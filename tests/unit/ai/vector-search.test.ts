import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EmbeddedPortfolioChunk } from '@/types/ai';
const db = vi.hoisted(() => ({ bulkWrite: vi.fn(), aggregate: vi.fn(), collection: vi.fn(), connect: vi.fn(), construct: vi.fn(), close: vi.fn() }));
vi.mock('mongodb', () => ({ MongoClient: class { constructor(...args: unknown[]) { db.construct(...args); } connect() { return db.connect().then(() => this); } close() { return db.close(); } db() { return { collection: db.collection }; } } }));
const chunk: EmbeddedPortfolioChunk = { id: 'stable-id', type: 'project', slug: 'scheduler', title: 'Scheduler', href: '/projects/scheduler', text: 'Verified text.', index: 0, embedding: [0.2, 0.8], contentHash: 'hash', updatedAt: new Date('2026-01-01') };
const row = (id = 'stable-id') => ({ id, type: 'project', title: 'Scheduler', href: '/projects/scheduler', text: 'Verified text.', score: 0.8 });
beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017'); vi.stubEnv('MONGODB_DB', 'test'); db.connect.mockResolvedValue(undefined); db.collection.mockReturnValue({ bulkWrite: db.bulkWrite, aggregate: db.aggregate }); db.bulkWrite.mockResolvedValue({}); });
afterEach(() => vi.unstubAllEnvs());
describe('Mongo boundary', () => {
  it('imports without configuration or starting a client and shares concurrent connections', async () => {
    vi.stubEnv('MONGODB_URI', '');
    const { getMongoDb } = await import('@/lib/db/mongo');
    await import('@/lib/db/vector-search');
    expect(db.construct).not.toHaveBeenCalled();
    await expect(getMongoDb()).rejects.toThrow();
    vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017');
    await Promise.all([getMongoDb(), getMongoDb()]);
    expect(db.construct).toHaveBeenCalledTimes(1);
    expect(db.connect).toHaveBeenCalledTimes(1);
  });
  it('retries a rejected connection instead of caching failure forever', async () => {
    db.connect.mockRejectedValueOnce(new Error('offline'));
    const { getMongoDb } = await import('@/lib/db/mongo');
    await expect(getMongoDb()).rejects.toThrow('offline');
    await getMongoDb();
    expect(db.connect).toHaveBeenCalledTimes(2);
  });
});
describe('vector adapter', () => {
  it('upserts by stable id while preserving source and embedding fields', async () => {
    const { upsertPortfolioChunks } = await import('@/lib/db/vector-search');
    await upsertPortfolioChunks([chunk]);
    expect(db.bulkWrite).toHaveBeenCalledWith([{ updateOne: { filter: { _id: 'stable-id' }, update: { $set: chunk }, upsert: true } }], { ordered: true });
  });
  it('does not connect for empty upserts and rejects malformed batches before any write', async () => {
    const { upsertPortfolioChunks } = await import('@/lib/db/vector-search');
    await upsertPortfolioChunks([]);
    await expect(upsertPortfolioChunks([chunk, { ...chunk, embedding: [NaN] }])).rejects.toThrow();
    expect(db.construct).not.toHaveBeenCalled();
    expect(db.bulkWrite).not.toHaveBeenCalled();
  });
  it('prefilters page slug/type then fills with broader unique evidence in page-first order', async () => {
    db.aggregate.mockReturnValueOnce({ toArray: async () => [row()] }).mockReturnValueOnce({ toArray: async () => [row(), row('other')] });
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    expect(await searchPortfolioVectors([0.2, 0.8], { sourceSlug: 'scheduler', sourceType: 'project', limit: 2 })).toEqual([row(), row('other')]);
    const first = db.aggregate.mock.calls[0][0];
    expect(first[0]).toEqual({ $vectorSearch: { index: 'portfolio_vectors', path: 'embedding', queryVector: [0.2, 0.8], numCandidates: 40, limit: 2, filter: { slug: { $eq: 'scheduler' }, type: { $eq: 'project' } } } });
    expect(first[1].$project).toMatchObject({ _id: 0, id: 1, score: { $meta: 'vectorSearchScore' } });
    expect(db.aggregate.mock.calls[1][0][0].$vectorSearch.filter).toBeUndefined();
  });
  it('does not broaden a full scoped result', async () => {
    db.aggregate.mockReturnValue({ toArray: async () => [row()] });
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    expect(await searchPortfolioVectors([1], { sourceSlug: 'scheduler', limit: 1 })).toEqual([row()]);
    expect(db.aggregate).toHaveBeenCalledTimes(1);
  });
  it('allows hybrid retrieval to defer broadening until after deduplication', async () => {
    db.aggregate.mockReturnValue({ toArray: async () => [row()] });
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    expect(await searchPortfolioVectors([1], { sourceSlug: 'scheduler', limit: 2, broaden: false })).toEqual([row()]);
    expect(db.aggregate).toHaveBeenCalledTimes(1);
  });
  it('rejects unbounded limits, operator-shaped slugs and invalid vectors before connection', async () => {
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    for (const embedding of [[], [Infinity], [NaN]]) await expect(searchPortfolioVectors(embedding)).rejects.toThrow();
    for (const limit of [0, -1, 101, 1.5]) await expect(searchPortfolioVectors([1], { limit })).rejects.toThrow();
    await expect(searchPortfolioVectors([1], { sourceSlug: '$ne' })).rejects.toThrow();
    expect(db.construct).not.toHaveBeenCalled();
  });
  it('rejects unsafe returned evidence rather than exposing external links', async () => {
    db.aggregate.mockReturnValue({ toArray: async () => [{ ...row(), href: 'https://evil.test' }] });
    const { searchPortfolioVectors } = await import('@/lib/db/vector-search');
    await expect(searchPortfolioVectors([1])).rejects.toThrow();
  });
});

it('reads stored hashes using stable IDs and a narrow projection', async () => {
  const find = vi.fn().mockReturnValue({ toArray: async () => [{ _id: 'stable-id', contentHash: 'hash' }] });
  db.collection.mockReturnValue({ find });
  const { getPortfolioContentHashes } = await import('@/lib/db/vector-search');
  expect(await getPortfolioContentHashes(['stable-id'])).toEqual(new Map([['stable-id', 'hash']]));
  expect(find).toHaveBeenCalledWith({ _id: { $in: ['stable-id'] } }, { projection: { _id: 1, contentHash: 1 } });
});

it('closes and clears the cached client for command lifecycle cleanup', async () => {
  const { getMongoDb, closeMongoConnection } = await import('@/lib/db/mongo');
  await getMongoDb();
  await closeMongoConnection();
  expect(db.close).toHaveBeenCalledTimes(1);
  await getMongoDb(); expect(db.construct).toHaveBeenCalledTimes(2);
});
