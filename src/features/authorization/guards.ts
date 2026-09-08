import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/auth";
import { prisma } from "@/lib/db/client";
import { isDeveloperRole, isLearnerRole } from "./role";
import {
  AuthorizationError,
  type Actor,
  type WorkspaceArea,
} from "./types";

/**
 * Retrieves the fresh database-authoritative actor corresponding to the current session.
 * Returns null if unauthenticated or if the user record no longer exists.
 * Does not expose sensitive fields (passwords, tokens, 2FA secrets).
 */
export async function getFreshActor(): Promise<Actor | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      authVersion: true,
      twoFactorEnabled: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    authVersion: user.authVersion,
    twoFactorEnabled: user.twoFactorEnabled,
  };
}

/**
 * Asserts that an authenticated actor exists in the current session.
 * Throws AuthorizationError("UNAUTHENTICATED") if not logged in.
 */
export async function requireFreshActor(): Promise<Actor> {
  const actor = await getFreshActor();
  if (!actor) {
    throw new AuthorizationError("UNAUTHENTICATED", "Authentication required");
  }
  return actor;
}

/**
 * Enforces developer role. Throws FORBIDDEN for learners and internal test accounts.
 */
export async function requireDeveloperActor(): Promise<Actor> {
  const actor = await requireFreshActor();
  if (!isDeveloperRole(actor.role)) {
    throw new AuthorizationError(
      "FORBIDDEN",
      "Developer workspace access required"
    );
  }
  return actor;
}

/**
 * Enforces learner workspace access (standard or internal learner).
 * Throws FORBIDDEN for developers attempting to access learner areas.
 */
export async function requireLearnerActor(): Promise<Actor> {
  const actor = await requireFreshActor();
  if (!isLearnerRole(actor.role)) {
    throw new AuthorizationError(
      "FORBIDDEN",
      "Learner workspace access required"
    );
  }
  return actor;
}

/**
 * Centralized guard for protecting workspace areas.
 * Evaluates provided actor or resolves a fresh one from the session and database.
 */
export async function requireActorForArea(
  area: WorkspaceArea,
  providedActor?: Actor | null
): Promise<Actor> {
  const actor =
    providedActor !== undefined ? providedActor : await getFreshActor();

  if (!actor) {
    throw new AuthorizationError("UNAUTHENTICATED", "Authentication required");
  }

  if (area === "developer") {
    if (!isDeveloperRole(actor.role)) {
      throw new AuthorizationError(
        "FORBIDDEN",
        "Developer workspace access required"
      );
    }
    return actor;
  }

  if (area === "learner") {
    if (!isLearnerRole(actor.role)) {
      throw new AuthorizationError(
        "FORBIDDEN",
        "Learner workspace access required"
      );
    }
    return actor;
  }

  throw new AuthorizationError("FORBIDDEN", `Unknown workspace area: ${area}`);
}
