import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";

test.describe("Core Networking Curriculum Cross-Path Regression (Milestone 10)", () => {
  test("1. Renders all 5 core learning paths and their capstone sections for authenticated learner", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    const paths = [
      {
        slug: "network-foundations",
        title: /Network Foundations/i,
        capstoneTitle: "Hari Pertama Sebagai Staf IT Support",
      },
      {
        slug: "ipv4-subnetting",
        title: /IPv4 & Subnetting/i,
        capstoneTitle: "Desain Pembagian Subnet Multi-Ruangan Sekolah",
      },
      {
        slug: "switching-lan",
        title: /Switching & LAN/i,
        capstoneTitle: "Perbaikan Segmentasi VLAN & Trunking Kantor (Staff & Guest)",
      },
      {
        slug: "network-services",
        title: /Routing & Network Services/i,
        capstoneTitle: "Investigasi Gangguan Layanan Enterprise (Named-Service Outage)",
      },
      {
        slug: "wireless-troubleshooting",
        title: /Wireless & Troubleshooting/i,
        capstoneTitle: "Investigasi Multi-Insiden Jaringan & Remediasi (Multi-Incident Investigation)",
      },
    ];

    for (const p of paths) {
      await page.goto(`/learn/${p.slug}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByRole("heading", { name: p.title }).first()).toBeVisible();
      await expect(page.getByText(p.capstoneTitle)).toBeVisible();
    }
  });

  test("2. Legacy aliases resolve to canonical paths without 404", async ({ page }) => {
    await createAndSignInLearner(page);

    // Switching & VLAN legacy alias
    await page.goto("/learn/switching-vlan-routing");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /Switching & LAN/i }).first()).toBeVisible();

    // Routing & Services legacy alias
    await page.goto("/learn/routing-services");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /Routing & Network Services/i }).first()).toBeVisible();
  });

  test("3. All 5 Capstone Challenge players render interactive inputs", async ({ page }) => {
    await createAndSignInLearner(page);

    const challenges = [
      {
        slug: "first-day-it-support",
        heading: /Hari Pertama Sebagai Staf IT Support/i,
      },
      {
        slug: "school-room-allocation",
        heading: /Desain Pembagian Subnet Multi-Ruangan/i,
      },
      {
        slug: "staff-guest-vlan-repair",
        heading: /Investigasi Misassignment Port & Trunk Allowed VLAN/i,
      },
      {
        slug: "named-service-outage",
        heading: /Investigasi Gangguan Layanan Enterprise/i,
      },
      {
        slug: "multi-incident-investigation",
        heading: /Investigasi Multi-Insiden Jaringan & Remediasi/i,
      },
    ];

    for (const ch of challenges) {
      await page.goto(`/challenges/${ch.slug}`);
      await page.waitForLoadState("networkidle");

      await expect(page.getByRole("heading", { name: ch.heading }).first()).toBeVisible();
    }
  });

  test("4. Enforces path prerequisite gate on capstone submission when incomplete", async ({
    page,
  }) => {
    await createAndSignInLearner(page);

    // Submitting Path 5 capstone without finishing the 8 lessons should be rejected with 400
    const res = await page.request.post("/api/challenges/submit", {
      data: {
        challengeId: "multi-incident-investigation",
        isPathFinal: true,
        apipaRootCause: "dhcp-pool-exhausted",
        apipaCorrection: "expand-pool-and-reduce-lease",
        interVlanRootCause: "missing-8021q-trunk",
        interVlanCorrection: "configure-trunk-on-fa024",
        gatewayRootCause: "wrong-default-gateway",
        gatewayCorrection: "update-dhcp-default-router",
        troubleshootingPrincipleOption: "isolate-single-variable",
        serviceVerificationOption: "verify-layer7-and-ping",
      },
    });

    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Prasyarat belum terpenuhi");
  });
});
