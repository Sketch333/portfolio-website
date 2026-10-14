import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getAllProjects } from '@/lib/content/projects';
import { getAllPosts } from '@/lib/content/blog';
import { getExperience } from '@/lib/content/experience';
import { chunkContent, type ChunkSource } from '@/lib/ai/chunking';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { portfolioChunkSchema } from '@/lib/ai/schemas';
import type { PortfolioChunk } from '@/types/ai';

/** Canonical repository content only: no environment, provider, or DB imports. */
export async function buildIngestionRecords() {
  const [projects, posts, experience] = await Promise.all([getAllProjects(), getAllPosts(), getExperience()]);
  const sources: ChunkSource[] = [
    ...projects.map(project => ({ type: 'project' as const, slug: project.slug, title: project.title,
      href: `/projects/${project.slug}`, text: project.body })),
    ...posts.map(post => ({ type: 'blog' as const, slug: post.slug, title: post.title,
      href: `/blog/${post.slug}`, text: post.body })),
    ...experience.map(entry => ({ type: 'experience' as const,
      slug: `${entry.company}-${entry.role}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      title: `${entry.role} — ${entry.company}`, href: '/#experience',
      text: entry.company === 'SprintX' ? `${entry.company} — ${entry.role} — ${entry.periodLabel}`
        : [`${entry.company} — ${entry.role} — ${entry.periodLabel}`, ...entry.highlights].join('\n\n'),
    })),
  ];
  return { sources, chunks: sources.flatMap(source => chunkContent(source)) };
}

export async function ingestChunks(chunks: readonly PortfolioChunk[]) {
  const validated = z.array(portfolioChunkSchema).parse(chunks);
  const { getPortfolioContentHashes, upsertPortfolioChunks } = await import('@/lib/db/vector-search');
  const hashes = await getPortfolioContentHashes(validated.map(chunk => chunk.id));
  const changed = validated.map(chunk => ({ ...chunk, contentHash: createHash('sha256').update(chunk.text).digest('hex') }))
    .filter(chunk => hashes.get(chunk.id) !== chunk.contentHash);
  if (!changed.length) return { updated: 0, skipped: validated.length };
  const { embedTexts } = await import('@/lib/ai/model');
  const embeddings = await embedTexts(changed.map(chunk => chunk.text));
  const updatedAt = new Date();
  // No mutation occurs until every provider batch has succeeded and been validated.
  await upsertPortfolioChunks(changed.map((chunk, index) => ({ ...chunk, embedding: embeddings[index], updatedAt })));
  return { updated: changed.length, skipped: validated.length - changed.length };
}

export async function runIngestion(args: string[]) {
  if (args.length !== 1 || !['--dry-run', '--development'].includes(args[0])) {
    throw new Error('Choose --dry-run or explicit --development ingestion.');
  }
  if (args[0] === '--development') {
    if (process.env.NODE_ENV === 'production' || process.env.MONGODB_INGESTION_ENV !== 'development') {
      throw new Error('Development ingestion requires MONGODB_INGESTION_ENV=development and a non-production runtime.');
    }
    const { getAiEnv, getMongoEnv } = await import('@/lib/ai/env');
    getAiEnv(); getMongoEnv();
    const { closeMongoConnection } = await import('@/lib/db/mongo');
    try {
      const { chunks } = await buildIngestionRecords();
      const result = await ingestChunks(chunks);
      console.log(`Development ingestion: ${result.updated} updated, ${result.skipped} unchanged`);
    } finally {
      await closeMongoConnection();
    }
    return;
  }
  const records = await buildIngestionRecords();
  console.log('Dry run — canonical portfolio content only');
  for (const type of ['project', 'blog', 'experience'] as const) {
    console.log(`${type}: ${records.sources.filter(source => source.type === type).length} sources, ${records.chunks.filter(chunk => chunk.type === type).length} chunks`);
  }
  console.log(`Total: ${records.chunks.length} chunks`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runIngestion(process.argv.slice(2)).catch(() => {
    // Provider/driver errors may include credentials or request bodies.
    console.error('Ingestion failed; check development configuration and provider/database availability.');
    process.exitCode = 1;
  });
}
