import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page exposes the primary positioning", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Syed Aon Muhammad Kazmi — AI, Data & Product");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "I build AI-driven systems with technical depth and business impact — spanning intelligent automation, full-stack products, analytics, and product strategy.",
  );
  await expect(page.getByText("AI · Data · Product", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "From data to products." }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "I build AI-driven systems with technical depth and business impact — spanning intelligent automation, full-stack products, analytics, and product strategy.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore My Work" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ask My Portfolio" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View résumé" })).toHaveAttribute(
    "href",
    "/resume",
  );
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ask My Portfolio" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute(
    "href",
    "mailto:syedaonm@gmail.com",
  );
});

test("home theme follows system and persists a manual light or dark choice", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.evaluate(() => localStorage.setItem("theme", "system"));
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();

  await context.close();
});

test("home honors reduced motion and has no Axe violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect
    .poll(() => page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches))
    .toBe(true);
  const transitionDurationSeconds = await page
    .locator('nav[aria-label="Primary"] a')
    .first()
    .evaluate((element) => {
      const duration = getComputedStyle(element).transitionDuration;
      return duration.endsWith("ms")
        ? Number.parseFloat(duration) / 1000
        : Number.parseFloat(duration);
    });
  expect(transitionDurationSeconds).toBeLessThanOrEqual(0.001);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
