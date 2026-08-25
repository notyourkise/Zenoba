import { expect, test } from "@playwright/test";

test.describe("IT Consultant Mode (Milestone 6)", () => {
  test("protects /consultant and case runner routes from unauthenticated direct access", async ({
    page,
  }) => {
    await page.goto("/consultant");
    await expect(page).toHaveURL(/.*sign-in.*/);

    await page.goto("/consultant/small-office-notaris");
    await expect(page).toHaveURL(/.*sign-in.*/);

    await page.goto("/consultant/portfolio");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test("rejects unauthenticated consultant submit API with 401", async ({
    request,
  }) => {
    const res = await request.post(
      "/api/consultant/small-office-notaris/submit",
      { data: { boqItems: [] } }
    );
    expect(res.status()).toBe(401);
  });
});
