"use client";

import * as React from "react";
import Link from "next/link";

export default function DeveloperError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 text-center space-y-6">
      <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
        <span className="text-sm font-semibold">Kendala Operasional</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Gagal Memuat Data Operasional
        </h1>
        <p className="text-sm text-slate-400">
          Terjadi kendala saat membaca data dari database atau layanan internal. Untuk menjaga privasi dan keamanan sistem, detail teknis mentah tidak ditampilkan di antarmuka publik.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Coba Lagi
        </button>
        <Link
          href="/developer"
          className="px-4 py-2 rounded-md text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Kembali ke Ringkasan
        </Link>
      </div>
    </div>
  );
}
