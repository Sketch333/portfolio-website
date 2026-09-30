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
