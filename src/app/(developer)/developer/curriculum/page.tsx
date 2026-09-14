import * as React from "react";
import { getCurriculumHealth } from "@/features/developer/curriculum/health";
import { prisma } from "@/lib/db/client";

export const metadata = {
  title: "Kesehatan Kurikulum — Developer Netloka",
};

export default async function DeveloperCurriculumPage() {
  const health = await getCurriculumHealth();
  const dbPaths = await prisma.learningPath.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      modules: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Kesehatan Kurikulum
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Status integritas, struktur modul, kuis formatif, dan capstone di seluruh katalog pembelajaran.
          </p>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold ${
              health.status === "healthy"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {health.status === "healthy" ? "VALID & SEHAT" : "PERLU TINJAUAN"}
          </span>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Jalur (Paths)</p>
          <p className="text-xl font-bold text-white mt-1">{health.summary.pathsCount}</p>
        </div>
        <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Total Modul</p>
          <p className="text-xl font-bold text-white mt-1">{health.summary.modulesCount}</p>
        </div>
        <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Total Pelajaran</p>
          <p className="text-xl font-bold text-white mt-1">{health.summary.lessonsCount}</p>
        </div>
        <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Kuis Formatif</p>
          <p className="text-xl font-bold text-white mt-1">{health.summary.quizzesCount}</p>
        </div>
        <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Asesmen Sumatif</p>
          <p className="text-xl font-bold text-white mt-1">{health.summary.assessmentsCount}</p>
        </div>
        <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 text-center">
          <p className="text-xs text-slate-400">Capstone Project</p>
          <p className="text-xl font-bold text-white mt-1">{health.summary.capstonesCount}</p>
        </div>
      </div>

      {/* Automated Integrity Checks */}
      <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Hasil Verifikasi Struktur Kurikulum
        </h2>
        <div className="space-y-3">
          {health.checks.map((check) => (
            <div
              key={check.name}
              className="flex items-start justify-between gap-4 p-3 rounded bg-slate-900/60 border border-slate-800 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-white">{check.name}</span>
                {check.message && <p className="text-slate-400">{check.message}</p>}
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
                  check.passed
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {check.passed ? "LULUS" : "GAGAL"}
              </span>
            </div>
          ))}
        </div>

        {health.issues.length > 0 && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1">
            <p className="font-semibold">Isu Terdeteksi:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {health.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Learning Paths Table */}
      <div className="rounded-lg bg-[#080d1a] border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Daftar Jalur Pembelajaran Terdaftar</h2>
          <span className="text-xs text-slate-400">Database & Registry Sinkron</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3">Urutan</th>
                <th scope="col" className="px-4 py-3">Jalur Pembelajaran</th>
                <th scope="col" className="px-4 py-3">Modul</th>
                <th scope="col" className="px-4 py-3">Pelajaran</th>
                <th scope="col" className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {dbPaths.map((p) => {
                const totalLessons = p.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                return (
                  <tr key={p.id} className="hover:bg-slate-850/50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      #{p.orderIndex + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{p.title}</div>
                      <div className="text-xs font-mono text-slate-400">{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-300">
                      {p.modules.length} Modul
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-300">
                      {totalLessons} Pelajaran
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Dipublikasikan
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-900/40 border-t border-slate-800 text-xs text-slate-400">
          Definisi kurikulum dikelola melalui source code berversi (<code>src/features/learning/content/registry.ts</code>). Modifikasi kurikulum secara langsung di web dinonaktifkan demi integritas pembelajaran.
        </div>
      </div>
    </div>
  );
}
