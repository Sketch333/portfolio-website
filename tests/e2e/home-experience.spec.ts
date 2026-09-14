import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const headings = [
  "From data to products.",
  "Selected Work",
  "AI × Data × Product × Business",
  "Experience",
  "Ask My Portfolio",
  "Writing / Build Journal",
  "Beyond the Work",
  "Contact",
];

test("home follows the complete narrative order with canonical work and conventional fallbacks", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main h1, main h2")).toHaveText(headings);
  const work = page.getByRole("region", { name: "Selected Work" });
  await expect(work.locator("article")).toHaveCount(5);
  await expect(
    work.locator("article").first().getByRole("heading"),
  ).toHaveAccessibleName(
    "AI-Powered University Timetable Scheduling & Teacher Assignment System",
  );
  await expect(
    work.getByRole("link", { name: /AI-Powered University Timetable/ }),
  ).toHaveAttribute("href", "/projects/university-timetable-system");
  await expect(page.getByRole("region", { name: "Experience" })).toContainText(
    "Business Developer",
  );
  await expect(page.getByText("Dates not supplied")).toHaveCount(0);
  await expect(
    page
      .getByRole("region", { name: "Writing / Build Journal" })
      .locator("article"),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("region", { name: "Ask My Portfolio" })
      .getByRole("link", { name: "Email me" }),
  ).toHaveAttribute("href", "mailto:syedaonm@gmail.com");
});

test("home narrative and project navigation remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("main h1, main h2")).toHaveText(headings);
    await page
      .getByRole("region", { name: "Selected Work" })
      .getByRole("link", { name: /AI-Powered University Timetable/ })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "AI-Powered University Timetable",
    );
  } finally {
    await context.close();
  }
});

test("home sections fit representative viewports and pass Axe in both themes", async ({
  page,
}) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});
