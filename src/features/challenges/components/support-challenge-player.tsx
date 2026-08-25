"use client";

import React, { useState } from "react";
import { CheckCircle2, Award, ShieldAlert, Sparkles, Loader2 } from "lucide-react";

export function SupportChallengePlayer() {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [topology, setTopology] = useState<string>("star");
  const [troubleshoot, setTroubleshoot] = useState<string>("check_layer1_cable");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    maxScore?: number;
    feedback: string[];
    xpResult?: { awarded: boolean; amount: number; totalXp: number } | null;
  } | null>(null);

  const inventoryOptions = [
    { id: "router-1", label: "Gigabit Enterprise Router (Layer 3)", recommended: true },
    { id: "switch-1", label: "24-Port Gigabit Managed Switch (Layer 2)", recommended: true },
    { id: "ap-1", label: "Dual-Band Wi-Fi 6 Access Point", recommended: true },
    { id: "cable-cat6", label: "Kabel UTP Cat6 1000BASE-T", recommended: true },
    { id: "hub-legacy", label: "8-Port Legacy Hub (Layer 1 - Usang)", recommended: false },
    { id: "coaxial-cable", label: "Kabel Koaksial 10BASE2 (Usang)", recommended: false },
  ];

  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: "first-day-it-support",
          selectedDeviceIds: selectedDevices,
          topologyChoice: topology,
          troubleshootAnswer: troubleshoot,
        }),
      });

      const data = await res.json();
      setResult(data);
      setSubmitted(true);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
          <Award className="w-4 h-4" />
          <span>Milestone 3 Capstone Challenge • +100 XP</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Skenario: Hari Pertama Sebagai Staf IT Support
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Anda baru saja bergabung di sebuah kantor cabang yang membutuhkan setup jaringan LAN baru untuk 10 komputer staf dan 1 file server. Selesaikan 3 misi di bawah ini:
        </p>
      </div>

      {/* Mission 1: Inventory Procurement */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs flex items-center justify-center mr-2">1</span>
          Pilih Inventaris Perangkat yang Tepat
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {inventoryOptions.map((item) => {
            const isSelected = selectedDevices.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleDevice(item.id)}
                className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
                    isSelected ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mission 2: Topology Choice */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs flex items-center justify-center mr-2">2</span>
          Pilih Susunan Topologi Fisik
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "star", title: "Topologi Star (Bintang)", desc: "Semua PC terhubung ke Switch pusat" },
            { id: "bus", title: "Topologi Bus", desc: "Berbagi 1 kabel utama panjang" },
            { id: "ring", title: "Topologi Ring", desc: "Lingkaran tertutup antar PC" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopology(t.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                topology === t.id
                  ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <h4 className="font-bold text-xs">{t.title}</h4>
              <p className="text-[11px] opacity-80 mt-1">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mission 3: Troubleshooting Scenario */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs flex items-center justify-center mr-2">3</span>
          Studi Kasus Troubleshooting: PC Marketing Tidak Bisa Konek
        </h3>
        <div className="space-y-2">
          {[
            {
              id: "check_layer1_cable",
              label: "1. Periksa lampu LED indikator Link pada port NIC PC dan pastikan kabel UTP terpasang sempurna (Layer 1).",
            },
            {
              id: "reinstall_os",
              label: "2. Langsung melakukan install ulang sistem operasi Windows tanpa mengecek kabel fisik.",
            },
            {
              id: "restart_router",
              label: "3. Me-restart router utama gedung sehingga memutus koneksi semua staf lain.",
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTroubleshoot(opt.id)}
              className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                troubleshoot === opt.id
                  ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {submitted && result && (
        <div
          className={`p-6 rounded-2xl border space-y-3 ${
            result.passed
              ? "bg-green-50/80 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200"
              : "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-base">
              {result.passed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              )}
              <span>{result.passed ? "Tantangan Berhasil Diselesaikan!" : "Skor Belum Mencapai Syarat Kelulusan"}</span>
            </div>
            <span className="font-extrabold text-lg">Skor: {result.score} / {result.maxScore}</span>
          </div>

          <ul className="list-disc pl-5 space-y-1 text-xs opacity-90">
            {result.feedback.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          {result.xpResult?.awarded && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-full text-xs font-bold mt-2">
              <Sparkles className="w-4 h-4 text-green-700" />
              <span>Reward: +{result.xpResult.amount} XP Ditambahkan ke Buku Besar! Total XP: {result.xpResult.totalXp} XP</span>
            </div>
          )}
        </div>
      )}

      {/* Submit Action */}
      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          disabled={loading || selectedDevices.length === 0}
          onClick={handleSubmit}
          className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-md transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Mengevaluasi...
            </>
          ) : (
            "Kirim Solusi Tantangan"
          )}
        </button>
      </div>
    </div>
  );
}
