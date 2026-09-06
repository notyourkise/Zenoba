import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Routing & Network Services Curriculum Mastery (Sprint 29)", () => {
  test("1. Enforces authentication on Routing & Services learn path and capstone challenge routes", async ({
    page,
    request,
  }) => {
    // Unauthenticated access to Path 4 syllabus
    await page.goto("/learn/network-services");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Fnetwork-services/);

    // Unauthenticated access to Path 4 Capstone Challenge
    await page.goto("/challenges/named-service-outage");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Fchallenges%2Fnamed-service-outage/);

    // Unauthenticated API submission rejection
    const apiRes = await request.post("/api/challenges/submit", {
      data: {
        challengeId: "named-service-outage",
        dhcpDefaultGateway: "192.168.1.1",
        dhcpDnsServer: "192.168.1.10",
        natOverloadEnabled: true,
        transportOutageReasonOption: "port-blocked-or-service-down",
      },
    });
    expect(apiRes.status()).toBe(401);
  });

  test("2. Displays all 5 modules, 10 lessons, and capstone challenge on Path 4 page", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-services");
    await page.waitForLoadState("networkidle");

    // Path header
    await expect(page.getByRole("heading", { name: /Routing & Network Services/i }).first()).toBeVisible();

    // Verify 5 modules are rendered
    await expect(page.getByRole("heading", { name: /1\. Konsep Routing & Default Gateway/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /2\. Rute Statis & Inter-VLAN Routing/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /3\. Layanan Otomatisasi IP & Resolusi Domain/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /4\. Translasi Alamat Jaringan/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /5\. Protokol Transport & Diagnostik Layanan/i })).toBeVisible();

    // Verify Capstone Challenge banner is rendered
    await expect(
      page.getByText("Investigasi Gangguan Layanan Enterprise (Named-Service Outage)")
    ).toBeVisible();
    await expect(page.getByText(/Terkunci • Selesaikan 10 materi lagi/i)).toBeVisible();
  });

  test("3. Renders Lesson 1 with interactive block and prevents answer leakage", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-services/gateway-dan-route/default-gateway");
    await page.waitForLoadState("networkidle");

    // Lesson Title
    await expect(
      page.getByRole("heading", { name: "Peran Default Gateway & Komunikasi Antar-Subnet" }).first()
    ).toBeVisible();

    // Learning outcomes section
    await expect(page.getByRole("region", { name: /Capaian Pembelajaran Pelajaran/i })).toBeVisible();
    await expect(page.getByText("RTG-L1-A")).toBeVisible();

    // Knowledge check block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // Ensure server-only misconception feedback is not leaked in the initial DOM
    const content = await page.content();
    expect(content).not.toContain("misconceptionFeedback");
    expect(content).not.toContain("Jika tujuan berada dalam subnet yang sama");
  });

  test("4. Formative quiz interaction in Lesson 1: incorrect retry and correct pass", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/network-services/gateway-dan-route/default-gateway");
    await page.waitForLoadState("networkidle");

    // Locate the first quiz block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // 1. Submit incorrect answer
    await quiz.getByRole("button", { name: "Saat mengirim data ke host 10.0.1.20", exact: true }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify feedback and retry button appear
    await expect(quiz.getByRole("button", { name: "Coba Lagi" })).toBeVisible();

    // 2. Retry with correct answer (Saat mengirim data ke host 10.0.2.15)
    await quiz.getByRole("button", { name: "Coba Lagi" }).click();
    await quiz.getByRole("button", { name: "Saat mengirim data ke host 10.0.2.15", exact: true }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify pass feedback
    await expect(quiz.getByText("Jawaban Anda tepat!")).toBeVisible();
  });

  test("5. Renders Capstone Challenge player with Default Gateway, DNS, and PAT controls", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/challenges/named-service-outage");
    await page.waitForLoadState("networkidle");

    // Header and description
    await expect(
      page.getByRole("heading", { name: /Investigasi Gangguan Layanan Enterprise/i }).first()
    ).toBeVisible();

    // Verify form sections are rendered
    await expect(page.getByText(/Koreksi Parameter Default Gateway pada DHCP Scope/i)).toBeVisible();
    await expect(page.getByText(/Koreksi Resolver DNS Server pada DHCP Scope/i)).toBeVisible();
    await expect(page.getByText(/Status Fitur NAT\/PAT Overload pada Router WAN/i)).toBeVisible();
    await expect(page.getByText(/Analisis Keterjangkauan Layer 3 vs Status Port Layer 4/i)).toBeVisible();

    // Submit button is present
    await expect(page.getByRole("button", { name: /Evaluasi Perbaikan Sekarang/i })).toBeVisible();
  });
});
