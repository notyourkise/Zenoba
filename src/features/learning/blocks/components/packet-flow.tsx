"use client";

import React, { useState } from "react";
import { Laptop, Server, HardDrive, ArrowRight, Play, RefreshCw } from "lucide-react";

export function PacketFlow() {
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      title: "1. Client Membuat Request",
      desc: "Browser di PC Client (192.168.1.10) membuat HTTP GET request ke Server (192.168.1.100).",
      activeNodes: ["client"],
      packetPosition: "Client",
    },
    {
      title: "2. Meneruskan ke Switch LAN",
      desc: "Frame Ethernet dikirim melalui kabel UTP ke Port 1 Switch. Switch membaca MAC Destination di tabel MAC-nya.",
      activeNodes: ["client", "switch"],
      packetPosition: "Switch Port 1 -> Port 24",
    },
    {
      title: "3. Diterima oleh Web Server",
      desc: "Frame diteruskan keluar dari Port 24 Switch langsung menuju Web Server untuk diproses aplikasinya.",
      activeNodes: ["switch", "server"],
      packetPosition: "Web Server",
    },
    {
      title: "4. Server Mengirimkan Response",
      desc: "Web Server merespons dengan kode HTTP 200 OK + data halaman web kembali ke Client.",
      activeNodes: ["server", "client"],
      packetPosition: "Client (Selesai)",
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
          <span>Interactive Packet Flow Simulator</span>
        </div>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Tahap {step + 1} dari {steps.length}
        </span>
      </div>

      {/* Animation Stage */}
      <div className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* Node 1: Client */}
        <div
          className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
            current.activeNodes.includes("client")
              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 scale-105 shadow-md"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 opacity-60"
          }`}
        >
          <Laptop className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold">PC Client</span>
          <span className="text-[10px] font-mono text-gray-500">192.168.1.10</span>
        </div>

        <ArrowRight className="w-5 h-5 text-gray-400 hidden sm:block animate-pulse" />

        {/* Node 2: Switch */}
        <div
          className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
            current.activeNodes.includes("switch")
              ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 scale-105 shadow-md"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 opacity-60"
          }`}
        >
          <HardDrive className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold">Switch LAN</span>
          <span className="text-[10px] text-gray-500">MAC Table Lookup</span>
        </div>

        <ArrowRight className="w-5 h-5 text-gray-400 hidden sm:block animate-pulse" />

        {/* Node 3: Server */}
        <div
          className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
            current.activeNodes.includes("server")
              ? "bg-green-50 dark:bg-green-950/60 border-green-400 text-green-700 dark:text-green-300 scale-105 shadow-md"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 opacity-60"
          }`}
        >
          <Server className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold">Web Server</span>
          <span className="text-[10px] font-mono text-gray-500">192.168.1.100</span>
        </div>
      </div>

      {/* Description & Step Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            {current.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {current.desc}
          </p>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
        >
          {step === steps.length - 1 ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Ulangi Simulasi
            </>
          ) : (
            <>
              Langkah Berikutnya
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
