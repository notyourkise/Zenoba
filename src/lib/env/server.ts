import { z } from "zod";

const serverEnvSchema = z
  .object({
    // Database
    DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),

    // Node environment
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // Authentication
    AUTH_SECRET: z
      .string()
      .min(32, "AUTH_SECRET must be at least 32 characters")
      .optional(),
    NEXTAUTH_SECRET: z
      .string()
      .min(32, "NEXTAUTH_SECRET must be at least 32 characters")
      .optional(),
  })
  .refine((data) => !!(data.AUTH_SECRET || data.NEXTAUTH_SECRET), {
    message: "AUTH_SECRET or NEXTAUTH_SECRET must be at least 32 characters",
    path: ["AUTH_SECRET"],
  });

export function getServerEnvironment() {
  const authSecret =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || undefined;

  const result = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    AUTH_SECRET: authSecret,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || authSecret,
  });

  if (!result.success) {
    console.error("❌ Invalid server environment configuration:");
    console.error(result.error.flatten());
    throw new Error("Invalid server environment configuration");
  }

  return result.data;
}

// Validate at import time (fail-fast on startup, skip in unit test runner)
if (process.env.NODE_ENV !== "test" && typeof window === "undefined") {
  try {
    getServerEnvironment();
  } catch (error) {
    // Only fail if not in static build analysis phase
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      // Re-throw to prevent running with invalid config
      throw error;
    }
  }
}
