import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  title: 'Writing | Aon Kazmi',
  description: 'Writing about AI, data, and product work by Aon Kazmi.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  if (posts.length === 0 && process.env.NODE_ENV !== 'development') notFound();

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground">EDITORIAL TECH</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Writing</h1>
      {posts.length === 0 ? (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Writing migration in progress</p>
      ) : (
        <ul className="mt-10 space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="rounded-xl border bg-card p-6 text-card-foreground">
                <h2 className="text-2xl font-semibold tracking-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">{post.description}</p>
                <time className="mt-4 block text-sm text-muted-foreground" dateTime={post.publishedAt}>
                  {post.publishedAt}
                </time>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
