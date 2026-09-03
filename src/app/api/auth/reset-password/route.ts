import { NextResponse } from "next/server";
import { z } from "zod";
import { consumePasswordResetToken } from "@/features/auth/password-reset";

const resetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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
