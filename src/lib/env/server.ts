import { z } from "zod";

const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),

  // Node environment
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export function getServerEnvironment() {
  const result = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
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
