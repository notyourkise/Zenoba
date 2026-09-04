import { getCurrentUser } from "@/lib/auth";
import { getUserProgressSummary } from "@/features/learning/progress";
import { getLearningPathsWithProgress } from "@/features/learning/queries";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [progressSummary, paths] = user?.id
    ? await Promise.all([
        getUserProgressSummary(user.id),
        getLearningPathsWithProgress(user.id),
      ])
    : [
        { totalLessons: 0, completedCount: 0, inProgressCount: 0, completionPercentage: 0, totalXp: 0 },
        [],
      ];

  const activePath = paths.find((p) => p.progressPercent > 0 && p.progressPercent < 100) || paths[0] || null;

  return (
    <div className="max-w-4xl space-y-10 py-2">
      {/* 1. Welcome Heading & Orientation */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white break-words">
          Selamat Datang{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Pusat kendali pembelajaran dan praktikum infrastruktur jaringan Anda.
        </p>
      </header>

      {/* 2. Continue Learning Section */}
      <section aria-labelledby="continue-learning-heading" className="space-y-4">
        <h2 id="continue-learning-heading" className="text-lg font-semibold text-zinc-900 dark:text-white">
          Lanjutkan Belajar
        </h2>

        {activePath ? (
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-medium text-zinc-900 dark:text-white">
                {activePath.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {activePath.completedLessonsCount} dari {activePath.totalLessonsCount} pelajaran selesai ({activePath.progressPercent}%)
              </p>
            </div>

            {/* Semantic progress bar */}
            <div
              role="progressbar"
              aria-label={`${activePath.title} progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={activePath.progressPercent}
              className="h-2 w-full max-w-md rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
            >
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(Math.max(activePath.progressPercent, 0), 100)}%` }}
              />
            </div>

            <div className="pt-1">
              <Link
                href={`/learn/${activePath.slug}`}
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
              >
                {activePath.progressPercent > 0 ? "Continue learning" : "Start learning"}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Belum ada jalur pembelajaran yang tersedia.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center min-h-[44px] text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Katalog Kursus
            </Link>
          </div>
        )}
      </section>

      {/* 3. Learning Progress Metrics */}
      <section aria-labelledby="learning-progress-heading" className="space-y-3">
        <h2 id="learning-progress-heading" className="text-lg font-semibold text-zinc-900 dark:text-white">
          Progres Belajar
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {progressSummary.completedCount}
            </span>{" "}
            dari {progressSummary.totalLessons} pelajaran selesai
          </div>
          <div>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {progressSummary.inProgressCount}
            </span>{" "}
            sedang dipelajari
          </div>
          <div>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {progressSummary.totalXp}
            </span>{" "}
            XP diperoleh
          </div>
        </div>
      </section>

      {/* 4. Practice & Exploration Links */}
      <section aria-labelledby="practice-heading" className="space-y-3">
        <h2 id="practice-heading" className="text-lg font-semibold text-zinc-900 dark:text-white">
          Praktik & Eksplorasi
        </h2>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link
            href="/labs"
            className="inline-flex items-center min-h-[44px] font-medium text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Interactive Labs
          </Link>
          <Link
            href="/challenges"
            className="inline-flex items-center min-h-[44px] font-medium text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Troubleshooting Challenges
          </Link>
          <Link
            href="/consultant"
            className="inline-flex items-center min-h-[44px] font-medium text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Simulasi Konsultan TI
          </Link>
        </div>
      </section>
    </div>
  );
}
