import { render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Capabilities } from '@/components/sections/capabilities';
import { ExperienceSection } from '@/components/sections/experience-section';
import { loadExperienceFrom } from '@/lib/content/experience';

describe('home capability and experience narrative', () => {
  it('presents four ordered capability stages in semantic server HTML', () => {
    render(<Capabilities />);
    const stages = within(screen.getByRole('list', { name: 'Capability progression' })).getAllByRole('listitem');
    expect(stages).toHaveLength(4);
    ['Data', 'Intelligence', 'Product', 'Business Impact'].forEach((stage, index) => {
      expect(within(stages[index]).getByRole('heading', { name: stage })).toBeVisible();
    });
    const html = renderToStaticMarkup(<Capabilities />);
    expect(html).toContain('Business Impact');
  });

  it('renders canonical roles in approved order without unverified SprintX details', async () => {
    const experience = await loadExperienceFrom('content/experience/experience.json');
    render(<ExperienceSection experience={experience} />);
    const entries = within(screen.getByRole('list', { name: 'Experience timeline' })).getAllByRole('listitem');
    expect(entries).toHaveLength(3);
    expect(within(entries[0]).getByRole('heading', { name: 'SprintX' })).toBeVisible();
    expect(within(entries[0]).getByText('Business Developer')).toBeVisible();
    expect(within(entries[0]).getByText('Present')).toBeVisible();
    expect(within(entries[0]).queryByRole('list')).not.toBeInTheDocument();
    expect(within(entries[0]).queryByText(/202[0-9]/)).not.toBeInTheDocument();
    expect(within(entries[1]).getByRole('heading', { name: 'WebForest' })).toBeVisible();
    expect(within(entries[1]).getByText('Data Researcher')).toBeVisible();
    expect(within(entries[2]).getByRole('heading', { name: 'Department of AI, UMT' })).toBeVisible();
    expect(within(entries[2]).getByText('Teaching Assistant')).toBeVisible();
    expect(screen.queryByText('Dates not supplied')).not.toBeInTheDocument();
  });
});
