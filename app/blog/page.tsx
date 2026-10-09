import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/content/blog';
import { readingMinutes } from '@/lib/content/headings';
import './writing.css';

export const metadata: Metadata = {
  title: 'Writing | Aon Kazmi',
  description: 'Practical notes on machine learning, data, and the decisions behind useful systems by Aon Kazmi.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const categories = [{ key: 'technical', label: 'Technical notes', description: 'Clear explanations. Practical decisions.' }, { key: 'build-journal', label: 'Build journal', description: 'Notes from making things work.' }] as const;
  return <section className="writing-shell"><div className="writing-wrap">
    <header className="writing-index-hero"><p className="writing-kicker">Writing / Data · Models · Decisions</p><h1>Ideas, put<br />into practice<span aria-hidden="true">.</span></h1><p className="writing-deck">Notes on understanding data, choosing models, and asking better questions before building.</p><div className="writing-index-meta"><span>{String(posts.length).padStart(2, '0')} articles</span><span>By Aon Kazmi</span><Link href="/projects">Explore the work ↗</Link></div></header>
    {categories.map(category => {
      const group = posts.filter(post => post.category === category.key).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
      if (!group.length) return null;
      return <section key={category.key} aria-labelledby={category.key} className="writing-category"><div className="writing-category-heading"><h2 id={category.key}>{category.label}</h2><p>{category.description}</p></div><ol className="writing-list">{group.map((post, index) => <li key={post.slug}><article className="writing-entry"><span aria-hidden="true" className="writing-number">{String(index + 1).padStart(2, '0')}</span><div><p className="writing-kicker">{post.tags[0]} / {readingMinutes(post.body)} min read</p><h3><Link href={`/blog/${post.slug}`}>{post.title}<span aria-hidden="true"> ↗</span></Link></h3><p className="writing-excerpt">{post.excerpt}</p></div></article></li>)}</ol></section>;
    })}
  </div></section>;
}
