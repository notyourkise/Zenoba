import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Learning Continuity & Curriculum Search (Milestone 14 / Sprint 37)", () => {
  test("unauthenticated access to /learn/search redirects to login", async ({
    page,
  }) => {
    await page.goto("/learn/search");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Fsearch/);
  });

  test("unauthenticated bookmark API requests return 401", async ({
    request,
  }) => {
    const res = await request.post("/api/learning/bookmarks", {
      data: { lessonId: "lesson-test" },
    });
    expect(res.status()).toBe(401);
  });

  test("authenticated learner can search curriculum, view results, and toggle bookmarks", async ({
    page,
  }) => {
    // 1. Sign in as fresh test learner
    await createAndSignInLearner(page);

    // 2. Navigate to search page
    await page.goto("/learn/search");
    await expect(
      page.getByRole("heading", { name: "Pencarian Kurikulum & Bookmark" })
    ).toBeVisible();

    // Verify search input is present
    const searchInput = page.locator("#curriculum-search-input");
    await expect(searchInput).toBeVisible();

    // Verify empty search initial state
    await expect(
      page.getByRole("heading", { name: "Mulai Mencari Kurikulum" })
    ).toBeVisible();

    // 3. Search for IPv4
    await searchInput.fill("IPv4");
    await page.getByRole("button", { name: "Cari Kurikulum" }).click();

    // 4. Verify results display with matching lessons
    await page.waitForURL((url) => url.searchParams.get("q") === "IPv4");
    await expect(
      page.getByRole("heading", { name: "Hasil Pencarian" })
    ).toBeVisible();

    // Check that at least one result is found and has a match badge
    const resultCard = page.locator("article").first();
    await expect(resultCard).toBeVisible();
    await expect(resultCard.getByRole("link", { name: /Buka Pelajaran/i })).toBeVisible();

    // 5. Toggle bookmark on the first result
    const bookmarkBtn = resultCard.getByRole("button", { name: /Simpan/i });
    await expect(bookmarkBtn).toBeVisible();
    await bookmarkBtn.click();

    // Verify state transitioned to "Tersimpan" / "Hapus dari bookmark"
    await expect(
      resultCard.getByRole("button", { name: /Hapus dari bookmark|Tersimpan/i })
    ).toBeVisible();

    // 6. Reload page and check bookmarks section contains the saved lesson
    await page.reload();
    const bookmarksAside = page.locator("aside");
    await expect(bookmarksAside.getByText("Materi Tersimpan")).toBeVisible();
    // Count should be exactly 1
    await expect(bookmarksAside.getByText("1", { exact: true })).toBeVisible();

    // 7. Click the lesson link to navigate to lesson runner
    const lessonLink = bookmarksAside.getByRole("link", { name: /Lanjutkan/i }).first();
    await lessonLink.click();

    // Verify we arrived at a lesson page with bookmark button visible in header
    await expect(page).toHaveURL(/\/learn\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+/);
    await expect(
      page.getByRole("button", { name: /Hapus dari bookmark|Tersimpan/i })
    ).toBeVisible();
  });
});
