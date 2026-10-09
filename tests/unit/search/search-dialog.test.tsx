import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { SearchDialog } from '@/components/search/search-dialog';

const records = [
  { id: 'project:chat', type: 'project' as const, title: 'Multimodal chatbot', description: 'Knowledge retrieval', href: '/projects/chat', keywords: ['Neo4j'] },
  { id: 'experience:sprintx', type: 'experience' as const, title: 'SprintX', description: 'Business Developer', href: '/#experience', keywords: [] },
];
afterEach(cleanup);

it('opens search, renders typed results, and returns focus after Escape', async () => {
  render(<SearchDialog records={records} />);
  const trigger = screen.getByRole('button', { name: 'Search portfolio' });
  trigger.focus();
  fireEvent.click(trigger);
  const input = await screen.findByRole('searchbox', { name: 'Search portfolio content' });
  expect(input).toHaveFocus();
  fireEvent.change(input, { target: { value: 'Neo4j' } });
  expect(screen.getByRole('link', { name: /Multimodal chatbot/ })).toHaveAttribute('href', '/projects/chat');
  expect(screen.getByText('project')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Ask AI about this' })).toHaveAttribute('href', '/#ask-ai?q=Neo4j');
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(screen.getByRole('link', { name: /Multimodal chatbot/ })).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Escape' });
  await waitFor(() => expect(trigger).toHaveFocus());
});

it('offers browse paths and an encoded AI link when nothing matches', async () => {
  render(<SearchDialog records={records} />);
  fireEvent.click(screen.getByRole('button', { name: 'Search portfolio' }));
  const input = await screen.findByRole('searchbox', { name: 'Search portfolio content' });
  fireEvent.change(input, { target: { value: 'x & y' } });
  expect(screen.getByRole('status')).toHaveTextContent('No results');
  expect(screen.getByRole('link', { name: 'Browse projects' })).toHaveAttribute('href', '/projects');
  expect(screen.getByRole('link', { name: 'Browse writing' })).toHaveAttribute('href', '/blog');
  expect(screen.getByRole('link', { name: 'Ask AI about this' })).toHaveAttribute('href', '/#ask-ai?q=x%20%26%20y');
});
