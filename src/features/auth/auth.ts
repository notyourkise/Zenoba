import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { Provider } from "next-auth/providers/index";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db/client";
import { verifyPassword } from "./password";
import { verifyTotpCode, verifyAndConsumeBackupCode } from "./totp";

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
          throw new Error("Invalid email or password");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash,
        );
        if (!isValid) {
          throw new Error("Invalid email or password");
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
        allowDangerousEmailAccountLinking: true,
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image;
        token.headline = user.headline;
        token.streakCount = user.streakCount;
        token.lastStreakDate = user.lastStreakDate;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.headline = token.headline as string | null;
        session.user.streakCount = typeof token.streakCount === "number" ? token.streakCount : 1;
        session.user.lastStreakDate = token.lastStreakDate as string | null;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
