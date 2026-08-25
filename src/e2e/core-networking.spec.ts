import { expect, test } from "@playwright/test";

test.describe("Core Networking & Addressing (Milestone 4)", () => {
  test("protects Path 2 and Path 3 learn routes from unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/learn/ipv4-subnetting");
    await expect(page).toHaveURL(/.*sign-in.*/);

    await page.goto("/learn/switching-vlan-routing");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });
});
