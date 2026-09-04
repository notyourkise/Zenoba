import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isGoogleLinked = dbUser.accounts.some((acc) => acc.provider === "google");
    let backupCodesCount = 0;
    if (dbUser.twoFactorBackupCodes) {
      try {
        const parsed = JSON.parse(dbUser.twoFactorBackupCodes);
        if (Array.isArray(parsed)) {
          backupCodesCount = parsed.length;
        }
      } catch {
        backupCodesCount = 0;
      }
    }

    return NextResponse.json({
      email: dbUser.email,
      hasPassword: Boolean(dbUser.passwordHash),
      isGoogleLinked,
      twoFactorEnabled: Boolean(dbUser.twoFactorEnabled),
      backupCodesCount,
    });
  } catch (error) {
    console.error("Error fetching user security status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
