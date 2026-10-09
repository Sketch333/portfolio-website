import type { ArticleHeading } from '@/lib/content/headings';

export function ArticleToc({ headings }: { headings: ArticleHeading[] }) {
  if (headings.filter(heading => heading.level === 2).length < 2) return null;
  return <nav aria-label="On this page" className="writing-toc">
    <p className="writing-kicker">On this page</p>
    <ol>{headings.map(heading => <li key={heading.id} className={heading.level === 3 ? 'writing-toc-sub' : undefined}><a href={`#${heading.id}`}>{heading.text}</a></li>)}</ol>
  </nav>;
}
