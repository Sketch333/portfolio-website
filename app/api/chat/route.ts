import { generateText, Output } from 'ai';
import { z } from 'zod';
import { getChatModel } from '@/lib/ai/model';
import { buildGroundedPrompt } from '@/lib/ai/prompt';
import { retrieveEvidence } from '@/lib/ai/retrieval';
import { createPortfolioAnswerSchema, evidenceSchema, portfolioAnswerSchema, portfolioChunkSchema } from '@/lib/ai/schemas';
import type { PortfolioAnswer } from '@/types/ai';

export const runtime = 'nodejs';
const inputSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(4000) }).strict()).min(1).max(20)
    .refine((messages) => messages.at(-1)?.role === 'user'),
  pageContext: z.object({ type: z.enum(['project', 'blog']), slug: portfolioChunkSchema.shape.slug }).strict().optional(),
  mode: z.enum(['default', 'recruiter']).default('default'),
}).strict();

const insufficient: PortfolioAnswer = {
  answer: "I don't have enough portfolio evidence to answer that reliably. Explore the projects, writing, or experience for verified details.",
  evidence: [], insufficientEvidence: true,
};
const unavailable: PortfolioAnswer = {
  answer: 'The portfolio assistant is temporarily unavailable. You can still browse projects, writing, and experience.',
  evidence: [], insufficientEvidence: true,
};
function json(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
}

// Enforce actual bytes, not only caller-controlled Content-Length, before JSON parsing.
async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 100000) { await reader.cancel(); throw new RangeError('Request too large'); }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { reader.releaseLock(); }
}

/** Completed JSON only: never expose tokens before contextual citation validation. */
export async function POST(request: Request) {
  let input: z.infer<typeof inputSchema>;
  try {
    input = inputSchema.parse(JSON.parse(await readBody(request)));
  } catch (error) {
    return json({ error: error instanceof RangeError ? 'Request too large.' : 'Invalid chat request.' }, error instanceof RangeError ? 413 : 400);
  }
  try {
    // History is bounded for the client contract, but prior generated claims are never
    // fed back as facts. Follow-ups must contain a standalone question (UI contract).
    const query = input.messages.at(-1)!.content;
    const evidence = z.array(evidenceSchema).max(6).parse(await retrieveEvidence({ query, pageContext: input.pageContext, limit: 6 }));
    if (!evidence.length) return json(insufficient);
    const { output } = await generateText({
      model: getChatModel(),
      system: buildGroundedPrompt(evidence, input.mode),
      prompt: query,
      output: Output.object({ schema: portfolioAnswerSchema }),
      maxOutputTokens: 1200,
      maxRetries: 0,
      abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(30000)]),
      experimental_telemetry: { isEnabled: false },
    });
    const validated = createPortfolioAnswerSchema(evidence).safeParse(output);
    // Dropping bad citations while retaining prose could leak unsupported claims.
    // Replace the entire answer on invalid, uncited or explicitly uncertain output.
    if (!validated.success || validated.data.insufficientEvidence || !validated.data.evidence.length
      || validated.data.answer.length > 6000 || /https?:|www\.|\]\(|<[^>]+>|(?:^|\s)\/(?:projects|blog|about|resume)\b/i.test(validated.data.answer)) {
      return json(insufficient);
    }
    return json(validated.data);
  } catch {
    // Provider/validation errors can include prompts and secrets. Never log payloads.
    return json(unavailable, 503);
  }
}
