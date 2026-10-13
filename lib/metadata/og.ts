import type { BlogPostRecord, ProjectRecord } from '@/types/content';
import { siteConfig } from './site';
export type OgPayload = { eyebrow: string; title: string; subtitle: string };
export const ogSize = { width: 1200, height: 630 };
export const ogTypography = { family: 'sans-serif', titleSize: 58, subtitleSize: 25 };

export function homeOgPayload(): OgPayload {
  return { eyebrow: 'AI, Data & Product', title: 'From data to products.', subtitle: siteConfig.description };
}
export function projectOgPayload(project: ProjectRecord): OgPayload {
  return { eyebrow: 'Project', title: project.title, subtitle: project.description };
}
export function articleOgPayload(post: BlogPostRecord): OgPayload {
  const category = post.category === 'technical' ? 'Technical writing' : 'Build journal';
  const date = post.publishedAt ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${post.publishedAt}T00:00:00Z`)) : undefined;
  return { eyebrow: date ? `${category} · ${date}` : category, title: post.title, subtitle: post.description };
}
