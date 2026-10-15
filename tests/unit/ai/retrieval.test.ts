import { beforeEach, expect, it, vi } from 'vitest';
import type { Evidence } from '@/types/ai';
import { retrieveEvidence } from '@/lib/ai/retrieval';

const remote = vi.hoisted(() => ({ embed: vi.fn(), search: vi.fn() }));
vi.mock('@/lib/ai/model', () => ({ embedTexts: remote.embed }));
vi.mock('@/lib/db/vector-search', () => ({ searchPortfolioVectors: remote.search }));

const scheduler: Evidence = { id: 'scheduler-architecture', type: 'project', title: 'Scheduler', href: '/projects/university-timetable-system', text: 'Verified scheduler architecture.', score: 0.65 };
const unrelated: Evidence = { id: 'other-project', type: 'project', title: 'Other project', href: '/projects/other', text: 'Other verified architecture.', score: 0.99 };
const pageContext = { type: 'project' as const, slug: 'university-timetable-system' };
beforeEach(() => { vi.resetAllMocks(); remote.embed.mockResolvedValue([[0.2, 0.8]]); remote.search.mockResolvedValue([]); });

it('ranks exact current-role facts before weak semantic matches despite unrelated page context', async () => {
  remote.search.mockResolvedValue([unrelated]);
  const result = await retrieveEvidence({ query: 'current role', pageContext, limit: 3 });
  expect(result[0]).toMatchObject({ id: 'experience:sprintx', text: 'SprintX — Business Developer — Present' });
  expect(result).toContainEqual(unrelated);
});

it('keeps page-scoped scheduler chunks before higher-scored unrelated evidence', async () => {
  remote.search.mockResolvedValueOnce([scheduler]).mockResolvedValueOnce([unrelated, scheduler]);
  expect(await retrieveEvidence({ query: 'Explain this architecture', pageContext, limit: 2 })).toEqual([scheduler, unrelated]);
  expect(remote.search.mock.calls).toEqual([
    [[0.2, 0.8], { sourceSlug: pageContext.slug, sourceType: 'project', limit: 2, broaden: false }],
    [[0.2, 0.8], { limit: 2 }],
  ]);
});

it('does not broaden when scoped unique evidence fills the limit', async () => {
  remote.search.mockResolvedValue([scheduler]);
  expect(await retrieveEvidence({ query: 'Explain this architecture', pageContext, limit: 1 })).toEqual([scheduler]);
  expect(remote.search).toHaveBeenCalledTimes(1);
});

it('collapses repeated IDs and identical href/text across IDs before deciding whether to broaden', async () => {
  remote.search.mockResolvedValueOnce([scheduler, { ...scheduler, id: 'duplicate' }])
    .mockResolvedValueOnce([{ ...scheduler, text: 'Changed text with same ID' }, unrelated]);
  expect(await retrieveEvidence({ query: 'Explain this architecture', pageContext, limit: 2 })).toEqual([scheduler, unrelated]);
  expect(remote.search).toHaveBeenCalledTimes(2);
});

it('does not collapse different chunks sharing a source href', async () => {
  const second = { ...scheduler, id: 'second-chunk', text: 'Another verified paragraph.' };
  remote.search.mockResolvedValue([scheduler, second]);
  expect(await retrieveEvidence({ query: 'Explain this architecture', pageContext, limit: 2 })).toEqual([scheduler, second]);
});

it.each(['AI', 'Atlas'])('retains canonical structured facts when %s is unavailable', async (boundary) => {
  if (boundary === 'AI') remote.embed.mockRejectedValue(new Error('unavailable'));
  else remote.search.mockRejectedValue(new Error('unavailable'));
  const result = await retrieveEvidence({ query: 'current role', limit: 3 });
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe('experience:sprintx');
});

it('retains scoped evidence if broadening fails', async () => {
  remote.search.mockResolvedValueOnce([scheduler]).mockRejectedValueOnce(new Error('offline'));
  expect(await retrieveEvidence({ query: 'Explain this architecture', pageContext, limit: 2 })).toEqual([scheduler]);
});

it('returns no invented evidence for unsupported claims when semantic retrieval has no evidence', async () => {
  expect(await retrieveEvidence({ query: 'Has Aon led a billion-dollar acquisition?', limit: 6 })).toEqual([]);
});

it('skips remote work when exact evidence already fills the limit', async () => {
  const result = await retrieveEvidence({ query: 'current role', limit: 1 });
  expect(result[0].id).toBe('experience:sprintx');
  expect(remote.embed).not.toHaveBeenCalled();
});

it.each([
  { type: 'experience', slug: 'sprintx' }, { type: 'project', slug: '../scheduler' },
  { type: 'blog', slug: { $ne: '' } }, { type: 'project', slug: '' },
])('rejects invalid page context before provider access: %j', async (pageContext) => {
  // Deliberately exercise the runtime boundary used by untrusted route input.
  await expect(retrieveEvidence({ query: 'architecture', pageContext: pageContext as never, limit: 2 })).rejects.toThrow();
  expect(remote.embed).not.toHaveBeenCalled();
  expect(remote.search).not.toHaveBeenCalled();
});

it.each([0, -1, 101, 1.5, NaN])('rejects invalid limit %s before provider access', async (limit) => {
  await expect(retrieveEvidence({ query: 'architecture', limit })).rejects.toThrow();
  expect(remote.embed).not.toHaveBeenCalled();
});

it('does not retrieve evidence for a blank query', async () => {
  expect(await retrieveEvidence({ query: '  ', limit: 3 })).toEqual([]);
  expect(remote.embed).not.toHaveBeenCalled();
});
