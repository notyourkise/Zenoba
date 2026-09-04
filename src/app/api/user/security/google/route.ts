import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        accounts: {
          where: { provider: "google" },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dbUser.accounts.length === 0) {
      return NextResponse.json(
        { error: "Akun Google belum terhubung dengan akun Anda." },
        { status: 400 },
      );
    }

    // Safety guard: If user does not have a local password, prevent disconnecting
    if (!dbUser.passwordHash) {
      return NextResponse.json(
        {
          error:
            "Anda harus membuat kata sandi terlebih dahulu sebelum memutuskan akun Google agar tidak terkunci dari akun Anda.",
        },
        { status: 400 },
      );
    }

    // Delete Google account record
    await prisma.account.deleteMany({
      where: {
        userId: dbUser.id,
        provider: "google",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Google account:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
