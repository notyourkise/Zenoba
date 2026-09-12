import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDeveloperUserDetail,
  getDeveloperUserPackageHistory,
} from "@/features/developer/users/queries";

export const metadata = {
  title: "Detail Pengguna — Developer Netloka",
};

export default async function DeveloperUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const [user, packageHistory] = await Promise.all([
    getDeveloperUserDetail(userId),
    getDeveloperUserPackageHistory(userId),
  ]);

  if (!user) {
    notFound();
  }

  const entitlements = packageHistory?.entitlements ?? [];
  const orders = packageHistory?.orders ?? [];

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div>
        <Link
          href="/developer/users"
          className="text-xs font-medium text-slate-400 hover:text-white inline-flex items-center gap-1 transition"
        >
          &larr; Kembali ke Direktori Pengguna
        </Link>
      </div>

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Detail Pengguna
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {user.id}</p>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold ${
              user.role === "DEVELOPER"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : user.role === "INTERNAL_LEARNER"
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}
          >
            Peran: {user.role}
          </span>
        </div>
      </div>

      {/* User Information Panel */}
      <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Informasi Akun
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">Nama Lengkap</span>
            <span className="font-medium text-white">{user.name || "—"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Alamat Email</span>
            <span className="font-mono text-slate-200">{user.email}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Headline</span>
            <span className="text-slate-300">{user.headline || "—"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Status 2FA</span>
            <span className="font-medium text-slate-200">
              {user.twoFactorEnabled ? "Aktif" : "Belum Aktif"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Auth Version</span>
            <span className="font-mono text-slate-300">{user.authVersion}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Tanggal Terdaftar</span>
            <span className="text-slate-300">
              {new Date(user.createdAt).toLocaleString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
          Privasi Kredensial: Seluruh rahasia autentikasi (hash kata sandi, token sesi, dan kode rahasia 2FA) diproteksi dan tidak dimuat dalam read model.
        </div>
      </div>

      {/* Learning Progress Panel */}
      <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Ringkasan Progres Pembelajaran
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Pelajaran Selesai</span>
            <span className="text-xl font-bold text-white">
              {user.progressSummary.completedLessonsCount}
            </span>
          </div>
          <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Total Pengalaman</span>
            <span className="text-xl font-bold text-blue-400">
              {user.progressSummary.totalXp} XP
            </span>
          </div>
          <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Streak Belajar</span>
            <span className="text-xl font-bold text-amber-400">
              {user.streakCount} Hari
            </span>
          </div>
          <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Aktivitas Terakhir</span>
            <span className="text-xs font-medium text-slate-300 block mt-1">
              {user.lastActiveAt
                ? new Date(user.lastActiveAt).toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Belum ada"}
            </span>
          </div>
        </div>
      </div>

      {/* Packages & Entitlements Panel */}
      <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Hak Akses & Entitlement Paket
          </h2>
          <span className="text-xs text-slate-400">
            Total: {entitlements.length} Hak Akses
          </span>
        </div>

        {entitlements.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">
            Pengguna belum memiliki catatan hak akses paket kursus.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-3 py-2">Kursus</th>
                  <th scope="col" className="px-3 py-2">Status</th>
                  <th scope="col" className="px-3 py-2">Sumber</th>
                  <th scope="col" className="px-3 py-2">Diberikan Pada</th>
                  <th scope="col" className="px-3 py-2">Dicabut Pada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {entitlements.map((ent) => (
                  <tr key={ent.id} className="hover:bg-slate-850/50">
                    <td className="px-3 py-2 font-sans font-medium text-white">
                      {ent.courseTitle}
                      <div className="text-[10px] text-slate-400 font-mono">{ent.courseId}</div>
                    </td>
                    <td className="px-3 py-2 font-sans">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          ent.state === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {ent.state}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-400">{ent.sourceType}</td>
                    <td className="px-3 py-2 text-slate-300">
                      {new Date(ent.grantedAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-3 py-2 text-slate-400">
                      {ent.revokedAt ? new Date(ent.revokedAt).toLocaleDateString("id-ID") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders Panel */}
      <div className="p-6 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Riwayat Pesanan Historis
          </h2>
          <span className="text-xs text-slate-400">
            Total: {orders.length} Pesanan
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">
            Belum ada riwayat transaksi pesanan untuk pengguna ini.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-3 py-2">ID Pesanan</th>
                  <th scope="col" className="px-3 py-2">Paket</th>
                  <th scope="col" className="px-3 py-2">Nominal</th>
                  <th scope="col" className="px-3 py-2">Status</th>
                  <th scope="col" className="px-3 py-2">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-850/50">
                    <td className="px-3 py-2 text-slate-200">{order.id}</td>
                    <td className="px-3 py-2 font-sans text-slate-300">
                      {order.packageTitle || "Standar"}
                      <div className="text-[10px] text-slate-400 font-mono">{order.packageId}</div>
                    </td>
                    <td className="px-3 py-2 text-emerald-400 font-semibold">
                      Rp {order.totalAmountIdr.toLocaleString("id-ID")}
                    </td>
                    <td className="px-3 py-2 font-sans">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {order.state}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
          Integritas Audit: Data pesanan bersifat immutable untuk menjamin rekonsiliasi keuangan. Penyesuaian hak akses manual di masa mendatang tidak akan mengubah catatan pesanan historis.
        </div>
      </div>
    </div>
  );
}
