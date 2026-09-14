import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

test('short mobile menu scrolls and keeps Contact reachable by keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 568, height: 320 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const dialog = page.getByRole('dialog', { name: 'Navigation menu' });
  const contact = dialog.getByRole('link', { name: 'Contact', exact: true });
  await dialog.hover();
  await page.mouse.wheel(0, 600);
  await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(contact).toBeInViewport({ ratio: 1 });
  for (const target of await dialog.locator('a, button').all()) {
    expect((await target.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  await dialog.getByRole('button', { name: 'Close navigation menu' }).focus();
  for (let index = 0; index < 6; index++) await page.keyboard.press('Tab');
  await expect(contact).toBeFocused();
  await expect(contact).toBeInViewport({ ratio: 1 });
  await page.keyboard.press('Enter');
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#contact$/);
});

test('fixture article has no Axe violations in both themes', async ({ browser }) => {
  // Exclusive creation prevents overwriting authored content; cleanup runs on failure too.
  // This local-only fixture is never committed or left in the canonical content tree.
  const fixturePath = path.join(process.cwd(), 'content/blog/e2e-accessibility-fixture.mdx');
  const source = await readFile(path.join(process.cwd(), 'tests/fixtures/content/blog/demo-post.mdx'), 'utf8');
  await writeFile(fixturePath, source.replace('slug: demo-post', 'slug: e2e-accessibility-fixture'), { flag: 'wx' });
  try {
    for (const colorScheme of ['light', 'dark'] as const) {
      const context = await browser.newContext({ colorScheme });
      try {
        const page = await context.newPage();
        await page.goto('/blog/e2e-accessibility-fixture');
        await expect(page.getByRole('heading', { name: 'Demo Post', exact: true })).toBeVisible();
        await expect(page.getByRole('list', { name: 'Article tags' })).toContainText('Testing');
        await expect(page.locator('html')).toHaveClass(new RegExp(colorScheme));
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      } finally {
        await context.close();
      }
    }
  } finally {
    await unlink(fixturePath);
  }
});
