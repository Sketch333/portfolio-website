import type { z } from 'zod';
import type { evidenceSchema, evidenceReferenceSchema, portfolioAnswerSchema, portfolioChunkSchema } from '@/lib/ai/schemas';

export type Evidence = z.infer<typeof evidenceSchema>;
export type EvidenceReference = z.infer<typeof evidenceReferenceSchema>;
export type PortfolioAnswer = z.infer<typeof portfolioAnswerSchema>;
export type PortfolioChunk = z.infer<typeof portfolioChunkSchema>;
export type PortfolioPageContext = { type: 'project' | 'blog'; slug: string };

// Embedding generation adds these fields after deterministic chunking succeeds.
export type EmbeddedPortfolioChunk = PortfolioChunk & {
  embedding: number[];
  contentHash: string;
  updatedAt: Date;
};
