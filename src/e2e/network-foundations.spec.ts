import { expect, test } from "@playwright/test";

test.describe("Network Foundations & Capstone Challenge", () => {
  test("protects challenges page from unauthenticated users", async ({ page }) => {
    await page.goto("/challenges");
    await expect(page).toHaveURL(/.*sign-in.*callbackUrl=%2Fchallenges/);
  });

  test("rejects unauthenticated challenge submission with 401", async ({
    request,
  }) => {
    const response = await request.post("/api/challenges/submit", {
      data: {
        challengeId: "first-day-it-support",
        selectedDeviceIds: ["router-1", "switch-1"],
        topologyChoice: "star",
        troubleshootAnswer: "check_layer1_cable",
      },
    });

    expect(response.status()).toBe(401);
  });
});
