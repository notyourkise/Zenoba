import { expect, test } from "@playwright/test";

test("renders the Netloka landing page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Welcome to Netloka" }),
  ).toBeVisible();
});

test("serves the health endpoint", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = await response.json();

  expect(response.ok()).toBeTruthy();
  expect(body.status).toBe("ok");
  expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
});
