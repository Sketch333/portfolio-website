import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmbeddedPortfolioChunk } from '@/types/ai';

const db = vi.hoisted(() => ({ chunks: { bulkWrite: vi.fn(), find: vi.fn(), aggregate: vi.fn() }, snapshots: { findOne: vi.fn(), updateOne: vi.fn() }, collection: vi.fn() }));
vi.mock('@/lib/db/mongo', () => ({ getMongoDb: async () => ({ collection: db.collection }) }));
const generation = '5b21ad19-56ee-4898-a616-70681da9ea6a';
const chunk: EmbeddedPortfolioChunk = { id: 'stable-id', type: 'project', slug: 'scheduler', title: 'Scheduler', href: '/projects/scheduler', text: 'Verified text.', index: 0, embedding: [0.2, 0.8], contentHash: 'hash', updatedAt: new Date('2026-01-01') };
const row = (id = 'stable-id') => ({ id, type: 'project', title: 'Scheduler', href: '/projects/scheduler', text: 'Verified text.', score: 0.8 });

beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks();
  db.collection.mockImplementation((name: string) => name === 'portfolio_snapshots' ? db.snapshots : db.chunks);
  db.snapshots.findOne.mockResolvedValue({ _id: 'active', generation, embeddingModel: 'vendor/embedding', activatedAt: new Date() });
  db.chunks.bulkWrite.mockResolvedValue({}); db.snapshots.updateOne.mockResolvedValue({});
});

describe('generation snapshot boundary', () => {
  it('stages generation-specific ids and atomically activates only the small pointer', async () => {
    const { stagePortfolioSnapshot, activatePortfolioSnapshot } = await import('@/lib/db/vector-search');
    await stagePortfolioSnapshot({ generation, embeddingModel: 'vendor/embedding', chunks: [chunk] });
    expect(db.chunks.bulkWrite).toHaveBeenCalledWith([expect.objectContaining({ updateOne: expect.objectContaining({ filter: { _id: `${generation}:stable-id` }, upsert: true }) })], { ordered: true });
    await activatePortfolioSnapshot({ generation, embeddingModel: 'vendor/embedding' });
    expect(db.snapshots.updateOne).toHaveBeenCalledWith({ _id: 'active' }, expect.objectContaining({ $set: expect.objectContaining({ generation, embeddingModel: 'vendor/embedding' }) }), { upsert: true });
  });

  it('keeps corrected, removed, and unpublished predecessor chunks outside every vector query', async () => {
    db.chunks.aggregate.mockReturnValue({ toArray: async () => [row('corrected')] });
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    expect(await searchPortfolioVectors([0.2, 0.8])).toEqual([row('corrected')]);
    const filter = db.chunks.aggregate.mock.calls[0][0][0].$vectorSearch.filter;
    expect(filter).toEqual({ generation: { $eq: generation } });
  });

  it('filters the active generation before page scope and broader retrieval', async () => {
    db.chunks.aggregate.mockReturnValueOnce({ toArray: async () => [row()] }).mockReturnValueOnce({ toArray: async () => [row(), row('other')] });
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    expect(await searchPortfolioVectors([1], { sourceSlug: 'scheduler', sourceType: 'project', limit: 2 })).toEqual([row(), row('other')]);
    expect(db.chunks.aggregate.mock.calls[0][0][0].$vectorSearch.filter).toEqual({ generation: { $eq: generation }, slug: { $eq: 'scheduler' }, type: { $eq: 'project' } });
    expect(db.chunks.aggregate.mock.calls[1][0][0].$vectorSearch.filter).toEqual({ generation: { $eq: generation } });
  });

  it('returns no vector evidence when no active snapshot exists, including after an empty activation', async () => {
    db.snapshots.findOne.mockResolvedValue(null);
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    expect(await searchPortfolioVectors([1])).toEqual([]);
    expect(db.chunks.aggregate).not.toHaveBeenCalled();
  });

  it('reuses only active rows matching both content hash and embedding model', async () => {
    db.chunks.find.mockReturnValue({ toArray: async () => [{ id: 'stable-id', contentHash: 'hash', embedding: [0.2, 0.8] }] });
    const { getReusablePortfolioChunks } = await import('@/lib/db/vector-search');
    expect(await getReusablePortfolioChunks(['stable-id'], 'vendor/embedding')).toEqual(new Map([['stable-id', { contentHash: 'hash', embedding: [0.2, 0.8] }]]));
    expect(db.chunks.find).toHaveBeenCalledWith({ generation, embeddingModel: 'vendor/embedding', id: { $in: ['stable-id'] } }, expect.anything());
  });

  it('validates malformed vectors and options before database access', async () => {
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    await expect(searchPortfolioVectors([])).rejects.toThrow();
    await expect(searchPortfolioVectors([1], { sourceSlug: '$ne' })).rejects.toThrow();
    expect(db.snapshots.findOne).not.toHaveBeenCalled();
  });
});
