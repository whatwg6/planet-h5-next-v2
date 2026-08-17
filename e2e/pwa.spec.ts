import { expect, test } from "@playwright/test";

test("exposes an installable web manifest", async ({ request }) => {
  const response = await request.get("./manifest.webmanifest");
  expect(response.ok()).toBeTruthy();
  const manifest = (await response.json()) as { display: string; start_url: string };
  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toContain("#/");
});
