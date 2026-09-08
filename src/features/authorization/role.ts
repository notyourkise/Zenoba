export const APP_ROLES = ["LEARNER", "INTERNAL_LEARNER", "DEVELOPER"] as const;

export type AppRole = (typeof APP_ROLES)[number];

/**
 * Returns true if the role is a recognized learner role (standard or internal test account).
 */
export function isLearnerRole(role: unknown): role is "LEARNER" | "INTERNAL_LEARNER" {
  return role === "LEARNER" || role === "INTERNAL_LEARNER";
}

/**
 * Returns true if the role is the developer role.
 */
export function isDeveloperRole(role: unknown): role is "DEVELOPER" {
  return role === "DEVELOPER";
}

/**
 * Returns true if the role is a privileged role (requires CLI provisioning).
 */
export function isPrivilegedRole(role: unknown): role is "INTERNAL_LEARNER" | "DEVELOPER" {
  return role === "INTERNAL_LEARNER" || role === "DEVELOPER";
}
