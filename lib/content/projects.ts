import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { blogFrontmatterSchema, projectFrontmatterSchema } from './frontmatter';
import type { BlogPostRecord, ProjectRecord } from '@/types/content';

type MdxEntry = {
  data: Record<string, unknown>;
  body: string;
  frontmatter: string;
};

function compareFilenames(left: string, right: string) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function extractFrontmatter(source: string) {
  return source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
}

async function readMdxDirectory(directory: string): Promise<MdxEntry[]> {
  const files = (await fs.readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => entry.name)
    .sort(compareFilenames);

  return Promise.all(
    files.map(async (file) => {
      const source = await fs.readFile(path.join(directory, file), 'utf8');
      const parsed = matter(source);

      return {
        data: parsed.data,
        body: parsed.content.trim(),
        frontmatter: extractFrontmatter(source),
      };
    }),
  );
}

function normalizeCalendarDates(
  data: Record<string, unknown>,
  fields: readonly string[],
  frontmatter: string,
): Record<string, unknown> {
  const normalized = { ...data };

  for (const field of fields) {
    const value = normalized[field];
    if (value instanceof Date) {
      const authoredDate = frontmatter.match(
        new RegExp(`^${field}:\\s*(\\d{4}-\\d{2}-\\d{2})\\s*(?:#.*)?$`, 'm'),
      )?.[1];
      normalized[field] = authoredDate ?? value.toISOString().slice(0, 10);
    }
  }

  return normalized;
}

function assertUniqueSlugs(records: Array<{ slug: string }>, recordLabel: string) {
  const slugs = new Set<string>();

  for (const record of records) {
    if (slugs.has(record.slug)) {
      throw new Error(`Duplicate ${recordLabel} slug: ${record.slug}`);
    }
    slugs.add(record.slug);
  }
}

export async function loadProjectsFrom(directory: string): Promise<ProjectRecord[]> {
  const entries = await readMdxDirectory(directory);
  const projects = entries.map(({ data, body }) => ({
    ...projectFrontmatterSchema.parse(data),
    body,
  }));

  assertUniqueSlugs(projects, 'project');
  return projects;
}

export async function loadBlogPostsFrom(directory: string): Promise<BlogPostRecord[]> {
  const entries = await readMdxDirectory(directory);
  const posts = entries.map(({ data, body, frontmatter }) => ({
    ...blogFrontmatterSchema.parse(
      normalizeCalendarDates(data, ['publishedAt', 'updatedAt'], frontmatter),
    ),
    body,
  }));

  assertUniqueSlugs(posts, 'blog post');
  return posts;
}

export async function getAllProjects(): Promise<ProjectRecord[]> {
  const projectsDirectory = path.join(process.cwd(), 'content/projects');
  const projects = await loadProjectsFrom(projectsDirectory);
  return projects.filter((project) => project.published);
}

export async function getProjectBySlug(slug: string): Promise<ProjectRecord | null> {
  return (await getAllProjects()).find((project) => project.slug === slug) ?? null;
}
