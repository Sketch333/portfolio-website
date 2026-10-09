import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ArticleToc } from '@/components/blog/article-toc';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { extractHeadings } from '@/lib/content/headings';
import { renderMdx } from '@/lib/content/mdx';

describe('article heading anchors', () => {
  const source = '## Why **data**?\n\n### A `model` & [link](/blog)\n\n```md\n## Not a heading\n```\n\n~~~\n### Also code\n~~~\n\n## Why **data**?\n\n## Why data-2\n\n## 中文';
  it('extracts semantic H2/H3 text, ignores fences and assigns unique stable IDs', () => {
    expect(extractHeadings(source)).toEqual([
      { level: 2, text: 'Why data?', id: 'why-data' },
      { level: 3, text: 'A model & link', id: 'a-model-link' },
      { level: 2, text: 'Why data?', id: 'why-data-2' },
      { level: 2, text: 'Why data-2', id: 'why-data-2-2' },
      { level: 2, text: '中文', id: '中文' },
    ]);
  });
  it('renders exactly the extracted IDs including duplicates and inline formatting', async () => {
    render(await renderMdx(source));
    expect(screen.getAllByRole('heading').map((heading) => heading.id)).toEqual(extractHeadings(source).map((heading) => heading.id));
  });
});

describe('article contents visibility', () => {
  it('requires two H2 sections, even when H3 headings are present', () => {
    expect(renderToStaticMarkup(createElement(ArticleToc, { headings: extractHeadings('## One\n### Child\n### Other') }))).toBe('');
    expect(renderToStaticMarkup(createElement(ArticleToc, { headings: extractHeadings('## One\n## Two') }))).toContain('aria-label="On this page"');
  });
});
