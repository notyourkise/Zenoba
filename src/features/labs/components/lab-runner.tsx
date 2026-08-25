"use client";

import React, { useState } from "react";
import { CheckCircle2, RotateCcw, Award, Play, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { SubnetCalculator } from "@/features/learning/blocks/components/subnet-calculator";
import { VlanBuilder } from "@/features/learning/blocks/components/vlan-builder";
import { RoutingTableVisualizer } from "@/features/learning/blocks/components/routing-table-visualizer";
import { TerminalBlockPlayer } from "@/features/learning/blocks/components/terminal-block-player";

export interface LabDef {
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  instructions: string[];
  xpReward: number;
}

export function LabRunner({ lab }: { lab: LabDef }) {
  const [activeTab, setActiveTab] = useState<"instructions" | "workbench">("workbench");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    feedback: string[];
    xpResult?: { awarded: boolean; amount: number; totalXp: number } | null;
  } | null>(null);

  // Form states for various lab types
  const [subnetState] = useState({
    ip: "192.168.1.130",
    prefix: 26,
    networkAddress: "192.168.1.128",
    broadcastAddress: "192.168.1.191",
    usableHosts: 62,
  });

  const [ipConfigState, setIpConfigState] = useState({
    pcIp: "192.168.10.15",
    subnetMask: "255.255.255.0",
    gateway: "192.168.10.1",
  });

  const [routingState] = useState({
    destination: "0.0.0.0",
    prefix: 0,
    nextHop: "192.168.1.254",
  });

  const handleSubmit = async () => {
    setLoading(true);
    let payloadState: Record<string, unknown> = { completed: true };

    if (lab.slug === "subnetting-calculator") payloadState = subnetState;
    if (lab.slug === "ip-configuration") payloadState = ipConfigState;
    if (lab.slug === "static-routing") payloadState = routingState;

    try {
      const res = await fetch(`/api/labs/${lab.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: payloadState }),
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
    setResult(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Interactive Lab • +{lab.xpReward} XP • {lab.difficulty}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lab.title}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {lab.description}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1.5 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("workbench")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "workbench"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Workbench Lab
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("instructions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "instructions"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Petunjuk ({lab.instructions.length})
          </button>
        </div>
      </div>

      {/* Instructions Tab Content */}
      {activeTab === "instructions" ? (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Petunjuk Pelaksanaan Lab:
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-xs text-gray-700 dark:text-gray-300">
            {lab.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      ) : (
        /* Workbench Tab Content */
        <div className="space-y-6">
          {lab.slug === "subnetting-calculator" && <SubnetCalculator />}
          {lab.slug === "vlan-segmentation" && <VlanBuilder />}
          {lab.slug === "static-routing" && <RoutingTableVisualizer />}
          {lab.slug === "troubleshooting" && <TerminalBlockPlayer />}

          {/* Form for IP Configuration Lab */}
          {lab.slug === "ip-configuration" && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Konfigurasi Adapter IPv4 PC Klien:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">IPv4 Address:</label>
                  <input
                    type="text"
                    value={ipConfigState.pcIp}
                    onChange={(e) => setIpConfigState((prev) => ({ ...prev, pcIp: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Subnet Mask:</label>
                  <input
                    type="text"
                    value={ipConfigState.subnetMask}
                    onChange={(e) => setIpConfigState((prev) => ({ ...prev, subnetMask: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Default Gateway:</label>
                  <input
                    type="text"
                    value={ipConfigState.gateway}
                    onChange={(e) => setIpConfigState((prev) => ({ ...prev, gateway: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Validation Result Banner */}
          {result && (
            <div
              className={`p-6 rounded-2xl border space-y-2.5 ${
                result.passed
                  ? "bg-green-50/80 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200"
                  : "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-base">
                <div className="flex items-center space-x-2">
                  {result.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  )}
                  <span>{result.passed ? "Konfigurasi Lab Lulus!" : "Konfigurasi Belum Tepat"}</span>
                </div>
                <span>Skor: {result.score} / 100</span>
              </div>

              <ul className="list-disc pl-5 space-y-1 text-xs opacity-90">
                {result.feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              {result.xpResult?.awarded && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-full text-xs font-bold mt-1">
                  <Sparkles className="w-4 h-4 text-green-700" />
                  <span>+{result.xpResult.amount} XP Ditambahkan ke Akun! Total: {result.xpResult.totalXp} XP</span>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Lab
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-md transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memvalidasi...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Validasi & Kumpulkan Lab
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
