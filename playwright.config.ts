import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ||
        "postgresql://netloka:netloka_ci_password@127.0.0.1:5432/netloka?schema=public",
      AUTH_SECRET:
        process.env.AUTH_SECRET ||
        "netloka_ci_auth_secret_minimum_32_characters_long_for_test",
      NEXTAUTH_SECRET:
        process.env.NEXTAUTH_SECRET ||
        "netloka_ci_auth_secret_minimum_32_characters_long_for_test",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    },
  },
});
