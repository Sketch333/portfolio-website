import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ArticleHeader } from '@/components/blog/article-header';
import BlogPage from '@/app/blog/page';
import { getAllPosts } from '@/lib/content/blog';
import type { BlogPostRecord } from '@/types/content';

vi.mock('@/lib/content/blog', () => ({ getAllPosts: vi.fn() }));

const undated: BlogPostRecord = {
  title: 'Undated article', description: 'An undated guide', excerpt: 'A guide',
  slug: 'undated', tags: ['Data'], category: 'technical', published: true,
  body: 'A useful article.',
};
const dated: BlogPostRecord = { ...undated, title: 'Dated article', slug: 'dated', publishedAt: '2025-01-02' };

describe('blog publication dates', () => {
  it('shows verified dates in article headers and omits missing dates', () => {
    const datedHtml = renderToStaticMarkup(<ArticleHeader post={dated} />);
    expect(datedHtml).toContain('<time dateTime="2025-01-02">January 2, 2025</time>');
    expect(renderToStaticMarkup(<ArticleHeader post={undated} />)).not.toContain('<time');
  });

  it('shows verified dates in index entries and omits missing dates', async () => {
    vi.mocked(getAllPosts).mockResolvedValue([dated, undated]);
    const html = renderToStaticMarkup(await BlogPage());
    expect(html).toContain('<time dateTime="2025-01-02">January 2, 2025</time>');
    expect(html.match(/<time/g)).toHaveLength(1);
  });
});
