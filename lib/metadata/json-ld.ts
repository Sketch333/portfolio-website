import { absoluteUrl } from './build-metadata';
import { siteConfig } from './site';
import type { BlogPostRecord } from '@/types/content';

export function personJsonLd() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    ...(url ? { url } : {}),
  };
}

export function articleJsonLd(post: BlogPostRecord) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = post.coverImage ? absoluteUrl(post.coverImage) : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: siteConfig.name },
    ...(url ? { url, mainEntityOfPage: { '@type': 'WebPage', '@id': url } } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(image ? { image } : {}),
  };
}

export function breadcrumbJsonLd(items: ReadonlyArray<{ name: string; pathname: string }>) {
  const urls = items.map(item => absoluteUrl(item.pathname));
  if (urls.some(url => !url)) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name, item: urls[index],
    })),
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
