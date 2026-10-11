import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import {
  generateBackupCodes,
  generateTotpSecret,
  generateTotpUri,
  hashBackupCode,
  verifyTotpCode,
} from "@/features/auth/totp";
import { generateQrCodeDataUrl } from "@/features/auth/qr";
import { verifyPassword } from "@/features/auth/password";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, code, password } = body;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. SETUP: Generate secret & QR code
    if (action === "setup") {
      const secret = generateTotpSecret(20);
      const uri = generateTotpUri(dbUser.email, secret, "Zenoba");
      const qrCodeDataUrl = await generateQrCodeDataUrl(uri);

      // Save pending secret (2FA remains disabled until verified)
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          twoFactorSecret: secret,
          twoFactorEnabled: false,
        },
      });

      return NextResponse.json({
        secret,
        uri,
        qrCodeDataUrl,
      });
    }

    // 2. VERIFY: Confirm first code to activate 2FA and get backup codes
    if (action === "verify") {
      if (!code || typeof code !== "string") {
        return NextResponse.json({ error: "Kode verifikasi diperlukan" }, { status: 400 });
      }

      if (!dbUser.twoFactorSecret) {
        return NextResponse.json(
          { error: "Sesi setup 2FA belum dimulai. Silakan mulai kembali." },
          { status: 400 },
        );
      }

      const isValid = verifyTotpCode(dbUser.twoFactorSecret, code);
      if (!isValid) {
        return NextResponse.json(
          { error: "Kode verifikasi tidak valid atau telah kedaluwarsa." },
          { status: 400 },
        );
      }

      const backupCodes = generateBackupCodes(8);
      const hashedBackupCodes = backupCodes.map(hashBackupCode);

      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          twoFactorEnabled: true,
          twoFactorBackupCodes: JSON.stringify(hashedBackupCodes),
        },
      });

      return NextResponse.json({
        success: true,
        backupCodes,
      });
    }

    // 3. DISABLE: Turn off 2FA
    if (action === "disable") {
      // Must verify either password or TOTP code
      let isAuthorized = false;

      if (password && dbUser.passwordHash) {
        isAuthorized = await verifyPassword(password, dbUser.passwordHash);
      } else if (code && dbUser.twoFactorSecret) {
        isAuthorized = verifyTotpCode(dbUser.twoFactorSecret, code);
      }

      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Kata sandi atau kode autentikasi tidak valid." },
          { status: 400 },
        );
      }

      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorBackupCodes: null,
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Aksi tidak dikenali." }, { status: 400 });
  } catch (error) {
    console.error("Error managing 2FA:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
