import { expect, test } from "@playwright/test";

test("home page exposes the primary positioning", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "From data to products." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore My Work" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ask My Portfolio" })).toBeVisible();
});
