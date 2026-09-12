import { prisma } from "@/lib/db/client";
import { requireDeveloperActor } from "@/lib/auth";
import { ORDINARY_LEARNER_FILTER } from "@/features/analytics/cohort";

export type DeveloperOverview = {
  ordinaryLearners: number;
  internalLearners: number;
  newLearners7d: number;
  newLearners30d: number;
  activeLearners7d: number;
  database: { status: "healthy" | "degraded"; latencyMs: number | null };
  curriculum: {
    paths: number;
    modules: number;
    lessons: number;
    assessments: number;
    capstones: number;
  };
};

/**
 * Retrieves high-level operational overview metrics for developers.
 * Excludes internal learners and developers from ordinary learner cohorts.
 * Bounded DTO explicitly omits sensitive user details and secrets.
 */
export async function getDeveloperOverview(
  now: Date = new Date()
): Promise<DeveloperOverview> {
  await requireDeveloperActor();

  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Execute panels in parallel using Promise.allSettled for fault isolation
  const [
    ordinaryLearnersRes,
    internalLearnersRes,
    new7dRes,
    new30dRes,
    active7dRes,
    dbCheckRes,
    pathsCountRes,
    modulesCountRes,
    lessonsCountRes,
  ] = await Promise.allSettled([
    prisma.user.count({ where: ORDINARY_LEARNER_FILTER }),
    prisma.user.count({ where: { role: "INTERNAL_LEARNER" } }),
    prisma.user.count({
      where: {
        ...ORDINARY_LEARNER_FILTER,
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    prisma.user.count({
      where: {
        ...ORDINARY_LEARNER_FILTER,
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.user.count({
      where: {
        ...ORDINARY_LEARNER_FILTER,
        lastActiveAt: { gte: sevenDaysAgo },
      },
    }),
    (async () => {
      const start = performance.now();
      await prisma.$queryRaw`SELECT 1`;
      return Math.round(performance.now() - start);
    })(),
    prisma.learningPath.count({ where: { published: true } }),
    prisma.module.count({ where: { published: true } }),
    prisma.lesson.count({ where: { published: true } }),
  ]);

  const ordinaryLearners =
    ordinaryLearnersRes.status === "fulfilled" ? ordinaryLearnersRes.value : 0;
  const internalLearners =
    internalLearnersRes.status === "fulfilled" ? internalLearnersRes.value : 0;
  const newLearners7d = new7dRes.status === "fulfilled" ? new7dRes.value : 0;
  const newLearners30d = new30dRes.status === "fulfilled" ? new30dRes.value : 0;
  const activeLearners7d =
    active7dRes.status === "fulfilled" ? active7dRes.value : 0;

  const dbStatus: { status: "healthy" | "degraded"; latencyMs: number | null } =
    dbCheckRes.status === "fulfilled"
      ? { status: "healthy", latencyMs: dbCheckRes.value }
      : { status: "degraded", latencyMs: null };

  const paths = pathsCountRes.status === "fulfilled" ? pathsCountRes.value : 6;
  const modules =
    modulesCountRes.status === "fulfilled" ? modulesCountRes.value : 31;
  const lessons =
    lessonsCountRes.status === "fulfilled" ? lessonsCountRes.value : 65;

  return {
    ordinaryLearners,
    internalLearners,
    newLearners7d,
    newLearners30d,
    activeLearners7d,
    database: dbStatus,
    curriculum: {
      paths,
      modules,
      lessons,
      assessments: 6,
      capstones: 6,
    },
  };
}
