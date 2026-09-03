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

const emailEnvSchema = z.object({
  APP_URL: z.string().url("APP_URL or NEXTAUTH_URL must be a valid URL"),
  SMTP_HOST: z.string().min(1).default("smtp.hostinger.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  SMTP_USER: z.string().email("SMTP_USER must be an email address"),
  SMTP_PASSWORD: z.string().min(1, "SMTP_PASSWORD is required"),
  EMAIL_FROM: z.string().email("EMAIL_FROM must be an email address"),
});

export function getEmailEnvironment() {
  const result = emailEnvSchema.safeParse({
    APP_URL: process.env.APP_URL || process.env.NEXTAUTH_URL,
    SMTP_HOST: process.env.SMTP_HOST || "smtp.hostinger.com",
    SMTP_PORT: process.env.SMTP_PORT || "465",
    SMTP_SECURE: process.env.SMTP_SECURE || "true",
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER,
  });

  if (!result.success) {
    throw new Error("Email delivery is not configured");
  }

  return result.data;
}

const commerceEnvSchema = z.object({
  PAYMENT_MODE: z.enum(["disabled", "sandbox"]).default("disabled"),
  SANDBOX_PAYMENT_EVENT_SECRET: z.string().optional(),
});

export function getCommerceEnvironment() {
  const paymentMode = (process.env.PAYMENT_MODE || "disabled") as "disabled" | "sandbox";
  const nodeEnv = process.env.NODE_ENV || "development";

  if (nodeEnv === "production" && paymentMode === "sandbox") {
    throw new Error("Sandbox payment mode is not allowed in production");
  }

  const result = commerceEnvSchema.safeParse({
    PAYMENT_MODE: paymentMode,
    SANDBOX_PAYMENT_EVENT_SECRET: process.env.SANDBOX_PAYMENT_EVENT_SECRET,
  });

  if (!result.success) {
    throw new Error("Invalid commerce environment configuration");
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
