import Link from 'next/link';
import type { BlogPostRecord } from '@/types/content';
import { readingMinutes } from '@/lib/content/headings';
import { formatPublicationDate } from '@/lib/content/publication-date';

export function ArticleHeader({ post }: { post: BlogPostRecord }) {
  return <header className="writing-header">
    <Link href="/blog" className="writing-back">← All writing</Link>
    <p className="writing-kicker">{post.category === 'technical' ? 'Technical notes' : 'Build journal'} / Aon Kazmi</p>
    <h1>{post.title}</h1>
    <p className="writing-deck">{post.description}</p>
    <div className="writing-byline"><span>By <Link href="/about">Aon Kazmi</Link></span>{post.publishedAt && <time dateTime={post.publishedAt}>{formatPublicationDate(post.publishedAt)}</time>}<span>{readingMinutes(post.body)} min read</span></div>
    <ul className="writing-tags" aria-label="Article tags">{post.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
  </header>;
}
