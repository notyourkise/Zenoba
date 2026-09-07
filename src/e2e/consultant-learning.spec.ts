import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";
import { prisma } from "@/lib/db/client";

test.describe("Network Planning & IT Consultant Curriculum & Capstone (Sprint 32)", () => {
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

  test("2. Displays all 5 modules, 10 lessons, and Consultant Workspace integration banner on Path 6 page", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-planning");
    await page.waitForLoadState("networkidle");

    // Path header
    await expect(
      page.getByRole("heading", { name: /Network Planning & IT Consultant/i }).first()
    ).toBeVisible();

    // Verify all 5 modules are rendered
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
    await expect(
      page.getByRole("heading", { name: /5\. Studi Kasus/i })
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

  test("5. Renders Lesson 9 (Small Office SOHO) with worked BoQ and topology", async ({
    page,
  }) => {
    const user = await createAndSignInLearner(page);

    if (user.id) {
      const priorLessons = await prisma.lesson.findMany({
        where: {
          module: { path: { slug: "network-planning" } },
          slug: { not: "small-office-transfer" },
        },
        select: { id: true },
      });
      for (const les of priorLessons) {
        await prisma.userLessonProgress.upsert({
          where: { userId_lessonId: { userId: user.id, lessonId: les.id } },
          update: { status: "COMPLETED" },
          create: { userId: user.id, lessonId: les.id, status: "COMPLETED" },
        });
      }
    }

    await page.goto("/learn/network-planning/applied-cases/small-office-transfer");
    await page.waitForLoadState("networkidle");

    // Lesson Title
    await expect(
      page.getByRole("heading", { name: /Studi Kasus 1: Perancangan Jaringan SOHO Kantor Notaris/i }).first()
    ).toBeVisible();

    // Outcomes
    await expect(page.getByText("PLAN-L9-A")).toBeVisible();
    await expect(page.getByText("PLAN-L9-B")).toBeVisible();

    // Content blocks
    await expect(page.getByText("diagram-topologi-soho-notaris.txt")).toBeVisible();
    await expect(page.getByText("Rancangan Alokasi Subnetting VLSM")).toBeVisible();

    // Verify zero answer leakage
    const pageContent = await page.content();
    expect(pageContent).not.toContain("correctAnswer");
    expect(pageContent).not.toContain("correctOptionId");
    expect(pageContent).not.toContain("misconceptionFeedback");
  });

  test("6. Enforces prerequisite proof gating on /consultant catalog and detail pages", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    // Navigate to consultant catalog
    await page.goto("/consultant");
    await page.waitForLoadState("networkidle");

    // Header & banner
    await expect(page.getByRole("heading", { name: /Mode Konsultan Jaringan TI/i })).toBeVisible();
    await expect(page.getByText("Jalur Konsultan Bertingkat (Prerequisite Proof Gating):")).toBeVisible();

    // Case 1 (Foundational) must be accessible
    await expect(page.getByRole("heading", { name: /1\. Kantor Notaris & PPAT \(SOHO\)/i })).toBeVisible();
    await expect(page.getByText("Mulai Kasus Fondasi (+250 XP)")).toBeVisible();

    // Cases 2-5 must be locked
    await expect(page.getByText("Terkunci • Selesaikan studi kasus fondasi SOHO Notaris terlebih dahulu").first()).toBeVisible();

    // Attempting direct access to Case 2 should display educational locked screen
    await page.goto("/consultant/warnet-gaming-center");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Akses Studi Kasus Masih Terkunci/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Buka Studi Kasus Fondasi \(SOHO Notaris\)/i })).toBeVisible();
  });

  test("7. Submits Small Office proposal, persists portfolio with rubric v1.0, and unlocks advanced cases", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    // Open foundational case workspace
    await page.goto("/consultant/small-office-notaris");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Proyek: Jaringan LAN & Wi-Fi Kantor Notaris/i })).toBeVisible();

    // Switch to Proposal tab
    await page.getByRole("button", { name: "5. Proposal & Skor" }).click();

    // Submit proposal
    const submitBtn = page.getByRole("button", { name: /Kumpulkan Proposal Resmi/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Expect passing evaluation
    await expect(page.getByText("Proposal Konsultan Diterima Klien!")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/100 \/ 100/)).toBeVisible();

    // Navigate to Portfolio page
    await page.goto("/consultant/portfolio");
    await page.waitForLoadState("networkidle");

    // Verify portfolio renders historical record
    await expect(page.getByRole("heading", { name: /Portofolio Proyek Konsultan Saya/i })).toBeVisible();
    await expect(page.getByText("Disetujui Klien")).toBeVisible();
    await expect(page.getByText("Rubrik v1.0")).toBeVisible();
    await expect(page.getByText("Rincian Evaluasi 5 Dimensi")).toBeVisible();

    // Return to /consultant catalog and verify Cases 2-5 are now unlocked!
    await page.goto("/consultant");
    await page.waitForLoadState("networkidle");

    // Prerequisite banner should no longer be visible
    await expect(page.getByText("Jalur Konsultan Bertingkat (Prerequisite Proof Gating):")).not.toBeVisible();

    // Case 1 shows "Disetujui Klien" and Cases 2-5 now show "Ambil Kasus Konsultasi"
    await expect(page.getByText("Disetujui Klien")).toBeVisible();
    await expect(page.getByText("Ambil Kasus Konsultasi (+250 XP)").first()).toBeVisible();
  });
});
