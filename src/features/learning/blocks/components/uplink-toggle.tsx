"use client";

import React, { useState } from "react";
import type { LessonBlock } from "../schema";

interface UplinkToggleProps {
  block: LessonBlock & {
    config?: {
      scenario?: string;
      instruction?: string;
    };
  };
  lessonId?: string;
}

export function UplinkToggle({ block }: UplinkToggleProps) {
  const [ispConnected, setIspConnected] = useState(false); // Initially disconnected to demonstrate local survival
  const [activeLog, setActiveLog] = useState<string>(
    "Kondisi: Uplink ISP sedang padam. Router lokal tetap menyala melayani Wi-Fi dan LAN rumah."
  );

  const handleTestPrint = () => {
    setActiveLog(
      "Uji Cetak Lokal: SUKSES! Laptop berhasil mengirim data dokumen langsung ke printer Wi-Fi di jaringan lokal yang sama. Komunikasi lokal TIDAK memerlukan koneksi Internet luar."
    );
  };

  const handleTestInternet = () => {
    if (ispConnected) {
      setActiveLog(
        "Uji Akses Internet: SUKSES! Paket data diteruskan melalui router keluar menuju ISP untuk membuka website eksternal."
      );
    } else {
      setActiveLog(
        "Uji Akses Internet: GAGAL (Koneksi Terputus). Sinyal Wi-Fi penuh, namun router tidak memiliki jalur keluar ke ISP. Layanan Internet padam, tetapi layanan lokal tetap aman."
      );
    }
  };

  return (
    <div className="my-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-5">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Aktivitas Interaktif: Uplink ISP vs Jaringan Lokal
        </span>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
          {block.config?.instruction ||
            "Putus jalur ISP Uplink. Amati bahwa laptop tetap berhasil mencetak ke printer lokal di LAN yang sama."}
        </p>
      </div>

      {/* Network Nodes Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-xs">
          <div className="font-bold text-blue-800 dark:text-blue-300">Laptop Klien</div>
          <div className="text-[11px] text-blue-700/80 dark:text-blue-400/80 mt-1">
            Koneksi Wi-Fi: <strong>Terhubung ke Router (Sinyal Penuh)</strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-green-200 dark:border-green-900/60 bg-green-50/50 dark:bg-green-950/20 text-xs">
          <div className="font-bold text-green-800 dark:text-green-300">Printer Wi-Fi Lokal</div>
          <div className="text-[11px] text-green-700/80 dark:text-green-400/80 mt-1">
            Status LAN: <strong>Siap Mencetak (LAN Lokal)</strong>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border text-xs transition-colors ${
            ispConnected
              ? "border-green-200 dark:border-green-900/60 bg-green-50/50 dark:bg-green-950/20"
              : "border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20"
          }`}
        >
          <div
            className={`font-bold ${
              ispConnected
                ? "text-green-800 dark:text-green-300"
                : "text-amber-800 dark:text-amber-300"
            }`}
          >
            Kabel Uplink ISP (Internet)
          </div>
          <div
            className={`text-[11px] mt-1 ${
              ispConnected
                ? "text-green-700/80 dark:text-green-400/80"
                : "text-amber-700/80 dark:text-amber-400/80"
            }`}
          >
            Status: <strong>{ispConnected ? "Tersambung (Online)" : "Padam / Terputus (Offline)"}</strong>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleTestPrint}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
        >
          Uji Cetak Dokumen (Lokal)
        </button>
        <button
          type="button"
          onClick={handleTestInternet}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
        >
          Uji Buka Website Internet
        </button>
        <button
          type="button"
          onClick={() => {
            setIspConnected(!ispConnected);
            setActiveLog(
              !ispConnected
                ? "Kabel ISP telah disambungkan kembali. Layanan internet aktif."
                : "Kabel ISP diputus. Hanya layanan lokal yang dapat diakses."
            );
          }}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
            ispConnected
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {ispConnected ? "Simulasikan ISP Gangguan" : "Pulihkan Sambungan ISP"}
        </button>
      </div>

      {/* Log Output */}
      <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-xs font-mono text-gray-800 dark:text-gray-300 leading-relaxed">
        {activeLog}
      </div>
    </div>
  );
}
