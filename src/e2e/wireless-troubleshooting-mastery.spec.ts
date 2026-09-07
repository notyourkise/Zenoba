import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Wireless & Troubleshooting Curriculum Mastery (Sprint 30)", () => {
  test("1. Enforces authentication on Wireless & Troubleshooting learn path and capstone challenge routes", async ({
    page,
    request,
  }) => {
    // Unauthenticated access to Path 5 syllabus
    await page.goto("/learn/wireless-troubleshooting");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Flearn%2Fwireless-troubleshooting/);

    // Unauthenticated access to Path 5 Capstone Challenge
    await page.goto("/challenges/multi-incident-investigation");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Fchallenges%2Fmulti-incident-investigation/);

    // Unauthenticated API submission rejection
    const apiRes = await request.post("/api/challenges/submit", {
      data: {
        challengeId: "multi-incident-investigation",
        dhcpApipaCause: "dhcp-pool-exhausted",
        dhcpApipaRemediation: "expand-pool-and-reduce-lease",
        interVlanIssue: "missing-trunk-encapsulation",
        interVlanFix: "switchport-mode-trunk",
        branchGatewayIssue: "wrong-default-gateway-dhcp",
        branchGatewayFix: "update-dhcp-default-router",
        troubleshootingMethodology: "divide-and-conquer",
        verificationStep: "verify-l7-and-host-reachability",
      },
    });
    expect(apiRes.status()).toBe(401);
  });

  test("2. Displays all 4 modules, 8 lessons, and capstone challenge on Path 5 page", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/wireless-troubleshooting");
    await page.waitForLoadState("networkidle");

    // Path header
    await expect(page.getByRole("heading", { name: /Wireless & Troubleshooting/i }).first()).toBeVisible();

    // Verify 4 modules are rendered
    await expect(page.getByRole("heading", { name: /1\. Dasar Wireless & Propagasi Gelombang Radio/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /2\. Keamanan Jaringan Nirkabel & Segmentasi/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /3\. Alat Diagnostik Jaringan & CLI/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /4\. Metodologi Troubleshooting Sistematis/i })).toBeVisible();

    // Verify Capstone Challenge banner is rendered
    await expect(
      page.getByText("Investigasi Multi-Insiden Jaringan & Remediasi (Multi-Incident Investigation)")
    ).toBeVisible();
    await expect(page.getByText(/Terkunci • Selesaikan 8 materi lagi/i)).toBeVisible();
  });

  test("3. Renders Lesson 1 with learning outcomes, interactive block, and prevents answer leakage", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/wireless-troubleshooting/wireless-basics/band-frekuensi-wifi");
    await page.waitForLoadState("networkidle");

    // Lesson Title
    await expect(
      page.getByRole("heading", { name: "Karakteristik Frekuensi Wi-Fi: 2.4 GHz, 5 GHz & 6 GHz" }).first()
    ).toBeVisible();

    // Learning outcomes section
    await expect(page.getByRole("region", { name: /Capaian Pembelajaran Pelajaran/i })).toBeVisible();
    await expect(page.getByText("WLS-L1-A")).toBeVisible();

    // Knowledge check block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // Ensure server-only misconception feedback is not leaked in the initial DOM
    const content = await page.content();
    expect(content).not.toContain("misconceptionFeedback");
    expect(content).not.toContain("Frekuensi tinggi justru mengalami redaman");
  });

  test("4. Formative quiz interaction in Lesson 1: incorrect retry and correct pass", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/learn/wireless-troubleshooting/wireless-basics/band-frekuensi-wifi");
    await page.waitForLoadState("networkidle");

    // Locate the first quiz block
    const quiz = page.locator(".my-8").filter({ hasText: "Knowledge Check" }).first();
    await expect(quiz).toBeVisible();

    // 1. Submit incorrect answer
    await quiz.getByRole("button", { name: "Daya pancar pemancar 2.4 GHz diatur 10 kali lebih kuat oleh standar regulasi internasional", exact: true }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify feedback and retry button appear
    await expect(quiz.getByRole("button", { name: "Coba Lagi" })).toBeVisible();

    // 2. Retry with correct answer
    await quiz.getByRole("button", { name: "Coba Lagi" }).click();
    await quiz.getByRole("button", { name: "Panjang gelombang 2.4 GHz lebih panjang sehingga mengalami redaman penyerapan energi (attenuation) lebih kecil pada materi padat", exact: true }).click();
    await quiz.getByRole("button", { name: "Kirim Jawaban" }).click();

    // Verify pass feedback
    await expect(quiz.getByText("Jawaban Anda tepat!")).toBeVisible();
  });

  test("5. Renders Capstone Challenge player with 4 incident investigation sections", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    await page.goto("/challenges/multi-incident-investigation");
    await page.waitForLoadState("networkidle");

    // Header and description
    await expect(
      page.getByRole("heading", { name: /Investigasi Multi-Insiden Jaringan & Remediasi/i }).first()
    ).toBeVisible();

    // Verify form sections are rendered
    await expect(page.getByText(/Insiden 1: Anomali IP APIPA 169.254.x.x di Ruang Training/i)).toBeVisible();
    await expect(page.getByText(/Insiden 2: Kegagalan Konektivitas Antar-VLAN\/Server/i)).toBeVisible();
    await expect(page.getByText(/Insiden 3: Kantor Cabang Bandung Offline Total/i)).toBeVisible();
    await expect(page.getByText(/Bagian 4: Metodologi Troubleshooting Terstruktur & Verifikasi/i)).toBeVisible();

    // Submit button is present
    await expect(page.getByRole("button", { name: /Evaluasi Solusi Remediasi/i })).toBeVisible();
  });
});
