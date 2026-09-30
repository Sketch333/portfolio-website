import { render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { HeroSequence } from '@/components/interactive/hero-sequence';

vi.mock('motion/react', async () => {
  const actual = await vi.importActual<object>('motion/react');
  return { ...actual, useReducedMotion: () => true };
});

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
  vi.stubGlobal('matchMedia', (media: string) => ({
    media, matches: true, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
});
afterAll(() => vi.unstubAllGlobals());

const stages = ['Data', 'Intelligence', 'Product', 'Impact'];

describe('HeroSequence', () => {
  it('presents the complete ordered story for reduced motion', () => {
    render(<HeroSequence />);
    const items = within(screen.getByRole('list', { name: 'From data to impact' })).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    stages.forEach((stage, index) => {
      expect(within(items[index]).getByText(stage)).toBeVisible();
    });
    expect(screen.getByText('Raw inputs become patterns.')).toBeVisible();
    expect(screen.getByText('Useful systems support decisions.')).toBeVisible();
  });

  it('includes every stage and its meaning in server-rendered HTML', () => {
    const html = renderToStaticMarkup(<HeroSequence />);
    stages.forEach((stage) => expect(html).toContain(stage));
    expect(html).toContain('Reasoning gives patterns direction.');
    expect(html).toContain('Intelligence becomes an interface.');
    expect(html).not.toContain('opacity:0');
  });
});
