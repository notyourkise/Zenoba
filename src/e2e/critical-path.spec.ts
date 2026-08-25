import { expect, test } from "@playwright/test";

test.describe("Production Critical Path & Security Headers (Milestone 7)", () => {
  test("verifies security headers on production response", async ({
    request,
  }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=");
  });

  test("verifies health check endpoint returns comprehensive health metrics", async ({
    request,
  }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(["healthy", "degraded"]).toContain(body.status);
    expect(body.version).toBe("1.0.0");
    expect(body.database).toBeDefined();
    expect(body.system).toBeDefined();
    expect(body.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  test("critical path access gates across all 4 product pillars", async ({
    page,
  }) => {
    // 1. Pillar 1: Learn Catalog
    await page.goto("/learn");
    await expect(page).toHaveURL(/.*sign-in.*/);

    // 2. Pillar 2: Labs Runner
    await page.goto("/labs");
    await expect(page).toHaveURL(/.*sign-in.*/);

    // 3. Pillar 3: Challenges Runner
    await page.goto("/challenges");
    await expect(page).toHaveURL(/.*sign-in.*/);

    // 4. Pillar 4: IT Consultant Project
    await page.goto("/consultant");
    await expect(page).toHaveURL(/.*sign-in.*/);

    // 5. User Portfolio & Profile
    await page.goto("/consultant/portfolio");
    await expect(page).toHaveURL(/.*sign-in.*/);

    await page.goto("/profile");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });
});
