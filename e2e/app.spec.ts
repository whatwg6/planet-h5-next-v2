import { expect, test } from "@playwright/test";

test("starts on the home route", async ({ page }) => {
  await page.goto("./#/");
  await expect(page.getByRole("heading", { name: "4.0 客户" })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "搜索客户" })).toBeVisible();
});

test("customer page follows the available viewport width", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 800 });
  await page.goto("./#/");

  const main = page.getByRole("main");
  await expect(main).toBeVisible();
  expect(await main.evaluate((element) => element.getBoundingClientRect().width)).toBe(430);
});

test("renders the hash-route fallback", async ({ page }) => {
  await page.goto("./#/missing");
  await expect(page.getByRole("heading", { name: "页面不存在" })).toBeVisible();
});
