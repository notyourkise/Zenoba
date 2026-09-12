import * as React from "react";
import Link from "next/link";

export const metadata = {
  title: "Akses & Riwayat Paket — Developer Netloka",
};

export default async function DeveloperAccessPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Akses & Riwayat Paket
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Tata kelola hak akses kursus, entitlement paket, dan audit rekonsiliasi transaksi.
        </p>
      </div>

      {/* Sprint 36 Elevation Notice Card */}
      <div className="p-6 rounded-lg bg-[#080d1a] border border-blue-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Manajemen Hak Akses & Entitlement
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Sprint 36 Terencana
          </span>
        </div>

        <p className="text-sm text-slate-300">
          Saat ini portal developer berada dalam mode <strong>read-only operasional</strong>. Fitur mutasi hak akses (pemberian atau pencabutan paket manual) akan diimplementasikan pada <strong>Sprint 36</strong> dengan kontrol keamanan ketat:
        </p>

        <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 pl-2">
          <li>
            <strong>Sesi Elevasi:</strong> Pengembang wajib melakukan re-autentikasi kata sandi dan verifikasi TOTP 2FA untuk mendapatkan sesi elevasi berdurasi 10 menit.
          </li>
          <li>
            <strong>Alasan Wajib (Written Reason):</strong> Setiap penyesuaian hak akses wajib menyertakan alasan tertulis yang dicatat secara permanen di tabel audit log.
          </li>
          <li>
            <strong>Integritas Data Transaksi:</strong> Penyesuaian manual tidak akan pernah memanipulasi, menyunting, atau menghapus riwayat pesanan (orders) historis.
          </li>
        </ul>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Ingin memeriksa riwayat paket atau pesanan pengguna tertentu?
          </span>
          <Link
            href="/developer/users"
            className="px-3 py-1.5 rounded text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buka Direktori Pengguna &rarr;
          </Link>
        </div>
      </div>

      {/* Principles Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-2">
          <h3 className="text-sm font-semibold text-white">Internal Learner Access</h3>
          <p className="text-xs text-slate-400">
            Akun <code>INTERNAL_LEARNER</code> secara otomatis memperoleh hak akses penuh ke seluruh katalog pembelajaran tanpa membuat entri transaksi palsu.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-2">
          <h3 className="text-sm font-semibold text-white">Pemisahan Status Entitlement</h3>
          <p className="text-xs text-slate-400">
            Status akses paket membedakan dengan tegas antara status <code>ACTIVE</code> dan <code>REVOKED</code> untuk mencegah grant yang tidak terkelola.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-2">
          <h3 className="text-sm font-semibold text-white">Immutable Audit Trail</h3>
          <p className="text-xs text-slate-400">
            Seluruh data kepemilikan kursus dan transaksi pesanan tersimpan secara terstruktur tanpa kemampuan mutasi sepihak melalui antarmuka web.
          </p>
        </div>
      </div>
    </div>
  );
}
