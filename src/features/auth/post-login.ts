import type { UserRole } from "@/generated/prisma/client";
import { getSafeAuthCallback } from "./callback-url";

/**
 * Determines the post-login destination URL based on the user's authoritative role
 * and an optional requested callback URL.
 *
 * Boundary rules:
 * - DEVELOPER: Default to /developer. Only allow callbackUrls that start with /developer.
 * - LEARNER / INTERNAL_LEARNER: Default to /dashboard. Forbid callbackUrls targeting /developer.
 */
export function getPostLoginDestination(
  role: UserRole | "DEVELOPER" | "LEARNER" | "INTERNAL_LEARNER" | string,
  callbackUrl?: string | null,
): string {
  if (role === "DEVELOPER") {
    const safe = callbackUrl ? getSafeAuthCallback(callbackUrl) : null;
    if (safe && safe.startsWith("/developer")) {
      return safe;
    }
    return "/developer";
  }

  const safe = callbackUrl ? getSafeAuthCallback(callbackUrl) : null;
  if (safe && !safe.startsWith("/developer")) {
    return safe;
  }
  return "/dashboard";
}
