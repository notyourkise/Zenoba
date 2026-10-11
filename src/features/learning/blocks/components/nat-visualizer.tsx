"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck, Laptop, Server, HardDrive } from "lucide-react";

export function NatVisualizer() {
  const [selectedFlow, setSelectedFlow] = useState<number>(0);

  const natEntries = [
    {
      id: "entry-1",
      device: "PC Klien 1",
      insideLocal: "192.168.1.10:51234",
      insideGlobal: "203.0.113.5:10001",
      outsideGlobal: "142.250.190.46:443 (Google)",
      protocol: "TCP",
    },
    {
      id: "entry-2",
      device: "PC Klien 2",
      insideLocal: "192.168.1.20:49812",
      insideGlobal: "203.0.113.5:10002",
      outsideGlobal: "103.20.5.10:443 (Zenoba)",
      protocol: "TCP",
    },
    {
      id: "entry-3",
      device: "Smartphone",
      insideLocal: "192.168.1.35:60111",
      insideGlobal: "203.0.113.5:10003",
      outsideGlobal: "1.1.1.1:53 (Cloudflare DNS)",
      protocol: "UDP",
    },
  ];

  const current = natEntries[selectedFlow];

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Interactive NAT / PAT (Port Address Translation) Table</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Pilih perangkat di bawah untuk melihat bagaimana Router mentranslasikan IP Privat lokal (Inside Local) ke IP Publik tunggal (Inside Global) dengan nomor port unik:
      </p>

      {/* Device Selector */}
      <div className="flex flex-wrap gap-2">
        {natEntries.map((entry, idx) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSelectedFlow(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFlow === idx
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            {entry.device}
          </button>
        ))}
      </div>

      {/* Visual Translation Flow */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-1">
          <Laptop className="w-6 h-6 mx-auto text-blue-600" />
          <span className="text-xs font-bold block">{current.device}</span>
          <span className="text-[10px] font-mono text-gray-500 block">
            Inside Local: {current.insideLocal}
          </span>
        </div>

        <ArrowRight className="w-5 h-5 text-gray-400 hidden sm:block animate-pulse" />

        <div className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-400 shadow-sm space-y-1">
          <HardDrive className="w-6 h-6 mx-auto text-indigo-600" />
          <span className="text-xs font-bold block text-blue-900 dark:text-blue-200">
            Router NAT Gateway
          </span>
          <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 block font-bold">
            Translated: {current.insideGlobal}
          </span>
        </div>

        <ArrowRight className="w-5 h-5 text-gray-400 hidden sm:block animate-pulse" />

        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-1">
          <Server className="w-6 h-6 mx-auto text-green-600" />
          <span className="text-xs font-bold block">Target Internet Server</span>
          <span className="text-[10px] font-mono text-gray-500 block">
            {current.outsideGlobal}
          </span>
        </div>
      </div>

      {/* NAT Translation Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-mono">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-3">Protocol</th>
              <th className="p-3">Inside Local (IP:Port Asli)</th>
              <th className="p-3">Inside Global (IP Publik:Port NAT)</th>
              <th className="p-3">Outside Global (Target Internet)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {natEntries.map((e, idx) => (
              <tr
                key={e.id}
                className={idx === selectedFlow ? "bg-blue-50/80 dark:bg-blue-950/60 font-bold" : ""}
              >
                <td className="p-3">{e.protocol}</td>
                <td className="p-3 text-blue-600 dark:text-blue-400">{e.insideLocal}</td>
                <td className="p-3 text-indigo-600 dark:text-indigo-400">{e.insideGlobal}</td>
                <td className="p-3 text-green-600 dark:text-green-400">{e.outsideGlobal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
