"use client";

import React, { useState } from "react";
import type { LessonBlock } from "../schema";

interface ConnectivityToggleProps {
  block: LessonBlock & {
    interactiveType?: string;
    config?: {
      scenario?: string;
      devices?: string[];
      instruction?: string;
    };
  };
  lessonId?: string;
}

export function ConnectivityToggle({ block }: ConnectivityToggleProps) {
  const scenario = block.config?.scenario || "standalone_vs_connected";
  const isBranchScenario = scenario === "printer_branch_troubleshooting";

  // Scenario 1: Standalone vs Connected (Lesson 1)
  const [cableConnected, setCableConnected] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "failure">("idle");

  // Scenario 2: Branch Disconnect (Lesson 4)
  const [pc2CableConnected, setPc2CableConnected] = useState(false);
  const [branchLog, setBranchLog] = useState<string>(
    "Kondisi awal: Kabel PC-2 terlepas. Kabel PC-1 dan Printer normal tersambung ke switch."
  );

  const handleSendMessageL1 = () => {
    if (cableConnected) {
      setTestStatus("success");
      setTestResult(
        "SUKSES: Pesan data 'Halo dari PC-A' berhasil diterima oleh PC-B melalui media kabel jaringan!"
      );
    } else {
      setTestStatus("failure");
      setTestResult(
        "GAGAL: Tidak ada media transmisi penghubung. Kedua komputer bekerja sebagai perangkat mandiri (standalone) yang terisolasi."
      );
    }
  };

  const handleTestPrintBranch = (client: "PC-1" | "PC-2") => {
    if (client === "PC-1") {
      setBranchLog(
        "PC-1 -> Printer: SUKSES mencetak dokumen. Jalur kabel PC-1 ke switch bekerja normal."
      );
    } else {
      if (pc2CableConnected) {
        setBranchLog(
          "PC-2 -> Printer: SUKSES! Setelah kabel cabang dipasang kembali, PC-2 dapat mencetak dokumen normal."
        );
      } else {
        setBranchLog(
          "PC-2 -> Printer: GAGAL! Kabel cabang PC-2 tidak terhubung ke switch. (Ingat: Printer tidak rusak, hanya cabang PC-2 yang lepas)."
        );
      }
    }
  };

  if (isBranchScenario) {
    return (
      <div className="my-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-5">
        <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Aktivitas Interaktif: Isolasi Cabang Jaringan
          </span>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
            {block.config?.instruction ||
              "Simulasikan kabel PC-2 putus. Perhatikan bahwa PC-1 tetap dapat mencetak."}
          </p>
        </div>

        {/* Status Perangkat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-green-200 dark:border-green-900/60 bg-green-50/50 dark:bg-green-950/20 text-xs">
            <div className="font-bold text-green-800 dark:text-green-300">PC-1 (Tata Usaha)</div>
            <div className="text-[11px] text-green-700/80 dark:text-green-400/80 mt-1">
              Kabel Cabang: <strong>Tersambung (Hijau)</strong>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs transition-colors ${
              pc2CableConnected
                ? "border-green-200 dark:border-green-900/60 bg-green-50/50 dark:bg-green-950/20"
                : "border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20"
            }`}
          >
            <div
              className={`font-bold ${
                pc2CableConnected
                  ? "text-green-800 dark:text-green-300"
                  : "text-red-800 dark:text-red-300"
              }`}
            >
              PC-2 (Tata Usaha)
            </div>
            <div
              className={`text-[11px] mt-1 ${
                pc2CableConnected
                  ? "text-green-700/80 dark:text-green-400/80"
                  : "text-red-700/80 dark:text-red-400/80"
              }`}
            >
              Kabel Cabang:{" "}
              <strong>{pc2CableConnected ? "Tersambung (Hijau)" : "Lepas / Putus (Merah)"}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-xs">
            <div className="font-bold text-blue-800 dark:text-blue-300">Printer Bersama</div>
            <div className="text-[11px] text-blue-700/80 dark:text-blue-400/80 mt-1">
              Kabel Cabang: <strong>Tersambung ke Switch</strong>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => handleTestPrintBranch("PC-1")}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
          >
            Uji Cetak dari PC-1
          </button>
          <button
            type="button"
            onClick={() => handleTestPrintBranch("PC-2")}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
          >
            Uji Cetak dari PC-2
          </button>
          <button
            type="button"
            onClick={() => {
              setPc2CableConnected(!pc2CableConnected);
              setBranchLog(
                !pc2CableConnected
                  ? "Kabel cabang PC-2 berhasil ditancapkan ke port LAN switch."
                  : "Kabel cabang PC-2 dicabut dari switch."
              );
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
              pc2CableConnected
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {pc2CableConnected ? "Cabut Kabel PC-2" : "Tancapkan Kabel PC-2"}
          </button>
        </div>

        {/* Activity Log */}
        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-xs font-mono text-gray-800 dark:text-gray-300 leading-relaxed">
          {branchLog}
        </div>
      </div>
    );
  }

  // Default: Standalone vs Connected (Lesson 1)
  return (
    <div className="my-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-5">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Aktivitas Interaktif: Mandiri vs Berjaringan
        </span>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
          {block.config?.instruction ||
            "Uji sambungan kabel antara PC-A dan PC-B. Amati transmisi data hanya terjadi saat media terhubung."}
        </p>
      </div>

      {/* Visual Device & Cable Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-w-[120px]">
          <span className="text-xs font-bold text-gray-900 dark:text-white">PC-A</span>
          <div className="text-[10px] text-gray-500 mt-0.5">Pengirim</div>
        </div>

        <div className="text-center px-4">
          <div
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
              cableConnected
                ? "bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800"
            }`}
          >
            {cableConnected ? "Kabel: Connected" : "Kabel: Disconnected"}
          </div>
        </div>

        <div className="text-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-w-[120px]">
          <span className="text-xs font-bold text-gray-900 dark:text-white">PC-B</span>
          <div className="text-[10px] text-gray-500 mt-0.5">Penerima</div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setCableConnected(!cableConnected);
            setTestResult(null);
            setTestStatus("idle");
          }}
          className={`px-4 py-2 text-xs font-bold rounded-lg text-white transition-colors ${
            cableConnected
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {cableConnected ? "Putuskan Kabel" : "Sambungkan Kabel"}
        </button>

        <button
          type="button"
          onClick={handleSendMessageL1}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
        >
          Kirim Pesan Uji
        </button>
      </div>

      {/* Feedback Message */}
      {testResult && (
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
            testStatus === "success"
              ? "border-green-200 dark:border-green-900/80 bg-green-50/80 dark:bg-green-950/30 text-green-800 dark:text-green-300"
              : "border-red-200 dark:border-red-900/80 bg-red-50/80 dark:bg-red-950/30 text-red-800 dark:text-red-300"
          }`}
        >
          {testResult}
        </div>
      )}
    </div>
  );
}
