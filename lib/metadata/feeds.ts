import type { MetadataRoute } from 'next';
import type { BlogPostRecord, ProjectRecord } from '@/types/content';
import { siteConfig } from './site';

const staticRoutes = ['/', '/about', '/projects', '/blog', '/resume'];
const url = (base: string, pathname: string) => new URL(pathname, base).toString();

export function buildSitemap(base: string, projects: ProjectRecord[], posts: BlogPostRecord[]): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map(pathname => ({ url: url(base, pathname) })),
    ...projects.filter(project => project.published && project.tier !== 'archive').map(project => ({ url: url(base, `/projects/${project.slug}`) })),
    ...posts.filter(post => post.published).map(post => ({ url: url(base, `/blog/${post.slug}`), ...(post.updatedAt || post.publishedAt ? { lastModified: post.updatedAt ?? post.publishedAt } : {}) })),
  ];
}

export function buildRobots(base: string): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: url(base, '/sitemap.xml') };
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]!);
}

export function buildRss(base: string, posts: BlogPostRecord[]): string {
  const items = posts.filter(post => post.published).sort((left, right) => (right.publishedAt ?? '').localeCompare(left.publishedAt ?? '') || left.slug.localeCompare(right.slug)).map(post => {
    const link = escapeXml(url(base, `/blog/${post.slug}`));
    return `<item><title>${escapeXml(post.title)}</title><description>${escapeXml(post.description)}</description><link>${link}</link><guid isPermaLink="true">${link}</guid>${post.publishedAt ? `<pubDate>${new Date(`${post.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>` : ''}</item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(siteConfig.title)}</title><link>${escapeXml(url(base, '/blog'))}</link><description>${escapeXml(siteConfig.description)}</description><atom:link href="${escapeXml(url(base, '/rss.xml'))}" rel="self" type="application/rss+xml"/>${items.join('')}</channel></rss>`;
}
