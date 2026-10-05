import Link from "next/link";
import type { BlogPostRecord } from "@/types/content";

export function WritingPreview({ posts }: { posts: BlogPostRecord[] }) {
  return (
    <section aria-labelledby="writing-heading" className="home-section">
      <div className="home-wrap">
        <p className="home-kicker">05 / Notes & perspective</p>
        <h2 id="writing-heading" className="home-title">
          Writing / Build Journal
        </h2>
        {posts.length > 0 ? (
          <div className="mt-10 border-t">
            {posts.map((post) => (
              <article key={post.slug} className="border-b py-7">
                {post.publishedAt && (
                  <time className="home-caption" dateTime={post.publishedAt}>
                    {post.publishedAt}
                  </time>
                )}
                <h3 className="mt-3 text-2xl">
                  <Link className="home-link" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="home-secondary mt-3 max-w-2xl leading-7">
                  {post.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 border-t pt-8 md:grid-cols-[1fr_2fr]">
            <p className="home-caption">Writing is taking shape.</p>
            <div>
              <p className="home-secondary max-w-2xl text-lg leading-8">
                There are no published articles here yet. For now, explore the
                project case studies for the systems and contributions behind
                the work.
              </p>
              <Link href="/projects" className="home-link mt-5">
                Read the project case studies
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
