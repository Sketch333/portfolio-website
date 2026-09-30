import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ProjectCard } from '@/components/projects/project-card';
import type { ProjectRecord } from '@/types/content';

const project: ProjectRecord = {
  title: 'A real project',
  description: 'Verified description.',
  slug: 'real-project',
  tier: 'featured',
  technologies: ['React', 'Django'],
  featured: true,
  published: true,
  role: 'Integration lead',
  body: '',
};

it.each(['home', 'index'] as const)('renders a server-readable %s card with a detail link', (variant) => {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(<ProjectCard project={project} variant={variant} />);

  expect(container.querySelector('article')).not.toBeNull();
  expect(container.querySelector('h3 a')?.getAttribute('href')).toBe('/projects/real-project');
  expect(container.textContent).toContain('Verified description.');
  expect(container.textContent).toContain('Integration lead');
  expect([...container.querySelectorAll('li')].map((item) => item.textContent)).toEqual(['React', 'Django']);
});

it('presents the Superstore work through verified analytical lenses on the home page', () => {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(
    <ProjectCard
      project={{ ...project, slug: 'bi-superstore-dashboard', title: 'BI Superstore Dashboard' }}
      variant="home"
    />,
  );

  const preview = container.querySelector('[aria-label="Superstore dashboard analysis areas"]');
  expect(preview).not.toBeNull();
  expect(preview?.textContent).toContain('KPI analysis');
  expect(preview?.textContent).toContain('Geographic analysis');
  expect(preview?.textContent).toContain('Product analysis');
  expect(preview?.textContent).toContain('Time analysis');
  expect(container.querySelector('img')).toBeNull();
  expect(container.querySelector('a[href="/projects/bi-superstore-dashboard"]')).not.toBeNull();
});
