import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const slug = 'how-to-build-a-simple-machine-learning-model-in-python';
test('writing index and article support keyboard navigation and exact contents links', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.locator('.writing-entry')).toHaveCount(8);
  const article = page.getByRole('link', { name: /How to Build a Simple Machine Learning Model in Python/ });
  await article.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`/blog/${slug}$`));
  await expect(page.getByText(/min read/, { exact: false }).first()).toBeVisible();
  await expect(page.locator('article time')).toHaveCount(0);
  const contents = page.getByRole('navigation', { name: 'On this page' });
  for (const link of await contents.getByRole('link').all()) {
    const href = await link.getAttribute('href');
    await expect(page.locator(`[id="${href!.slice(1)}"]`)).toHaveCount(1);
  }
  const first = contents.getByRole('link').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#what-do-you-need-before-training$/);
  await expect(page.getByRole('navigation', { name: 'More writing' })).toBeVisible();
  const related = page.locator('.writing-related').getByRole('link', { name: /Industrial IoT/ });
  await expect(related).toHaveAttribute('href', '/projects/industrial-iot-sensor-analytics');
  await related.click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Industrial IoT');
});

test('articles remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`/blog/${slug}`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Machine Learning Model');
  await expect(page.locator('.writing-body pre').first()).toBeVisible();
  const link = page.getByRole('navigation', { name: 'On this page' }).getByRole('link').first();
  await link.click();
  await expect(page).toHaveURL(/#what-do-you-need-before-training$/);
  await context.close();
});

test('writing is accessible in both themes and fits mobile, tablet, desktop', async ({ page }) => {
  test.setTimeout(90000);
  for (const theme of ['light', 'dark']) {
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    for (const route of ['/blog', `/blog/${slug}`]) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveClass(new RegExp(theme));
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.screenshot({ path: 'test-results/writing-' + theme + '-' + width + (route === '/blog' ? '-index' : '-article') + '.png', fullPage: true });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    }
  }
});
