import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import { resolveConsultantFeedback } from "@/features/consultant/feedback";

interface DimensionDetail {
  score: number;
  maxScore: number;
  feedback: string;
}

export default async function PortfolioPage() {
  const user = await getCurrentUser();

  let projects: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (user?.id) {
    projects = await prisma.consultantProject.findMany({
      where: { userId: user.id },
      include: { case: true },
      orderBy: { submittedAt: "desc" },
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <Link
        href="/consultant"
        className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        &larr; Kembali ke Katalog Konsultan
      </Link>

      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Professional Network Design Records
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Portofolio Proyek Konsultan Saya
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Daftar seluruh proposal dan rancangan infrastruktur jaringan yang telah Anda ajukan kepada klien di Netloka dengan rekam jejak penilaian multi-dimensi.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Belum Ada Proyek Konsultasi Tersimpan
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Pilih salah satu studi kasus di mode konsultan, rancang BoQ &amp; topologi, lalu ajukan proposal resmi untuk membangun portofolio Anda.
            </p>
          </div>
          <Link
            href="/consultant"
            className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Jelajahi Studi Kasus Klien &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => {
            const structuredFeedback = resolveConsultantFeedback({
              score: proj.score,
              passed: proj.passed,
              feedback: proj.feedback,
              compositeScore: proj.compositeScore,
              boqItems: proj.boqItems,
              vlanPlan: proj.vlanPlan,
            });

            const composite = proj.compositeScore as any; // eslint-disable-line @typescript-eslint/no-explicit-any
            const feedback = proj.feedback as any; // eslint-disable-line @typescript-eslint/no-explicit-any
            const rubricVersion = structuredFeedback.rubricVersion;
            const dimensions: Record<string, DimensionDetail> =
              composite?.dimensions || feedback?.dimensions || {};

            return (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center flex-wrap gap-2 text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold ${
                          proj.passed
                            ? "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300"
                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {proj.passed ? "Disetujui Klien" : "Revisi Diperlukan"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono font-semibold text-[11px]">
                        Rubrik v{rubricVersion}
                      </span>
                      <span className="text-gray-400 text-xs">
                        Diajukan: {new Date(proj.submittedAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {proj.case?.title || "Proyek Jaringan"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Klien: <strong>{proj.case?.clientName || "Klien Netloka"}</strong> &bull; Pagu Anggaran: Rp {(proj.case?.budget || 0).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-start sm:self-center">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-semibold">Skor Total</span>
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {proj.score} / 100
                      </span>
                    </div>

                    <Link
                      href={`/consultant/${proj.case?.slug}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                    >
                      Buka Desain &rarr;
                    </Link>
                  </div>
                </div>

                {/* Blocking Issues Alert */}
                {structuredFeedback.blockingIssues && structuredFeedback.blockingIssues.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block">
                      Isu Pemblokir ({structuredFeedback.blockingIssues.length})
                    </span>
                    <ul className="space-y-1 text-xs text-red-800 dark:text-red-300 list-disc list-inside">
                      {structuredFeedback.blockingIssues.map((issue, idx) => (
                        <li key={idx} className="leading-relaxed text-[11px]">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Strengths Card */}
                {structuredFeedback.strengths && structuredFeedback.strengths.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                      Kekuatan Proposal ({structuredFeedback.strengths.length})
                    </span>
                    <ul className="space-y-1 text-xs text-emerald-800 dark:text-emerald-300 list-disc list-inside">
                      {structuredFeedback.strengths.map((str, idx) => (
                        <li key={idx} className="leading-relaxed text-[11px]">
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prioritized Next Actions */}
                {structuredFeedback.nextActions && structuredFeedback.nextActions.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
                      Rekomendasi Langkah Berikutnya
                    </span>
                    <div className="space-y-1.5">
                      {structuredFeedback.nextActions.map((action, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white dark:bg-gray-800/90 rounded-lg border border-indigo-100 dark:border-indigo-900/40 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  action.priority === 1
                                    ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                                    : action.priority === 2
                                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                    : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                }`}
                              >
                                P{action.priority}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white text-[11px]">
                                {action.action}
                              </span>
                            </div>
                            {action.outcomeId && (
                              <span className="px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono text-[10px] font-bold">
                                {action.outcomeId}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                            {action.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimension Score Breakdown */}
                {Object.keys(dimensions).length > 0 && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700/80 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                      Rincian Evaluasi 5 Dimensi
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                      {Object.entries(dimensions).map(([key, dim]) => (
                        <div
                          key={key}
                          className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-700/60 space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white capitalize text-[11px]">
                            <span>{key.replace(/([A-Z])/g, " $1")}</span>
                            <span className="text-indigo-600 dark:text-indigo-400">
                              {dim.score}/{dim.maxScore}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-tight">
                            {dim.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
