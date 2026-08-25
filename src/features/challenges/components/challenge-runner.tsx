"use client";

import React, { useState } from "react";
import { TerminalBlockPlayer } from "@/features/learning/blocks/components/terminal-block-player";
import { ShieldAlert, CheckCircle2, AlertCircle, HelpCircle, Sparkles, Loader2, RotateCcw } from "lucide-react";

export interface ChallengeDef {
  slug: string;
  title: string;
  difficulty: string;
  description: string;
  scenario: string;
  symptoms: string[];
  options: { id: string; label: string }[];
  xpReward: number;
}

export function ChallengeRunner({ challenge }: { challenge: ChallengeDef }) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    rootCauseFeedback: string;
    explanation: string;
    xpResult?: { awarded: boolean; amount: number; totalXp: number } | null;
  } | null>(null);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/challenges/${challenge.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission: { selectedRootCause: selectedOption },
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedOption("");
    setResult(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Challenge Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Diagnostic Challenge • +{challenge.xpReward} XP • {challenge.difficulty}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {challenge.title}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {challenge.description}
          </p>
        </div>
      </div>

      {/* Scenario & Symptoms Banner */}
      <div className="p-6 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-3">
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Skenario Insiden:</span>
        </h3>
        <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          {challenge.scenario}
        </p>

        <div className="pt-2">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-1">
            Gejala & Laporan Pengguna:
          </span>
          <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900/80 dark:text-amber-200/80">
            {challenge.symptoms.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Diagnostic Sandbox Terminal */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Workbench Investigasi CLI:
        </h3>
        <TerminalBlockPlayer />
      </div>

      {/* Root Cause Hypothesis Form */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          Berdasarkan hasil investigasi Anda, apa akar penyebab (Root Cause) insiden ini?
        </h3>

        <div className="space-y-2.5">
          {challenge.options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedOption === opt.id
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-bold shadow-sm"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="rootCause"
                value={opt.id}
                checked={selectedOption === opt.id}
                onChange={() => setSelectedOption(opt.id)}
                className="mt-0.5 mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs leading-relaxed">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Result & Explanation Banner */}
      {result && (
        <div
          className={`p-6 rounded-2xl border space-y-3 ${
            result.passed
              ? "bg-green-50/80 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200"
              : "bg-red-50/80 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200"
          }`}
        >
          <div className="flex items-center justify-between font-bold text-base">
            <div className="flex items-center space-x-2">
              {result.passed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <span>{result.passed ? "Investigasi Berhasil!" : "Investigasi Belum Tepat"}</span>
            </div>
            <span>Skor: {result.score} / 150</span>
          </div>

          <p className="text-xs font-semibold">{result.rootCauseFeedback}</p>
          <p className="text-xs opacity-90 leading-relaxed border-t border-current/10 pt-2">
            <strong>Penjelasan Teknis:</strong> {result.explanation}
          </p>

          {result.xpResult?.awarded && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-full text-xs font-bold mt-1">
              <Sparkles className="w-4 h-4 text-green-700" />
              <span>+{result.xpResult.amount} XP Ditambahkan ke Akun! Total: {result.xpResult.totalXp} XP</span>
            </div>
          )}
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Pilihan
        </button>

        <button
          type="button"
          disabled={!selectedOption || loading}
          onClick={handleSubmit}
          className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-md transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menganalisis...
            </>
          ) : (
            <>Kumpulkan Diagnosis Tantangan</>
          )}
        </button>
      </div>
    </div>
  );
}
