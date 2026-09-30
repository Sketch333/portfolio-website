import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { SchedulerDemo } from '@/components/projects/demos/scheduler-demo';
import { SchedulerDemoFallback } from '@/components/projects/demos/scheduler-demo-fallback';

it('moves from constraints through conflicts to a resolved example with semantic states', () => {
  render(<SchedulerDemo />);
  expect(screen.getByText('Constraints loaded')).toBeVisible();
  expect(screen.getByText(/fictional course codes/i)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Show scheduling conflicts' }));
  expect(screen.getByText('Conflicts identified')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Inspect CP-SAT progress' }));
  expect(screen.getByText('CP-SAT scheduling progress')).toBeVisible();
  expect(screen.getByText(/illustrative sequence, not a live solver run/i)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Resolve scheduling conflicts' }));
  expect(screen.getByText('Schedule resolved')).toBeVisible();
  expect(screen.getByRole('table', { name: 'Example resolved timetable' })).toBeVisible();
  expect(screen.getAllByRole('row')).toHaveLength(4);
  expect(screen.getByText('Capacity and schedule state')).toBeVisible();
  expect(screen.getByText(/EX-101: 24 of 30 seats/i)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Review constraints' }));
  expect(screen.getByText('Constraints loaded')).toBeVisible();
});

it('keeps progress, capacity, and timetable explanation in the server fallback', () => {
  render(<SchedulerDemoFallback />);
  expect(screen.getByText(/CP-SAT scheduling progress/i)).toBeVisible();
  expect(screen.getByText(/EX-101: 24 of 30 seats/i)).toBeVisible();
  expect(screen.getByRole('table', { name: 'Example resolved timetable' })).toBeVisible();
});
