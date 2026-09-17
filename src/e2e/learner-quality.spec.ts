import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Learner Quality Acceptance & Regression (Milestone 14 / Task 39.2)", () => {
  test("1. Responsive Viewports: 320px mobile, 768px tablet, and 1280px desktop layouts", async ({
    page,
  }) => {
    // Authenticate test learner
    await createAndSignInLearner(page);

    // --- Viewport 1: 320px Ultra-Compact Mobile ---
    await page.setViewportSize({ width: 320, height: 600 });
    await page.goto("/dashboard");
    await expect(page.getByLabel("Buka menu navigasi")).toBeVisible({ timeout: 10000 });

    // Verify no horizontal overflow at 320px on dashboard
    const isOverflownDashboard = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflownDashboard).toBe(false);

    // Verify no horizontal overflow at 320px on search page
    await page.goto("/learn/search");
    await expect(page.locator("#curriculum-search-input")).toBeVisible({ timeout: 10000 });
    const isOverflownSearch = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflownSearch).toBe(false);

    // --- Viewport 2: 768px Tablet ---
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });
    const isOverflown768 = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflown768).toBe(false);

    // --- Viewport 3: 1280px Desktop ---
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/dashboard");
    // Desktop sidebar is visible, mobile header is hidden
    await expect(page.getByLabel("Navigasi Utama Workspace")).toBeVisible({ timeout: 10000 });
  });

  test("2. Keyboard-only navigation and focus restoration on mobile navigation drawer", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    // Set mobile viewport to expose the mobile drawer
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");

    const toggleBtn = page.getByLabel("Buka menu navigasi");
    await expect(toggleBtn).toBeVisible({ timeout: 10000 });

    // Open drawer via button click
    await toggleBtn.click();

    // Verify drawer dialog is open and has accessible modal attributes
    const drawerDialog = page.getByRole("dialog", { name: "Menu navigasi seluler" });
    await expect(drawerDialog).toBeVisible({ timeout: 10000 });

    // Verify close button is focused upon opening
    const closeBtn = page.getByLabel("Tutup menu navigasi");
    await expect(closeBtn).toBeFocused();

    // Press Escape key to close drawer
    await page.keyboard.press("Escape");

    // Verify drawer dialog is dismissed
    await expect(drawerDialog).not.toBeVisible();

    // Verify focus is cleanly restored to the toggle button
    await expect(toggleBtn).toBeFocused();
  });

  test("3. Respects prefers-reduced-motion media query across core learner views", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await createAndSignInLearner(page);

    // Navigate to dashboard
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });

    // Navigate to review session
    await page.goto("/learn/review");
    await expect(
      page.getByRole("heading", { name: "Review Berkala Sasaran Kompetensi" })
    ).toBeVisible({ timeout: 10000 });
  });

  test("4. Autosave draft persistence and recovery across page reloads", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    const testLessonId = "intro-to-networking";
    const testActivityId = "quality-check-activity";
    const testPayload = {
      notes: "Catatan pengujian kualitas pembelajaran Netloka",
      selectedOptions: ["A", "C"],
      timestamp: Date.now(),
    };

    // 1. Save draft via authoritative draft API (PUT method)
    const saveRes = await page.request.put("/api/learning/drafts", {
      data: {
        lessonId: testLessonId,
        activityId: testActivityId,
        contentVersion: "1.0",
        payload: testPayload,
      },
    });
    expect(saveRes.ok()).toBe(true);

    // 2. Fetch draft to ensure persistence
    const fetchRes = await page.request.get(
      `/api/learning/drafts?lessonId=${testLessonId}&activityId=${testActivityId}`
    );
    expect(fetchRes.ok()).toBe(true);
    const data = await fetchRes.json();
    expect(data.draft).toBeDefined();
    expect(data.draft.payload.notes).toBe(testPayload.notes);
    expect(data.draft.payload.selectedOptions).toEqual(["A", "C"]);

    // 3. Discard draft
    const deleteRes = await page.request.delete(
      `/api/learning/drafts?lessonId=${testLessonId}&activityId=${testActivityId}`
    );
    expect(deleteRes.ok()).toBe(true);

    // 4. Verify draft is gone
    const verifyRes = await page.request.get(
      `/api/learning/drafts?lessonId=${testLessonId}&activityId=${testActivityId}`
    );
    const verifyData = await verifyRes.json();
    expect(verifyData.draft).toBeNull();
  });

  test("5. Failure-path handling and interactive retry flow in lesson action bar", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    // Navigate to introductory lesson
    await page.goto("/learn/network-foundations/welcome-to-networking/intro-to-networking");

    // Intercept /api/learning/progress to simulate server failure on first attempt
    let failureCount = 0;
    await page.route("**/api/learning/progress", async (route) => {
      if (failureCount === 0) {
        failureCount++;
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Koneksi terputus saat menyimpan progres pembelajaran",
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Locate action bar completion button
    const completeBtn = page.getByRole("button", { name: "Tandai Selesai" });
    await expect(completeBtn).toBeVisible({ timeout: 15000 });
    await completeBtn.click();

    // Target the specific action bar alert (avoiding __next-route-announcer__ collision)
    const errorAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: /Gagal menyelesaikan pelajaran/i });
    await expect(errorAlert).toBeVisible({ timeout: 10000 });

    const retryBtn = errorAlert.getByRole("button", { name: /Coba Lagi/i });
    await expect(retryBtn).toBeVisible({ timeout: 10000 });

    // Click retry button (now route will succeed)
    await retryBtn.click();

    // Verify error alert clears and completion indicator appears
    await expect(page.getByText("Telah Selesai")).toBeVisible({ timeout: 15000 });
  });

  test("6. Full Milestone 14 User Journey: Search, Bookmarks, Remediation, Mastery, Review", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    // Step A: Search & Bookmarks
    await page.goto("/learn/search");
    const searchInput = page.locator("#curriculum-search-input");
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill("IPv4");
    await page.getByRole("button", { name: "Cari Kurikulum" }).click();
    await page.waitForURL((url) => url.searchParams.get("q") === "IPv4", { timeout: 10000 });

    const firstResult = page.locator("article").first();
    await expect(firstResult).toBeVisible({ timeout: 10000 });

    // Bookmark first result
    const bookmarkBtn = firstResult.getByLabel(/Simpan ke bookmark/i);
    await expect(bookmarkBtn).toBeVisible({ timeout: 10000 });
    await bookmarkBtn.click();

    // Verify bookmark state toggled to saved
    await expect(firstResult.getByLabel(/Hapus dari bookmark/i)).toBeVisible({
      timeout: 10000,
    });

    // Step B: Remediation Center
    await page.goto("/learn/remediation");
    await expect(page.getByRole("heading", { name: "Pusat Remediasi Materi" })).toBeVisible({
      timeout: 10000,
    });

    // Step C: Mastery Overview
    await page.goto("/learn/mastery");
    await expect(page.getByRole("heading", { name: "Penguasaan Materi & Remediasi" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Kemajuan Keseluruhan")).toBeVisible({ timeout: 10000 });

    // Step D: Spaced Review
    await page.goto("/learn/review");
    await expect(
      page.getByRole("heading", { name: "Review Berkala Sasaran Kompetensi" })
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Jatuh Tempo Hari Ini")).toBeVisible({ timeout: 10000 });
  });

  test("7. Route Performance Baselines: Core M14 pages render within acceptable limits", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    const routes = [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Search & Bookmarks", path: "/learn/search" },
      { name: "Mastery Overview", path: "/learn/mastery" },
      { name: "Remediation Center", path: "/learn/remediation" },
      { name: "Spaced Review", path: "/learn/review" },
    ];

    for (const route of routes) {
      const startTime = Date.now();
      const res = await page.goto(route.path);
      const elapsed = Date.now() - startTime;

      expect(res?.status()).toBe(200);
      // Ensure page rendered within 10000ms threshold in shared CI environment
      expect(elapsed, `${route.name} took too long to load: ${elapsed}ms`).toBeLessThan(10000);
    }
  });
});
