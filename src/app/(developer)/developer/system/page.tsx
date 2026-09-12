import * as React from "react";
import { getSystemHealth } from "@/features/developer/system/health";

export const metadata = {
  title: "Kesehatan Sistem — Developer Netloka",
};

export default async function DeveloperSystemPage() {
  const health = await getSystemHealth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Kesehatan Sistem
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Status runtime Node.js, latensi PostgreSQL, alokasi memori, dan checklist variabel lingkungan.
          </p>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold ${
              health.status === "healthy"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {health.status === "healthy" ? "SISTEM SEHAT" : "SISTEM TERDEGRADASI"}
          </span>
        </div>
      </div>

      {/* Grid: Database, Runtime, Memory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Database Status */}
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Database PostgreSQL
            </h2>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                health.database.status === "healthy"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {health.database.status}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400">Latensi Koneksi</span>
            <p className="text-2xl font-mono font-bold text-white mt-0.5">
              {health.database.latencyMs !== null ? `${health.database.latencyMs} ms` : "N/A"}
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            Dicek pada: {new Date(health.timestamp).toLocaleTimeString("id-ID")}
          </p>
        </div>

        {/* Runtime Environment */}
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Runtime Node.js
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Versi Node:</span>
              <span className="font-mono text-white">{health.environment.nodeVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Platform OS:</span>
              <span className="font-mono text-white">{process.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Environment:</span>
              <span className="font-mono text-white">{health.environment.environment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Uptime:</span>
              <span className="font-mono text-white">
                {Math.floor(health.uptimeSeconds / 60)}m ({health.uptimeSeconds}s)
              </span>
            </div>
          </div>
        </div>

        {/* Memory Allocation */}
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Alokasi Memori
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">RSS (Resident Set):</span>
              <span className="font-mono text-white">{health.memory.rssMb} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Heap Total:</span>
              <span className="font-mono text-white">{health.memory.heapTotalMb} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Heap Digunakan:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {health.memory.heapUsedMb} MB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Variable Checklist */}
      <div className="rounded-lg bg-[#080d1a] border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Checklist Konfigurasi Environment</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pemeriksaan ketersediaan variabel esensial tanpa membocorkan nilai rahasia.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Secret Redacted</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3">Nama Variabel</th>
                <th scope="col" className="px-4 py-3">Status Konfigurasi</th>
                <th scope="col" className="px-4 py-3">Nilai Disamarkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {Object.entries(health.environment.variables).map(([key, val]) => (
                <tr key={key} className="hover:bg-slate-850/50">
                  <td className="px-4 py-2.5 font-bold text-white">{key}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                        val.configured
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {val.configured ? "TERKONFIGURASI" : "TIDAK TERPASANG"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px]">{val.redacted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-900/40 border-t border-slate-800 text-xs text-slate-400">
          Operasi restart server, upgrade runtime, dan modifikasi file <code>.env</code> dikelola secara langsung melalui VPS CLI demi menjaga prinsip keamanan dan isolasi portal web.
        </div>
      </div>
    </div>
  );
}
