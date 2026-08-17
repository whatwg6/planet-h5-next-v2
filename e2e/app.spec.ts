import { expect, test } from "@playwright/test";

test("starts on the home route", async ({ page }) => {
  await page.goto("./#/");
  await expect(page.getByRole("heading", { name: "Planet H5" })).toBeVisible();
});

test("renders the hash-route fallback", async ({ page }) => {
  await page.goto("./#/missing");
  await expect(page.getByRole("heading", { name: "页面不存在" })).toBeVisible();
});
