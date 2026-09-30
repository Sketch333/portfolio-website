import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BiDashboardExplorer } from '@/components/projects/demos/bi-dashboard-explorer';

it('lets readers inspect only the verified Superstore analysis areas', () => {
  render(<BiDashboardExplorer />);
  const lenses = screen.getByRole('list', { name: 'Dashboard analysis areas' });
  expect(within(lenses).getAllByRole('listitem')).toHaveLength(4);
  for (const title of ['KPI summaries', 'Geographic view', 'Product comparison', 'Time trends']) {
    expect(within(lenses).getByText(title)).toBeVisible();
  }
  expect(screen.getByRole('link', { name: /Inspect the original dashboard image/i })).toHaveAttribute('href', '/projects/superstore-dashboard.png');
  expect(screen.getByText(/static Power BI artifact/i)).toBeVisible();
  expect(screen.queryByText(/revenue|churn|conversion rate/i)).not.toBeInTheDocument();
});
