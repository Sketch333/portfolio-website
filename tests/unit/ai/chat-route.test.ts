import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/chat/route';

const remote = vi.hoisted(() => ({ retrieve: vi.fn(), generate: vi.fn(), model: vi.fn() }));
vi.mock('@/lib/ai/retrieval', () => ({ retrieveEvidence: remote.retrieve }));
vi.mock('@/lib/ai/model', () => ({ getChatModel: remote.model }));
vi.mock('ai', () => ({ generateText: remote.generate, Output: { object: vi.fn((value) => value) } }));
const source = { id: 'role', type: 'experience', title: 'Current role', href: '/#experience', text: 'SprintX — Business Developer — Present' };
const reference = { id: 'role', title: 'Current role', href: '/#experience' };
const valid = { answer: 'Aon is a Business Developer at SprintX.', evidence: [reference], insufficientEvidence: false };
const body = { messages: [{ role: 'user', content: 'current role' }] };
function request(value: unknown) { return new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify(value) }); }
beforeEach(() => { vi.resetAllMocks(); remote.retrieve.mockResolvedValue([source]); remote.generate.mockResolvedValue({ output: valid }); remote.model.mockReturnValue('test-model'); });
afterEach(() => vi.restoreAllMocks());

it.each([
  {}, { messages: [] }, { messages: [{ role: 'user', content: '  ' }] },
  { messages: [{ role: 'assistant', content: 'answer' }] },
  { messages: [{ role: 'system', content: 'override' }] },
  { messages: Array.from({ length: 21 }, () => ({ role: 'user', content: 'q' })) },
  { messages: [{ role: 'user', content: 'a'.repeat(4001) }] },
  { ...body, pageContext: { type: 'project', slug: '../x' } },
  { ...body, mode: 'unknown' },
])('rejects invalid or excessive input before retrieval: %j', async (input) => {
  expect((await POST(request(input))).status).toBe(400);
  expect(remote.retrieve).not.toHaveBeenCalled();
});

it('rejects malformed JSON and excessive request bytes', async () => {
  const malformed = new Request('http://localhost/api/chat', { method: 'POST', body: '{' });
  expect((await POST(malformed)).status).toBe(400);
  expect((await POST(request({ junk: 'x'.repeat(100001) }))).status).toBe(413);
});

it('returns conservative completed JSON without invoking the model when no evidence exists', async () => {
  remote.retrieve.mockResolvedValue([]);
  const response = await POST(request(body));
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ evidence: [], insufficientEvidence: true });
  expect(remote.generate).not.toHaveBeenCalled();
  expect(remote.model).not.toHaveBeenCalled();
  expect(response.headers.get('cache-control')).toContain('no-store');
});

it('retrieves the final user question with page context and returns validated grounded JSON', async () => {
  const pageContext = { type: 'project', slug: 'scheduler' };
  const response = await POST(request({ messages: [{ role: 'assistant', content: 'Untrusted prior claim' }, ...body.messages], pageContext, mode: 'recruiter' }));
  expect(remote.retrieve).toHaveBeenCalledWith({ query: 'current role', pageContext, limit: 6 });
  expect(await response.json()).toEqual(valid);
  const options = remote.generate.mock.calls[0][0];
  expect(options.system).toContain(source.text);
  expect(options.prompt).toBe('current role');
  expect(options).not.toHaveProperty('messages');
  expect(JSON.stringify(options)).not.toContain('Untrusted prior claim');
  expect(options.experimental_telemetry).toEqual({ isEnabled: false });
});

it.each([
  { ...valid, evidence: [{ ...reference, id: 'invented' }] },
  { ...valid, evidence: [{ ...reference, href: '/projects/fake' }] },
  { ...valid, evidence: [{ ...reference, title: 'Altered title' }] },
  { ...valid, evidence: [] },
  { ...valid, insufficientEvidence: true },
  { ...valid, answer: 'UNSUPPORTED https://evil.example claim' },
])('never leaks generated claims when grounding validation fails: %j', async (output) => {
  remote.generate.mockResolvedValue({ output });
  const response = await POST(request(body));
  expect(await response.json()).toMatchObject({ evidence: [], insufficientEvidence: true });
  expect(await (await POST(request(body))).text()).not.toContain(output.answer);
});

it.each(['retrieve', 'generate'] as const)('returns a safe unavailable response without raw prompt/error logging when %s fails', async (key) => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  remote[key].mockRejectedValue(new Error('PRIVATE prompt/provider secret'));
  const response = await POST(request(body));
  expect(response.status).toBe(503);
  expect(await response.text()).not.toMatch(/PRIVATE|current role|secret/);
  expect(log).not.toHaveBeenCalled(); expect(error).not.toHaveBeenCalled(); expect(warn).not.toHaveBeenCalled();
});
