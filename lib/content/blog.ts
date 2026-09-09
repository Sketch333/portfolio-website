import path from 'node:path';
import { loadBlogPostsFrom } from './projects';
import type { BlogPostRecord } from '@/types/content';

export { loadBlogPostsFrom };

export async function getAllPosts(): Promise<BlogPostRecord[]> {
  const blogDirectory = path.join(process.cwd(), 'content/blog');
  const posts = await loadBlogPostsFrom(blogDirectory);

  return posts
    .filter((post) => post.published)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  return (await getAllPosts()).find((post) => post.slug === slug) ?? null;
}
