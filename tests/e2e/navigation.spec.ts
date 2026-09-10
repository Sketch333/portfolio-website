import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("desktop shell supports skip navigation, primary links, and theme switching", async ({
  page,
}) => {
  await page.goto("/");

  const primary = page.getByRole("navigation", { name: "Primary" });
  await expect(primary.getByRole("link", { name: "Work" })).toHaveAttribute(
    "href",
    "/#work",
  );
  await expect(primary.getByRole("link", { name: "Experience" })).toHaveAttribute(
    "href",
    "/#experience",
  );
  await expect(primary.getByRole("link", { name: "Writing" })).toHaveAttribute(
    "href",
    "/blog",
  );
  await expect(primary.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "/about",
  );
  await expect(primary.getByRole("link", { name: "Ask AI" })).toHaveAttribute(
    "href",
    "/#ask-ai",
  );
  await expect(
    page.locator("header").getByRole("link", { name: "Contact" }),
  ).toHaveAttribute("href", "/#contact");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const themeToggle = page.getByRole("button", { name: "Switch to dark theme" });
  const themeToggleBox = await themeToggle.boundingBox();
  expect(themeToggleBox?.height).toBeGreaterThanOrEqual(44);
  await themeToggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("mobile navigation supports keyboard open, Escape, focus return, and link close", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.locator('button[aria-label="Open navigation menu"]');
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("dialog", { name: "Navigation menu" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("Enter");
  const mobileNavigation = page.getByRole("navigation", {
    name: "Mobile primary",
  });
  await mobileNavigation.getByRole("link", { name: "Work" }).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#work$/);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("small-screen navigation remains available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  await page.goto("/");

  const fallback = page.getByRole("navigation", {
    name: "Primary navigation without JavaScript",
  });
  await expect(fallback.getByRole("link", { name: "Work" })).toHaveAttribute(
    "href",
    "/#work",
  );
  await expect(fallback.getByRole("link", { name: "Contact" })).toHaveAttribute(
    "href",
    "/#contact",
  );

  await context.close();
});
