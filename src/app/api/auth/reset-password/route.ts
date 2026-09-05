import { NextResponse } from "next/server";
import { z } from "zod";
import { consumePasswordResetToken } from "@/features/auth/password-reset";
import { checkRateLimit, getClientIp } from "@/features/auth/rate-limiter";

const resetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_IP = 10;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const clientIp = getClientIp(request);
  const ipCheck = checkRateLimit(
    `reset-password:ip:${clientIp}`,
    MAX_ATTEMPTS_PER_IP,
    RATE_LIMIT_WINDOW_MS,
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

  const result = resetSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }

  const status = await consumePasswordResetToken(
    result.data.token,
    result.data.password,
  );

  if (status === "invalid") {
    return NextResponse.json(
      { error: "This password reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "Your password has been reset successfully.",
  });
}
