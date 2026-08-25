import { z } from "zod";

const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),

  // Node environment
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Authentication
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export function getServerEnvironment() {
  const result = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  });

  if (!result.success) {
    console.error("❌ Invalid server environment configuration:");
    console.error(result.error.flatten());
    throw new Error("Invalid server environment configuration");
  }

  return result.data;
}

// Validate at import time (fail-fast on startup)
if (process.env.NODE_ENV !== "test") {
  getServerEnvironment();
}
