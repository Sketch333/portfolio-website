import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getAllProjects } from '@/lib/content/projects';
import { getAllPosts } from '@/lib/content/blog';
import { getExperience } from '@/lib/content/experience';
import { chunkContent, type ChunkSource } from '@/lib/ai/chunking';

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

export async function runIngestion(args: string[]) {
  if (args.length !== 1 || args[0] !== '--dry-run') {
    throw new Error('Only --dry-run is supported until embedding and database integration are configured.');
  }
  const records = await buildIngestionRecords();
  console.log('Dry run — canonical portfolio content only');
  for (const type of ['project', 'blog', 'experience'] as const) {
    console.log(`${type}: ${records.sources.filter(source => source.type === type).length} sources, ${records.chunks.filter(chunk => chunk.type === type).length} chunks`);
  }
  console.log(`Total: ${records.chunks.length} chunks`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runIngestion(process.argv.slice(2)).catch(error => {
    console.error(error instanceof Error ? error.message : 'Ingestion failed');
    process.exitCode = 1;
  });
}
