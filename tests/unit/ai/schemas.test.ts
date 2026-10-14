// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { evidenceSchema, portfolioChunkSchema, createPortfolioAnswerSchema } from '@/lib/ai/schemas';
import type { Evidence } from '@/types/ai';

const evidence: Evidence = { id: 'project:chatbot', type: 'project', title: 'Chatbot', href: '/projects/multimodal-ai-chatbot', text: 'Uses Neo4j.' };
const citation = { id: evidence.id, title: evidence.title, href: evidence.href };

describe('portfolio evidence boundaries', () => {
  it.each(['/', '/#experience', '/about', '/resume', '/projects', '/projects/multimodal-ai-chatbot', '/blog/an-article#details', 'https://github.com/Sketch333/TunTun'])('accepts approved source %s', (href) => {
    expect(evidenceSchema.safeParse({ ...evidence, href }).success).toBe(true);
  });
  it.each(['//evil.com', '/\\evil.com', '/api/chat', '/experience', '/contact', '/projects/../api/chat', '/projects/%2e%2e/api', '/projects/a?redirect=https://evil.com', 'javascript:alert(1)', 'http://github.com/Sketch333/a', 'https://github.com.evil.com/a', 'https://evil.github.com/a', 'https://user:pass@github.com/a', 'https://github.com:444/a', 'https://example.com/a'])('rejects unsafe or unapproved source %s', (href) => {
    expect(evidenceSchema.safeParse({ ...evidence, href }).success).toBe(false);
  });
  it.each([{ id: '' }, { title: ' ' }, { text: '' }, { score: Infinity }, { type: 'unknown' }])('rejects malformed evidence %j', (change) => {
    expect(evidenceSchema.safeParse({ ...evidence, ...change }).success).toBe(false);
  });
  it('accepts stable chunk metadata and rejects invalid chunk indexes', () => {
    const chunk = { ...evidence, slug: 'multimodal-ai-chatbot', index: 0 };
    expect(portfolioChunkSchema.safeParse(chunk).success).toBe(true);
    expect(portfolioChunkSchema.safeParse({ ...chunk, index: -1 }).success).toBe(false);
    expect(portfolioChunkSchema.safeParse({ ...chunk, slug: '../escape' }).success).toBe(false);
  });
});

describe('answer grounding validation', () => {
  it('accepts citations from the retrieved set', () => {
    expect(createPortfolioAnswerSchema([evidence]).safeParse({ answer: 'It uses Neo4j.', evidence: [citation], insufficientEvidence: false }).success).toBe(true);
  });
  it('rejects a fabricated citation ID even with a valid portfolio URL', () => {
    expect(createPortfolioAnswerSchema([evidence]).safeParse({ answer: 'Claim.', evidence: [{ ...citation, id: 'made-up' }], insufficientEvidence: false }).success).toBe(false);
  });
  it('rejects altered citation links and titles for known IDs', () => {
    for (const change of [{ href: '/about' }, { title: 'Fabricated source' }]) {
      expect(createPortfolioAnswerSchema([evidence]).safeParse({ answer: 'Claim.', evidence: [{ ...citation, ...change }], insufficientEvidence: false }).success).toBe(false);
    }
  });
  it('allows a conservative answer with no evidence', () => {
    expect(createPortfolioAnswerSchema([]).safeParse({ answer: 'Insufficient evidence.', evidence: [], insufficientEvidence: true }).success).toBe(true);
  });
});
