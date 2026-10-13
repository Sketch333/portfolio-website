import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { OgCard } from '@/components/metadata/og-card';
import { getPostBySlug } from '@/lib/content/blog';
import { articleOgPayload, ogSize } from '@/lib/metadata/og';

export const alt = 'Aon Kazmi — Article preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return new ImageResponse(<OgCard payload={articleOgPayload(post)} />, ogSize);
}
