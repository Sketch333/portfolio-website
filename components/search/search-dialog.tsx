'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Dialog } from 'radix-ui';
import { Search, X } from 'lucide-react';
import { searchPortfolio } from '@/lib/search/query';
import type { SearchRecord } from '@/types/search';
import { SearchResults, searchLinkClass } from './search-results';

export function SearchDialog({ records }: { records: readonly SearchRecord[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const results = searchPortfolio(query, records);

  function navigateResults(event: KeyboardEvent<HTMLDivElement>) {
    const links = Array.from(contentRef.current?.querySelectorAll<HTMLAnchorElement>('[data-search-result]') ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const inInput = event.target === inputRef.current;
    if (!inInput && current < 0) return;
    if (event.key === 'ArrowDown' && links.length) {
      event.preventDefault();
      links[(current + 1) % links.length].focus();
    } else if (event.key === 'ArrowUp' && links.length) {
      event.preventDefault();
      if (current <= 0 && !inInput) inputRef.current?.focus();
      else links[inInput ? links.length - 1 : current - 1].focus();
    } else if (event.key === 'Enter' && inInput && links.length && !event.nativeEvent.isComposing) {
      event.preventDefault();
      links[0].click();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" aria-label="Search portfolio" className={`${searchLinkClass} inline-flex size-11 shrink-0 items-center justify-center border hover:bg-accent`}>
          <Search aria-hidden="true" className="size-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm" />
        <Dialog.Content ref={contentRef} onKeyDown={navigateResults}
          onOpenAutoFocus={event => { event.preventDefault(); inputRef.current?.focus(); }}
          className="fixed left-1/2 top-[5vh] z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-y-auto rounded-xl border bg-background p-5 shadow-xl focus:outline-none">
          <div className="flex items-center justify-between gap-4">
            <Dialog.Title className="text-xl font-semibold">Search portfolio</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close search" className={`${searchLinkClass} inline-flex size-11 items-center justify-center hover:bg-accent`}><X aria-hidden="true" className="size-5" /></button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">Find projects, writing, and experience. Use arrow keys to move through results and Enter to open one.</Dialog.Description>
          <label htmlFor={inputId} className="sr-only">Search portfolio content</label>
          <input id={inputId} ref={inputRef} type="search" autoComplete="off" value={query}
            onChange={event => setQuery(event.target.value)}
            className={`${searchLinkClass} mt-4 min-h-11 w-full border bg-background px-3 text-base`} />
          <SearchResults query={query} results={results} onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
