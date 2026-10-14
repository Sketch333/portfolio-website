import { z } from 'zod';
import type { Document } from 'mongodb';
import { getMongoDb } from '@/lib/db/mongo';
import { evidenceSchema, portfolioChunkSchema } from '@/lib/ai/schemas';
import type { EmbeddedPortfolioChunk, Evidence } from '@/types/ai';

const COLLECTION = 'portfolio_chunks';
const INDEX = 'portfolio_vectors';
const embeddingSchema = z.array(z.number().finite()).min(1).max(8192);
const embeddedChunkSchema = portfolioChunkSchema.extend({
  embedding: embeddingSchema, contentHash: z.string().min(1), updatedAt: z.date(),
});
const optionsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(6),
  sourceSlug: portfolioChunkSchema.shape.slug.optional(),
  sourceType: portfolioChunkSchema.shape.type.optional(),
});
export type VectorSearchOptions = z.input<typeof optionsSchema>;
type StoredChunk = EmbeddedPortfolioChunk & { _id: string };

export async function getPortfolioContentHashes(ids: readonly string[]): Promise<Map<string, string>> {
  const validated = z.array(z.string().min(1)).parse(ids);
  if (!validated.length) return new Map();
  const collection = (await getMongoDb()).collection<StoredChunk>(COLLECTION);
  const rows = await collection.find({ _id: { $in: validated } }, { projection: { _id: 1, contentHash: 1 } }).toArray();
  return new Map(rows.filter(row => typeof row.contentHash === 'string').map(row => [row._id, row.contentHash]));
}

// Provision manually in the intended development database; never create indexes
// during browsing. Match numDimensions and model to ingestion/query embeddings.
// Atlas definition: { fields: [
//   { type: 'vector', path: 'embedding', numDimensions: <model dimensions>, similarity: 'cosine' },
//   { type: 'filter', path: 'slug' }, { type: 'filter', path: 'type' }
// ] }, name: 'portfolio_vectors', type: 'vectorSearch'.
export async function upsertPortfolioChunks(chunks: readonly EmbeddedPortfolioChunk[]) {
  const validated = z.array(embeddedChunkSchema).parse(chunks);
  if (!validated.length) return;
  const collection = (await getMongoDb()).collection<StoredChunk>(COLLECTION);
  await collection.bulkWrite(validated.map(chunk => ({
    updateOne: { filter: { _id: chunk.id }, update: { $set: chunk }, upsert: true },
  })), { ordered: true });
}

export async function searchPortfolioVectors(embedding: number[], options: VectorSearchOptions = {}): Promise<Evidence[]> {
  const queryVector = embeddingSchema.parse(embedding);
  const { limit, sourceSlug, sourceType } = optionsSchema.parse(options);
  const collection = (await getMongoDb()).collection<StoredChunk>(COLLECTION);
  async function search(scoped: boolean): Promise<Evidence[]> {
    const filter: Document = {};
    if (scoped && sourceSlug) filter.slug = { $eq: sourceSlug };
    if (scoped && sourceType) filter.type = { $eq: sourceType };
    const pipeline = [
      { $vectorSearch: { index: INDEX, path: 'embedding', queryVector, numCandidates: limit * 20, limit,
        ...(Object.keys(filter).length ? { filter } : {}) } },
      { $project: { _id: 0, id: 1, type: 1, title: 1, href: 1, text: 1, score: { $meta: 'vectorSearchScore' } } },
    ];
    const rows = await collection.aggregate(pipeline).toArray();
    return rows.map(row => evidenceSchema.parse(row));
  }
  const results = await search(Boolean(sourceSlug));
  if (sourceSlug && results.length < limit) {
    const seen = new Set(results.map(result => result.id));
    for (const result of await search(false)) {
      if (!seen.has(result.id)) { results.push(result); seen.add(result.id); }
      if (results.length >= limit) break;
    }
  }
  return results.slice(0, limit);
}
