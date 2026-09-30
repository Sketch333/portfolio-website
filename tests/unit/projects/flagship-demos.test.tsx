import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { VideoPipelineDemo } from '@/components/projects/demos/video-pipeline-demo';
import { ChatbotSystemDemo } from '@/components/projects/demos/chatbot-system-demo';

it('explains the video workflow in order without presenting generated media as evidence', () => {
  render(<VideoPipelineDemo />);
  const steps = within(screen.getByRole('list', { name: 'Video pipeline stages' })).getAllByRole('listitem');
  expect(steps).toHaveLength(5);
  expect(steps.map((step) => within(step).getByRole('heading').textContent)).toEqual([
    'Script', 'Scene plan', 'Model generation', 'Human validation', 'FFmpeg / render',
  ]);
  expect(screen.getByText(/conceptual walkthrough/i)).toBeVisible();
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it('shows the hybrid channels and states the hardware evidence boundary', () => {
  render(<ChatbotSystemDemo />);
  const diagram = screen.getByRole('group', { name: 'Hybrid chatbot system map' });
  for (const label of ['AIML', 'Prolog', 'Neo4j', 'Memory', 'Sensor inputs', 'ESP32']) {
    expect(within(diagram).getByText(label)).toBeVisible();
  }
  expect(screen.getByText(/hardware connection has not been independently verified/i)).toBeVisible();
  expect(screen.getByText(/architecture walkthrough, not a live chatbot/i)).toBeVisible();
});
