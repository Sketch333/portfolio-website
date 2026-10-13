import { afterEach, describe, expect, it, vi } from 'vitest';
import { absoluteUrl, buildPageMetadata, buildRootMetadata } from '@/lib/metadata/build-metadata';
import { articleJsonLd, breadcrumbJsonLd, personJsonLd, serializeJsonLd } from '@/lib/metadata/json-ld';

const post = { title: 'Cleaning data', description: 'Practical data cleaning.', slug: 'cleaning-data', tags: ['Data'], category: 'technical' as const, excerpt: 'Clean data.', published: true, featured: true, body: 'Body' };
afterEach(() => vi.unstubAllEnvs());
describe('metadata', () => {
  it('sets the configured base for inherited file-based social images on fallback routes', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
    expect(buildRootMetadata().metadataBase?.toString()).toBe('https://portfolio.example/');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(buildRootMetadata().metadataBase).toBeUndefined();
  });
  it('formats distinct content titles and preserves descriptions', () => {
    expect(buildPageMetadata({ ...post, pathname: '/blog/cleaning-data', type: 'article' })).toMatchObject({ title: 'Cleaning data | Aon Kazmi', description: 'Practical data cleaning.', openGraph: { type: 'article', title: 'Cleaning data | Aon Kazmi' } });
    expect(buildPageMetadata({ title: 'Scheduler', description: 'Constraint scheduling.', pathname: '/projects/scheduler' }).title).toBe('Scheduler | Aon Kazmi');
  });
  it('omits canonical and social URLs without a configured site', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(absoluteUrl('/blog/cleaning-data')).toBeUndefined();
    expect(buildPageMetadata({ ...post, pathname: '/blog/cleaning-data' }).alternates).toBeUndefined();
    expect(personJsonLd()).not.toHaveProperty('url');
    expect(breadcrumbJsonLd([{ name: 'Home', pathname: '/' }])).toBeUndefined();
  });
  it('uses only valid HTTP site URLs and resolves paths from the site root', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example/');
    expect(absoluteUrl('/blog/cleaning-data')).toBe('https://portfolio.example/blog/cleaning-data');
    expect(buildPageMetadata({ ...post, pathname: '/blog/cleaning-data' }).alternates).toEqual({ canonical: 'https://portfolio.example/blog/cleaning-data' });
    for (const base of ['invalid', 'javascript:alert(1)', 'https://user:password@portfolio.example']) {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', base);
      expect(absoluteUrl('/')).toBeUndefined();
    }
  });
  it('rejects paths that URL normalization would resolve to another origin', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
    expect(absoluteUrl('/\\evil.example/image.png')).toBeUndefined();
    expect(absoluteUrl('/\t/evil.example/image.png')).toBeUndefined();
    expect(buildPageMetadata({ ...post, pathname: '/blog/cleaning-data', coverImage: '/\\evil.example/image.png' }).openGraph).not.toHaveProperty('images');
  });
  it('includes real cover assets only when configured and never invents images', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
    expect(buildPageMetadata({ ...post, pathname: '/blog/cleaning-data' }).openGraph).not.toHaveProperty('images');
    expect(buildPageMetadata({ ...post, pathname: '/blog/cleaning-data', coverImage: '/images/cleaning.png' }).openGraph).toMatchObject({ images: ['https://portfolio.example/images/cleaning.png'] });
  });
  it('omits absent article dates and retains supplied dates', () => {
    expect(articleJsonLd(post)).not.toHaveProperty('datePublished');
    expect(articleJsonLd(post)).not.toHaveProperty('dateModified');
    expect(articleJsonLd({ ...post, publishedAt: '2025-01-02', updatedAt: '2025-02-03' })).toMatchObject({ datePublished: '2025-01-02', dateModified: '2025-02-03', headline: 'Cleaning data', author: { name: 'Syed Aon Muhammad Kazmi' } });
  });
  it('builds ordered canonical breadcrumbs', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
    expect(breadcrumbJsonLd([{ name: 'Home', pathname: '/' }, { name: 'Writing', pathname: '/blog' }])).toMatchObject({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://portfolio.example/' }, { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://portfolio.example/blog' }] });
  });
  it('escapes script-breaking text without changing structured data', () => {
    const data = articleJsonLd({ ...post, title: '</script><script>alert(1)</script>' });
    const serialized = serializeJsonLd(data);
    expect(serialized).not.toContain('<');
    expect(JSON.parse(serialized)).toEqual(data);
  });
});
