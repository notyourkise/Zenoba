import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/auth";
import { hashPassword } from "@/features/auth/password";
import {
  revokeUserSessions,
  type PrismaClientLike,
} from "@/features/auth/session-revocation";

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok dengan password baru",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Input tidak valid" },
        { status: 400 },
      );
    }

    const { newPassword } = result.data;
    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await revokeUserSessions(user.id, undefined, prisma as unknown as PrismaClientLike);

    return NextResponse.json({
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui password" },
      { status: 500 },
    );
  }
}
