import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("IPv4 & Subnetting Curriculum Mastery (Sprint 27)", () => {
  test("1. Enforces authentication on IPv4 learn path and capstone challenge routes", async ({
    page,
    request,
  }) => {
    // Unauthenticated access to Path 2 syllabus
    await page.goto("/learn/ipv4-subnetting");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Fipv4-subnetting/);

    // Unauthenticated access to Path 2 Capstone Challenge
    await page.goto("/challenges/school-room-allocation");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Fchallenges%2Fschool-room-allocation/);

    // Unauthenticated API submission rejection
    const apiRes = await request.post("/api/challenges/submit", {
      data: {
        challengeId: "school-room-allocation",
        allocations: [],
      },
    });
    expect(apiRes.status()).toBe(401);
  });

  test("2. Displays all 5 modules, 10 lessons, and capstone challenge on Path 2 page", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/ipv4-subnetting");
    await page.waitForLoadState("networkidle");

    // Path header
    await expect(page.getByRole("heading", { name: /IPv4 & Subnetting/i }).first()).toBeVisible();

    // Verify 5 modules are rendered
    await expect(page.getByText("Biner & Representasi IPv4")).toBeVisible();
    await expect(page.getByText("Jenis Alamat IPv4")).toBeVisible();
    await expect(page.getByText("Netmask & Notasi CIDR")).toBeVisible();
    await expect(page.getByText("Kalkulasi Subnetting Presisi")).toBeVisible();
    await expect(page.getByText("Desain VLSM & Alokasi Jaringan")).toBeVisible();

    // Verify Capstone Challenge banner is rendered
    await expect(page.getByText("Tantangan Akhir Path: School Multi-Room Subnet Allocation")).toBeVisible();
    await expect(page.getByRole("link", { name: /Mulai Tantangan Capstone/i })).toBeVisible();
  });

  test("3. Renders Lesson 1 with interactive binary converter and prevents answer leakage", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/ipv4-subnetting/biner-dan-ipv4/biner-8-bit");
    await page.waitForLoadState("networkidle");

    // Lesson Title
    await expect(
      page.getByRole("heading", { name: "Konsep Dasar Biner & Nilai Tempat 8-Bit" }).first()
    ).toBeVisible();

    // Learning outcomes section
    await expect(page.getByRole("region", { name: /Capaian Pembelajaran Pelajaran/i })).toBeVisible();
    await expect(page.getByText("P2-BIN-01")).toBeVisible();

    // Interactive Binary Converter component
    await expect(page.getByText(/Kalkulator Konversi Biner 8-Bit Interaktif/i)).toBeVisible();

    // Knowledge check block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // Ensure server-only misconception feedback is not leaked in the initial DOM
    const content = await page.content();
    expect(content).not.toContain("misconceptionFeedback");
    expect(content).not.toContain("128 + 32 + 8 + 2");
  });

  test("4. Formative quiz interaction in Lesson 1: incorrect retry and correct pass", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/ipv4-subnetting/biner-dan-ipv4/biner-8-bit");
    await page.waitForLoadState("networkidle");

    // Locate the first quiz block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // 1. Submit incorrect answer
    await quiz.getByRole("button", { name: "172" }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify feedback and retry button appear
    await expect(quiz.getByRole("button", { name: "Coba Lagi" })).toBeVisible();

    // 2. Retry with correct answer
    await quiz.getByRole("button", { name: "Coba Lagi" }).click();
    await quiz.getByRole("button", { name: "170" }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify pass feedback
    await expect(quiz.getByText("Jawaban Anda tepat!")).toBeVisible();
  });

  test("5. Renders Capstone Challenge player with 5 room allocation forms", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/challenges/school-room-allocation");
    await page.waitForLoadState("networkidle");

    // Header and description
    await expect(
      page.getByRole("heading", { name: "School Multi-Room Subnet Allocation" }).first()
    ).toBeVisible();

    // Verify all 5 room cards are rendered
    await expect(page.getByText("Lab Komputer TKJ")).toBeVisible();
    await expect(page.getByText("Ruang Guru & Staff")).toBeVisible();
    await expect(page.getByText("Ruang Tata Usaha (TU)")).toBeVisible();
    await expect(page.getByText("Server & Manajemen Jaringan")).toBeVisible();
    await expect(page.getByText("Link Point-to-Point Router-ke-Firewall")).toBeVisible();

    // Submit button is present
    await expect(page.getByRole("button", { name: /Kirim Evaluasi Alokasi/i })).toBeVisible();
  });
});
