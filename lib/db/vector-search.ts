import { z } from 'zod';
import type { Document } from 'mongodb';
import { getMongoDb } from '@/lib/db/mongo';
import { evidenceSchema, portfolioChunkSchema } from '@/lib/ai/schemas';
import type { EmbeddedPortfolioChunk, Evidence } from '@/types/ai';

const COLLECTION = 'portfolio_chunks';
const SNAPSHOTS = 'portfolio_snapshots';
const INDEX = 'portfolio_vectors';
const ACTIVE_POINTER = 'active';
const embeddingSchema = z.array(z.number().finite()).min(1).max(8192);
const embeddedChunkSchema = portfolioChunkSchema.extend({ embedding: embeddingSchema, contentHash: z.string().min(1), updatedAt: z.date() });
const generationSchema = z.string().uuid();
const snapshotSchema = z.object({ generation: generationSchema, embeddingModel: z.string().min(1), chunks: z.array(embeddedChunkSchema) });
const optionsSchema = z.object({ limit: z.number().int().min(1).max(100).default(6), sourceSlug: portfolioChunkSchema.shape.slug.optional(), sourceType: portfolioChunkSchema.shape.type.optional(), broaden: z.boolean().default(true) });
export type VectorSearchOptions = z.input<typeof optionsSchema>;
type StoredChunk = EmbeddedPortfolioChunk & { _id: string; generation: string; embeddingModel: string };
type ActiveSnapshot = { _id: typeof ACTIVE_POINTER; generation: string; embeddingModel: string; activatedAt: Date };

/** Reads reusable vectors only from the published snapshot. */
export async function getReusablePortfolioChunks(ids: readonly string[], embeddingModel: string) {
  const validIds = z.array(z.string().min(1)).parse(ids);
  const model = z.string().min(1).parse(embeddingModel);
  if (!validIds.length) return new Map<string, { contentHash: string; embedding: number[] }>();
  const db = await getMongoDb();
  const active = await db.collection<ActiveSnapshot>(SNAPSHOTS).findOne({ _id: ACTIVE_POINTER });
  if (!active) return new Map<string, { contentHash: string; embedding: number[] }>();
  const rows = await db.collection<StoredChunk>(COLLECTION).find({ generation: active.generation, embeddingModel: model, id: { $in: validIds } }, { projection: { id: 1, contentHash: 1, embedding: 1 } }).toArray();
  return new Map(rows.map(row => [row.id, { contentHash: row.contentHash, embedding: embeddingSchema.parse(row.embedding) }]));
}

/** Stages a full isolated generation. It cannot change what requests can search. */
export async function stagePortfolioSnapshot(snapshot: z.input<typeof snapshotSchema>) {
  const { generation, embeddingModel, chunks } = snapshotSchema.parse(snapshot);
  if (!chunks.length) return;
  const collection = (await getMongoDb()).collection<StoredChunk>(COLLECTION);
  await collection.bulkWrite(chunks.map(chunk => ({ updateOne: { filter: { _id: `${generation}:${chunk.id}` }, update: { $set: { ...chunk, _id: `${generation}:${chunk.id}`, generation, embeddingModel } }, upsert: true } })), { ordered: true });
}

/** A single-document update is the atomic publish step after staging succeeds. */
export async function activatePortfolioSnapshot({ generation, embeddingModel }: Pick<z.infer<typeof snapshotSchema>, 'generation' | 'embeddingModel'>) {
  const pointer = { generation: generationSchema.parse(generation), embeddingModel: z.string().min(1).parse(embeddingModel) };
  await (await getMongoDb()).collection<ActiveSnapshot>(SNAPSHOTS).updateOne({ _id: ACTIVE_POINTER }, { $set: { ...pointer, activatedAt: new Date() } }, { upsert: true });
}

// Provision manually in the intended development database. Atlas fields must include:
// vector `embedding` plus filters `generation`, `slug`, and `type`.
export async function searchPortfolioVectors(embedding: number[], options: VectorSearchOptions = {}): Promise<Evidence[]> {
  const queryVector = embeddingSchema.parse(embedding);
  const { limit, sourceSlug, sourceType, broaden } = optionsSchema.parse(options);
  const db = await getMongoDb();
  const active = await db.collection<ActiveSnapshot>(SNAPSHOTS).findOne({ _id: ACTIVE_POINTER });
  if (!active) return [];
  const activeGeneration = active.generation;
  const collection = db.collection<StoredChunk>(COLLECTION);
  async function search(scoped: boolean): Promise<Evidence[]> {
    const filter: Document = { generation: { $eq: activeGeneration } };
    if (scoped && sourceSlug) filter.slug = { $eq: sourceSlug };
    if (scoped && sourceType) filter.type = { $eq: sourceType };
    const pipeline = [{ $vectorSearch: { index: INDEX, path: 'embedding', queryVector, numCandidates: limit * 20, limit, filter } }, { $project: { _id: 0, id: 1, type: 1, title: 1, href: 1, text: 1, score: { $meta: 'vectorSearchScore' } } }];
    return (await collection.aggregate(pipeline).toArray()).map(row => evidenceSchema.parse(row));
  }
  const results = await search(Boolean(sourceSlug));
  if (broaden && sourceSlug && results.length < limit) {
    const seen = new Set(results.map(result => result.id));
    for (const result of await search(false)) {
      if (!seen.has(result.id)) { results.push(result); seen.add(result.id); }
      if (results.length >= limit) break;
    }
  }
  return results.slice(0, limit);
}
