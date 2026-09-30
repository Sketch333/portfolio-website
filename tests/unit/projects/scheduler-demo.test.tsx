import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { SchedulerDemo } from '@/components/projects/demos/scheduler-demo';

it('moves from constraints through conflicts to a resolved example with semantic states', () => {
  render(<SchedulerDemo />);
  expect(screen.getByText('Constraints loaded')).toBeVisible();
  expect(screen.getByText(/fictional course codes/i)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Show scheduling conflicts' }));
  expect(screen.getByText('Conflicts identified')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Resolve scheduling conflicts' }));
  expect(screen.getByText('Schedule resolved')).toBeVisible();
  expect(screen.getByRole('table', { name: 'Example resolved timetable' })).toBeVisible();
  expect(screen.getAllByRole('row')).toHaveLength(4);
  fireEvent.click(screen.getByRole('button', { name: 'Review constraints' }));
  expect(screen.getByText('Constraints loaded')).toBeVisible();
});
