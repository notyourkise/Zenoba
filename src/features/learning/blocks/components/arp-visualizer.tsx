"use client";

import React, { useState } from "react";
import { Laptop, HardDrive, ArrowRight, Play, RotateCcw, CheckCircle2 } from "lucide-react";

export function ArpVisualizer() {
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      title: "1. PC-A Ingin Mengirim Data ke PC-B",
      desc: "PC-A (192.168.1.10) mengetahui IP tujuan PC-B (192.168.1.20), namun belum mengetahui MAC Address fisiknya.",
      broadcast: false,
      arpTableUpdated: false,
    },
    {
      title: "2. ARP Request (Broadcast FF:FF:FF:FF:FF:FF)",
      desc: "PC-A mengirim paket ARP Request ke Switch: 'Siapa pemilik IP 192.168.1.20? Beri tahu 192.168.1.10'. Switch menyebarkannya ke semua port.",
      broadcast: true,
      arpTableUpdated: false,
    },
    {
      title: "3. PC-B Merespons dengan ARP Reply (Unicast)",
      desc: "PC-C mengabaikan paket karena IP tidak cocok. PC-B merespons langsung ke MAC PC-A: 'Saya pemilik 192.168.1.20, MAC saya 00:BB:CC:DD:EE:20'.",
      broadcast: false,
      arpTableUpdated: false,
    },
    {
      title: "4. ARP Table PC-A & Switch Terupdate",
      desc: "PC-A menyimpan pemetaan IP-ke-MAC di ARP Cache-nya. Komunikasi data selanjutnya langsung berformat Unicast.",
      broadcast: false,
      arpTableUpdated: true,
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
          <span>Interactive ARP (Address Resolution Protocol) Simulator</span>
        </div>
        <span className="text-xs text-gray-500 font-semibold">
          Langkah {step + 1} dari {steps.length}
        </span>
      </div>

      {/* Visual Network Stage */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center space-y-6">
        <div className="p-3 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-md">
          <HardDrive className="w-4 h-4" />
          <span>Central Switch (Port 1, 2, 3)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* PC-A */}
          <div className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-blue-400 text-center text-xs space-y-1 shadow-sm">
            <Laptop className="w-6 h-6 mx-auto text-blue-600 mb-1" />
            <span className="font-bold block text-gray-900 dark:text-white">PC-A (Pengirim)</span>
            <span className="text-[10px] text-gray-500 font-mono block">192.168.1.10</span>
            <span className="text-[10px] text-gray-400 font-mono block">MAC: 00:AA..10</span>
          </div>

          {/* PC-B */}
          <div
            className={`p-3.5 bg-white dark:bg-gray-800 rounded-xl border text-center text-xs space-y-1 transition-all ${
              step >= 2 ? "border-green-400 shadow-sm" : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <Laptop className="w-6 h-6 mx-auto text-green-600 mb-1" />
            <span className="font-bold block text-gray-900 dark:text-white">PC-B (Target)</span>
            <span className="text-[10px] text-gray-500 font-mono block">192.168.1.20</span>
            <span className="text-[10px] text-gray-400 font-mono block">MAC: 00:BB..20</span>
          </div>

          {/* PC-C */}
          <div className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center text-xs space-y-1 opacity-70">
            <Laptop className="w-6 h-6 mx-auto text-gray-400 mb-1" />
            <span className="font-bold block text-gray-900 dark:text-white">PC-C (Lainnya)</span>
            <span className="text-[10px] text-gray-500 font-mono block">192.168.1.30</span>
            <span className="text-[10px] text-gray-400 font-mono block">MAC: 00:CC..30</span>
          </div>
        </div>
      </div>

      {/* ARP Table Preview */}
      {current.arpTableUpdated && (
        <div className="p-4 bg-green-50/70 dark:bg-green-950/40 rounded-xl border border-green-200 dark:border-green-900/60 text-xs space-y-2">
          <span className="font-bold text-green-900 dark:text-green-200 flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Tabel ARP Cache PC-A (Hasil Resolusi):</span>
          </span>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-green-200">
            <div>IP Address: 192.168.1.20</div>
            <div>Physical (MAC): 00:BB:CC:DD:EE:20 [Dynamic]</div>
          </div>
        </div>
      )}

      {/* Explanation & Controls */}
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
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex-shrink-0"
        >
          {step === steps.length - 1 ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
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
