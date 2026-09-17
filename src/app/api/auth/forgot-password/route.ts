import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import {
  createPasswordResetToken,
  invalidatePasswordResetToken,
  hashResetToken,
} from "@/features/auth/password-reset";
import { sendPasswordResetEmail } from "@/features/auth/email/password-reset-email";
import {
  checkRateLimitAsync,
  hashRateLimitKey,
  getClientIp,
  ensureMinimumDuration,
  type RateLimitPrismaClientLike,
} from "@/features/auth/rate-limiter";

const requestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const genericResponse = {
  message:
    "If an account exists for that email, a password reset link has been sent.",
};

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_IP = 5;
const MAX_ATTEMPTS_PER_EMAIL = 3;

export async function POST(request: Request) {
  const startTime = Date.now();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = requestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }

  const clientIp = getClientIp(request);
  const email = result.data.email.toLowerCase().trim();

  // 1. IP rate limiting (5 requests per 15 minutes)
  const ipKey = hashRateLimitKey("forgot-password:ip", clientIp);
  const ipCheck = await checkRateLimitAsync(
    ipKey,
    MAX_ATTEMPTS_PER_IP,
    RATE_LIMIT_WINDOW_MS,
    { db: prisma as unknown as RateLimitPrismaClientLike },
  );
  if (!ipCheck.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(ipCheck.retryAfterSeconds) },
      },
    );
  }

  // 2. Email rate limiting (3 requests per 15 minutes)
  const emailKey = hashRateLimitKey("forgot-password:email", email);
  const emailCheck = await checkRateLimitAsync(
    emailKey,
    MAX_ATTEMPTS_PER_EMAIL,
    RATE_LIMIT_WINDOW_MS,
    { db: prisma as unknown as RateLimitPrismaClientLike },
  );
  if (!emailCheck.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(emailCheck.retryAfterSeconds) },
      },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });

  if (!user?.passwordHash) {
    // Equalize CPU workload to mitigate timing-based enumeration
    hashResetToken("dummy-entropy-padding-for-timing-defense");
    await ensureMinimumDuration(startTime, 250);
    return NextResponse.json(genericResponse);
  }

  let rawToken: string | null = null;
  try {
    rawToken = await createPasswordResetToken(user.id);
    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
    if (!appUrl) {
      throw new Error("Application URL is not configured");
    }

    const resetUrl = new URL("/reset-password", appUrl);
    resetUrl.searchParams.set("token", rawToken);
    await sendPasswordResetEmail({
      to: user.email,
      resetUrl: resetUrl.toString(),
    });
  } catch {
    if (rawToken) {
      await invalidatePasswordResetToken(rawToken).catch(() => undefined);
    }
    console.error("Password reset email delivery failed");
  }

  await ensureMinimumDuration(startTime, 250);
  return NextResponse.json(genericResponse);
}
