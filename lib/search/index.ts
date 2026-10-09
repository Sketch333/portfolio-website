import { getAllProjects } from '@/lib/content/projects';
import { getAllPosts } from '@/lib/content/blog';
import { getExperience } from '@/lib/content/experience';
import type { SearchRecord } from '@/types/search';

export { searchPortfolio } from './query';

// Server entry point: the client imports only query.ts, never filesystem loaders.
export async function buildSearchIndex(): Promise<SearchRecord[]> {
  const [projects, posts, experience] = await Promise.all([
    getAllProjects(), getAllPosts(), getExperience(),
  ]);
  return [
    ...projects.map(project => ({
      id: `project:${project.slug}`, type: 'project' as const,
      title: project.title, description: project.description,
      href: `/projects/${project.slug}`,
      keywords: [...project.technologies, ...(project.role ? [project.role] : [])],
    })),
    ...posts.map(post => ({
      id: `article:${post.slug}`, type: 'article' as const,
      title: post.title, description: post.description,
      href: `/blog/${post.slug}`, keywords: [...post.tags, post.category],
    })),
    ...experience.map((entry, index) => ({
      id: `experience:${index}`, type: 'experience' as const,
      title: entry.company,
      description: entry.periodLabel === 'Dates not supplied'
        ? entry.role
        : `${entry.role} · ${entry.periodLabel}`,
      href: '/#experience', keywords: [entry.company, entry.role, ...entry.highlights],
    })),
  ];
}
