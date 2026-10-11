import * as React from "react";

export const metadata = {
  title: "Keamanan & Postur Audit — Developer Zenoba",
};

export default async function DeveloperSecurityPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Keamanan & Postur Audit
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Arsitektur isolasi peran, perlindungan rahasia kredensial, dan kepatuhan audit sistem Zenoba.
        </p>
      </div>

      {/* Grid of Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workspace Isolation */}
        <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Isolasi Workspace</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AKTIF & TERUJI
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Pemisahan tegas antara area learner publik (<code>/dashboard</code>, <code>/learn</code>) dan area operasional (<code>/developer</code>).
          </p>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 pl-1">
            <li>Guard <code>requireDeveloperActor()</code> menolak pengguna non-developer dengan <code>403 Forbidden</code>.</li>
            <li>Guard <code>requireLearnerActor()</code> mencegah peran pengembang mengakses mutasi belajar siswa.</li>
            <li>Routing berbasis peran database-authoritative dievaluasi pada setiap request.</li>
          </ul>
        </div>

        {/* Secret Redaction */}
        <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Penghilangan Rahasia (Secret Redaction)</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              INVARIANT SISTEM
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Seluruh query dan read model pengembang dirancang dengan proyeksi aman (safe projection).
          </p>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 pl-1">
            <li>Kolom sensitif seperti <code>passwordHash</code>, <code>twoFactorSecret</code>, dan token tidak pernah diambil dari database.</li>
            <li>Nilai variabel lingkungan (connection strings, API keys) disamarkan sebagai <code>[CONFIGURED / REDACTED]</code>.</li>
            <li>Tidak ada antarmuka web yang dapat menampilkan atau mengunduh kredensial mentah.</li>
          </ul>
        </div>

        {/* Cohort Protection */}
        <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Perlindungan Kohort & Metrik</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              FILTER KOHORT
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Pencegahan polusi data pembelajaran dan bisnis oleh akun internal.
          </p>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 pl-1">
            <li>Filter <code>ORDINARY_LEARNER_FILTER</code> otomatis mengecualikan <code>INTERNAL_LEARNER</code> dan <code>DEVELOPER</code>.</li>
            <li>Metrik pertumbuhan pendaftar 7d/30d dan siswa aktif hanya mencerminkan learner publik nyata.</li>
            <li>Akun internal memiliki akses penuh kurikulum tanpa memanipulasi data konversi komersial.</li>
          </ul>
        </div>

        {/* Elevation & Audit Roadmap */}
        <div className="p-6 rounded-lg bg-[#080d1a] border border-blue-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Sesi Elevasi & Audit (Sprint 36)</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ROADMAP
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Pemberian wewenang mutasi paket dengan proteksi ganda dan jejak audit permanen.
          </p>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 pl-1">
            <li>Wajib re-autentikasi kata sandi dan kode 2FA untuk memulai sesi elevasi 10 menit.</li>
            <li>Wajib mencantumkan alasan tertulis pada setiap mutasi paket yang dicatat di tabel audit log.</li>
            <li>Data transaksi pesanan historis tetap bersifat mutlak tidak dapat diedit (immutable).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
