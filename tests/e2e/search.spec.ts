import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('search traps focus, returns focus, and opens conventional results by keyboard', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Search portfolio', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Search portfolio', exact: true });
  const input = dialog.getByRole('searchbox', { name: 'Search portfolio content' });
  await expect(input).toBeFocused();
  await input.fill('Neo4j');
  const result = dialog.getByRole('link', { name: /Multimodal/ });
  await expect(result).toHaveAttribute('href', '/projects/multimodal-ai-chatbot');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('ArrowDown');
  await expect(result).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await input.fill('Business Developer');
  await expect(dialog.getByRole('link', { name: /SprintX/ })).toHaveAttribute('href', '/#experience');
  await input.fill('Neo4j');
  await dialog.getByRole('link', { name: 'Ask AI about this' }).focus();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close search' })).toBeFocused();
  await input.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/multimodal-ai-chatbot$/);
});

test('normal navigation remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Search fallback' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Search fallback' }).getByRole('link', { name: 'Browse projects' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await context.close();
});
