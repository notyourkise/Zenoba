import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { Provider } from "next-auth/providers/index";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db/client";
import { verifyPassword } from "./password";
import { verifyTotpCode, verifyAndConsumeBackupCode } from "./totp";
import {
  isSessionRevokedAsync,
  setSessionRevocationPrismaClient,
  type PrismaClientLike,
} from "./session-revocation";
import { recordSecurityEvent } from "@/features/security/events";
import { touchUserActivity } from "@/features/analytics/activity";

setSessionRevocationPrismaClient(prisma as unknown as PrismaClientLike);

type GoogleEnvironment = Record<string, string | undefined>;

export function isGoogleAuthConfigured(
  environment: GoogleEnvironment = process.env,
): boolean {
  return Boolean(
    environment.GOOGLE_CLIENT_ID?.trim() &&
      environment.GOOGLE_CLIENT_SECRET?.trim(),
  );
}

export function buildAuthProviders(
  environment: GoogleEnvironment = process.env,
): Provider[] {
  const providers: Provider[] = [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          await recordSecurityEvent({
            type: "AUTH_LOGIN_FAILED",
            severity: "WARN",
            metadata: { email: credentials.email, reason: "user_not_found_or_no_password" },
          });
          throw new Error("Invalid email or password");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash,
        );
        if (!isValid) {
          await recordSecurityEvent({
            userId: user.id,
            type: "AUTH_LOGIN_FAILED",
            severity: "WARN",
            metadata: { email: credentials.email, reason: "invalid_password" },
          });
          throw new Error("Invalid email or password");
        }

        // Developer accounts strictly require enabled 2FA
        if (user.role === "DEVELOPER" && !user.twoFactorEnabled) {
          await recordSecurityEvent({
            userId: user.id,
            type: "AUTH_LOGIN_FAILED",
            severity: "HIGH",
            metadata: { email: credentials.email, reason: "developer_2fa_disabled" },
          });
          throw new Error("Developer accounts must have two-factor authentication enabled");
        }

        // 2FA Verification Check
        if (user.twoFactorEnabled) {
          const rawCode = credentials.code?.trim();
          if (!rawCode) {
            throw new Error("2FA_REQUIRED");
          }

          let isCodeValid = false;
          if (user.twoFactorSecret && verifyTotpCode(user.twoFactorSecret, rawCode)) {
            isCodeValid = true;
          } else if (user.twoFactorBackupCodes) {
            try {
              const storedHashes = JSON.parse(user.twoFactorBackupCodes);
              if (Array.isArray(storedHashes)) {
                const consumption = verifyAndConsumeBackupCode(rawCode, storedHashes);
                if (consumption.valid) {
                  isCodeValid = true;
                  await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      twoFactorBackupCodes: JSON.stringify(consumption.remainingHashedCodes),
                    },
                  });
                }
              }
            } catch {
              // Ignore parsing error
            }
          }

          if (!isCodeValid) {
            await recordSecurityEvent({
              userId: user.id,
              type: "AUTH_LOGIN_FAILED",
              severity: "WARN",
              metadata: { email: credentials.email, reason: "invalid_2fa_code" },
            });
            throw new Error("Kode autentikasi 2FA tidak valid.");
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          headline: user.headline,
          streakCount: user.streakCount,
          lastStreakDate: user.lastStreakDate,
        };
      },
    }),
  ];

  if (isGoogleAuthConfigured(environment)) {
    providers.push(
      GoogleProvider({
        clientId: environment.GOOGLE_CLIENT_ID!.trim(),
        clientSecret: environment.GOOGLE_CLIENT_SECRET!.trim(),
      }),
    );
  }

  return providers;
}

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: buildAuthProviders(),
  events: {
    async signIn({ user }) {
      if (user?.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });
          await touchUserActivity(user.id);
        } catch (error) {
          console.error("[Auth] Failed to update user login/activity on signIn event:", error);
        }
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const normalizedEmail = user.email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          select: { id: true, role: true },
        });
        if (existingUser?.role === "DEVELOPER") {
          await recordSecurityEvent({
            userId: existingUser.id,
            type: "AUTH_OAUTH_DEVELOPER_REJECTED",
            severity: "WARN",
            metadata: { email: normalizedEmail, provider: "google" },
          });
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image;
        token.headline = user.headline;
        token.streakCount = user.streakCount;
        token.lastStreakDate = user.lastStreakDate;
      }
      if (trigger === "update" && session) {
        if (session.name !== undefined) {
          token.name = session.name;
        }
        if (session.headline !== undefined) {
          token.headline = session.headline;
        }
        if (session.image !== undefined) {
          token.picture = session.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const tokenIatMs = typeof token.iat === "number" ? token.iat * 1000 : undefined;
      const isDev = token.role === "DEVELOPER";
      if (token.id) {
        const isRevoked = await isSessionRevokedAsync(token.id as string, tokenIatMs, {
          failClosed: isDev,
        });
        if (isRevoked) {
          return {
            ...session,
            user: undefined as unknown as typeof session.user,
            expires: new Date(0).toISOString(),
          };
        }
      }

      if (session.user) {
        session.user.id = token.id as string;
        if (token.name) {
          session.user.name = token.name as string;
        }
        session.user.role = token.role as string;
        session.user.headline = token.headline as string | null;
        session.user.streakCount = typeof token.streakCount === "number" ? token.streakCount : 1;
        session.user.lastStreakDate = token.lastStreakDate as string | null;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        session.user.issuedAtMs = tokenIatMs;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
