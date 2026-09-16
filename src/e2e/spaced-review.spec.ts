import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Learner Spaced Review (Sprint 39 / Task 39.1)", () => {
  test("unauthenticated access to /learn/review redirects to login", async ({
    page,
  }) => {
    await page.goto("/learn/review");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Freview/);
  });

  test("authenticated learner can view spaced review session, metrics, and scheduled reviews", async ({
    page,
  }) => {
    // 1. Sign in as fresh test learner
    await createAndSignInLearner(page);

    // 2. Navigate to review page
    await page.goto("/learn/review");

    // 3. Verify page header
    await expect(
      page.getByRole("heading", { name: "Review Berkala Sasaran Kompetensi" })
    ).toBeVisible();

    // 4. Verify metrics bar
    await expect(page.getByText("Jatuh Tempo Hari Ini")).toBeVisible();
    await expect(page.getByText("Selesai Diulas Hari Ini")).toBeVisible();
    await expect(page.getByText("Total Sasaran Terjadwal")).toBeVisible();

    // 5. Verify upcoming reviews section
    await expect(
      page.getByRole("heading", { name: "Jadwal Review Mendatang" })
    ).toBeVisible();
  });
});
