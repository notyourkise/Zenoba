import type { UserRole } from "@/generated/prisma/client";

/**
 * Filter object to restrict Prisma queries to standard learners only,
 * preventing metrics pollution from privileged accounts (INTERNAL_LEARNER, DEVELOPER).
 */
export const ORDINARY_LEARNER_FILTER = {
  role: "LEARNER" as UserRole,
} as const;

/**
 * Returns true if the given role represents a standard learner cohort member.
 * Internal test accounts (INTERNAL_LEARNER) and operators (DEVELOPER) return false.
 */
export function isAnalyticsLearner(role: unknown): role is "LEARNER" {
  return role === "LEARNER";
}
