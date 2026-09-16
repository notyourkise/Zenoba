import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Learner Outcome Mastery & Remediation (Sprint 38 / Task 38.1)", () => {
  test("unauthenticated access to /learn/mastery redirects to login", async ({
    page,
  }) => {
    await page.goto("/learn/mastery");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Fmastery/);
  });

  test("authenticated learner can view mastery dashboard, summary metrics, and remediation links", async ({
    page,
  }) => {
    // 1. Sign in as fresh test learner
    await createAndSignInLearner(page);

    // 2. Navigate to mastery page via sidebar or URL
    await page.goto("/learn/mastery");

    // 3. Verify page header
    await expect(
      page.getByRole("heading", { name: "Penguasaan Materi & Remediasi" })
    ).toBeVisible();

    // 4. Verify summary statistics section
    await expect(page.getByText("Total Sasaran")).toBeVisible();
    await expect(page.getByText("Dikuasai", { exact: false })).toBeVisible();
    await expect(page.getByText("Pencapaian Penguasaan Keseluruhan")).toBeVisible();

    // 5. Verify modules list and outcomes
    await expect(
      page.getByRole("heading", { name: "Rincian Modul & Sasaran Kompetensi" })
    ).toBeVisible();

    // Verify at least one module is listed with competency outcomes
    const firstActionLink = page.getByRole("link", { name: /Mulai Pelajari|Lanjutkan Materi|Buka Materi Remediasi/i }).first();
    await expect(firstActionLink).toBeVisible();
  });
});
