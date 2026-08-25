import { expect, test } from "@playwright/test";

test.describe("Labs & Challenge Engine (Milestone 5)", () => {
  test("protects /labs and lab runner routes from unauthenticated direct access", async ({
    page,
  }) => {
    await page.goto("/labs");
    await expect(page).toHaveURL(/.*sign-in.*/);

    await page.goto("/labs/subnetting-calculator");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test("protects /challenges and challenge runner routes from unauthenticated direct access", async ({
    page,
  }) => {
    await page.goto("/challenges");
    await expect(page).toHaveURL(/.*sign-in.*/);

    await page.goto("/challenges/branch-office-down");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test("rejects unauthenticated lab and challenge submit APIs with 401", async ({
    request,
  }) => {
    const labRes = await request.post("/api/labs/subnetting-calculator/submit", {
      data: { state: {} },
    });
    expect(labRes.status()).toBe(401);

    const challengeRes = await request.post(
      "/api/challenges/branch-office-down/submit",
      { data: { submission: {} } }
    );
    expect(challengeRes.status()).toBe(401);
  });
});
