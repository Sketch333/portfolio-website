import { expect, it, vi, afterEach } from 'vitest';
import { generateMetadata as projectMetadata } from '@/app/projects/[slug]/page';
import { generateMetadata as articleMetadata } from '@/app/blog/[slug]/page';
import { getAllPosts } from '@/lib/content/blog';
import { getAllProjects } from '@/lib/content/projects';
import { metadata as home } from '@/app/page';
import { metadata as about } from '@/app/about/page';
import { metadata as writing } from '@/app/blog/page';
import { metadata as projects } from '@/app/projects/page';
import { metadata as resume } from '@/app/resume/page';
afterEach(() => vi.unstubAllEnvs());
it('produces distinct accurate metadata for all public content routes', async () => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
  const all = [home, about, writing, projects, resume];
  for (const project of await getAllProjects()) {
    const metadata = await projectMetadata({ params: Promise.resolve({ slug: project.slug }) });
    expect(metadata.title).toBe(`${project.title} | Aon Kazmi`);
    expect(metadata.description).toBe(project.description);
    expect(metadata.alternates?.canonical).toBe(`https://portfolio.example/projects/${project.slug}`);
    all.push(metadata);
  }
  for (const post of await getAllPosts()) {
    const metadata = await articleMetadata({ params: Promise.resolve({ slug: post.slug }) });
    expect(metadata.title).toBe(`${post.title} | Aon Kazmi`);
    expect(metadata.description).toBe(post.description);
    expect(metadata.alternates?.canonical).toBe(`https://portfolio.example/blog/${post.slug}`);
    expect(metadata.openGraph).not.toHaveProperty('publishedTime');
    all.push(metadata);
  }
  expect(new Set(all.map(item => item.title)).size).toBe(all.length);
  expect(new Set(all.map(item => item.description)).size).toBe(all.length);
});
it('keeps unavailable detail routes out of indexing without a canonical', async () => {
  expect(await articleMetadata({ params: Promise.resolve({ slug: 'missing' }) })).toEqual({ title: 'Article not found | Aon Kazmi', robots: { index: false } });
  expect(await projectMetadata({ params: Promise.resolve({ slug: 'missing' }) })).toEqual({ title: 'Project not found | Aon Kazmi', robots: { index: false } });
});
