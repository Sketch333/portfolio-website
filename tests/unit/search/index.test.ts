import { describe, expect, it } from 'vitest';
import { buildSearchIndex, searchPortfolio } from '@/lib/search';

describe('canonical portfolio search', () => {
  it('finds a project by technology without case sensitivity', async () => {
    const records = await buildSearchIndex();
    expect(searchPortfolio('  nEO4j  ', records)).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'project', title: expect.stringMatching(/Multimodal/), href: expect.stringMatching(/^\/projects\//) }),
    ]));
  });
  it('finds SprintX by its role and links to experience', async () => {
    expect(searchPortfolio('Business Developer', await buildSearchIndex())[0]).toMatchObject({ title: 'SprintX', type: 'experience', href: '/#experience' });
  });
  it('does not return results for blank or unmatched queries', async () => {
    const records = await buildSearchIndex();
    expect(searchPortfolio(' \n ', records)).toEqual([]);
    expect(searchPortfolio('unfindablequux', records)).toEqual([]);
  });
  it('finds writing by tags and sends compact records without article bodies', async () => {
    const records = await buildSearchIndex();
    expect(searchPortfolio('Python', records).some(record => record.type === 'article')).toBe(true);
    expect(records.every(record => Object.keys(record).sort().join(',') === 'description,href,id,keywords,title,type')).toBe(true);
    expect(records.filter(record => record.type === 'article')).toHaveLength(8);
  });
  it('requires every query token and ranks title matches before keywords', () => {
    const records = [
      { id: 'keyword', type: 'project' as const, title: 'Other', description: '', href: '/other', keywords: ['data product'] },
      { id: 'partial', type: 'project' as const, title: 'Data', description: '', href: '/partial', keywords: [] },
      { id: 'title', type: 'project' as const, title: 'Data product', description: '', href: '/title', keywords: [] },
    ];
    expect(searchPortfolio('DATA   product', records).map(record => record.id)).toEqual(['title', 'keyword']);
  });
});
