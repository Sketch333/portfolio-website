import { beforeEach, expect, it, vi } from 'vitest';
import { portfolioCases } from './portfolio-cases';
import { retrieveEvidence } from '@/lib/ai/retrieval';
import { getAllPosts } from '@/lib/content/blog';
import { buildStructuredContext } from '@/lib/ai/structured-context';
import { chunkContent } from '@/lib/ai/chunking';
import { POST } from '@/app/api/chat/route';
import type { Evidence } from '@/types/ai';

const remote = vi.hoisted(() => ({ embed: vi.fn(), search: vi.fn(), generate: vi.fn(), model: vi.fn() }));
vi.mock('@/lib/ai/model', () => ({ embedTexts: remote.embed, getChatModel: remote.model }));
vi.mock('@/lib/db/vector-search', () => ({ searchPortfolioVectors: remote.search }));
vi.mock('ai', () => ({ generateText: remote.generate, Output: { object: (value: unknown) => value } }));
beforeEach(() => {
  vi.resetAllMocks();
  remote.embed.mockResolvedValue([[0.1, 0.2]]);
  remote.search.mockResolvedValue([]);
  remote.model.mockReturnValue('offline-eval');
});
function ask(question: string) {
  return POST(new Request('http://localhost/api/chat', {
    method: 'POST', body: JSON.stringify({ messages: [{ role: 'user', content: question }] }),
  }));
}

it.each(portfolioCases)('retrieves only supported canonical facts: $query', async ({ query, ids }) => {
  expect((await retrieveEvidence({ query, limit: 6 })).map(source => source.id)).toEqual(ids);
});

it('keeps scheduler team delivery distinct from personal contribution', async () => {
  const [source] = await retrieveEvidence({ query: 'scheduler', limit: 1 });
  expect(source.text).toContain('A four-person team built');
  expect(source.text).toContain('Full-Stack Integration Lead');
  expect(source.text).toContain('My verified contribution areas included electives scheduling');
  expect(source.text).toContain('APIs for solver execution, polling, and capacity data');
  expect(source.text).not.toMatch(/sole (?:developer|author)|built everything/i);
});

it('discovers canonical writing through the semantic boundary with a real article link', async () => {
  const post = (await getAllPosts()).find(post => post.slug === 'the-role-of-statistics-in-data-science')!;
  const chunks = chunkContent({ type: 'blog', slug: post.slug, title: post.title, href: `/blog/${post.slug}`, text: post.body });
  remote.search.mockResolvedValue([chunks[0]]);
  const result = await retrieveEvidence({ query: 'Find writing explaining statistics in data science', limit: 3 });
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({ type: 'blog', href: '/blog/the-role-of-statistics-in-data-science' });
  expect(result[0].text).toContain('statistics');
});

it.each(['Compare the scheduler and multimodal chatbot', 'What evidence fits an AI Product role?'])('retains multiple canonical projects for semantic synthesis: %s', async query => {
  const sources = await buildStructuredContext();
  remote.search.mockResolvedValue(['project:university-timetable-system', 'project:multimodal-ai-chatbot'].map(id => sources.find(source => source.id === id)!));
  const result = await retrieveEvidence({ query, limit: 6 });
  expect(result.map(source => source.href)).toEqual(['/projects/university-timetable-system', '/projects/multimodal-ai-chatbot']);
  expect(result[0].text).toContain('Full-Stack Integration Lead');
  expect(result[1].text).toContain('Neo4j');
});

it.each(['Has Aon led a billion-dollar acquisition?', 'What revenue did Aon generate at SprintX?'])('returns a conservative answer without generation for unsupported evidence: %s', async query => {
  const response = await ask(query);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ answer: expect.stringContaining("don't have enough portfolio evidence"), evidence: [], insufficientEvidence: true });
  expect(remote.generate).not.toHaveBeenCalled();
});

it.each(['id', 'title', 'href'] as const)('rejects altered %s through real retrieval and route validation', async field => {
  const citation = { id: 'experience:sprintx', title: 'Business Developer — SprintX', href: '/#experience' };
  remote.generate.mockResolvedValue({ output: { answer: 'UNSUPPORTED GENERATED CLAIM', evidence: [{ ...citation, [field]: field === 'href' ? '/projects/invented' : 'invented' }], insufficientEvidence: false } });
  const response = await ask('current role');
  const output = await response.json();
  expect(output).toMatchObject({ insufficientEvidence: true, evidence: [] });
  expect(output.answer).not.toContain('UNSUPPORTED');
});

it('returns exact canonical citations with a grounded completed answer', async () => {
  const evidence: Pick<Evidence, 'id' | 'title' | 'href'>[] = [{ id: 'experience:sprintx', title: 'Business Developer — SprintX', href: '/#experience' }];
  remote.generate.mockResolvedValue({ output: { answer: 'Aon is a Business Developer at SprintX.', evidence, insufficientEvidence: false } });
  expect(await (await ask('current role')).json()).toEqual({ answer: 'Aon is a Business Developer at SprintX.', evidence, insufficientEvidence: false });
});
