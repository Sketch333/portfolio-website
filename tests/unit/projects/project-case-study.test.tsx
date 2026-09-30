import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectCaseStudy } from '@/components/projects/project-case-study';
import { getProjectPresentation } from '@/lib/projects/presentation';
import { getProjectBySlug } from '@/lib/content/projects';
import type { ProjectRecord } from '@/types/content';

const fixture: ProjectRecord = {
  title: 'Fixture project',
  description: 'Fixture description',
  slug: 'fixture-project',
  tier: 'flagship',
  technologies: ['React'],
  featured: true,
  published: true,
  role: 'Integration lead',
  sourceUrl: 'https://example.com/source',
  demoUrl: 'https://example.com/demo',
  body: `## Technology
Authored technology context.

## Evidence boundary
No published performance figures.

## Contribution
Authored personal work.

## Overview
Authored overview.

\`\`\`md
## Contribution
\`\`\`

## Engineering Decisions
Authored decision.`,
};

async function renderProject(project: ProjectRecord) {
  const element = await ProjectCaseStudy({ project, presentation: getProjectPresentation(project) });
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(element);
  return container;
}

describe('ProjectCaseStudy', () => {
  it('orders authored sections and canonical slots while preserving unknown evidence and fenced text', async () => {
    const container = await renderProject(fixture);
    const headings = [...container.querySelectorAll('h2')].map((heading) => heading.textContent);

    expect(headings).toEqual([
      'Overview',
      'My Contribution',
      'Engineering Decisions',
      'Technology',
      'Evidence boundary',
      'Source / Demo / Related Writing',
    ]);
    expect(container.textContent).toContain('No published performance figures.');
    expect(container.querySelector('pre')?.textContent).toContain('## Contribution');
    expect(container.textContent?.indexOf('Integration lead')).toBeLessThan(
      container.textContent!.indexOf('Authored personal work.'),
    );
    expect(container.querySelectorAll('h2')).toHaveLength(6);
    expect(container.querySelector('a[href="https://example.com/source"]')?.textContent).toBe('Source');
    expect(container.querySelector('a[href="https://example.com/demo"]')?.textContent).toBe('Demo');
    expect(container.querySelector('a[href="https://example.com/source"]')?.getAttribute('href')).toBe('https://example.com/source');
    expect(container.querySelector('a[href="https://example.com/demo"]')?.getAttribute('href')).toBe('https://example.com/demo');
  });

  it('retains the scheduler team scope and detailed personal contribution from canonical MDX', async () => {
    const project = await getProjectBySlug('university-timetable-system');
    expect(project).not.toBeNull();
    const container = await renderProject(project!);

    expect(container.textContent).toContain('A four-person team built');
    expect(container.textContent).toContain('electives scheduling');
    expect(container.textContent).toContain('XLSX and Synergy-compatible CSV exports');
    expect([...container.querySelectorAll('h2')].map((heading) => heading.textContent)).toEqual([
      'Overview',
      'My Contribution',
      'Technology',
    ]);
  });

  it('omits sections without evidence or resources', async () => {
    const container = await renderProject({
      ...fixture,
      body: '## Overview\nOnly verified prose.',
      role: undefined,
      technologies: [],
      sourceUrl: undefined,
      demoUrl: undefined,
    });
    expect([...container.querySelectorAll('h2')].map((heading) => heading.textContent)).toEqual(['Overview']);
  });

  it('does not create an empty resources section for an invalid direct URL', async () => {
    const container = await renderProject({
      ...fixture,
      body: '## Overview\nOnly verified prose.',
      role: undefined,
      technologies: [],
      sourceUrl: 'javascript:alert(1)',
      demoUrl: undefined,
    });

    expect([...container.querySelectorAll('h2')].map((heading) => heading.textContent)).toEqual(['Overview']);
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
  });

  it('does not create an empty demonstration section for false or empty demo props', async () => {
    for (const demo of [false, '']) {
      const element = await ProjectCaseStudy({
        project: { ...fixture, body: '## Overview\nVerified prose.' },
        presentation: getProjectPresentation(fixture),
        demo,
      });
      const container = document.createElement('div');
      container.innerHTML = renderToStaticMarkup(element);
      expect(container.textContent).not.toContain('Interactive Demonstration');
    }
  });

  it('reserves space for the verified Superstore dashboard image', async () => {
    const project = await getProjectBySlug('bi-superstore-dashboard');
    expect(project).not.toBeNull();
    const container = await renderProject(project!);
    const image = container.querySelector<HTMLImageElement>('img[src="/projects/superstore-dashboard.png"]');

    expect(image).not.toBeNull();
    expect(image?.getAttribute('width')).toBe('1300');
    expect(image?.getAttribute('height')).toBe('722');
    expect(image?.getAttribute('alt')).toMatch(/Global Superstore Power BI dashboard/i);
  });
});
