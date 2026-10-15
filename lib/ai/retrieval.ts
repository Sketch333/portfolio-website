import { z } from 'zod';
import { buildStructuredContext, matchStructuredEvidence } from '@/lib/ai/structured-context';
import { embedTexts } from '@/lib/ai/model';
import { searchPortfolioVectors } from '@/lib/db/vector-search';
import { portfolioChunkSchema } from '@/lib/ai/schemas';
import type { Evidence, PortfolioPageContext } from '@/types/ai';

const inputSchema = z.object({
  query: z.string().trim(),
  pageContext: z.object({
    type: z.enum(['project', 'blog']),
    slug: portfolioChunkSchema.shape.slug,
  }).optional(),
  limit: z.number().int().min(1).max(100),
});

/** Exact canonical facts precede page-scoped chunks, then broader semantic evidence.
 * Remote failures preserve any evidence already retrieved without fabricating a substitute.
 */
export async function retrieveEvidence(input: { query: string; pageContext?: PortfolioPageContext; limit: number }): Promise<Evidence[]> {
  const { query, pageContext, limit } = inputSchema.parse(input);
  if (!query) return [];
  const results: Evidence[] = [];
  const ids = new Set<string>();
  const passages = new Set<string>();
  function append(sources: Evidence[]) {
    for (const source of sources) {
      const passage = JSON.stringify([source.href, source.text]);
      if (ids.has(source.id) || passages.has(passage)) continue;
      results.push(source);
      ids.add(source.id);
      passages.add(passage);
      if (results.length >= limit) break;
    }
  }
  append(matchStructuredEvidence(query, await buildStructuredContext()));
  if (results.length >= limit) return results;

  try {
    const [embedding] = await embedTexts([query]);
    if (pageContext) {
      append(await searchPortfolioVectors(embedding, {
        sourceSlug: pageContext.slug, sourceType: pageContext.type, limit, broaden: false,
      }));
    }
    // Count unique merged evidence, not raw provider rows, before broadening.
    if (results.length < limit) append(await searchPortfolioVectors(embedding, { limit }));
  } catch {
    // AI/Atlas is optional. Do not log visitor prompts or provider error payloads.
  }
  return results;
}
