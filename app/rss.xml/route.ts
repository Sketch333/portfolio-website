import { getAllPosts } from '@/lib/content/blog';
import { buildRss } from '@/lib/metadata/feeds';
import { indexingSiteUrl } from '@/lib/metadata/site-url';

export const dynamic = 'force-static';

export async function GET() {
  const base = indexingSiteUrl();
  return new Response(buildRss(base, await getAllPosts()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
