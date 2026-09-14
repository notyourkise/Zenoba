import * as React from "react";
import Link from "next/link";
import { getDeveloperOverview } from "@/features/developer/overview/queries";

export const metadata = {
  title: "Ringkasan Operasional — Developer Netloka",
};

export default async function DeveloperOverviewPage() {
  const overview = await getDeveloperOverview();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Ringkasan Operasional
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Metrik agregat learner, status latensi database, dan integritas kurikulum Netloka.
        </p>
      </div>

      {/* Cohort & User Metrics Grid */}
      <section aria-labelledby="metrics-heading" className="space-y-4">
        <h2 id="metrics-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Kohort Pengguna & Keaktifan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-1">
            <p className="text-xs font-medium text-slate-400">Learner Publik</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {overview.ordinaryLearners.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">Akun siswa standar</p>
          </div>

          <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-1">
            <p className="text-xs font-medium text-slate-400">Internal Test Accounts</p>
            <p className="text-2xl font-bold text-amber-400 tracking-tight">
              {overview.internalLearners.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">Dikecualikan dari metrik bisnis</p>
          </div>

          <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-1">
            <p className="text-xs font-medium text-slate-400">Registrasi (7 Hari)</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {overview.newLearners7d.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">Pendaftar baru 7 hari terakhir</p>
          </div>

          <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-1">
            <p className="text-xs font-medium text-slate-400">Registrasi (30 Hari)</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {overview.newLearners30d.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">Pendaftar baru 30 hari terakhir</p>
          </div>

          <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-1">
            <p className="text-xs font-medium text-slate-400">Aktif (7 Hari)</p>
            <p className="text-2xl font-bold text-emerald-400 tracking-tight">
              {overview.activeLearners7d.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">Learner berprogres 7 hari terakhir</p>
          </div>
        </div>
      </section>

      {/* System & Curriculum Health Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Health Card */}
        <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Status Database</h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${
                overview.database.status === "healthy"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {overview.database.status === "healthy" ? "Sehat" : "Degradasi"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Latensi Database:</span>
              <span className="font-mono text-white font-medium">
                {overview.database.latencyMs !== null ? `${overview.database.latencyMs} ms` : "N/A"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Koneksi database PostgreSQL terverifikasi secara read-only. Pengukuran dilakukan dengan query ping sederhana.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/developer/system"
              className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
            >
              Buka Kesehatan Sistem &rarr;
            </Link>
          </div>
        </div>

        {/* Curriculum Health Card */}
        <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Katalog Kurikulum</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {overview.curriculum.paths} Jalur Pembelajaran
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400">Modul</p>
              <p className="text-lg font-bold text-white">{overview.curriculum.modules}</p>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400">Pelajaran</p>
              <p className="text-lg font-bold text-white">{overview.curriculum.lessons}</p>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400">Kuis</p>
              <p className="text-lg font-bold text-white">{overview.curriculum.assessments}</p>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400">Capstone</p>
              <p className="text-lg font-bold text-white">{overview.curriculum.capstones}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/developer/curriculum"
              className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
            >
              Buka Kesehatan Kurikulum &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <section aria-labelledby="shortcuts-heading" className="space-y-4">
        <h2 id="shortcuts-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Pintasan Navigasi Operasional
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/developer/users"
            className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition space-y-1 block"
          >
            <p className="text-sm font-semibold text-white">Direktori Pengguna</p>
            <p className="text-xs text-slate-400">
              Cari siswa, telusuri progres belajar, dan periksa riwayat paket individu.
            </p>
          </Link>
          <Link
            href="/developer/access"
            className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition space-y-1 block"
          >
            <p className="text-sm font-semibold text-white">Akses & Riwayat Paket</p>
            <p className="text-xs text-slate-400">
              Lihat status entitlement dan aturan sesi elevasi mutasi (Sprint 36).
            </p>
          </Link>
          <Link
            href="/developer/security"
            className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition space-y-1 block"
          >
            <p className="text-sm font-semibold text-white">Keamanan & Audit</p>
            <p className="text-xs text-slate-400">
              Pelajari isolasi workspace, proteksi secret redaction, dan guard 2FA.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
