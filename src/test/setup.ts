import "@testing-library/jest-dom";

// Provide safe defaults for unit/integration tests when not set in environment
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://netloka:netloka_ci_password@127.0.0.1:5432/netloka?schema=public";
process.env.AUTH_SECRET =
  process.env.AUTH_SECRET ||
  "netloka_ci_auth_secret_minimum_32_characters_long_for_test";
process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  "netloka_ci_auth_secret_minimum_32_characters_long_for_test";
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
