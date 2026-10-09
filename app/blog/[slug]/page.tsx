import type { Metadata } from 'next';
import { ArticleHeader } from '@/components/blog/article-header';
import { ArticleToc } from '@/components/blog/article-toc';
import { RelatedContent } from '@/components/blog/related-content';
import { extractHeadings } from '@/lib/content/headings';
import { getAllProjects } from '@/lib/content/projects';
import '../writing.css';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/content/blog';
import { renderMdx } from '@/lib/content/mdx';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: 'Article not found | Aon Kazmi', robots: { index: false } };

  return {
    title: `${post.title} | Aon Kazmi`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [body, posts, projects] = await Promise.all([renderMdx(post.body), getAllPosts(), getAllProjects()]);
  const index = posts.findIndex(item => item.slug === post.slug);
  const related = projects.filter(project => post.relatedProjectSlugs?.includes(project.slug));
  return <article className="writing-shell"><div className="writing-wrap">
    <ArticleHeader post={post} />
    <div className="writing-reading-layout"><ArticleToc headings={extractHeadings(post.body)} /><div className="writing-body">{body}</div></div>
    <RelatedContent projects={related} previous={posts[index - 1]} next={posts[index + 1]} />
  </div></article>;
}
