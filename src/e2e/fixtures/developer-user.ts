import { expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { prisma } from "@/lib/db/client";
import { generateTotpSecret, generateTotpToken } from "@/features/auth/totp";

export interface TestDeveloper {
  id: string;
  email: string;
  password: string;
  name: string;
  totpSecret: string;
  getCurrentTotpCode: () => string;
}

export interface DeveloperContext {
  context: BrowserContext;
  page: Page;
  user: TestDeveloper;
}

/**
 * Provisions an authentic test account, promotes it to DEVELOPER role with 2FA enabled,
 * and signs in through the authentication modal.
 */
export async function createAndSignInDeveloper(
  page: Page,
  options?: { email?: string; name?: string; password?: string },
): Promise<TestDeveloper> {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const email = options?.email || `dev_${timestamp}_${randomSuffix}@zenoba.test`;
  const password = options?.password || "Password123!";
  const name = options?.name || `Dev ${randomSuffix}`;

  // 1. Register account via API endpoint
  const registerResponse = await page.request.post("/api/auth/register", {
    data: { email, password, name },
  });

  expect(registerResponse.ok(), `Registration failed: ${await registerResponse.text()}`).toBeTruthy();
  const registerData = (await registerResponse.json()) as { user: { id: string } };
  const userId = registerData.user.id;

  // 2. Generate TOTP secret and promote role in database
  const totpSecret = generateTotpSecret();
  await prisma.user.update({
    where: { id: userId },
    data: {
      role: "DEVELOPER",
      twoFactorEnabled: true,
      twoFactorSecret: totpSecret,
    },
  });

  // 3. Sign in via credentials modal with 2FA
  await page.goto("/?auth=sign-in&callbackUrl=%2Fdeveloper");
  await page.waitForLoadState("networkidle");
  const emailInput = page.locator("#auth-email");
  await expect(emailInput).toBeVisible({ timeout: 10000 });

  await emailInput.fill(email);
  const passwordInput = page.locator("#auth-password");
  await passwordInput.fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  // Developer account requires 2FA: enter TOTP code in modal
  const codeInput = page.locator("#auth-2fa-code");
  await expect(codeInput).toBeVisible({ timeout: 10000 });
  const totpCode = generateTotpToken(totpSecret);
  await codeInput.fill(totpCode);
  await page.getByRole("button", { name: "Verifikasi & Masuk" }).click();

  // 4. Wait for redirect to /developer portal
  await page.waitForURL((url) => url.pathname.includes("/developer"), {
    timeout: 30000,
  });
  await expect(page.getByText("Zenoba Developer Workspace").first()).toBeVisible({ timeout: 15000 });

  return {
    id: userId,
    email,
    password,
    name,
    totpSecret,
    getCurrentTotpCode: () => generateTotpToken(totpSecret),
  };
}

/**
 * Creates an isolated browser context with a freshly authenticated developer.
 */
export async function createAuthenticatedDeveloperContext(
  browser: Browser,
  options?: { email?: string; name?: string },
): Promise<DeveloperContext> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const user = await createAndSignInDeveloper(page, options);
  return { context, page, user };
}

/**
 * Provisions a test account with INTERNAL_LEARNER role for access verification.
 */
export async function createInternalLearner(
  page: Page,
  options?: { email?: string; name?: string; password?: string },
) {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const email = options?.email || `internal_${timestamp}_${randomSuffix}@zenoba.test`;
  const password = options?.password || "Password123!";
  const name = options?.name || `Internal Tester ${randomSuffix}`;

  const registerResponse = await page.request.post("/api/auth/register", {
    data: { email, password, name },
  });

  expect(registerResponse.ok(), `Registration failed: ${await registerResponse.text()}`).toBeTruthy();
  const registerData = (await registerResponse.json()) as { user: { id: string } };
  const userId = registerData.user.id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: "INTERNAL_LEARNER",
    },
  });

  return { id: userId, email, password, name };
}
