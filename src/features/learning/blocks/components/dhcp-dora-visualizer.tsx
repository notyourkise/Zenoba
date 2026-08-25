"use client";

import React, { useState } from "react";
import { Server, Laptop, ArrowRight, Play, RotateCcw } from "lucide-react";

export function DhcpDoraVisualizer() {
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      stage: "D — DHCP Discover",
      direction: "Client -> Broadcast (255.255.255.255)",
      packet: "UDP Port 67 (DHCP Server)",
      desc: "Klien baru bergabung ke jaringan tanpa alamat IP. Klien menyiarkan paket broadcast 'Discover' ke seluruh subnet untuk mencari DHCP Server yang tersedia.",
      activeClient: true,
      activeServer: false,
    },
    {
      stage: "O — DHCP Offer",
      direction: "DHCP Server -> Client (Unicast / Broadcast)",
      packet: "UDP Port 68 (DHCP Client)",
      desc: "DHCP Server merespons dengan menawarkan IP (misal: 192.168.1.105), Subnet Mask 255.255.255.0, Default Gateway 192.168.1.1, dan DNS Server 1.1.1.1 beserta waktu sewa (Lease Time).",
      activeClient: false,
      activeServer: true,
    },
    {
      stage: "R — DHCP Request",
      direction: "Client -> Broadcast (255.255.255.255)",
      packet: "UDP Port 67",
      desc: "Klien menerima tawaran dan menyiarkan pesan 'Request' untuk mengonfirmasi bahwa ia memilih IP dari server tersebut secara resmi.",
      activeClient: true,
      activeServer: false,
    },
    {
      stage: "A — DHCP Acknowledge (ACK)",
      direction: "DHCP Server -> Client",
      packet: "UDP Port 68 (Selesai)",
      desc: "DHCP Server mengirimkan paket ACK final. Klien resmi mengonfigurasi IP 192.168.1.105 pada interface jaringannya dan siap berkomunikasi.",
      activeClient: true,
      activeServer: true,
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    setStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Play className="w-4 h-4" />
          <span>Interactive DHCP DORA Flow Simulator</span>
        </div>
        <span className="text-xs font-bold text-gray-500">
          Tahap {step + 1} dari 4: {current.stage.split(" — ")[0]}
        </span>
      </div>

      {/* DORA Steps Progress Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {["1. Discover", "2. Offer", "3. Request", "4. ACK"].map((name, idx) => (
          <button
            key={name}
            type="button"
            onClick={() => setStep(idx)}
            className={`p-2 rounded-xl text-center text-xs font-bold transition-all border ${
              step === idx
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : idx < step
                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 text-blue-700 dark:text-blue-300"
                : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Animation Stage */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* Client */}
        <div
          className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
            current.activeClient
              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md scale-105"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
          }`}
        >
          <Laptop className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold">DHCP Client (PC)</span>
          <span className="text-[10px] font-mono text-gray-500">
            {step === 3 ? "IP: 192.168.1.105" : "IP: 0.0.0.0 (Unassigned)"}
          </span>
        </div>

        {/* Packet Information */}
        <div className="text-center space-y-1">
          <div className="inline-block px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
            {current.stage}
          </div>
          <span className="text-[11px] text-gray-500 block font-mono">
            {current.direction}
          </span>
        </div>

        {/* DHCP Server */}
        <div
          className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
            current.activeServer
              ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-md scale-105"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
          }`}
        >
          <Server className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold">DHCP Server (Router)</span>
          <span className="text-[10px] font-mono text-gray-500">IP: 192.168.1.1</span>
        </div>
      </div>

      {/* Explanation & Next Step */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          {current.desc}
        </p>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex-shrink-0"
        >
          {step === 3 ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Ulangi DORA
            </>
          ) : (
            <>
              Tahap Selanjutnya
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
