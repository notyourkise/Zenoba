import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Switching & LAN Curriculum Mastery (Sprint 28)", () => {
  test("1. Enforces authentication on Switching & LAN learn path and capstone challenge routes", async ({
    page,
    request,
  }) => {
    // Unauthenticated access to Path 3 syllabus
    await page.goto("/learn/switching-lan");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Fswitching-lan/);

    // Unauthenticated access to Path 3 Capstone Challenge
    await page.goto("/challenges/staff-guest-vlan-repair");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Fchallenges%2Fstaff-guest-vlan-repair/);

    // Unauthenticated API submission rejection
    const apiRes = await request.post("/api/challenges/submit", {
      data: {
        challengeId: "staff-guest-vlan-repair",
        switch2Port2Vlan: 10,
        trunkAllowedVlans: [10, 20],
        interVlanReasonOption: "l2-isolation-needs-l3-router",
      },
    });
    expect(apiRes.status()).toBe(401);
  });

  test("2. Displays all 4 modules, 8 lessons, and capstone challenge on Path 3 page", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/switching-lan");
    await page.waitForLoadState("networkidle");

    // Path header
    await expect(page.getByRole("heading", { name: /Switching & LAN/i }).first()).toBeVisible();

    // Verify 4 modules are rendered
    await expect(page.getByRole("heading", { name: /1\. Ethernet & Alamat MAC/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /2\. Protokol ARP & Resolusi Alamat/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /3\. Konsep VLAN & Segmentasi Trafik/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /4\. Konfigurasi Access & Trunk Port/i })).toBeVisible();

    // Verify Capstone Challenge banner is rendered
    await expect(
      page.getByText("Perbaikan Segmentasi VLAN & Trunking Kantor (Staff & Guest)")
    ).toBeVisible();
    await expect(page.getByText(/Terkunci • Selesaikan 8 materi lagi/i)).toBeVisible();
  });

  test("3. Renders Lesson 1 with interactive block and prevents answer leakage", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/switching-lan/ethernet-dan-mac/ethernet-mac-address");
    await page.waitForLoadState("networkidle");

    // Lesson Title
    await expect(
      page.getByRole("heading", { name: "Format Frame Ethernet & Alamat MAC" }).first()
    ).toBeVisible();

    // Learning outcomes section
    await expect(page.getByRole("region", { name: /Capaian Pembelajaran Pelajaran/i })).toBeVisible();
    await expect(page.getByText("ETH-L1-A")).toBeVisible();

    // Knowledge check block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // Ensure server-only misconception feedback is not leaked in the initial DOM
    const content = await page.content();
    expect(content).not.toContain("misconceptionFeedback");
    expect(content).not.toContain("Jangan tertukar dengan alamat IPv4 yang berukuran 32 bit");
  });

  test("4. Formative quiz interaction in Lesson 1: incorrect retry and correct pass", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/switching-lan/ethernet-dan-mac/ethernet-mac-address");
    await page.waitForLoadState("networkidle");

    // Locate the first quiz block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // 1. Submit incorrect answer
    await quiz.getByRole("button", { name: "32 bit (4 byte)", exact: true }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify feedback and retry button appear
    await expect(quiz.getByRole("button", { name: "Coba Lagi" })).toBeVisible();

    // 2. Retry with correct answer (48 bit (6 byte))
    await quiz.getByRole("button", { name: "Coba Lagi" }).click();
    await quiz.getByRole("button", { name: "48 bit (6 byte)", exact: true }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify pass feedback
    await expect(quiz.getByText("Jawaban Anda tepat!")).toBeVisible();
  });

  test("5. Renders Capstone Challenge player with VLAN and Trunk settings", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/challenges/staff-guest-vlan-repair");
    await page.waitForLoadState("networkidle");

    // Header and description
    await expect(
      page.getByRole("heading", { name: /Investigasi Misassignment Port/i }).first()
    ).toBeVisible();

    // Verify form sections are rendered
    await expect(page.getByText(/Perbaikan Port Access PC Staff 2/i)).toBeVisible();
    await expect(page.getByText(/Konfigurasi Allowed VLAN pada Trunk Link/i)).toBeVisible();
    await expect(page.getByText(/Pertanyaan Analisis: Mengapa PC Staff/i)).toBeVisible();

    // Submit button is present
    await expect(page.getByRole("button", { name: /Kirim Solusi Tantangan/i })).toBeVisible();
  });
});
