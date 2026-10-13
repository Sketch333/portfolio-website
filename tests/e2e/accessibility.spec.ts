import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const [name, route] of [
  ["home", "/"],
  ["flagship scheduler", "/projects/university-timetable-system"],
] as const) {
  test(`${name} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(({ impact }) =>
        impact === "serious" || impact === "critical",
      ),
    ).toEqual([]);
  });
}

test('article contents and search are usable by Tab and Enter', async ({ page }) => {
  await page.goto('/blog/how-to-build-a-simple-machine-learning-model-in-python');
  const contents = page.getByRole('navigation', { name: 'On this page' });
  const first = contents.getByRole('link').first();
  // Walk from the document's initial focus, as a keyboard visitor does.
  for (let count = 0; count < 40 && !(await first.evaluate(node => node === document.activeElement)); count++) {
    await page.keyboard.press('Tab');
  }
  await expect(first).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(contents.getByRole('link').nth(1)).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#what-do-you-need-before-training$/);
  const trigger = page.getByRole('button', { name: 'Search portfolio', exact: true });
  for (let count = 0; count < 40 && !(await trigger.evaluate(node => node === document.activeElement)); count++) {
    await page.keyboard.press('Shift+Tab');
  }
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Search portfolio', exact: true });
  await expect(dialog.getByRole('searchbox')).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});
