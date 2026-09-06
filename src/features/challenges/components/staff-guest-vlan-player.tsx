"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { INTER_VLAN_OPTIONS } from "@/features/learning/practice/switching/vlan-repair";

interface StaffGuestVlanPlayerProps {
  isPathFinal?: boolean;
}

export function StaffGuestVlanPlayer({
  isPathFinal = false,
}: StaffGuestVlanPlayerProps) {
  const [port2Vlan, setPort2Vlan] = useState<number>(20); // Default buggy state: 20
  const [allowedVlans, setAllowedVlans] = useState<number[]>([10]); // Default buggy state: only 10
  const [selectedReason, setSelectedReason] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    passed?: boolean;
    score?: number;
    maxScore?: number;
    feedback?: string[];
    criteriaResults?: Array<{
      id: string;
      title: string;
      passed: boolean;
      score: number;
      maxScore: number;
      feedback: string;
    }>;
    unmetOutcomes?: string[];
    xpResult?: { awarded: boolean; amount: number; totalXp: number } | null;
    error?: string;
    completedLessons?: number;
    totalLessons?: number;
  } | null>(null);

  const toggleAllowedVlan = (vlanId: number) => {
    setAllowedVlans((prev) =>
      prev.includes(vlanId)
        ? prev.filter((id) => id !== vlanId)
        : [...prev, vlanId].sort((a, b) => a - b)
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: "staff-guest-vlan-repair",
          switch2Port2Vlan: port2Vlan,
          trunkAllowedVlans: allowedVlans,
          interVlanReasonOption: selectedReason,
          isPathFinal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({
          error: data.error || "Gagal mengirim jawaban evaluasi.",
          completedLessons: data.completedLessons,
          totalLessons: data.totalLessons,
        });
      } else {
        setResult(data);
      }
    } catch {
      setResult({
        error: "Terjadi kesalahan jaringan saat mengirimkan jawaban.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenario Briefing */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isPathFinal
                ? "Ujian Akhir Kelulusan Path 3 (Switching & LAN)"
                : "Capstone Troubleshooting Challenge"}
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              Investigasi Misassignment Port & Trunk Allowed VLAN Mismatch
            </h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Passing Grade: 70 / 100
          </span>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          Gedung sekolah dua lantai menggunakan dua switch terkelola (Switch 1 di Lantai 1 dan Switch 2 di Lantai 2) yang dihubungkan melalui kabel trunk pada port <strong>Fa0/24</strong>. Jaringan dibagi menjadi dua segmen: <strong>VLAN 10 (Staff/Guru - 192.168.10.0/24)</strong> dan <strong>VLAN 20 (Siswa/Tamu - 192.168.20.0/24)</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
          <div>
            <span className="font-bold text-gray-900 dark:text-white block mb-1">
              Topologi Switch 1 (Lantai 1):
            </span>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Port Fa0/1: Server Staff (192.168.10.2) — VLAN 10 (Access)</li>
              <li>• Port Fa0/3: Laptop Tamu 1 (192.168.20.21) — VLAN 20 (Access)</li>
              <li>• Port Fa0/24: Uplink Trunk ke Switch 2 (Allowed VLAN saat ini: 10)</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white block mb-1">
              Topologi Switch 2 (Lantai 2):
            </span>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Port Fa0/2: PC Staff 2 (192.168.10.12) — Salah Port: VLAN 20 (Access)</li>
              <li>• Port Fa0/8: Hotspot Gateway Tamu (192.168.20.1) — VLAN 20 (Access)</li>
              <li>• Port Fa0/24: Downlink Trunk ke Switch 1</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
          Tindakan Perbaikan & Analisis Teknisi
        </h2>

        {/* Action 1: Fix Switch 2 Port 2 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900 dark:text-white block">
            1. Perbaikan Port Access PC Staff 2 di Switch 2 (Port Fa0/2):
          </label>
          <p className="text-xs text-gray-500">
            Pilih VLAN ID yang benar agar PC Staff 2 dapat berkomunikasi satu broadcast domain dengan Server Staff di Switch 1:
          </p>
          <select
            value={port2Vlan}
            onChange={(e) => setPort2Vlan(Number(e.target.value))}
            className="w-full sm:w-64 px-3 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value={1}>VLAN 1 (Default)</option>
            <option value={10}>VLAN 10 (Staff / Guru)</option>
            <option value={20}>VLAN 20 (Siswa / Tamu)</option>
            <option value={30}>VLAN 30 (Manajemen)</option>
          </select>
        </div>

        {/* Action 2: Fix Trunk Allowed List */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900 dark:text-white block">
            2. Konfigurasi Allowed VLAN pada Trunk Link Antar-Switch (Port Fa0/24):
          </label>
          <p className="text-xs text-gray-500">
            Centang seluruh nomor VLAN yang harus diizinkan melintasi kabel trunk antar-lantai:
          </p>
          <div className="flex flex-wrap gap-3">
            {[10, 20, 30, 99].map((vlanId) => (
              <label
                key={vlanId}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-colors ${
                  allowedVlans.includes(vlanId)
                    ? "border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={allowedVlans.includes(vlanId)}
                  onChange={() => toggleAllowedVlan(vlanId)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>VLAN {vlanId}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action 3: Inter-VLAN Understanding Analysis */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900 dark:text-white block">
            3. Pertanyaan Analisis: Mengapa PC Staff (VLAN 10) tetap tidak bisa ping ke Laptop Tamu (VLAN 20) setelah perbaikan port dan trunk?
          </label>
          <div className="space-y-2">
            {INTER_VLAN_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start space-x-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  selectedReason === opt.id
                    ? "border-blue-600 bg-blue-50/70 text-blue-950 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-700 font-medium"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                }`}
              >
                <input
                  type="radio"
                  name="interVlanReason"
                  value={opt.id}
                  checked={selectedReason === opt.id}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedReason}
            className="px-6 py-2.5 text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center space-x-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {loading
                ? "Memverifikasi Konfigurasi..."
                : isPathFinal
                ? "Kirim Ujian Akhir Path 3"
                : "Kirim Solusi Tantangan"}
            </span>
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div
          className={`p-6 rounded-2xl border ${
            result.error
              ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200"
              : result.passed
              ? "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-950 dark:text-green-200"
              : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200"
          } space-y-4`}
        >
          {result.error ? (
            <div>
              <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
                Pengiriman Ditolak
              </h3>
              <p className="text-xs mt-1 text-red-700 dark:text-red-300">
                {result.error}
              </p>
              {result.completedLessons !== undefined &&
                result.totalLessons !== undefined && (
                  <p className="text-xs font-bold mt-2">
                    Progres Anda: {result.completedLessons} dari{" "}
                    {result.totalLessons} materi terselesaikan.
                  </p>
                )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold">
                    {result.passed
                      ? "Evaluasi LULUS! Tantangan Berhasil Diselesaikan"
                      : "Evaluasi Belum Lulus"}
                  </h3>
                  <p className="text-xs opacity-80 mt-0.5">
                    Skor Anda: <strong>{result.score}</strong> / {result.maxScore}
                  </p>
                </div>
                {result.xpResult?.awarded && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-200">
                    +{result.xpResult.amount} XP Didapatkan!
                  </span>
                )}
              </div>

              {/* Criteria Breakdown */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  Rincian Penilaian Kriteria:
                </span>
                {result.criteriaResults?.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-white/60 dark:bg-black/30 border border-black/5 dark:border-white/5 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{c.title}</span>
                      <span
                        className={`font-mono font-bold ${
                          c.passed
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {c.score} / {c.maxScore} Poin
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90">{c.feedback}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
