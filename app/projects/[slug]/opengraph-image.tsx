import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { OgCard } from '@/components/metadata/og-card';
import { getProjectBySlug } from '@/lib/content/projects';
import { projectOgPayload, ogSize } from '@/lib/metadata/og';

export const alt = 'Aon Kazmi — Project preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return new ImageResponse(<OgCard payload={projectOgPayload(project)} />, ogSize);
}
