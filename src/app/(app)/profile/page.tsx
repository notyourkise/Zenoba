import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserProgressSummary } from "@/features/learning/progress";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/?auth=sign-in");
  }

  const progress = user.id
    ? await getUserProgressSummary(user.id)
    : { totalLessons: 0, completedCount: 0, inProgressCount: 0, completionPercentage: 0, totalXp: 0 };

  const initials = user.name
    ? user.name.slice(0, 2).toUpperCase()
    : user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "NL";

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      {/* 1. Header Profil & Kartu Identitas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0b0e19] sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/20 ring-4 ring-blue-500/20">
              {initials}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                {user.name || "Learner Netloka"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {user.email}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {user.role || "LEARNER"}
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  - SMK TKJ & IT Infrastructure
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button variant="outline-dark" asChild className="h-9 px-4 text-xs font-semibold">
              <Link href="/settings">
                Pengaturan Akun
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Ringkasan Statistik Pembelajaran */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0e19]">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Total Pengalaman
          </span>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-sky-400">
            {progress.totalXp.toLocaleString()} <span className="text-xs font-normal text-gray-500 dark:text-slate-400">XP</span>
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            Diperoleh dari materi, lab, dan kuis
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0e19]">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Materi Tuntas
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {progress.completedCount} <span className="text-sm font-normal text-gray-500 dark:text-slate-400">/ {progress.totalLessons}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            Modul pembelajaran kurikulum
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0e19]">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Progres Belajar
          </span>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {progress.completionPercentage}%
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Navigasi Portofolio 4 Pilar Netloka */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0b0e19]">
        <div className="mb-4 border-b border-gray-100 pb-3 dark:border-white/10">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Eksplorasi Pembelajaran
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
            Akses langsung ke 4 pilar kurikulum praktis IT infrastructure Anda.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/learn"
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-colors hover:border-blue-500/30 hover:bg-blue-50/30 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-sky-500/30 dark:hover:bg-sky-950/20"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Learn
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Materi interaktif & konsep dasar jaringan
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-sky-400">
              Buka
            </span>
          </Link>

          <Link
            href="/labs"
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-colors hover:border-blue-500/30 hover:bg-blue-50/30 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-sky-500/30 dark:hover:bg-sky-950/20"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Labs
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Praktik simulator terminal & topologi
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-sky-400">
              Buka
            </span>
          </Link>

          <Link
            href="/challenges"
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-colors hover:border-blue-500/30 hover:bg-blue-50/30 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-sky-500/30 dark:hover:bg-sky-950/20"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Challenges
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Selesaikan skenario troubleshooting riil
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-sky-400">
              Buka
            </span>
          </Link>

          <Link
            href="/consultant"
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-colors hover:border-blue-500/30 hover:bg-blue-50/30 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-sky-500/30 dark:hover:bg-sky-950/20"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Consultant Mode
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Rancang BoQ, anggaran & topologi UKK
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-sky-400">
              Buka
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}