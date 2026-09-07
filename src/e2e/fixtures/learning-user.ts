import { expect, type Browser, type BrowserContext, type Page } from "@playwright/test";

export interface TestLearner {
  id?: string;
  email: string;
  password: string;
  name: string;
}

export interface LearnerContext {
  context: BrowserContext;
  page: Page;
  user: TestLearner;
}

/**
 * Creates a unique test learner account via the registration API,
 * then performs an authentic credentials sign-in through the NextAuth modal.
 */
export async function createAndSignInLearner(
  page: Page,
  options?: { email?: string; name?: string; password?: string }
): Promise<TestLearner> {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const email = options?.email || `learner_${timestamp}_${randomSuffix}@netloka.test`;
  const password = options?.password || "Password123!";
  const name = options?.name || `Learner ${randomSuffix}`;

  // 1. Register account via API endpoint
  const registerResponse = await page.request.post("/api/auth/register", {
    data: { email, password, name },
  });

  expect(registerResponse.ok(), `Registration failed: ${await registerResponse.text()}`).toBeTruthy();
  const registerData = (await registerResponse.json()) as { user?: { id: string } };
  const userId = registerData.user?.id;

  // 2. Sign in via UI credentials auth modal
  await page.goto("/?auth=sign-in");
  await page.waitForLoadState("networkidle");
  const emailInput = page.locator("#auth-email");
  await expect(emailInput).toBeVisible({ timeout: 10000 });

  await emailInput.fill(email);
  const passwordInput = page.locator("#auth-password");
  await passwordInput.fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  // 3. Wait for URL change to dashboard upon successful session establishment
  await page.waitForURL((url) => url.pathname.includes("/dashboard"), {
    timeout: 30000,
  });
  await expect(page.getByLabel("Navigasi Utama Workspace")).toBeVisible({ timeout: 15000 });

  return { id: userId, email, password, name };
}

/**
 * Creates an isolated browser context with a freshly authenticated learner.
 * This ensures clean, independent cookie/session jars for multi-user scenarios.
 */
export async function createAuthenticatedLearnerContext(
  browser: Browser,
  options?: { email?: string; name?: string }
): Promise<LearnerContext> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const user = await createAndSignInLearner(page, options);
  return { context, page, user };
}
