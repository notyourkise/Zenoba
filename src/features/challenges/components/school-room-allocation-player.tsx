"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  SCHOOL_ROOM_REQUIREMENTS,
  RoomAllocationInput,
} from "@/features/learning/practice/ipv4/room-allocation";

interface SchoolRoomAllocationPlayerProps {
  isPathFinal?: boolean;
}

export function SchoolRoomAllocationPlayer({ isPathFinal = false }: SchoolRoomAllocationPlayerProps) {
  const [allocations, setAllocations] = useState<RoomAllocationInput[]>(
    SCHOOL_ROOM_REQUIREMENTS.map((r) => ({
      roomId: r.id,
      roomName: r.name,
      requiredHosts: r.minHosts,
      prefix: 24,
      networkAddress: "",
      gateway: "",
      broadcastAddress: "",
    }))
  );

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    passed?: boolean;
    score?: number;
    maxScore?: number;
    feedback?: string[];
    criteriaResults?: Array<{
      id: string;
      title: string;
      passed: boolean;
      feedback: string;
    }>;
    unmetOutcomes?: string[];
    roomDetails?: Array<{
      roomId: string;
      roomName: string;
      passed: boolean;
      errors: string[];
      capacity: number;
    }>;
    xpResult?: { awarded: boolean; amount: number; totalXp: number } | null;
    error?: string;
    completedLessons?: number;
    totalLessons?: number;
  } | null>(null);

  const updateRoom = (roomId: string, field: keyof RoomAllocationInput, value: string | number) => {
    setAllocations((prev) =>
      prev.map((r) => (r.roomId === roomId ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: "school-room-allocation",
          allocations,
          isPathFinal,
        }),
      });

      const data = await res.json();
      setResult(data);
      setSubmitted(true);
    } catch {
      setResult({ error: "Gagal mengirim jawaban. Periksa koneksi jaringan Anda." });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setResult(null);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Path 2 Capstone Challenge • Alokasi Subnetting VLSM
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">
            Desain Pembagian Subnet Multi-Ruangan SMK TKJ
          </h2>
        </div>
        <div className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-full font-bold text-blue-700 dark:text-blue-300 self-start sm:self-auto">
          Blok Induk: 192.168.10.0/24
        </div>
      </div>

      {/* Brief / Scenario */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
        <p className="font-semibold text-gray-900 dark:text-white">
          Skenario Kasus Nyata:
        </p>
        <p>
          Anda ditugaskan merancang skema pengalamatan IP untuk 5 ruangan di gedung SMK TKJ menggunakan jaringan dasar <strong>192.168.10.0/24</strong>.
          Terapkan prinsip <strong>VLSM</strong> dengan mengurutkan alokasi dari kebutuhan host terbesar ke terkecil untuk mencegah pemborosan dan menghindari tumpang tindih (<em>zero overlap</em>).
        </p>
      </div>

      {/* Prerequisite Error Barrier */}
      {result?.error && result.completedLessons !== undefined && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs space-y-2">
          <div className="font-bold">
            Prasyarat Ujian Belum Terpenuhi
          </div>
          <p>{result.error}</p>
          <div className="font-semibold">
            Progres Anda: {result.completedLessons} dari {result.totalLessons} materi selesai.
          </div>
        </div>
      )}

      {/* Form Grid */}
      <div className="space-y-4">
        {SCHOOL_ROOM_REQUIREMENTS.map((req, idx) => {
          const current = allocations.find((a) => a.roomId === req.id);
          if (!current) return null;

          return (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-200/60 dark:border-gray-700/60 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {req.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                  Kebutuhan: Min. {req.minHosts} Host
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Prefix CIDR
                  </label>
                  <select
                    value={current.prefix}
                    disabled={submitted && result?.passed}
                    onChange={(e) => updateRoom(req.id, "prefix", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {[24, 25, 26, 27, 28, 29, 30].map((p) => (
                      <option key={p} value={p}>
                        /{p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Network Address
                  </label>
                  <input
                    type="text"
                    placeholder="192.168.10.x"
                    value={current.networkAddress}
                    disabled={submitted && result?.passed}
                    onChange={(e) => updateRoom(req.id, "networkAddress", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Gateway IP (Usable Pertama)
                  </label>
                  <input
                    type="text"
                    placeholder="192.168.10.x"
                    value={current.gateway}
                    disabled={submitted && result?.passed}
                    onChange={(e) => updateRoom(req.id, "gateway", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Broadcast IP
                  </label>
                  <input
                    type="text"
                    placeholder="192.168.10.x"
                    value={current.broadcastAddress}
                    disabled={submitted && result?.passed}
                    onChange={(e) => updateRoom(req.id, "broadcastAddress", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / Reset Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          Reset Jawaban
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || (submitted && result?.passed)}
          className="inline-flex items-center px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memvalidasi Jawaban...
            </>
          ) : (
            "Kirim Solusi Subnetting"
          )}
        </button>
      </div>

      {/* Result Section */}
      {submitted && result && (
        <div
          className={`p-6 rounded-2xl border ${
            result.passed
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
              : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100"
          } space-y-4`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-1">
                {result.passed ? "Status: Lulus Evaluasi" : "Status: Belum Memenuhi Kriteria"}
              </div>
              <h3 className="text-lg font-bold">
                {result.passed
                  ? "Evaluasi Sempurna: Seluruh Kriteria VLSM Terpenuhi!"
                  : "Evaluasi Belum Memenuhi Seluruh Kriteria"}
              </h3>
              <p className="text-xs opacity-90 mt-1">
                Skor Evaluasi: {result.score} / {result.maxScore || 100}
              </p>
            </div>

            {result.xpResult?.awarded && (
              <div className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 rounded-xl text-xs font-black">
                +{result.xpResult.amount} XP Didapatkan!
              </div>
            )}
          </div>

          {/* Criteria Breakdown */}
          {result.criteriaResults && result.criteriaResults.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
              <span className="text-xs font-bold uppercase tracking-wider block">
                Rincian Evaluasi Kriteria:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {result.criteriaResults.map((crit) => (
                  <div
                    key={crit.id}
                    className={`p-2.5 rounded-lg border ${
                      crit.passed
                        ? "bg-white/80 dark:bg-gray-800/80 border-emerald-300 dark:border-emerald-700"
                        : "bg-white/80 dark:bg-gray-800/80 border-amber-300 dark:border-amber-700"
                    } space-y-1`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{crit.title}</span>
                      <span className={crit.passed ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>
                        {crit.passed ? "LULUS" : "BELUM LULUS"}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80">{crit.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
