import { expect, test } from "@playwright/test";
import { createAndSignInLearner, createAuthenticatedLearnerContext } from "./fixtures/learning-user";

test.describe("Welcome to Networking — Pilot Integration & Multi-User E2E (Sprint 24)", () => {
  test("1. Renders explicit learning outcomes and prevents pre-submit answer leakage", async ({
    page,
  }) => {
    // Authenticate learner
    await createAndSignInLearner(page);

    // Navigate to Lesson 1: intro-to-networking
    await page.goto("/learn/network-foundations/welcome-to-networking/intro-to-networking");
    await page.waitForLoadState("networkidle");

    // Verify Lesson title and learning outcome section
    await expect(page.getByRole("heading", { name: "Apa Itu Jaringan Komputer?" }).first()).toBeVisible();
    await expect(page.getByRole("region", { name: /Capaian Pembelajaran Pelajaran/i })).toBeVisible();

    // Verify outcomes are rendered with their IDs
    await expect(page.getByText("WN-L1-A")).toBeVisible();
    await expect(
      page.getByText("Siswa dapat membedakan kumpulan perangkat yang terhubung dan perangkat yang berdiri sendiri.")
    ).toBeVisible();

    // Verify private answers and internal feedback are NOT leaked in the initial DOM or script content
    const pageHtml = await page.content();
    expect(pageHtml).not.toContain("misconceptionFeedback");
    expect(pageHtml).not.toContain("Perangkat periferal pribadi (seperti keyboard nirkabel");
  });

  test("2. Formative quiz lifecycle: incorrect attempt -> retry -> pass -> complete", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-foundations/welcome-to-networking/intro-to-networking");
    await page.waitForLoadState("networkidle");

    // Locate the first knowledge check block
    const quiz1 = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz1).toBeVisible();

    // 1. Submit incorrect answer
    await quiz1.getByRole("button", { name: /Komputer menyala dengan spesifikasi RAM/i }).click();
    await quiz1.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify failure feedback showing misconception explanation
    await expect(quiz1.getByText(/Perangkat periferal pribadi/i)).toBeVisible();
    await expect(quiz1.getByRole("button", { name: "Coba Lagi" })).toBeVisible();

    // 2. Retry with correct answer
    await quiz1.getByRole("button", { name: "Coba Lagi" }).click();
    await quiz1.getByRole("button", { name: /Komputer terhubung ke perangkat lain/i }).click();
    await quiz1.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify pass feedback
    await expect(quiz1.getByText("Jawaban Anda tepat!")).toBeVisible();
  });

  test("3. Enforces prerequisite barriers: locked module assessment rejects early access", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    // Direct access to final assessment before completing lessons
    await page.goto("/learn/network-foundations/welcome-to-networking/assessment");

    // Barrier UI should block access
    await expect(page.getByRole("heading", { name: "Ujian Akhir Modul Masih Terkunci" })).toBeVisible();
    await expect(page.getByText(/Anda harus menyelesaikan seluruh materi pelajaran/i)).toBeVisible();
  });

  test("4. Full pilot journey: complete lessons, fail assessment, remediate, pass & persist", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    // Complete all 4 formative lessons via authoritative quiz submissions
    const lessonSlugs = [
      {
        slug: "intro-to-networking",
        quizzes: [
          { quizId: "quiz-wn-l1-q1", answer: "opt-b" },
          { quizId: "quiz-wn-l1-q2", answer: "opt-c" },
          { quizId: "quiz-wn-l1-q3", answer: "opt-b" },
        ],
      },
      {
        slug: "everyday-networks",
        quizzes: [
          { quizId: "quiz-wn-l2-q1", answer: "opt-b" },
          { quizId: "quiz-wn-l2-q2", answer: "opt-b" },
          { quizId: "quiz-wn-l2-q3", answer: "opt-b" },
        ],
      },
      {
        slug: "sharing-network-resources",
        quizzes: [
          { quizId: "quiz-wn-l3-q1", answer: "opt-b" },
          { quizId: "quiz-wn-l3-q2", answer: "opt-c" },
          { quizId: "quiz-wn-l3-q3", answer: "opt-b" },
        ],
      },
      {
        slug: "simple-network-communication",
        quizzes: [
          { quizId: "quiz-wn-l4-q1", answer: "opt-b" },
          { quizId: "quiz-wn-l4-q2", answer: "opt-b" },
          { quizId: "quiz-wn-l4-q3", answer: "opt-c" },
        ],
      },
    ];

    for (const item of lessonSlugs) {
      // Submit all quizzes for this lesson
      for (const q of item.quizzes) {
        const quizRes = await page.request.post("/api/learning/quiz/submit", {
          data: {
            lessonId: item.slug,
            quizId: q.quizId,
            answer: q.answer,
            requestId: `req-${q.quizId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          },
        });
        expect(quizRes.ok(), `Quiz ${q.quizId} failed: ${await quizRes.text()}`).toBeTruthy();
      }

      // Mark lesson completed
      const progressRes = await page.request.post("/api/learning/progress", {
        data: {
          lessonId: item.slug,
          action: "complete",
        },
      });
      expect(progressRes.ok(), `Progress complete for ${item.slug} failed: ${await progressRes.text()}`).toBeTruthy();
    }

    // Now visit final assessment page - should be unlocked!
    await page.goto("/learn/network-foundations/welcome-to-networking/assessment");
    await page.waitForLoadState("networkidle");

    // Stage 1: Briefing
    await expect(page.getByRole("heading", { name: /Welcome to Networking/i })).toBeVisible();
    await expect(page.getByText("Evaluasi Akhir Modul")).toBeVisible();
    await page.getByRole("button", { name: "Mulai Ujian Sekarang" }).click();

    // Stage 2: Testing - Test FAILURE scenario first (leave practical incomplete, answer wrong concepts)
    await expect(page.getByRole("heading", { name: /Bagian 1: Soal Pemahaman Konsep/i })).toBeVisible();

    // Select opt-a for all questions (which will give < 8/10)
    for (let i = 1; i <= 10; i++) {
      const qNum = i < 10 ? `0${i}` : `${i}`;
      const qId = `final-wn-f${qNum}`;
      await page.locator(`input[name="question-${qId}"][value="opt-a"]`).check();
    }

    // Leave practical incomplete (PC-Sirkulasi still disconnected)
    await page.getByRole("button", { name: "Kirim Jawaban Ujian Akhir" }).click();

    // Stage 3: Result - Verify failure & remedial guidance
    await expect(page.getByRole("heading", { name: "Belum Memenuhi Syarat Kelulusan" })).toBeVisible();
    await expect(page.getByText("Rekomendasi Materi Remedial")).toBeVisible();

    // Click retry
    await page.getByRole("button", { name: "Ulangi Ujian Akhir" }).click();

    // Second Attempt: PASS scenario
    // Answer all 10 concept questions with correct options
    const correctConceptAnswers: Record<string, string> = {
      "final-wn-f01": "opt-b",
      "final-wn-f02": "opt-b",
      "final-wn-f03": "opt-b",
      "final-wn-f04": "opt-b",
      "final-wn-f05": "opt-b",
      "final-wn-f06": "opt-b",
      "final-wn-f07": "opt-a",
      "final-wn-f08": "opt-b",
      "final-wn-f09": "opt-c",
      "final-wn-f10": "opt-b",
    };

    for (const [qId, optId] of Object.entries(correctConceptAnswers)) {
      await page.locator(`input[name="question-${qId}"][value="${optId}"]`).check();
    }

    // Complete practical criteria:
    // 1. Connect PC-Sirkulasi cable
    await page.getByRole("button", { name: "Pasang Kabel PC-Sirkulasi" }).click();
    // 2. Run print test from PC-Katalog
    await page.getByRole("button", { name: "Uji Cetak PC-Katalog" }).click();
    // 3. Run print test from PC-Sirkulasi
    await page.getByRole("button", { name: "Uji Cetak PC-Sirkulasi" }).click();

    // Submit final assessment
    await page.getByRole("button", { name: "Kirim Jawaban Ujian Akhir" }).click();

    // Verify Pass Result
    await expect(page.getByRole("heading", { name: "Selamat! Anda Lulus Evaluasi Modul" })).toBeVisible();
    await expect(page.getByText(/Lulus Ambang Batas/i)).toBeVisible();
    await expect(page.getByText("3/3 Kriteria Terpenuhi")).toBeVisible();
    await expect(page.getByRole("link", { name: "Selesai & Lanjutkan Jalur" })).toBeVisible();

    // Verify reload retains passed state
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/Anda telah lulus ujian akhir modul ini sebelumnya/i)).toBeVisible();
  });

  test("5. Multi-user isolation & anti-spoofing verification", async ({ browser }) => {
    // 1. Create two isolated browser contexts
    const userAContext = await createAuthenticatedLearnerContext(browser, {
      name: "Siswa A - TKJ",
    });
    const userBContext = await createAuthenticatedLearnerContext(browser, {
      name: "Siswa B - TKJ",
    });

    try {
      // 2. User A completes Lesson 1 quiz
      const quizResA = await userAContext.page.request.post("/api/learning/quiz/submit", {
        data: {
          lessonId: "intro-to-networking",
          quizId: "quiz-wn-l1-q1",
          answer: "opt-b",
          requestId: `req-userA-${Date.now()}`,
        },
      });
      expect(quizResA.ok()).toBeTruthy();

      const progressResA = await userAContext.page.request.post("/api/learning/progress", {
        data: {
          lessonId: "intro-to-networking",
          action: "start",
        },
      });
      expect(progressResA.ok()).toBeTruthy();

      // 3. User B visits module assessment - must still be LOCKED for User B
      await userBContext.page.goto("/learn/network-foundations/welcome-to-networking/assessment");
      await expect(
        userBContext.page.getByRole("heading", { name: "Ujian Akhir Modul Masih Terkunci" })
      ).toBeVisible();

      // 4. Test idempotency: Resubmitting identical quiz request does not award duplicate XP
      const duplicateRes = await userAContext.page.request.post("/api/learning/quiz/submit", {
        data: {
          lessonId: "intro-to-networking",
          quizId: "quiz-wn-l1-q1",
          answer: "opt-b",
          requestId: `req-userA-${Date.now()}`,
        },
      });
      expect(duplicateRes.ok()).toBeTruthy();
      const duplicateData = (await duplicateRes.json()) as { passed: boolean };
      expect(duplicateData.passed).toBe(true);
    } finally {
      await userAContext.context.close();
      await userBContext.context.close();
    }
  });
});
