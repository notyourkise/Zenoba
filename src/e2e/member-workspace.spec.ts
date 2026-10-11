import { expect, test } from "@playwright/test";

test.describe("Member Workspace & Course Commerce (Milestone 7 / Sprint 17)", () => {
  test("unauthenticated visit to /catalog redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/catalog");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fcatalog/);
  });

  test("unauthenticated visit to /my-learning redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/my-learning");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fmy-learning/);
  });

  test("unauthenticated visit to /my-packages redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/my-packages");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fmy-packages/);
  });

  test("unauthenticated visit to /orders redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Forders/);
  });

  test("landing page retains public marketing shell without leaking workspace sidebar", async ({
    page,
  }) => {
    await page.goto("/");

    // Public marketing header and elements
    await expect(page.getByText("Zenoba").first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Kuasai IT Infrastructure/i }),
    ).toBeVisible();

    // Workspace sidebar must NOT be present on public landing
    await expect(page.getByLabel("Navigasi Utama Workspace")).not.toBeVisible();
  });
});
