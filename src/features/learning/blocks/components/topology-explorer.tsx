"use client";

import React, { useState } from "react";
import { Network, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

export type TopologyType = "star" | "bus" | "ring" | "mesh";

interface NodeItem {
  id: string;
  label: string;
  active: boolean;
}

export function TopologyExplorer() {
  const [selectedTopology, setSelectedTopology] = useState<TopologyType>("star");
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: "node-1", label: "PC 1", active: true },
    { id: "node-2", label: "PC 2", active: true },
    { id: "node-3", label: "PC 3", active: true },
    { id: "node-4", label: "Server", active: true },
  ]);

  const toggleNode = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n))
    );
  };

  const getTopologyInsight = () => {
    const inactiveCount = nodes.filter((n) => !n.active).length;

    switch (selectedTopology) {
      case "star":
        return {
          title: "Topologi Star (Bintang)",
          description:
            "Semua node terhubung ke titik pusat (Switch). Jika satu kabel PC putus, node lain tetap dapat berkomunikasi.",
          resilience: inactiveCount === 0 ? "Normal" : "Toleransi Kesalahan Baik",
          color: "text-blue-600 dark:text-blue-400",
        };
      case "bus":
        return {
          title: "Topologi Bus",
          description:
            "Semua node berbagi satu kabel backbone utama dengan terminator di ujungnya. Jika kabel backbone terputus, seluruh jaringan akan lumpuh.",
          resilience: inactiveCount > 0 ? "Rawan Gangguan" : "Rentan Single Point of Failure",
          color: "text-amber-600 dark:text-amber-400",
        };
      case "ring":
        return {
          title: "Topologi Ring (Cincin)",
          description:
            "Data mengalir satu arah dalam lingkaran tertutup. Jika satu node mati tanpa mekanisme redundant ring, transmisi token terhenti.",
          resilience: inactiveCount > 0 ? "Aliran Terputus" : "Sensitif Terhadap Titik Mati",
          color: "text-purple-600 dark:text-purple-400",
        };
      case "mesh":
        return {
          title: "Topologi Full Mesh",
          description:
            "Setiap node terhubung langsung ke semua node lain. Memberikan redundansi tertinggi meskipun membutuhkan banyak kabel/port.",
          resilience: "Redundansi Maksimal",
          color: "text-green-600 dark:text-green-400",
        };
    }
  };

  const insight = getTopologyInsight();

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Network className="w-4 h-4" />
          <span>Interactive Topology Explorer</span>
        </div>

        {/* Topology Selector Tabs */}
        <div className="flex items-center space-x-1.5 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl">
          {(["star", "bus", "ring", "mesh"] as TopologyType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTopology(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                selectedTopology === t
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Topology Visual Stage */}
      <div className="p-8 bg-gray-50 dark:bg-gray-900/80 rounded-xl border border-gray-200/80 dark:border-gray-800 text-center relative overflow-hidden">
        {selectedTopology === "star" && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="p-4 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">
              Central Switch (L2)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => toggleNode(node.id)}
                  className={`p-3 rounded-xl border transition-all text-xs font-semibold ${
                    node.active
                      ? "bg-white dark:bg-gray-800 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 shadow-sm"
                      : "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 opacity-60 line-through"
                  }`}
                >
                  <Activity className="w-4 h-4 mx-auto mb-1" />
                  {node.label}
                  <span className="block text-[10px] mt-0.5 font-normal">
                    {node.active ? "Online" : "Down"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTopology === "bus" && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="h-2 bg-amber-500 rounded-full w-full relative">
              <span className="absolute -top-5 left-0 text-[10px] text-gray-500 font-mono">Terminator</span>
              <span className="absolute -top-5 right-0 text-[10px] text-gray-500 font-mono">Terminator</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => toggleNode(node.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    node.active
                      ? "bg-white dark:bg-gray-800 border-amber-300 text-gray-800 dark:text-gray-200"
                      : "bg-red-50 dark:bg-red-950/40 border-red-300 text-red-600 opacity-60 line-through"
                  }`}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTopology === "ring" && (
          <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto py-2">
            {nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => toggleNode(node.id)}
                className={`p-4 rounded-full border text-xs font-bold transition-all ${
                  node.active
                    ? "bg-purple-50 dark:bg-purple-950/50 border-purple-300 text-purple-700 dark:text-purple-300"
                    : "bg-red-50 dark:bg-red-950/40 border-red-300 text-red-600 line-through opacity-60"
                }`}
              >
                {node.label}
              </button>
            ))}
          </div>
        )}

        {selectedTopology === "mesh" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto py-2">
            {nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => toggleNode(node.id)}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                  node.active
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    : "bg-red-50 dark:bg-red-950/40 border-red-300 text-red-600 opacity-60 line-through"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                {node.label}
              </button>
            ))}
          </div>
        )}

        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-4">
          💡 Klik pada masing-masing node untuk mensimulasikan kegagalan kabel/node.
        </p>
      </div>

      {/* Dynamic Topology Explanation */}
      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 space-y-1.5">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-4 h-4 ${insight.color}`} />
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            {insight.title} — Status: {insight.resilience}
          </h4>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          {insight.description}
        </p>
      </div>
    </div>
  );
}
