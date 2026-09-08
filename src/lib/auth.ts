import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/auth";
import { prisma } from "@/lib/db/client";

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
      },
    });

    if (dbUser) {
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
    // Return session.user fallback if database is temporarily unreachable or in mock tests
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
