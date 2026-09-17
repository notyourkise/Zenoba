import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/auth";
import { prisma } from "@/lib/db/client";
import {
  setSessionRevocationPrismaClient,
  type PrismaClientLike,
} from "@/features/auth/session-revocation";

setSessionRevocationPrismaClient(prisma as unknown as PrismaClientLike);

/**
 * Get current session on the server
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get current authenticated user on the server with fresh database state
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user?.id) {
    return session?.user ?? null;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        authVersion: true,
        image: true,
        headline: true,
        streakCount: true,
        lastStreakDate: true,
        securityState: {
          select: {
            validAfter: true,
          },
        },
      },
    });

    if (dbUser) {
      // Invalidate session if token was issued prior to validAfter
      const tokenIatMs = session.user.issuedAtMs;
      if (dbUser.securityState?.validAfter && typeof tokenIatMs === "number") {
        if (tokenIatMs < dbUser.securityState.validAfter.getTime()) {
          return null;
        }
      }

      return {
        ...session.user,
        name: dbUser.name,
        role: dbUser.role,
        authVersion: dbUser.authVersion,
        image: dbUser.image,
        headline: dbUser.headline,
        streakCount: dbUser.streakCount,
        lastStreakDate: dbUser.lastStreakDate,
      };
    }
  } catch {
    // Fail closed for privileged developer accounts on database error
    if (session?.user?.role === "DEVELOPER") {
      return null;
    }
    // Return session.user fallback if database is temporarily unreachable for ordinary learners
  }

  return session.user;
}

/**
 * Alias for getCurrentUser
 */
export const currentUser = getCurrentUser;

/**
 * Check if current session is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

// Re-export centralized server-authoritative role guards and actor types
export {
  getFreshActor,
  requireFreshActor,
  requireDeveloperActor,
  requireLearnerActor,
  requireActorForArea,
} from "@/features/authorization/guards";
export { AuthorizationError } from "@/features/authorization/types";
export type { Actor, WorkspaceArea } from "@/features/authorization/types";
