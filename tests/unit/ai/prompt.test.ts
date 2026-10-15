import { expect, it } from 'vitest';
import { buildGroundedPrompt } from '@/lib/ai/prompt';

it('requires evidence-only answers, factual restraint, interpretation labels and exact source links', () => {
  const prompt = buildGroundedPrompt([{ id: 'role', type: 'experience', title: 'Role', href: '/#experience', text: 'Verified role only.' }], 'recruiter');
  expect(prompt).toMatch(/only.*evidence/i);
  expect(prompt).toMatch(/never invent/i);
  expect(prompt).toMatch(/insufficient/i);
  expect(prompt).toMatch(/interpretation/i);
  expect(prompt).toMatch(/source links/i);
  expect(prompt).toContain('Verified role only.');
  expect(prompt).toContain('recruiter');
  expect(prompt).toMatch(/untrusted/i);
});
