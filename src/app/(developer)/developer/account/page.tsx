import * as React from "react";
import { requireDeveloperActor } from "@/features/authorization/guards";

export const metadata = {
  title: "Akun Pengembang — Developer Netloka",
};

export default async function DeveloperAccountPage() {
  const actor = await requireDeveloperActor();

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Akun Pengembang
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detail identitas sesi pengembang yang sedang aktif, status keamanan akun, dan batasan wewenang.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Identitas Pengembang Aktif
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">Nama Lengkap</span>
            <span className="font-medium text-white">{actor.name || "—"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Alamat Email</span>
            <span className="font-mono text-slate-200">{actor.email}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Peran Sistem</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {actor.role}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Otentikasi Dua Faktor (2FA)</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                actor.twoFactorEnabled
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {actor.twoFactorEnabled ? "Aktif" : "Belum Aktif"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Auth Version</span>
            <span className="font-mono text-slate-300">{actor.authVersion}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">ID Pengguna</span>
            <span className="font-mono text-xs text-slate-400">{actor.id}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
          Akun pengembang diprovisikan secara khusus melalui VPS CLI dengan pencatatan wewenang resmi. Registrasi publik otomatis diarahkan sebagai peran LEARNER biasa.
        </div>
      </div>

      {/* Session Posture Card */}
      <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Status & Batasan Sesi
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 rounded bg-slate-900/60 border border-slate-800 text-xs">
            <div>
              <span className="font-semibold text-white">Mode Sesi Saat Ini</span>
              <p className="text-slate-400">Read-Only Operasional</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              STANDAR
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-slate-900/60 border border-slate-800 text-xs">
            <div>
              <span className="font-semibold text-white">Sesi Elevasi Administratif</span>
              <p className="text-slate-400">Dibutuhkan untuk mutasi paket pada Sprint 36</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
              TIDAK AKTIF
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
          Sesi aktif dilindungi oleh validasi database-authoritative pada setiap navigasi. Jika sesi dibatalkan pada VPS, hak akses web langsung berakhir seketika.
        </div>
      </div>
    </div>
  );
}
