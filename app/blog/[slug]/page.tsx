import type { Metadata } from 'next';
import Link from 'next/link';
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

  const body = await renderMdx(post.body);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <Link
        href="/blog"
        className="rounded-sm text-sm font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        All writing
      </Link>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.description}</p>
      <time className="mt-6 block text-sm text-muted-foreground" dateTime={post.publishedAt}>{post.publishedAt}</time>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Article tags">
        {post.tags.map((tag) => <li key={tag} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{tag}</li>)}
      </ul>
      <div className="mt-12">{body}</div>
    </article>
  );
}
