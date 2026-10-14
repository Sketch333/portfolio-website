import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import type { PortfolioChunk } from '@/types/ai';
const mocks = vi.hoisted(() => ({ embedMany: vi.fn(), createGateway: vi.fn(), embeddingModel: vi.fn(), languageModel: vi.fn(), read: vi.fn(), upsert: vi.fn() }));
vi.mock('ai', () => ({ embedMany: mocks.embedMany, createGateway: mocks.createGateway }));
vi.mock('@/lib/db/vector-search', () => ({ getPortfolioContentHashes: mocks.read, upsertPortfolioChunks: mocks.upsert }));
const chunks: PortfolioChunk[] = Array.from({ length: 70 }, (_, index) => ({ id: `id-${index}`, type: 'project', slug: 'demo', title: 'Demo', href: '/projects/demo', text: `Evidence ${index}`, index }));
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('AI_GATEWAY_API_KEY', 'test-key'); vi.stubEnv('AI_CHAT_MODEL', 'vendor/chat'); vi.stubEnv('AI_EMBEDDING_MODEL', 'vendor/embedding');
  mocks.createGateway.mockReturnValue({ embeddingModel: mocks.embeddingModel, languageModel: mocks.languageModel });
  mocks.embeddingModel.mockReturnValue('embedding-adapter'); mocks.languageModel.mockReturnValue('chat-adapter');
  mocks.embedMany.mockImplementation(async ({ values }: { values: string[] }) => ({ embeddings: values.map(() => [0.2, 0.8]) }));
  mocks.read.mockResolvedValue(new Map()); mocks.upsert.mockResolvedValue(undefined);
});
afterEach(() => vi.unstubAllEnvs());
it('uses configured Gateway models and batches ordered embeddings', async () => {
  const { embedTexts, getChatModel } = await import('@/lib/ai/model');
  expect(await embedTexts(chunks.map(c => c.text))).toHaveLength(70);
  expect(mocks.embedMany.mock.calls.map(([call]) => call.values.length)).toEqual([64, 6]);
  expect(mocks.embeddingModel).toHaveBeenCalledWith('vendor/embedding');
  expect(getChatModel()).toBe('chat-adapter');
  expect(mocks.languageModel).toHaveBeenCalledWith('vendor/chat');
  expect(mocks.createGateway).toHaveBeenCalledWith({ apiKey: 'test-key' });
});
it('skips matching stored hashes and writes complete validated records only after embedding', async () => {
  const { ingestChunks } = await import('@/scripts/ingest-portfolio');
  mocks.read.mockResolvedValue(new Map([[chunks[0].id, createHash('sha256').update(chunks[0].text).digest('hex')]]));
  mocks.upsert.mockImplementation(async (records) => {
    expect(mocks.embedMany).toHaveBeenCalledTimes(2);
    expect(records).toHaveLength(69); expect(records[0]).toMatchObject({ ...chunks[1], embedding: [0.2, 0.8] });
    expect(records[0].updatedAt).toBeInstanceOf(Date); expect(records[0].contentHash).toMatch(/^[a-f0-9]{64}$/);
  });
  expect(await ingestChunks(chunks)).toEqual({ updated: 69, skipped: 1 });
  expect(mocks.embedMany.mock.calls.flatMap(([call]) => call.values)).not.toContain(chunks[0].text);
});
it('does not write any records when a later provider batch fails', async () => {
  const { ingestChunks } = await import('@/scripts/ingest-portfolio');
  mocks.embedMany.mockResolvedValueOnce({ embeddings: Array.from({ length: 64 }, () => [0.2, 0.8]) }).mockRejectedValueOnce(new Error('provider offline'));
  await expect(ingestChunks(chunks)).rejects.toThrow('provider offline'); expect(mocks.upsert).not.toHaveBeenCalled();
});
it('rejects malformed provider vectors before database writes', async () => {
  const { ingestChunks } = await import('@/scripts/ingest-portfolio');
  mocks.embedMany.mockResolvedValue({ embeddings: [[NaN]] });
  await expect(ingestChunks(chunks)).rejects.toThrow(); expect(mocks.upsert).not.toHaveBeenCalled();
});
it('avoids provider and writes when all chunks are unchanged', async () => {
  const { ingestChunks } = await import('@/scripts/ingest-portfolio');
  mocks.read.mockResolvedValue(new Map(chunks.map(c => [c.id, createHash('sha256').update(c.text).digest('hex')])));
  expect(await ingestChunks(chunks)).toEqual({ updated: 0, skipped: 70 }); expect(mocks.embedMany).not.toHaveBeenCalled(); expect(mocks.upsert).not.toHaveBeenCalled();
});
it('requires deliberate development invocation and rejects production before reads', async () => {
  const { runIngestion } = await import('@/scripts/ingest-portfolio');
  await expect(runIngestion([])).rejects.toThrow();
  vi.stubEnv('NODE_ENV', 'production');
  await expect(runIngestion(['--development'])).rejects.toThrow(/development/i); expect(mocks.read).not.toHaveBeenCalled();
});


it('rejects unconfirmed database targets and missing configuration before reads', async () => {
  const { runIngestion } = await import('@/scripts/ingest-portfolio');
  vi.stubEnv('MONGODB_INGESTION_ENV', '');
  await expect(runIngestion(['--development'])).rejects.toThrow(/development/i);
  vi.stubEnv('MONGODB_INGESTION_ENV', 'development'); vi.stubEnv('MONGODB_URI', '');
  await expect(runIngestion(['--development'])).rejects.toThrow();
  expect(mocks.read).not.toHaveBeenCalled();
});
it('rejects inconsistent vector dimensions across batches before writes', async () => {
  const { ingestChunks } = await import('@/scripts/ingest-portfolio');
  mocks.embedMany.mockResolvedValueOnce({ embeddings: Array.from({ length: 64 }, () => [0.2, 0.8]) }).mockResolvedValueOnce({ embeddings: Array.from({ length: 6 }, () => [0.2]) });
  await expect(ingestChunks(chunks)).rejects.toThrow(/dimensions/); expect(mocks.upsert).not.toHaveBeenCalled();
});
it('allows empty embedding input without credentials or provider calls', async () => {
  const { embedTexts } = await import('@/lib/ai/model');
  vi.stubEnv('AI_GATEWAY_API_KEY', '');
  expect(await embedTexts([])).toEqual([]); expect(mocks.createGateway).not.toHaveBeenCalled();
});
