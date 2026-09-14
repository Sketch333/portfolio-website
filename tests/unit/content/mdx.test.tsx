import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderMdx } from '@/lib/content/mdx';

describe('renderMdx', () => {
  it('renders semantic headings and links', async () => {
    render(await renderMdx('## Architecture\n\n[Source](https://example.com)'));
    expect(screen.getByRole('heading', { name: 'Architecture', level: 2 })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute('href', 'https://example.com');
  });
});
