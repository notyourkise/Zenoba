import Link from "next/link";
import { requireLearnerActor } from "@/features/authorization/guards";
import { getLearnerRemediationPlan } from "@/features/learning/remediation-queries";
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";

export const metadata = {
  title: "Pusat Remediasi & Penguatan Materi — Zenoba",
  description:
    "Fokus pada penguatan konsep materi dan sasaran kompetensi kurikulum yang membutuhkan ulasan sebelum melanjutkan topik berikutnya.",
};

export default async function RemediationCenterPage() {
  const actor = await requireLearnerActor();
  const plan = await getLearnerRemediationPlan(actor.id);
  const { totalNeedsReviewOutcomes, totalRemediationLessons, lessons } = plan;

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Penguatan Konsep & Remediasi Terarah</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Pusat Remediasi Materi
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Daftar materi pembelajaran yang direkomendasikan untuk Anda ulas kembali berdasarkan hasil evaluasi asesmen atau pembaruan kurikulum. Pembelajaran remediasi membantu memperkuat konsep sebelum Anda mengulang evaluasi kompetensi.
        </p>
      </div>

      {lessons.length === 0 ? (
        /* Empty State: No active remediation */
        <div className="p-8 sm:p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-center space-y-4 shadow-xs">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Tidak Ada Materi Remediasi Aktif
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Seluruh sasaran kompetensi Anda telah terverifikasi atau sedang berjalan dengan baik. Anda dapat melanjutkan materi baru di kurikulum.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/my-learning"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Pembelajaran Saya</span>
            </Link>
            <Link
              href="/learn/mastery"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
            >
              <Award className="w-4 h-4" aria-hidden="true" />
              <span>Status Penguasaan Materi</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Active Remediation Plan */
        <div className="space-y-8">
          {/* Summary Banner */}
          <div
            role="status"
            className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200 space-y-2"
          >
            <div className="flex items-center gap-2 font-bold text-base">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
              <span>
                {totalNeedsReviewOutcomes} Sasaran Kompetensi Memerlukan Remediasi
              </span>
            </div>
            <p className="text-sm text-amber-900/90 dark:text-amber-300/90">
              Sistem telah memetakan konsep yang perlu diperkuat ke dalam {totalRemediationLessons} materi pembelajaran di bawah ini. Pelajari materi tersebut untuk mempersiapkan diri sebelum mengulang uji kompetensi.
            </p>
          </div>

          {/* Remediation Cards List */}
          <section aria-label="Daftar Materi Remediasi" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Materi yang Perlu Diperkuat
              </h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {lessons.length} Pelajaran Direkomendasikan
              </span>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, idx) => (
                <article
                  key={lesson.lessonId}
                  className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4 hover:border-amber-500/40 transition-all"
                >
                  {/* Card Header & Breadcrumbs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {idx + 1}. {lesson.pathTitle}
                      </span>
                      <span>›</span>
                      <span>{lesson.moduleTitle}</span>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 self-start sm:self-auto">
                      Remediasi Prioritas
                    </span>
                  </div>

                  {/* Title & Outcomes List */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {lesson.lessonTitle}
                    </h3>

                    {lesson.unmetOutcomes.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                          Konsep sasaran yang perlu dipelajari kembali:
                        </p>
                        <ul className="space-y-1">
                          {lesson.unmetOutcomes.map((outcome) => (
                            <li
                              key={outcome.outcomeId}
                              className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2 pl-1"
                            >
                              <span className="text-amber-500 select-none">•</span>
                              <span>{outcome.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={lesson.href}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors shadow-xs"
                    >
                      <span>Buka Materi Remediasi</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>

                    <Link
                      href={`/learn/${lesson.pathSlug}/${lesson.moduleSlug}/assessment`}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                    >
                      <span>Uji Kompetensi Modul Terkait</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
