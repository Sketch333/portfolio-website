'use client';

import Link from 'next/link';
import type { SearchRecord } from '@/types/search';

export const searchLinkClass = 'rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export function SearchResults({ query, results, onNavigate }: {
  query: string; results: readonly SearchRecord[]; onNavigate: () => void;
}) {
  return (
    <>
      <p role="status" className="my-4 text-sm text-muted-foreground">
        {!query.trim() ? 'Search projects, writing, technologies, and experience.' :
          results.length ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'No results. Try a different term or browse the portfolio.'}
      </p>
      <ul aria-label="Search results" className="space-y-2">
        {results.map(result => (
          <li key={result.id}>
            <Link data-search-result href={result.href} onClick={onNavigate}
              className={`${searchLinkClass} block border p-3 hover:bg-accent focus:bg-accent`}>
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">{result.type}</span>
              <span className="block font-semibold">{result.title}</span>
              <span className="block text-sm text-muted-foreground">{result.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <nav aria-label="Search alternatives" className="mt-5 flex flex-wrap gap-3 border-t pt-4 text-sm">
        <Link href="/projects" onClick={onNavigate} className={`${searchLinkClass} inline-flex min-h-11 items-center underline`}>Browse projects</Link>
        <Link href="/blog" onClick={onNavigate} className={`${searchLinkClass} inline-flex min-h-11 items-center underline`}>Browse writing</Link>
        {query.trim() && <a href={`/?q=${encodeURIComponent(query.trim())}#ask-ai`} onClick={onNavigate}
          className={`${searchLinkClass} inline-flex min-h-11 items-center underline`}>Ask AI about this</a>}
      </nav>
    </>
  );
}

