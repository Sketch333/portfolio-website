import { z } from 'zod';
import type { Evidence } from '@/types/ai';

// Canonical project sourceUrl values currently use GitHub. New hosts require
// explicit source approval rather than merely a syntactically valid HTTPS URL.
export const APPROVED_PUBLIC_SOURCE_HOSTS = ['github.com'] as const;
const nonEmpty = z.string().refine((value) => value.trim().length > 0, 'Must not be blank');
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const evidenceHrefSchema = z.string().refine((value) => {
  if (/[\s\\\u0000-\u001f\u007f]/.test(value)) return false;
  if (value.startsWith('/')) {
    // Published pages only; reject normalization, encoded paths, APIs and queries.
    return /^\/(?:about|resume|projects(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?|blog(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?)?(?:#[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(value);
  }
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port
      && APPROVED_PUBLIC_SOURCE_HOSTS.some((host) => host === url.hostname);
  } catch {
    return false;
  }
}, 'Must be a portfolio path or an approved public source URL');

export const evidenceSchema = z.object({
  id: nonEmpty,
  type: z.enum(['project', 'blog', 'experience', 'profile']),
  title: nonEmpty,
  href: evidenceHrefSchema,
  text: nonEmpty,
  score: z.number().finite().optional(),
});
export const portfolioChunkSchema = evidenceSchema.omit({ score: true }).extend({
  slug: slugSchema,
  index: z.number().int().nonnegative(),
});
export const evidenceReferenceSchema = evidenceSchema.pick({ id: true, title: true, href: true });

// Shape validation alone does not establish grounding. Generated answers must
// pass createPortfolioAnswerSchema with this request's retrieved evidence.
export const portfolioAnswerSchema = z.object({
  answer: nonEmpty,
  evidence: z.array(evidenceReferenceSchema),
  insufficientEvidence: z.boolean(),
});

export function createPortfolioAnswerSchema(retrievedEvidence: readonly Evidence[]) {
  const sources = new Map(retrievedEvidence.map((source) => [source.id, evidenceSchema.parse(source)]));
  return portfolioAnswerSchema.superRefine((answer, context) => {
    answer.evidence.forEach((reference, index) => {
      const source = sources.get(reference.id);
      if (!source || source.href !== reference.href || source.title !== reference.title) {
        context.addIssue({ code: 'custom', path: ['evidence', index], message: 'Citation must match retrieved evidence' });
      }
    });
  });
}
