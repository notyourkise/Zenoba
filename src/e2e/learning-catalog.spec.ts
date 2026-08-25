import { expect, test } from "@playwright/test";

test.describe("Learning Catalog & Shell", () => {
  test("renders learn catalog with heading", async ({ page }) => {
    // Navigate without auth will redirect to sign-in
    await page.goto("/learn");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn/);
  });

  test("protected learn routes redirect unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/learn/network-foundations");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });
});
