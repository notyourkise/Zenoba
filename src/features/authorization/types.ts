import type { UserRole } from "@/generated/prisma/client";

export type WorkspaceArea = "learner" | "developer";

/**
 * Sanitized, database-backed representation of an active authenticated actor.
 * Never includes passwords, OAuth secrets, reset tokens, or 2FA secrets.
 */
export interface Actor {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  authVersion: number;
  twoFactorEnabled: boolean;
}

export type AuthorizationErrorCode = "UNAUTHENTICATED" | "FORBIDDEN" | "STALE_AUTH";

export class AuthorizationError extends Error {
  readonly code: AuthorizationErrorCode;
  readonly status: number;

  constructor(code: AuthorizationErrorCode, message?: string) {
    super(message || code);
    this.name = "AuthorizationError";
    this.code = code;
    this.status = code === "UNAUTHENTICATED" ? 401 : 403;
  }
}
