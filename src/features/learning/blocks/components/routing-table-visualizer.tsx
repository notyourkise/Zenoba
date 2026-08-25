"use client";

import React, { useState } from "react";
import { Compass, CheckCircle2 } from "lucide-react";
import { evaluateL3Routing, SimRoute } from "@/features/network-logic/simulation/topology";

export function RoutingTableVisualizer() {
  const [testIp, setTestIp] = useState<string>("10.50.1.20");

  const sampleRoutes: SimRoute[] = [
    {
      id: "r1",
      destinationSubnet: "192.168.1.0",
      prefix: 24,
      nextHopIp: "DIRECT",
      interfaceName: "GigabitEthernet 0/0 (LAN)",
      metric: 0,
    },
    {
      id: "r2",
      destinationSubnet: "10.0.0.0",
      prefix: 8,
      nextHopIp: "192.168.1.254",
      interfaceName: "GigabitEthernet 0/0",
      metric: 1,
    },
    {
      id: "r3",
      destinationSubnet: "10.50.0.0",
      prefix: 16,
      nextHopIp: "192.168.1.250",
      interfaceName: "GigabitEthernet 0/0",
      metric: 1,
    },
    {
      id: "r4",
      destinationSubnet: "0.0.0.0",
      prefix: 0,
      nextHopIp: "203.0.113.1",
      interfaceName: "Serial 0/0/0 (WAN / Internet)",
      metric: 10,
      isDefault: true,
    },
  ];

  const evalResult = evaluateL3Routing(testIp, sampleRoutes);

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 pb-3">
        <Compass className="w-4 h-4" />
        <span>Interactive Longest Prefix Match (LPM) Routing Table Visualizer</span>
      </div>

      {/* Target IP Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
          Uji Destinasi IP Paket:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={testIp}
            onChange={(e) => setTestIp(e.target.value)}
            placeholder="misal: 10.50.1.20 atau 8.8.8.8"
            className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 font-mono text-xs outline-none"
          />
          <button
            type="button"
            onClick={() => setTestIp("8.8.8.8")}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Internet (8.8.8.8)
          </button>
          <button
            type="button"
            onClick={() => setTestIp("192.168.1.50")}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Local LAN (192.168.1.50)
          </button>
        </div>
      </div>

      {/* Routing Table Display */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-3">Destinasi Jaringan</th>
              <th className="p-3">Prefix</th>
              <th className="p-3">Next Hop Gateway</th>
              <th className="p-3">Interface Keluar</th>
              <th className="p-3">Metric</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sampleRoutes.map((r) => {
              const isMatched = evalResult.matchedRoute?.id === r.id;

              return (
                <tr
                  key={r.id}
                  className={`transition-colors ${
                    isMatched
                      ? "bg-blue-50/80 dark:bg-blue-950/60 font-bold text-blue-900 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <td className="p-3 flex items-center space-x-1.5">
                    {isMatched && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                    <span>{r.destinationSubnet}</span>
                  </td>
                  <td className="p-3">/{r.prefix}</td>
                  <td className="p-3">{r.nextHopIp}</td>
                  <td className="p-3">{r.interfaceName}</td>
                  <td className="p-3">{r.metric}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Evaluation Result Feedback */}
      <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 text-xs space-y-1">
        <span className="font-bold text-blue-900 dark:text-blue-200 block">
          Keputusan Routing: {evalResult.action}
        </span>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {evalResult.reason}
        </p>
      </div>
    </div>
  );
}
