import { expect, test } from "@playwright/test";

test.describe("Netloka Core App & Auth Shell", () => {
  test("renders the Netloka landing page with brand and CTA", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("Netloka").first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Kuasai Jaringan Komputer/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Mulai Belajar Gratis/i })
    ).toBeVisible();
  });

  test("serves the health endpoint", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(body.status).toBe("ok");
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  test("renders sign-in page", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(
      page.getByRole("heading", { name: "Sign In", exact: true })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign In", exact: true })
    ).toBeVisible();
  });

  test("renders sign-up page", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(
      page.getByRole("heading", { name: "Create Account", exact: true })
    ).toBeVisible();
    await expect(page.getByLabel(/Name/i)).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirm Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign Up", exact: true })
    ).toBeVisible();
  });

  test("redirects unauthenticated access on protected route to sign-in", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Fdashboard/);
  });
});
