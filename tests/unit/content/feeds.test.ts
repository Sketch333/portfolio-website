import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildSitemap, buildRss, buildRobots } from '@/lib/metadata/feeds';
import { indexingSiteUrl } from '@/lib/metadata/site-url';

const post = { title: 'Data & <products> "today"', description: "Aon's <guide> & examples", slug: 'data', tags: [], category: 'technical' as const, excerpt: 'Guide', published: true, body: '' };
const project = { title: 'Project', description: 'Example', slug: 'project', tier: 'flagship' as const, technologies: [], featured: true, published: true, body: '' };
afterEach(() => vi.unstubAllEnvs());
describe('canonical indexing feeds', () => {
  it('includes static and published detail routes but excludes draft and archive records', () => {
    const entries = buildSitemap('https://example.test', [project, { ...project, slug: 'draft', published: false }, { ...project, slug: 'archive', tier: 'archive' }], [post, { ...post, slug: 'draft', published: false }]);
    expect(entries.map(entry => entry.url)).toEqual(['https://example.test/', 'https://example.test/about', 'https://example.test/projects', 'https://example.test/blog', 'https://example.test/resume', 'https://example.test/projects/project', 'https://example.test/blog/data']);
    expect(entries.at(-1)).not.toHaveProperty('lastModified');
  });
  it('renders valid escaped RSS, newest first, retaining real dates and omitting absent dates', () => {
    const xml = buildRss('https://example.test', [post, { ...post, slug: 'older', publishedAt: '2025-01-01' }, { ...post, slug: 'newer', publishedAt: '2025-02-01' }, { ...post, slug: 'draft', published: false }]);
    const document = new DOMParser().parseFromString(xml, 'text/xml');
    expect(document.querySelector('parsererror')).toBeNull();
    const items = [...document.querySelectorAll('item')];
    expect(items.map(item => item.querySelector('link')?.textContent)).toEqual(['https://example.test/blog/newer', 'https://example.test/blog/older', 'https://example.test/blog/data']);
    expect(items[0].querySelector('title')?.textContent).toBe(post.title);
    expect(items[0].querySelector('description')?.textContent).toBe(post.description);
    expect(items[0].querySelector('pubDate')?.textContent).toBe('Sat, 01 Feb 2025 00:00:00 GMT');
    expect(items[2].querySelector('pubDate')).toBeNull();
  });
  it('points robots to the configured canonical sitemap', () => {
    expect(buildRobots('https://example.test')).toEqual({ rules: { userAgent: '*', allow: '/' }, sitemap: 'https://example.test/sitemap.xml' });
  });
  it('allows localhost fallback only for local preview', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('CI', '');
    vi.stubEnv('VERCEL', '');
    expect(indexingSiteUrl()).toBe('http://localhost:3000');
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => indexingSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
  it('rejects malformed and local production origins', () => {
    vi.stubEnv('NODE_ENV', 'production');
    for (const url of ['invalid', 'https://user:pass@example.test', 'http://localhost:3000', 'http://localhost.:3000', 'http://127.0.0.1:3000', 'http://[::1]:3000']) {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', url);
      expect(() => indexingSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
    }
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test/path');
    expect(indexingSiteUrl()).toBe('https://example.test');
  });
  it('requires a configured origin in CI even outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('CI', 'true');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(() => indexingSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});
