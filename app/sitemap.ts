import { getAllPosts } from '@/lib/content/blog';
import { getAllProjects } from '@/lib/content/projects';
import { buildSitemap } from '@/lib/metadata/feeds';
import { indexingSiteUrl } from '@/lib/metadata/site-url';

export default async function sitemap() {
  const base = indexingSiteUrl();
  const [projects, posts] = await Promise.all([getAllProjects(), getAllPosts()]);
  return buildSitemap(base, projects, posts);
}
