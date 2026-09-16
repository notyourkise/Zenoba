import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";
import { createAndSignInDeveloper } from "./fixtures/developer-user";

test.describe("Developer Assessment Analytics (Sprint 38 Task 38.3)", () => {
  test("unauthenticated visit to /developer/learning redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/developer/learning");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fdeveloper%2Flearning/);
  });

  test("standard learner is strictly denied access to /developer/learning", async ({
    page,
  }) => {
    // 1. Authenticate as normal learner
    await createAndSignInLearner(page);

    // 2. Attempt navigating to developer learning analytics
    await page.goto("/developer/learning");

    // 3. Learner is strictly redirected away to learner dashboard
    await page.waitForURL((url) => url.pathname.includes("/dashboard"), {
      timeout: 15000,
    });
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(
      page.getByRole("heading", { name: "Analitik Pembelajaran & Kesehatan Asesmen" })
    ).not.toBeVisible();
  });

  test("authenticated developer accesses learning analytics and sees privacy notice", async ({
    page,
  }) => {
    // 1. Sign in as developer
    await createAndSignInDeveloper(page);

    // 2. Navigate via shell link or direct URL
    await page.goto("/developer/learning");
    await page.waitForLoadState("domcontentloaded");

    // 3. Verify page landmarks and privacy notices
    await expect(
      page.getByRole("heading", { name: "Analitik Pembelajaran & Kesehatan Asesmen" })
    ).toBeVisible();
    await expect(page.getByText(/K-Anonymity \(Min\. 5 Learner\)/i)).toBeVisible();
    await expect(page.getByText(/Akun Internal Disaring/i)).toBeVisible();
    await expect(page.getByText("Prinsip Privasi & Keamanan Data (K-Anonymity)")).toBeVisible();

    // 4. Verify table header or empty state container is present
    await expect(
      page.getByRole("heading", { name: "Daftar Kesehatan Butir & Outcome" })
    ).toBeVisible();
  });
});
