import { createHash } from 'node:crypto';
import { portfolioChunkSchema } from '@/lib/ai/schemas';
import type { PortfolioChunk } from '@/types/ai';

export type ChunkSource = Pick<PortfolioChunk, 'type' | 'slug' | 'title' | 'href' | 'text'>;

/** Sentence boundaries are preferred; a long sentence falls back to words,
 * then character slices so every emitted chunk respects the configured bound. */
function splitParagraph(paragraph: string, maxChars: number): string[] {
  const sentences = paragraph.split(/(?<=[.!?])\s+/);
  return sentences.flatMap(sentence => {
    const parts: string[] = [];
    let remaining = sentence.trim();
    while (remaining.length > maxChars) {
      const space = remaining.lastIndexOf(' ', maxChars);
      let end = space > 0 ? space : maxChars;
      if (end < remaining.length && /[\uD800-\uDBFF]/.test(remaining[end - 1]) && /[\uDC00-\uDFFF]/.test(remaining[end])) end--;
      if (end === 0) throw new RangeError('maxChars cannot fit a Unicode character');
      parts.push(remaining.slice(0, end));
      remaining = remaining.slice(end).trimStart();
    }
    if (remaining) parts.push(remaining);
    return parts;
  });
}

export function chunkContent(record: ChunkSource, maxChars = 1800): PortfolioChunk[] {
  if (!Number.isSafeInteger(maxChars) || maxChars < 1) {
    throw new RangeError('maxChars must be a positive safe integer');
  }
  const paragraphs = record.text.replace(/\r\n?/g, '\n').trim().split(/\n\s*\n/).map(text => text.trim()).filter(Boolean);
  const texts: string[] = [];
  let current = '';
  for (const paragraph of paragraphs) {
    const parts = paragraph.length <= maxChars ? [paragraph] : splitParagraph(paragraph, maxChars);
    for (let partIndex = 0; partIndex < parts.length; partIndex++) {
      const separator = partIndex === 0 ? '\n\n' : ' ';
      const candidate = current ? `${current}${separator}${parts[partIndex]}` : parts[partIndex];
      if (candidate.length > maxChars) {
        texts.push(current);
        current = parts[partIndex];
      } else current = candidate;
    }
  }
  if (current) texts.push(current);
  return texts.map((text, index) => portfolioChunkSchema.parse({
    type: record.type, slug: record.slug, title: record.title, href: record.href, index, text,
    id: createHash('sha256').update(`${record.type}:${record.slug}:${index}:${text}`).digest('hex'),
  }));
}

