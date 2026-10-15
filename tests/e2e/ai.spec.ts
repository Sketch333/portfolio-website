import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const article = 'the-role-of-statistics-in-data-science';
for (const failure of ['http', 'network'] as const) {
  test(`${failure} failure preserves keyboard project and writing navigation`, async ({ page }) => {
    await page.route('**/api/chat', route => failure === 'http'
      ? route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"unavailable"}' })
      : route.abort('failed'));
    await page.goto('/?q=Current%20role#ask-ai');
    const input = page.getByRole('textbox', { name: 'Your question' });
    await expect(input).toHaveValue('Current role');
    await page.getByRole('button', { name: 'Ask question', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toContainText('unavailable');
    await expect(page.getByRole('status')).toHaveCount(1);
    await expect(input).toBeFocused();
    const navigation = page.getByRole('navigation', { name: 'Explore portfolio' });
    await expect(navigation.getByRole('link', { name: 'Browse writing' })).toBeVisible();
    expect((await new AxeBuilder({ page }).include('#ask-ai').analyze()).violations).toEqual([]);
    await navigation.getByRole('link', { name: 'Browse projects' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/?q=Current%20role#ask-ai');
    await page.getByRole('button', { name: 'Ask question', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('unavailable');
    await page.getByRole('navigation', { name: 'Explore portfolio' }).getByRole('link', { name: 'Browse writing' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

for (const context of [
  { type: 'project', slug: 'university-timetable-system', path: '/projects/university-timetable-system' },
  { type: 'blog', slug: article, path: `/blog/${article}` },
]) {
  test(`real ${context.type} route submits page context and exposes usable evidence links`, async ({ page }) => {
    let submitted: unknown;
    await page.route('**/api/chat', async route => {
      submitted = route.request().postDataJSON();
      await route.fulfill({ json: { answer: 'Verified portfolio evidence.', evidence: [{ id: 'source', title: 'Read source', href: context.path }], insufficientEvidence: false } });
    });
    await page.goto(`${context.path}?q=Explain%20this%20work#ask-ai`);
    const input = page.getByRole('textbox', { name: 'Your question' });
    await expect(input).toHaveValue('Explain this work');
    await page.getByRole('checkbox', { name: 'Recruiter mode' }).check();
    await page.getByRole('button', { name: 'Ask question', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Verified portfolio evidence.');
    expect(submitted).toEqual({ messages: [{ role: 'user', content: 'Explain this work' }], mode: 'recruiter', pageContext: { type: context.type, slug: context.slug } });
    await expect(input).toBeFocused();
    const source = page.getByRole('link', { name: 'Read source' });
    await expect(source).toHaveAttribute('href', context.path);
    await source.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${context.path}$`));
  });
}
