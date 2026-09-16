import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Remediation Center (Sprint 38 / Task 38.2)", () => {
  test("unauthenticated access to /learn/remediation redirects to login", async ({
    page,
  }) => {
    await page.goto("/learn/remediation");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Fremediation/);
  });

  test("authenticated learner can view remediation center with header and navigation", async ({
    page,
  }) => {
    // 1. Sign in as fresh test learner
    await createAndSignInLearner(page);

    // 2. Navigate to remediation center
    await page.goto("/learn/remediation");

    // 3. Verify page header
    await expect(
      page.getByRole("heading", { name: "Pusat Remediasi Materi" })
    ).toBeVisible();

    // 4. Since fresh learner has no failed assessments, verify empty state
    await expect(
      page.getByRole("heading", { name: "Tidak Ada Materi Remediasi Aktif" })
    ).toBeVisible();

    // 5. Verify navigation buttons to My Learning and Mastery in main content
    const mainContent = page.getByRole("main");
    const myLearningBtn = mainContent.getByRole("link", { name: /Pembelajaran Saya/i });
    await expect(myLearningBtn).toBeVisible();

    const masteryBtn = mainContent.getByRole("link", { name: /Status Penguasaan Materi/i });
    await expect(masteryBtn).toBeVisible();
    await masteryBtn.click();

    // 6. Verify navigated to mastery dashboard
    await expect(page).toHaveURL(/\/learn\/mastery/);
    await expect(
      page.getByRole("heading", { name: "Penguasaan Materi & Remediasi" })
    ).toBeVisible();
  });
});
