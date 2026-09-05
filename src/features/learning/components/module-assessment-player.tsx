"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  createInitialLibraryState,
  toggleLinkStatus,
  toggleIspUplink,
  executePrintTest,
  isDirectLinkConnected,
  LibraryTopologyState,
} from "../practice/connectivity/domain";
import type { PublicFinalConceptQuestion } from "../content/public-projection";
import type { ModuleFinalSubmissionResponse } from "../assessment/service";

// Map outcomes to lesson slugs for remedial recommendations
const OUTCOME_TO_LESSON_MAP: Record<string, { slug: string; title: string }> = {
  "WN-M1": { slug: "intro-to-networking", title: "Pelajaran 1: Apa Itu Jaringan Komputer?" },
  "WN-L1-A": { slug: "intro-to-networking", title: "Pelajaran 1: Apa Itu Jaringan Komputer?" },
  "WN-L1-B": { slug: "intro-to-networking", title: "Pelajaran 1: Apa Itu Jaringan Komputer?" },
  "WN-M2": { slug: "everyday-networks", title: "Pelajaran 2: Perangkat Jaringan di Sekitar Kita" },
  "WN-L2-A": { slug: "everyday-networks", title: "Pelajaran 2: Perangkat Jaringan di Sekitar Kita" },
  "WN-L2-B": { slug: "everyday-networks", title: "Pelajaran 2: Perangkat Jaringan di Sekitar Kita" },
  "WN-M3": { slug: "sharing-network-resources", title: "Pelajaran 3: Berbagi Sumber Daya dalam Jaringan" },
  "WN-L3-A": { slug: "sharing-network-resources", title: "Pelajaran 3: Berbagi Sumber Daya dalam Jaringan" },
  "WN-L3-B": { slug: "sharing-network-resources", title: "Pelajaran 3: Berbagi Sumber Daya dalam Jaringan" },
  "WN-M4": { slug: "simple-network-communication", title: "Pelajaran 4: Bagaimana Perangkat Saling Berbicara?" },
  "WN-L4-A": { slug: "simple-network-communication", title: "Pelajaran 4: Bagaimana Perangkat Saling Berbicara?" },
  "WN-L4-B": { slug: "simple-network-communication", title: "Pelajaran 4: Bagaimana Perangkat Saling Berbicara?" },
};

interface ModuleAssessmentPlayerProps {
  moduleId: string;
  moduleTitle: string;
  pathSlug: string;
  moduleSlug: string;
  questions: PublicFinalConceptQuestion[];
  initialAlreadyPassed?: boolean;
}

export function ModuleAssessmentPlayer({
  moduleId,
  moduleTitle,
  pathSlug,
  moduleSlug,
  questions,
  initialAlreadyPassed = false,
}: ModuleAssessmentPlayerProps) {
  const [stage, setStage] = useState<"briefing" | "testing" | "result">("briefing");
  const [conceptAnswers, setConceptAnswers] = useState<Record<string, string>>({});
  const [practicalState, setPracticalState] = useState<LibraryTopologyState>(createInitialLibraryState());
  const [practicalLog, setPracticalLog] = useState<string>(
    "Kondisi awal: PC-Sirkulasi kabel lepas. Uplink ISP sedang padam."
  );

  const [submitting, setSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [result, setResult] = useState<ModuleFinalSubmissionResponse | null>(null);
  const [requestId, setRequestId] = useState<string>(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `req-mod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );

  // Concept selection
  const handleSelectOption = (questionId: string, optionId: string) => {
    setConceptAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Practical interactions
  const handleTogglePc2Cable = () => {
    const isConn = isDirectLinkConnected(practicalState.links, "pc-sirkulasi", "switch-perpus");
    const next = toggleLinkStatus(practicalState, "pc-sirkulasi", "switch-perpus");
    setPracticalState(next);
    setPracticalLog(
      !isConn
        ? "Kabel cabang PC-Sirkulasi telah ditancapkan ke port switch perpustakaan."
        : "Kabel cabang PC-Sirkulasi dicabut dari switch perpustakaan."
    );
  };

  const handleToggleIsp = () => {
    const next = toggleIspUplink(practicalState);
    setPracticalState(next);
    setPracticalLog(
      next.ispUplinkConnected
        ? "Uplink ISP disambungkan (Online). Perhatian: Verifikasi P03 mensyaratkan pembuktian cetak saat offline!"
        : "Uplink ISP diputus (Offline). Mode uji ketahanan layanan lokal aktif."
    );
  };

  const handlePrintTest = (client: "pc-katalog" | "pc-sirkulasi") => {
    const { newState, reason } = executePrintTest(practicalState, client, "printer-barcode");
    setPracticalState(newState);
    setPracticalLog(reason);
  };

  const allConceptAnswered =
    questions.length > 0 && questions.every((q) => Boolean(conceptAnswers[q.id]));

  const handleSubmit = async () => {
    setSubmitting(true);
    setNetworkError(null);

    try {
      const res = await fetch("/api/learning/assessment/module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          conceptAnswers,
          practicalState,
          requestId,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Gagal memproses evaluasi akhir modul.");
      }

      setResult(data);
      setStage("result");
    } catch (err) {
      setNetworkError(
        err instanceof Error ? err.message : "Terjadi kendala jaringan saat mengirim jawaban."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setRequestId(
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `req-mod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    );
    setConceptAnswers({});
    setPracticalState(createInitialLibraryState());
    setPracticalLog("Simulasi di-reset ke kondisi awal.");
    setResult(null);
    setNetworkError(null);
    setStage("testing");
  };

  // ---------------------------------------------------------------------------
  // Stage 1: Briefing
  // ---------------------------------------------------------------------------
  if (stage === "briefing") {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-6">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Evaluasi Akhir Modul
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
              {moduleTitle}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              Ujian ini menguji penguasaan konsep dasar jaringan serta keterampilan praktik diagnosis konektivitas lokal Anda.
            </p>
          </div>

          {initialAlreadyPassed && (
            <div className="p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 text-xs">
              <strong>Status:</strong> Anda telah lulus ujian akhir modul ini sebelumnya. Anda dapat mengulanginya kembali untuk menguji ulang pemahaman Anda tanpa mereset reward kelulusan.
            </div>
          )}

          {/* Passing Criteria Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 text-xs space-y-1.5">
              <div className="font-bold text-blue-900 dark:text-blue-300">Bagian 1: Ujian Konsep</div>
              <p className="text-gray-600 dark:text-gray-300">
                10 butir soal pilihan ganda menelusuri pemahaman perangkat, media, peran client-server, dan alur request-response.
              </p>
              <div className="font-semibold text-blue-700 dark:text-blue-400 pt-1">
                Ambang Batas: Min. 8 dari 10 soal benar (80%)
              </div>
            </div>

            <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 text-xs space-y-1.5">
              <div className="font-bold text-indigo-900 dark:text-indigo-300">Bagian 2: Praktik Konektivitas Lab</div>
              <p className="text-gray-600 dark:text-gray-300">
                Simulasi jaringan perpustakaan: isolasi kabel cabang rusak dan verifikasi layanan cetak lokal tanpa akses Internet.
              </p>
              <div className="font-semibold text-indigo-700 dark:text-indigo-400 pt-1">
                Ambang Batas: 3 dari 3 kriteria wajib lulus (100%)
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link
              href={`/learn/${pathSlug}`}
              className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Kembali ke Modul
            </Link>

            <button
              type="button"
              onClick={() => setStage("testing")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
            >
              Mulai Ujian Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Stage 3: Result
  // ---------------------------------------------------------------------------
  if (stage === "result" && result) {
    const isPassed = result.passed;

    // Collect remedial lesson recommendations from unmet outcomes
    const remedialLessons = Array.from(
      new Set(
        result.unmetOutcomes
          .map((code) => OUTCOME_TO_LESSON_MAP[code])
          .filter(Boolean)
      )
    );

    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <div
          className={`p-8 rounded-2xl border shadow-sm space-y-6 ${
            isPassed
              ? "border-green-200 dark:border-green-900/60 bg-white dark:bg-gray-800"
              : "border-amber-200 dark:border-amber-900/60 bg-white dark:bg-gray-800"
          }`}
        >
          {/* Result Header */}
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isPassed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
              }`}
            >
              Hasil Evaluasi Akhir Modul
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
              {isPassed ? "Selamat! Anda Lulus Evaluasi Modul" : "Belum Memenuhi Syarat Kelulusan"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
              {result.feedback}
            </p>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-xs space-y-1">
              <div className="text-gray-500 dark:text-gray-400">Skor Teori Konsep:</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">
                {result.conceptScore} / {result.conceptMax}
              </div>
              <div
                className={`font-semibold text-[11px] ${
                  result.conceptPassed ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.conceptPassed ? "Lulus Ambang Batas (>= 8/10)" : "Gagal: Butuh minimal 8 benar"}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-xs space-y-1">
              <div className="text-gray-500 dark:text-gray-400">Kriteria Praktik Lab:</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">
                {result.practicalResults.filter((r) => r.passed).length} / {result.practicalResults.length}
              </div>
              <div
                className={`font-semibold text-[11px] ${
                  result.practicalPassed ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.practicalPassed ? "3/3 Kriteria Terpenuhi" : "Gagal: Wajib 3/3 kriteria"}
              </div>
            </div>
          </div>

          {/* Practical Criteria Breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Rincian Kriteria Praktik
            </h3>
            <div className="space-y-2 text-xs">
              {result.practicalResults.map((crit) => (
                <div
                  key={crit.id}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                    crit.passed
                      ? "border-green-200 dark:border-green-900/60 bg-green-50/40 dark:bg-green-950/20 text-green-900 dark:text-green-200"
                      : "border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                  }`}
                >
                  <div>
                    <div className="font-bold">
                      [{crit.id}] {crit.title}
                    </div>
                    <p className="text-[11px] opacity-90 mt-0.5">{crit.reason}</p>
                  </div>
                  <span className="font-bold text-[11px] flex-shrink-0">
                    {crit.passed ? "LULUS" : "GAGAL"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Remedial Guidance if Failed */}
          {!isPassed && remedialLessons.length > 0 && (
            <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 text-xs space-y-3">
              <div className="font-bold text-amber-900 dark:text-amber-200">
                Rekomendasi Materi Remedial
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Berdasarkan capaian yang belum tuntas ({result.unmetOutcomes.join(", ")}), kami menyarankan Anda mengulas kembali materi berikut sebelum mencoba lagi:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-amber-900 dark:text-amber-200">
                {remedialLessons.map((les) => (
                  <li key={les.slug}>
                    <Link
                      href={`/learn/${pathSlug}/${moduleSlug}/${les.slug}`}
                      className="underline font-semibold hover:text-amber-950 dark:hover:text-white"
                    >
                      {les.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link
              href={`/learn/${pathSlug}`}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Kembali ke Modul
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="px-5 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Ulangi Ujian Akhir
              </button>

              {isPassed && (
                <Link
                  href={`/learn/${pathSlug}`}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors"
                >
                  Selesai & Lanjutkan Jalur
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Stage 2: Testing (Questions + Practical Simulator)
  // ---------------------------------------------------------------------------
  const isPc2Connected = isDirectLinkConnected(practicalState.links, "pc-sirkulasi", "switch-perpus");

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Test Title Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Lembar Ujian Akhir
          </span>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">
            {moduleTitle}
          </h1>
        </div>
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          Terjawab: {Object.keys(conceptAnswers).length} / {questions.length} Soal Konsep
        </div>
      </div>

      {networkError && (
        <div className="p-4 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs">
          {networkError}
        </div>
      )}

      {/* Part 1: Concept Questions */}
      <section aria-label="Bagian 1 Soal Konsep" className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
            Bagian 1: Soal Pemahaman Konsep (10 Butir)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Pilih satu jawaban yang paling tepat untuk masing-masing pertanyaan berikut.
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                  {q.question}
                </div>
              </div>

              <div className="space-y-2 pt-1 pl-9">
                {q.options.map((opt) => {
                  const isSelected = conceptAnswers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-semibold"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => handleSelectOption(q.id, opt.id)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Part 2: Practical Connectivity Simulator */}
      <section aria-label="Bagian 2 Praktik Konektivitas" className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
            Bagian 2: Praktik Konektivitas Lab Perpustakaan
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Selesaikan skenario troubleshooting: perbaiki koneksi yang gagal dan verifikasi komunikasi lokal dalam kondisi Internet padam.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-5">
          {/* Topology Node Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-green-200 dark:border-green-900/60 bg-green-50/50 dark:bg-green-950/20 text-xs">
              <div className="font-bold text-green-900 dark:text-green-300">PC-Katalog</div>
              <div className="text-[11px] text-green-700 dark:text-green-400 mt-0.5">
                Kabel LAN: <strong>Tersambung</strong>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border text-xs transition-colors ${
                isPc2Connected
                  ? "border-green-200 dark:border-green-900/60 bg-green-50/50 dark:bg-green-950/20"
                  : "border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20"
              }`}
            >
              <div
                className={`font-bold ${
                  isPc2Connected ? "text-green-900 dark:text-green-300" : "text-red-900 dark:text-red-300"
                }`}
              >
                PC-Sirkulasi
              </div>
              <div
                className={`text-[11px] mt-0.5 ${
                  isPc2Connected ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                }`}
              >
                Kabel LAN: <strong>{isPc2Connected ? "Tersambung" : "Lepas / Rusak"}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-xs">
              <div className="font-bold text-blue-900 dark:text-blue-300">Printer-Barcode</div>
              <div className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                Kabel LAN: <strong>Tersambung ke Switch</strong>
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              practicalState.ispUplinkConnected
                ? "border-green-200 bg-green-50/50 dark:bg-green-950/20 text-green-900 dark:text-green-300"
                : "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300"
            }`}
          >
            <div>
              <strong>Uplink Internet ISP:</strong>{" "}
              {practicalState.ispUplinkConnected ? "Online" : "Offline / Padam"}
            </div>
            <button
              type="button"
              onClick={handleToggleIsp}
              className="text-xs underline font-semibold"
            >
              {practicalState.ispUplinkConnected ? "Putus Jalur ISP" : "Sambungkan ISP"}
            </button>
          </div>

          {/* Action Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleTogglePc2Cable}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
                isPc2Connected ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPc2Connected ? "Cabut Kabel PC-Sirkulasi" : "Pasang Kabel PC-Sirkulasi"}
            </button>

            <button
              type="button"
              onClick={() => handlePrintTest("pc-katalog")}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 transition-colors"
            >
              Uji Cetak PC-Katalog
            </button>

            <button
              type="button"
              onClick={() => handlePrintTest("pc-sirkulasi")}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 transition-colors"
            >
              Uji Cetak PC-Sirkulasi
            </button>
          </div>

          {/* Activity Log Output */}
          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-xs font-mono text-gray-800 dark:text-gray-300 leading-relaxed">
            {practicalLog}
          </div>
        </div>
      </section>

      {/* Bottom Submit Bar */}
      <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-gray-500">
          Pastikan 10 soal konsep telah terjawab dan simulasi praktik telah diverifikasi.
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allConceptAnswered || submitting}
          className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 shadow-sm rounded-xl transition-colors flex-shrink-0"
        >
          {submitting ? "Memproses Evaluasi..." : "Kirim Jawaban Ujian Akhir"}
        </button>
      </div>
    </div>
  );
}
