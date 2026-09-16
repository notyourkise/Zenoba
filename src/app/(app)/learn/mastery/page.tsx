import Link from "next/link";
import { requireLearnerActor } from "@/features/authorization/guards";
import { getLearnerMasteryOverview } from "@/features/learning/mastery-queries";
import type { MasteryState, OutcomeMastery } from "@/features/learning/mastery";
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Circle,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "Penguasaan Materi & Remediasi — Netloka",
  description:
    "Pantau pencapaian sasaran kompetensi kurikulum berbasis bukti evaluasi dan riwayat pembelajaran nyata.",
};

function getMasteryBadge(state: MasteryState) {
  switch (state) {
    case "MASTERED":
      return {
        label: "Dikuasai",
        containerClass:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
      };
    case "NEEDS_REVIEW":
      return {
        label: "Perlu Evaluasi",
        containerClass:
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        icon: AlertCircle,
      };
    case "IN_PROGRESS":
      return {
        label: "Sedang Dipelajari",
        containerClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        icon: Clock,
      };
    case "NOT_STARTED":
    default:
      return {
        label: "Belum Dimulai",
        containerClass:
          "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
        icon: Circle,
      };
  }
}

function getOutcomeAction(outcome: OutcomeMastery) {
  const targetUrl = outcome.lessonSlug
    ? `/learn/${outcome.pathSlug}/${outcome.moduleSlug}/${outcome.lessonSlug}`
    : `/learn/${outcome.pathSlug}/${outcome.moduleSlug}`;

  switch (outcome.state) {
    case "NEEDS_REVIEW":
      return {
        href: targetUrl,
        label: "Buka Materi Remediasi",
        variant: "remediation" as const,
      };
    case "IN_PROGRESS":
      return {
        href: targetUrl,
        label: "Lanjutkan Materi",
        variant: "primary" as const,
      };
    case "MASTERED":
      return {
        href: targetUrl,
        label: "Ulas Kembali",
        variant: "subtle" as const,
      };
    case "NOT_STARTED":
    default:
      return {
        href: targetUrl,
        label: "Mulai Pelajari",
        variant: "subtle" as const,
      };
  }
}

export default async function LearnerMasteryPage() {
  const actor = await requireLearnerActor();
  const summary = await getLearnerMasteryOverview(actor.id);
  const { modules } = summary;

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
          <Award className="w-4 h-4" aria-hidden="true" />
          <span>Penguasaan Kompetensi Terverifikasi</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Penguasaan Materi & Remediasi
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Status penguasaan materi dihitung dari bukti evaluasi terverifikasi (kuis modul dan tugas asesmen) serta progres pembelajaran nyata. Sasaran yang belum lulus atau menggunakan versi kurikulum lama membutuhkan remediasi.
        </p>
      </div>

      {/* Summary Statistics Cards */}
      <section aria-label="Ringkasan Statistik Penguasaan">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Total Outcomes */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Sasaran
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
              {summary.totalOutcomes}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Kompetensi kurikulum
            </p>
          </div>

          {/* Mastered */}
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-xs">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Dikuasai
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {summary.masteredCount}
            </p>
            <p className="mt-1 text-xs text-emerald-600/80 dark:text-emerald-400/80">
              {summary.masteryPercentage}% dari kurikulum
            </p>
          </div>

          {/* Needs Review / Remediation */}
          <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 shadow-xs">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Perlu Remediasi
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-300">
              {summary.needsReviewCount}
            </p>
            <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80">
              Evaluasi ulang diperlukan
            </p>
          </div>

          {/* In Progress */}
          <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-xs">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Sedang Berjalan
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">
              {summary.inProgressCount}
            </p>
            <p className="mt-1 text-xs text-blue-600/80 dark:text-blue-400/80">
              Materi aktif dipelajari
            </p>
          </div>

          {/* Not Started */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs col-span-2 md:col-span-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Belum Dimulai
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-700 dark:text-zinc-300">
              {summary.notStartedCount}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Siap untuk dipelajari
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              Pencapaian Penguasaan Keseluruhan
            </span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {summary.masteryPercentage}%
            </span>
          </div>
          <div
            className="w-full bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden flex"
            role="progressbar"
            aria-valuenow={summary.masteryPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Pencapaian Penguasaan: ${summary.masteryPercentage}%`}
          >
            {summary.masteredCount > 0 && (
              <div
                style={{
                  width: `${(summary.masteredCount / summary.totalOutcomes) * 100}%`,
                }}
                className="bg-emerald-500 h-full"
                title={`Dikuasai: ${summary.masteredCount}`}
              />
            )}
            {summary.inProgressCount > 0 && (
              <div
                style={{
                  width: `${(summary.inProgressCount / summary.totalOutcomes) * 100}%`,
                }}
                className="bg-blue-500 h-full"
                title={`Sedang Berjalan: ${summary.inProgressCount}`}
              />
            )}
            {summary.needsReviewCount > 0 && (
              <div
                style={{
                  width: `${(summary.needsReviewCount / summary.totalOutcomes) * 100}%`,
                }}
                className="bg-amber-500 h-full"
                title={`Perlu Remediasi: ${summary.needsReviewCount}`}
              />
            )}
          </div>
        </div>
      </section>

      {/* Remediation Notification Banner */}
      {summary.needsReviewCount > 0 && (
        <div
          role="status"
          className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-sm">
                Remediasi Diperlukan ({summary.needsReviewCount} Sasaran)
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                Beberapa sasaran kompetensi membutuhkan ulasan ulang karena evaluasi belum mencapai kriteria kelulusan atau terdapat pembaruan materi kurikulum.
              </p>
            </div>
          </div>
          <div className="flex items-center shrink-0">
            <Link
              href="/learn/remediation"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
            >
              <span>Buka Pusat Remediasi</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      {/* Modules Competency Breakdown */}
      <section aria-label="Daftar Modul & Sasaran Kompetensi" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Rincian Modul & Sasaran Kompetensi
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {modules.length} Modul Terdata
          </span>
        </div>

        {modules.length === 0 ? (
          <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Belum ada modul kurikulum yang terkonfigurasi.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {modules.map((mod) => {
              const modulePercentage =
                mod.totalOutcomes > 0
                  ? Math.round((mod.masteredCount / mod.totalOutcomes) * 100)
                  : 0;

              return (
                <div
                  key={mod.moduleId}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs"
                >
                  {/* Module Header */}
                  <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{mod.pathTitle}</span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                          {mod.moduleTitle}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                            {mod.masteredCount} / {mod.totalOutcomes} Sasaran
                          </span>
                          <span className="block text-[11px] text-zinc-500 dark:text-zinc-400">
                            {modulePercentage}% Penguasaan
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Module Progress Bar */}
                    <div className="mt-3 w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden flex">
                      {mod.masteredCount > 0 && (
                        <div
                          style={{
                            width: `${(mod.masteredCount / mod.totalOutcomes) * 100}%`,
                          }}
                          className="bg-emerald-500 h-full"
                        />
                      )}
                      {mod.inProgressCount > 0 && (
                        <div
                          style={{
                            width: `${(mod.inProgressCount / mod.totalOutcomes) * 100}%`,
                          }}
                          className="bg-blue-500 h-full"
                        />
                      )}
                      {mod.needsReviewCount > 0 && (
                        <div
                          style={{
                            width: `${(mod.needsReviewCount / mod.totalOutcomes) * 100}%`,
                          }}
                          className="bg-amber-500 h-full"
                        />
                      )}
                    </div>
                  </div>

                  {/* Outcomes List */}
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {mod.outcomes.map((outcome) => {
                      const badge = getMasteryBadge(outcome.state);
                      const BadgeIcon = badge.icon;
                      const action = getOutcomeAction(outcome);

                      return (
                        <div
                          key={outcome.outcomeId}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                        >
                          <div className="space-y-1.5 flex-1 pr-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.containerClass}`}
                              >
                                <BadgeIcon className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{badge.label}</span>
                              </span>
                              {outcome.lessonTitle && (
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                  Materi: {outcome.lessonTitle}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                              {outcome.text}
                            </h4>
                            {outcome.description && (
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                {outcome.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center shrink-0">
                            <Link
                              href={action.href}
                              className={
                                action.variant === "remediation"
                                  ? "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
                                  : action.variant === "primary"
                                    ? "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                                    : "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                              }
                            >
                              <span>{action.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
