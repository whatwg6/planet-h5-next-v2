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

test("opens meal plans and switches credential types", async ({ page }) => {
  await page.goto("./#/");
  await page.getByRole("button", { name: "查看客户：美好科技集团" }).click();

  await expect(page.getByRole("heading", { name: "美好科技-北京...用餐计划" })).toBeVisible();
  await expect(page.getByText("12:00 送达")).toHaveCount(2);

  await page.getByRole("button", { name: "二维码" }).click();
  await expect(page.getByText("12:00 - 14:00")).toBeVisible();
  await expect(page.getByText("18:00 - 20:00")).toBeVisible();
});

test("renders the hash-route fallback", async ({ page }) => {
  await page.goto("./#/missing");
  await expect(page.getByRole("heading", { name: "页面不存在" })).toBeVisible();
});
