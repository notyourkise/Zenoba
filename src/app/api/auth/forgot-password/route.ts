import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import {
  createPasswordResetToken,
  invalidatePasswordResetToken,
} from "@/features/auth/password-reset";
import { sendPasswordResetEmail } from "@/features/auth/email/password-reset-email";

const requestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const genericResponse = {
  message:
    "If an account exists for that email, a password reset link has been sent.",
};

export async function POST(request: Request) {
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

  const email = result.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });

  if (!user?.passwordHash) {
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

  return NextResponse.json(genericResponse);
}
