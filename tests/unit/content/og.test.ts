import { afterEach, expect, it, vi } from 'vitest';
import { getAllPosts } from '@/lib/content/blog';
import { getProjectBySlug } from '@/lib/content/projects';
import { homeOgPayload, projectOgPayload, articleOgPayload } from '@/lib/metadata/og';
import { buildPageMetadata } from '@/lib/metadata/build-metadata';

afterEach(() => vi.unstubAllEnvs());
it('uses the approved home positioning', () => {
  expect(homeOgPayload()).toMatchObject({ title: 'From data to products.', eyebrow: 'AI, Data & Product' });
});
it('uses canonical scheduler title and description', async () => {
  const project = (await getProjectBySlug('university-timetable-system'))!;
  expect(projectOgPayload(project)).toEqual({ eyebrow: 'Project', title: project.title, subtitle: project.description });
});
it('preserves undated articles and supplied original dates without cover assets', async () => {
  const post = (await getAllPosts())[0];
  expect(articleOgPayload(post)).toEqual({ eyebrow: 'Technical writing', title: post.title, subtitle: post.description });
  expect(articleOgPayload({ ...post, publishedAt: '2025-01-02' }).eyebrow).toBe('Technical writing · January 2, 2025');
  expect(articleOgPayload({ ...post, category: 'build-journal' }).eyebrow).toBe('Build journal');
});
it('prefers generated cards for both social networks using a verified origin', () => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
  const metadata = buildPageMetadata({ title: 'Scheduler', description: 'Scheduling', pathname: '/projects/scheduler', ogImage: '/projects/scheduler/opengraph-image', coverImage: '/images/old.png' });
  expect(metadata.openGraph).toMatchObject({ images: ['https://portfolio.example/projects/scheduler/opengraph-image'] });
  expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', images: ['https://portfolio.example/projects/scheduler/opengraph-image'] });
});
it('omits generated image URLs with missing configuration or unsafe paths', () => {
  const input = { title: 'Article', description: 'Writing', pathname: '/blog/article', ogImage: '/blog/article/opengraph-image' };
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
  expect(buildPageMetadata(input).openGraph).not.toHaveProperty('images');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
  expect(buildPageMetadata({ ...input, ogImage: '/\\evil.example/card' }).openGraph).not.toHaveProperty('images');
});
