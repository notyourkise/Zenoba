import { expect, test } from "@playwright/test";

test.describe("Netloka Core App & Auth Shell", () => {
  test("renders the Netloka landing page with brand and CTA", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("Netloka").first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Kuasai IT Infrastructure/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Jelajahi", exact: true })
    ).toBeVisible();
  });

  test("renders the IT Infrastructure Journey with celestial checkpoints", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "IT Infrastructure Journey" })
    ).toBeVisible();

    for (const destination of [
      "Mercury",
      "Venus",
      "Mars",
      "Jupiter",
      "Saturn",
      "Polaris",
    ]) {
      await expect(
        page.getByText(destination, { exact: true }).first()
      ).toBeVisible();
    }

    await expect(
      page.getByRole("link", { name: "Lihat jalur belajar" })
    ).toHaveAttribute("href", "/learn");
  });

  test("keeps the Netloka brand clear of the desktop viewport edge", async ({
    page,
  }) => {
    await page.goto("/");

    const brand = page.getByRole("link", { name: "Netloka Home" });
    await expect(brand).toBeVisible();

    const xPosition = await brand.evaluate(
      (element) => element.getBoundingClientRect().x
    );

    expect(xPosition).toBe(32);
  });

  test("serves the health endpoint", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(["healthy", "degraded"]).toContain(body.status);
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  test("opens and switches the landing-page authentication modal", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Masuk", exact: true }).click();

    await expect(page).toHaveURL(/\?auth=sign-in/, { timeout: 15_000 });
    await expect(
      page.getByRole("dialog", { name: "Sign in to Netloka" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue with Google Setup pending" }),
    ).toBeDisabled();

    await page.getByRole("link", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\?auth=sign-up/, { timeout: 15_000 });
    await expect(
      page.getByRole("dialog", { name: "Create your Netloka account" }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("keeps legacy auth routes compatible with the landing modal", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    await expect(page).toHaveURL(/\?auth=sign-up/);
    await expect(
      page.getByRole("dialog", { name: "Create your Netloka account" }),
    ).toBeVisible();
    await expect(page.getByLabel(/Name/i)).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirm password")).toBeVisible();
  });

  test("navigates from Sign In to password recovery", async ({ page }) => {
    await page.goto("/?auth=sign-in");

    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
    await expect(
      page.getByRole("heading", { name: "Forgot your password?" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("shows a safe invalid state for reset links without tokens", async ({
    page,
  }) => {
    await page.goto("/reset-password");

    await expect(
      page.getByText("This password reset link is invalid or incomplete.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reset password" }),
    ).toBeDisabled();
  });

  test("redirects unauthenticated access on protected route to sign-in", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fdashboard/);
    await expect(
      page.getByRole("dialog", { name: "Sign in to Netloka" }),
    ).toBeVisible();
  });
});
