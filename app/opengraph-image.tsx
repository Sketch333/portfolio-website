import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/metadata/og-card';
import { homeOgPayload, ogSize } from '@/lib/metadata/og';

export const alt = 'Aon Kazmi — From data to products.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(<OgCard payload={homeOgPayload()} />, ogSize);
}
