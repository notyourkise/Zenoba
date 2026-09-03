import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { Provider } from "next-auth/providers/index";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db/client";
import { verifyPassword } from "./password";

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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
