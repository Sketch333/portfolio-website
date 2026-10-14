import { createGateway, embedMany } from 'ai';
import { z } from 'zod';
import { getAiEnv } from '@/lib/ai/env';

function configuredGateway() {
  const env = getAiEnv();
  return { env, gateway: createGateway({ apiKey: env.AI_GATEWAY_API_KEY }) };
}

export function getChatModel() {
  const { env, gateway } = configuredGateway();
  return gateway.languageModel(env.AI_CHAT_MODEL);
}

/** Bounded sequential batches keep provider load predictable and preserve order. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const values = z.array(z.string().trim().min(1)).parse(texts);
  if (!values.length) return [];
  const { env, gateway } = configuredGateway();
  const model = gateway.embeddingModel(env.AI_EMBEDDING_MODEL);
  const embeddings: number[][] = [];
  let dimensions: number | undefined;
  for (let offset = 0; offset < values.length; offset += 64) {
    const batch = values.slice(offset, offset + 64);
    const result = await embedMany({ model, values: batch, maxParallelCalls: 1, maxRetries: 0 });
    const vectors = z.array(z.array(z.number().finite()).min(1).max(8192)).length(batch.length).parse(result.embeddings);
    for (const vector of vectors) {
      dimensions ??= vector.length;
      if (vector.length !== dimensions) throw new Error('Embedding dimensions differ within the ingestion run.');
    }
    embeddings.push(...vectors);
  }
  return embeddings;
}
