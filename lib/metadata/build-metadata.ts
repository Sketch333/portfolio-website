import type { Metadata } from 'next';

/** Uses the configured, verified deployment origin; never guesses a domain. */
export function absoluteUrl(pathname: string): string | undefined {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return undefined;
  try {
    const site = new URL(base);
    if (!['https:', 'http:'].includes(site.protocol) || site.username || site.password) return undefined;
    if (!pathname.startsWith('/') || pathname.startsWith('//')) return undefined;
    const resolved = new URL(pathname, site.origin);
    if (resolved.origin !== site.origin) return undefined;
    return resolved.toString();
  } catch {
    return undefined;
  }
}

type PageMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  type?: 'website' | 'article';
  coverImage?: string;
  publishedAt?: string;
  updatedAt?: string;
};

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const title = `${input.title} | Aon Kazmi`;
  const url = absoluteUrl(input.pathname);
  const image = input.coverImage ? absoluteUrl(input.coverImage) : undefined;
  return {
    title,
    description: input.description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description: input.description,
      type: input.type ?? 'website',
      ...(url ? { url } : {}),
      ...(image ? { images: [image] } : {}),
      ...(input.type === 'article' ? {
        ...(input.publishedAt ? { publishedTime: input.publishedAt } : {}),
        ...(input.updatedAt ? { modifiedTime: input.updatedAt } : {}),
      } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description: input.description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
