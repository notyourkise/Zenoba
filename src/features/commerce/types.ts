export type CourseAccessTier = "FREE" | "PREMIUM";

export type CatalogStatus = "COMING_SOON" | "AVAILABLE" | "RETIRED";

export type PackageKind = "SINGLE" | "COMBO";

export type OrderState = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";

export type PaymentAttemptState = "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";

export type EntitlementState = "ACTIVE" | "REVOKED";

export type EntitlementSourceType = "FREE" | "PURCHASE" | "ADMIN";

export type PaymentProvider = "SANDBOX" | "MIDTRANS";

export interface CourseInput {
  slug: string;
  title?: string;
  accessTier: CourseAccessTier;
  catalogStatus: CatalogStatus;
  learningPathId?: string | null;
  isLinkedPathPublished?: boolean;
}

export interface PackageInput {
  slug: string;
  title: string;
  kind: PackageKind;
  catalogStatus: CatalogStatus;
  amountIdr: number | null;
  courses: CourseInput[];
}

export interface ValidatedPackageDefinition {
  slug: string;
  title: string;
  kind: PackageKind;
  catalogStatus: CatalogStatus;
  amountIdr: number | null;
  courses: CourseInput[];
}

export const FINAL_ORDER_STATES: readonly OrderState[] = [
  "PAID",
  "EXPIRED",
  "CANCELLED",
] as const;
