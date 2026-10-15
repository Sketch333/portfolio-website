import { beforeEach, expect, it, vi } from 'vitest';
import { createPortfolioAnswerSchema } from '@/lib/ai/schemas';
import type { PortfolioChunk } from '@/types/ai';

const memory = vi.hoisted(() => ({ docs: new Map<string, Record<string, unknown>>(), active: undefined as Record<string, unknown> | undefined, failStage: false, failActivation: false, embeddings: vi.fn() }));
vi.mock('ai', () => ({
  createGateway: () => ({ embeddingModel: () => 'embedding', languageModel: () => 'chat' }),
  embedMany: async ({ values }: { values: string[] }) => ({ embeddings: memory.embeddings(values) }),
}));
vi.mock('@/lib/db/mongo', () => ({
  getMongoDb: async () => ({ collection: (name: string) => name === 'portfolio_snapshots' ? {
    findOne: async () => memory.active,
    updateOne: async (_filter: unknown, update: { $set: Record<string, unknown> }) => {
      if (memory.failActivation) throw new Error('activation failed');
      memory.active = { _id: 'active', ...update.$set };
    },
  } : {
    bulkWrite: async (ops: Array<{ updateOne: { update: { $set: Record<string, unknown> } } }>) => {
      if (memory.failStage) throw new Error('stage failed');
      for (const op of ops) memory.docs.set(String(op.updateOne.update.$set._id), op.updateOne.update.$set);
    },
    find: (filter: { generation: string; embeddingModel: string; id: { $in: string[] } }) => ({ toArray: async () => [...memory.docs.values()].filter(row => row.generation === filter.generation && row.embeddingModel === filter.embeddingModel && filter.id.$in.includes(String(row.id))) }),
    aggregate: (pipeline: Array<{ $vectorSearch: { filter: Record<string, { $eq: string }> } }>) => ({ toArray: async () => {
      const filter = pipeline[0].$vectorSearch.filter;
      return [...memory.docs.values()].filter(row => Object.entries(filter).every(([key, value]) => row[key] === value.$eq)).map(({ id, type, title, href, text }) => ({ id, type, title, href, text, score: 1 }));
    } }),
  },
}),
}));

const base = (overrides: Partial<PortfolioChunk> = {}): PortfolioChunk => ({ id: 'article', type: 'blog', slug: 'article', title: 'Original title', href: '/blog/article', text: 'Original verified claim.', index: 0, ...overrides });
beforeEach(() => {
  vi.resetModules(); memory.docs.clear(); memory.active = undefined; memory.failStage = false; memory.failActivation = false;
  memory.embeddings.mockReset(); memory.embeddings.mockImplementation((values: string[]) => values.map(() => [0.1, 0.2]));
  vi.stubEnv('AI_GATEWAY_API_KEY', 'key'); vi.stubEnv('AI_CHAT_MODEL', 'chat'); vi.stubEnv('AI_EMBEDDING_MODEL', 'embedding-v1');
});

it('publishes only corrected active evidence, invalidates its prior citation, and removes unpublished sources', async () => {
  const { ingestChunks } = await import('@/scripts/ingest-portfolio');
  const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
  await ingestChunks([base()]);
  const original = await searchPortfolioVectors([1]);
  expect(createPortfolioAnswerSchema(original).safeParse({ answer: 'Original verified claim.', evidence: [{ id: 'article', title: 'Original title', href: '/blog/article' }], insufficientEvidence: false }).success).toBe(true);
  await ingestChunks([base({ id: 'corrected-article', text: 'Corrected verified claim.', title: 'Corrected title' })]);
  const corrected = await searchPortfolioVectors([1]);
  expect(corrected.map(item => item.text)).toEqual(['Corrected verified claim.']);
  expect(createPortfolioAnswerSchema(corrected).safeParse({ answer: 'Old claim', evidence: [{ id: 'article', title: 'Original title', href: '/blog/article' }], insufficientEvidence: false }).success).toBe(false);
  await ingestChunks([]);
  expect(await searchPortfolioVectors([1])).toEqual([]);
});

it('reuses vectors for metadata-only updates, re-embeds model changes, and preserves active data when staging fails', async () => {
  const { ingestChunks } = await import('@/scripts/ingest-portfolio');
  const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
  await ingestChunks([base()]); memory.embeddings.mockClear();
  await ingestChunks([base({ title: 'Renamed title', href: '/blog/article' })]);
  expect(memory.embeddings).not.toHaveBeenCalled();
  expect((await searchPortfolioVectors([1]))[0].title).toBe('Renamed title');
  vi.stubEnv('AI_EMBEDDING_MODEL', 'embedding-v2');
  await ingestChunks([base({ title: 'Model two title' })]);
  expect(memory.embeddings).toHaveBeenCalledTimes(1);
  memory.failStage = true;
  await expect(ingestChunks([base({ id: 'bad', text: 'Never publish this.' })])).rejects.toThrow('stage failed');
  expect((await searchPortfolioVectors([1])).map(item => item.text)).toEqual(['Original verified claim.']);
});

it('preserves the published snapshot when activation fails after staging', async () => {
  const { ingestChunks } = await import('@/scripts/ingest-portfolio');
  const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
  await ingestChunks([base()]);
  memory.failActivation = true;
  await expect(ingestChunks([base({ id: 'new-article', text: 'New claim awaiting publication.' })])).rejects.toThrow('activation failed');
  memory.failActivation = false;
  expect((await searchPortfolioVectors([1])).map(item => item.text)).toEqual(['Original verified claim.']);
});
