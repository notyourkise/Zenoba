import { expect, test } from "@playwright/test";
import { createAndSignInLearner } from "./fixtures/learning-user";
import { createAndSignInDeveloper } from "./fixtures/developer-user";

test.describe("Developer Operations & Privilege Workspace (Milestone 13)", () => {
  test("unauthenticated visit to /developer redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/developer");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fdeveloper/);
  });

  test("unauthenticated visit to /developer/users redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/developer/users");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fdeveloper%2Fusers/);
  });

  test("unauthenticated visit to /developer/access redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/developer/access");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fdeveloper%2Faccess/);
  });

  test("unauthenticated visit to /developer/system redirects to landing auth modal", async ({
    page,
  }) => {
    await page.goto("/developer/system");
    await expect(page).toHaveURL(/.*auth=sign-in.*callbackUrl=%2Fdeveloper%2Fsystem/);
  });

  test("standard learner is strictly denied access to developer workspace", async ({
    page,
  }) => {
    // 1. Authenticate as normal learner
    await createAndSignInLearner(page);

    // 2. Attempt navigating directly to developer workspace
    await page.goto("/developer");

    // 3. Learner is strictly redirected away to learner dashboard (workspace isolation)
    await page.waitForURL((url) => url.pathname.includes("/dashboard"), {
      timeout: 15000,
    });
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole("heading", { name: "Ringkasan Operasional" })).not.toBeVisible();
    await expect(page.getByLabel("Navigasi Utama Workspace")).toBeVisible();
  });

  test("authenticated developer accesses overview dashboard and navigates shell landmarks", async ({
    page,
  }) => {
    // 1. Sign in as developer
    await createAndSignInDeveloper(page);

    // 2. Verify developer overview landmarks
    await expect(page.getByRole("heading", { name: "Ringkasan Operasional" })).toBeVisible();
    const devNav = page.getByRole("navigation", { name: "Navigasi Pengembang" });
    await expect(devNav.getByRole("link", { name: /Pengguna/i })).toBeVisible();
    await expect(devNav.getByRole("link", { name: /Akses & Paket/i })).toBeVisible();
    await expect(devNav.getByRole("link", { name: /Kesehatan Kurikulum/i })).toBeVisible();
    await expect(devNav.getByRole("link", { name: /Kesehatan Sistem/i })).toBeVisible();

    // 3. Navigate to /developer/users
    await devNav.getByRole("link", { name: /Pengguna/i }).click();
    await page.waitForURL((url) => url.pathname.includes("/developer/users"));
    await expect(page.getByRole("heading", { name: "Direktori Pengguna" })).toBeVisible();
    await expect(page.getByPlaceholder(/Cari berdasarkan nama atau email/i)).toBeVisible();

    // 4. Navigate to /developer/access
    await devNav.getByRole("link", { name: /Akses & Paket/i }).click();
    await page.waitForURL((url) => url.pathname.includes("/developer/access"));
    await expect(page.getByText("Manajemen Hak Akses & Entitlement")).toBeVisible();
    await expect(
      page.getByText("Formulir Penyesuaian Hak Akses Paket (Entitlement)"),
    ).toBeVisible();
  });

  test("developer can open elevation dialog and execute privilege step-down", async ({
    page,
  }) => {
    const dev = await createAndSignInDeveloper(page);

    // 1. Click elevate trigger button in header
    const elevateBtn = page.getByRole("button", { name: /Elevate Privileges/i });
    await expect(elevateBtn).toBeVisible();
    await elevateBtn.click();

    // 2. Dialog is visible
    const dialogTitle = page.getByText("Elevasi Sesi Developer");
    await expect(dialogTitle).toBeVisible();

    // 3. Fill in password and 2FA TOTP code
    const passwordInput = page.locator("#elevation-password");
    const codeInput = page.locator("#elevation-code");

    await passwordInput.fill(dev.password);
    await codeInput.fill(dev.getCurrentTotpCode());

    await page.getByRole("button", { name: /Konfirmasi Elevasi/i }).click();

    // 4. Dialog closes and elevation indicator displays countdown
    await expect(dialogTitle).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Ter-elevasi:/i)).toBeVisible({ timeout: 10000 });

    // 5. Click step-down button to revoke elevation
    const stepDownBtn = page.getByRole("button", { name: /Step Down \/ Cabut Elevasi/i });
    await expect(stepDownBtn).toBeVisible();
    await stepDownBtn.click();

    // 6. Indicator reverts to trigger button
    await expect(page.getByRole("button", { name: /Elevate Privileges/i })).toBeVisible({
      timeout: 10000,
    });
  });
});
