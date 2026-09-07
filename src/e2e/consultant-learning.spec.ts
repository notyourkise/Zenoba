import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Network Planning & IT Consultant Curriculum (Sprint 31)", () => {
  test.beforeEach(async () => {
    test.setTimeout(60000);
  });

  test("1. Enforces authentication on Network Planning learn path routes", async ({
    page,
  }) => {
    // Unauthenticated access to Path 6 syllabus
    await page.goto("/learn/network-planning");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Fnetwork-planning/);
  });

  test("2. Displays all 4 modules, 8 lessons, and Consultant Workspace integration banner on Path 6 page", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-planning");
    await page.waitForLoadState("networkidle");

    // Path header
    await expect(
      page.getByRole("heading", { name: /Network Planning & IT Consultant/i }).first()
    ).toBeVisible();

    // Verify 4 modules are rendered
    await expect(
      page.getByText("1. Analisis Kebutuhan Jaringan & Wawancara Klien")
    ).toBeVisible();
    await expect(
      page.getByText("2. Kapasitas Port, AP, PoE & Penyusunan BoQ")
    ).toBeVisible();
    await expect(
      page.getByText("3. Desain Topologi Hirarkis, Subnetting & VLAN")
    ).toBeVisible();
    await expect(
      page.getByText("4. Dokumentasi Teknis Proposal & Review Desain")
    ).toBeVisible();

    // Verify Consultant Workspace integration banner is rendered
    await expect(
      page.getByText("Workspace Perancangan Proyek Jaringan Nyata")
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Buka Consultant Workspace/i })
    ).toBeVisible();
  });

  test("3. Renders Lesson 1 with learning outcomes and prevents answer leakage", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-planning/requirements-analysis/wawancara-klien");
    await page.waitForLoadState("networkidle");

    // Lesson Title
    await expect(
      page.getByRole("heading", { name: "Wawancara Klien: Membedakan Kebutuhan Hakiki vs Solusi Prematur" }).first()
    ).toBeVisible();

    // Learning outcomes section
    await expect(page.getByRole("region", { name: /Capaian Pembelajaran Pelajaran/i })).toBeVisible();
    await expect(page.getByText("PLAN-L1-A")).toBeVisible();
    await expect(
      page.getByText("Siswa dapat mengidentifikasi perbedaan fundamental antara 'Kebutuhan Pengguna'")
    ).toBeVisible();

    // Verify code block rendered
    await expect(page.getByText("panduan-wawancara-klien.txt")).toBeVisible();

    // Verify zero answer leakage in HTML source
    const pageContent = await page.content();
    expect(pageContent).not.toContain("correctAnswer");
    expect(pageContent).not.toContain("correctOptionId");
    expect(pageContent).not.toContain("misconceptionFeedback");
  });

  test("4. Formative quiz interaction in Lesson 1: incorrect retry and correct pass", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-planning/requirements-analysis/wawancara-klien");
    await page.waitForLoadState("networkidle");

    // Locate the first quiz block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // 1. Submit incorrect answer
    await quiz.getByRole("button", { name: "Langsung memesan 5 AP tersebut sesuai permintaan agar klien puas.", exact: true }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify feedback and retry button appear
    await expect(quiz.getByRole("button", { name: "Coba Lagi" })).toBeVisible();

    // 2. Retry with correct answer
    await quiz.getByRole("button", { name: "Coba Lagi" }).click();
    await quiz.getByRole("button", { name: "Mewawancarai dan menganalisis apakah kegagalan EDC disebabkan oleh interferensi", exact: false }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify pass feedback
    await expect(quiz.getByText("Jawaban Anda tepat!")).toBeVisible();
  });

  test("5. Navigates to Consultant Workspace via connection link", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-planning");
    await page.waitForLoadState("networkidle");

    const workspaceBtn = page.getByRole("link", { name: /Buka Consultant Workspace/i });
    await expect(workspaceBtn).toBeVisible();
    await workspaceBtn.click();

    await page.waitForURL((url) => url.pathname.includes("/consultant"));
    await expect(page.getByRole("heading", { name: /Mode Konsultan Jaringan TI/i })).toBeVisible();
  });
});
