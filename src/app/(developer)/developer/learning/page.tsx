import * as React from "react";
import { requireDeveloperActor } from "@/features/authorization/guards";
import { getAssessmentAnalyticsOverview } from "@/features/developer/overview/queries";

export const metadata = {
  title: "Analitik Pembelajaran — Developer Zenoba",
};

export default async function DeveloperLearningPage() {
  await requireDeveloperActor();
  const summary = await getAssessmentAnalyticsOverview();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Analitik Pembelajaran & Kesehatan Asesmen
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Evaluasi tingkat kelulusan, retake, dan friksi materi pembelajaran berbasis bukti kohor reguler terproteksi privasi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            K-Anonymity (Min. 5 Learner)
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Akun Internal Disaring
          </span>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Butir Dianalisis</p>
          <p className="text-2xl font-bold text-white mt-1">{summary.totalAssessments}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Total Percobaan</p>
          <p className="text-2xl font-bold text-white mt-1">{summary.totalAttempts}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Asesmen Sehat (≥70%)</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{summary.healthyCount}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Perlu Tinjauan (&lt;50%)</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{summary.needsReviewCount}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Kohor Terlindungi (&lt;5)</p>
          <p className="text-2xl font-bold text-slate-400 mt-1">{summary.suppressedCount}</p>
        </div>
      </div>

      {/* Privacy & Methodology Notice */}
      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-slate-300 space-y-1.5">
        <p className="font-semibold text-blue-400 uppercase tracking-wider text-[11px]">
          Prinsip Privasi & Keamanan Data (K-Anonymity)
        </p>
        <p className="text-slate-400 leading-relaxed">
          Metrik dihitung khusus dari learner reguler. Akun staf (<code>INTERNAL_LEARNER</code>) dan operator (<code>DEVELOPER</code>) disaring otomatis agar tidak mengotori data. Untuk butir asesmen dengan kurang dari 5 learner unik, tingkat kelulusan dan median percobaan otomatis disupresi untuk melindungi identitas peserta. Jawaban mentah dan pilihan ganda tidak pernah dimuat di halaman ini.
        </p>
      </div>

      {/* Main Table */}
      <div className="rounded-lg bg-[#080d1a] border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-white">Daftar Kesehatan Butir & Outcome</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rincian performa kohor pada setiap instrumen evaluasi materi.
            </p>
          </div>
        </div>

        {summary.items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Belum ada data percobaan asesmen dari learner reguler untuk dianalisis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-4 py-3">Butir Asesmen</th>
                  <th scope="col" className="px-4 py-3">Outcome Pembelajaran</th>
                  <th scope="col" className="px-3 py-3 text-center">Versi</th>
                  <th scope="col" className="px-3 py-3 text-center">Percobaan</th>
                  <th scope="col" className="px-3 py-3 text-center">Learner</th>
                  <th scope="col" className="px-3 py-3 text-center">Lulus Ke-1</th>
                  <th scope="col" className="px-3 py-3 text-center">Lulus Retake</th>
                  <th scope="col" className="px-3 py-3 text-center">Median Percobaan</th>
                  <th scope="col" className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {summary.items.map((item) => {
                  let statusBadge = (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                      TERLINDUNGI
                    </span>
                  );

                  if (!item.isSuppressed) {
                    if (item.firstAttemptPassRate !== null && item.firstAttemptPassRate >= 0.7) {
                      statusBadge = (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          SEHAT
                        </span>
                      );
                    } else if (item.firstAttemptPassRate !== null && item.firstAttemptPassRate < 0.5) {
                      statusBadge = (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          PERLU TINJAUAN
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          SEDANG
                        </span>
                      );
                    }
                  }

                  return (
                    <tr key={`${item.assessmentId}-${item.contentVersion}`} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">
                        <div className="space-y-0.5">
                          <p>{item.assessmentId}</p>
                          {item.moduleTitle && (
                            <p className="text-[11px] text-slate-400 font-normal">
                              {item.moduleTitle}
                              {item.lessonTitle ? ` • ${item.lessonTitle}` : ""}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-xs">
                        <p className="line-clamp-2" title={item.outcomeText ?? item.outcomeId}>
                          {item.outcomeText ?? item.outcomeId}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-center text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono">
                          v{item.contentVersion}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-slate-200">
                        {item.attemptCount}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-300">
                        {item.distinctLearners}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.isSuppressed ? (
                          <span className="text-slate-500" title="Disupresi untuk privasi (<5 peserta)">—</span>
                        ) : item.firstAttemptPassRate !== null ? (
                          <span
                            className={
                              item.firstAttemptPassRate >= 0.7
                                ? "text-emerald-400 font-semibold"
                                : item.firstAttemptPassRate < 0.5
                                ? "text-red-400 font-semibold"
                                : "text-amber-400 font-semibold"
                            }
                          >
                            {Math.round(item.firstAttemptPassRate * 100)}%
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.isSuppressed ? (
                          <span className="text-slate-500">—</span>
                        ) : item.retryPassRate !== null ? (
                          <span className="text-slate-300">
                            {Math.round(item.retryPassRate * 100)}%
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.isSuppressed ? (
                          <span className="text-slate-500">—</span>
                        ) : item.medianAttemptsToPass !== null ? (
                          <span className="font-mono text-slate-300">
                            {item.medianAttemptsToPass}x
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right shrink-0">
                        {statusBadge}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
