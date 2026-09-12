import { prisma } from "@/lib/db/client";
import { requireDeveloperActor } from "@/lib/auth";
import type { UserRole } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

export interface DeveloperUserSummary {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  authVersion: number;
  twoFactorEnabled: boolean;
  streakCount: number;
  headline: string | null;
  lastLoginAt: Date | null;
  lastActiveAt: Date | null;
  createdAt: Date;
}

export interface SearchDeveloperUsersInput {
  query?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface SearchDeveloperUsersResult {
  users: DeveloperUserSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DeveloperUserDetail extends DeveloperUserSummary {
  progressSummary: {
    completedLessonsCount: number;
    totalXp: number;
    quizAttemptsCount: number;
    assessmentAttemptsCount: number;
    consultantProjectsCount: number;
  };
}

export interface DeveloperUserPackageHistory {
  entitlements: Array<{
    id: string;
    courseId: string;
    courseTitle: string;
    sourceType: string;
    state: string;
    grantedAt: Date;
    revokedAt: Date | null;
  }>;
  orders: Array<{
    id: string;
    state: string;
    packageId: string;
    packageTitle: string;
    totalAmountIdr: number;
    createdAt: Date;
    paidAt: Date | null;
  }>;
}

const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  authVersion: true,
  twoFactorEnabled: true,
  streakCount: true,
  headline: true,
  lastLoginAt: true,
  lastActiveAt: true,
  createdAt: true,
} as const;

/**
 * Searches users for the developer portal with strict projection and pagination.
 * Excludes sensitive fields (passwords, tokens, 2FA secrets).
 */
export async function searchDeveloperUsers(
  input: SearchDeveloperUsersInput
): Promise<SearchDeveloperUsersResult> {
  await requireDeveloperActor();

  const trimmedQuery = input.query?.trim();
  const hasRole = Boolean(input.role);

  // If query is provided but shorter than 2 chars, and no role filter, return empty
  if (trimmedQuery !== undefined && trimmedQuery.length < 2 && !hasRole) {
    return {
      users: [],
      total: 0,
      page: 1,
      limit: Math.min(Math.max(1, input.limit ?? 20), 50),
      totalPages: 0,
    };
  }

  const limit = Math.min(Math.max(1, input.limit ?? 20), 50);
  const page = Math.max(1, input.page ?? 1);
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (trimmedQuery && trimmedQuery.length >= 2) {
    where.OR = [
      { email: { contains: trimmedQuery, mode: "insensitive" } },
      { name: { contains: trimmedQuery, mode: "insensitive" } },
    ];
  }

  if (input.role) {
    where.role = input.role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: SAFE_USER_SELECT,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Retrieves safe user details and aggregated learning progress for developers.
 * Returns null if user is not found.
 */
export async function getDeveloperUserDetail(
  userId: string
): Promise<DeveloperUserDetail | null> {
  await requireDeveloperActor();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: SAFE_USER_SELECT,
  });

  if (!user) {
    return null;
  }

  const [
    completedLessonsCount,
    xpSumRes,
    quizAttemptsCount,
    assessmentAttemptsCount,
    consultantProjectsCount,
  ] = await Promise.all([
    prisma.userLessonProgress.count({
      where: { userId, status: "COMPLETED" },
    }),
    prisma.userXpLedger.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.quizAttempt.count({
      where: { userId },
    }),
    prisma.assessmentAttempt.count({
      where: { userId },
    }),
    prisma.consultantProject.count({
      where: { userId },
    }),
  ]);

  return {
    ...user,
    progressSummary: {
      completedLessonsCount,
      totalXp: xpSumRes._sum.amount ?? 0,
      quizAttemptsCount,
      assessmentAttemptsCount,
      consultantProjectsCount,
    },
  };
}

/**
 * Retrieves package and entitlement history for a user.
 * Distinguishes active/revoked entitlement states and order history.
 */
export async function getDeveloperUserPackageHistory(
  userId: string
): Promise<DeveloperUserPackageHistory | null> {
  await requireDeveloperActor();

  const [entitlements, orders] = await Promise.all([
    prisma.entitlement.findMany({
      where: { userId },
      select: {
        id: true,
        courseId: true,
        sourceType: true,
        state: true,
        grantedAt: true,
        revokedAt: true,
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { grantedAt: "desc" },
    }),
    prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        state: true,
        packageId: true,
        totalAmountIdr: true,
        createdAt: true,
        paidAt: true,
        package: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    entitlements: entitlements.map((e) => ({
      id: e.id,
      courseId: e.courseId,
      courseTitle: e.course?.title ?? e.courseId,
      sourceType: e.sourceType,
      state: e.state,
      grantedAt: e.grantedAt,
      revokedAt: e.revokedAt,
    })),
    orders: orders.map((o) => ({
      id: o.id,
      state: o.state,
      packageId: o.packageId,
      packageTitle: o.package?.title ?? o.packageId,
      totalAmountIdr: o.totalAmountIdr,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
    })),
  };
}
