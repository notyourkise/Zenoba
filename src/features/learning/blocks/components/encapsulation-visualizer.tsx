"use client";

import React, { useState } from "react";
import { ArrowDown, ArrowUp, Box } from "lucide-react";

export function EncapsulationVisualizer() {
  const [direction, setDirection] = useState<"encapsulation" | "decapsulation">("encapsulation");
  const [stepIndex, setStepIndex] = useState<number>(0);

  const steps = [
    {
      layer: "Application (Layer 7-5)",
      pdu: "User Data",
      header: "Data Payload",
      explanation: "Aplikasi (seperti browser) menghasilkan payload data asli (contoh: teks HTML/JSON).",
    },
    {
      layer: "Transport (Layer 4)",
      pdu: "Segment",
      header: "[TCP Header (Port 80/443)] + Data",
      explanation: "Header TCP ditambahkan berisi Port Sumber & Port Tujuan serta nomor urut (Sequence).",
    },
    {
      layer: "Network (Layer 3)",
      pdu: "Packet",
      header: "[IP Header (Source & Dest IP)] + Segment",
      explanation: "Header IP ditambahkan berisi IP Pengirim & IP Tujuan untuk routing global.",
    },
    {
      layer: "Data Link (Layer 2)",
      pdu: "Frame",
      header: "[Ethernet Header (MAC)] + Packet + [FCS Trailer]",
      explanation: "Header Ethernet (MAC Address) dan Trailer FCS (Error Checking) membungkus paket menjadi Frame.",
    },
    {
      layer: "Physical (Layer 1)",
      pdu: "Bits (01010110)",
      header: "Sinyal Elektrik / Optik / Radio",
      explanation: "Seluruh frame dikonversi menjadi bit-bit biner dan ditransmisikan melalui kabel/udara.",
    },
  ];

  const current = steps[stepIndex];

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Box className="w-4 h-4" />
          <span>Interactive Packet Encapsulation & Decapsulation</span>
        </div>

        {/* Direction Switcher */}
        <div className="flex items-center space-x-1.5 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setDirection("encapsulation");
              setStepIndex(0);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
              direction === "encapsulation"
                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5 mr-1" />
            Enkapsulasi (Kirim)
          </button>
          <button
            type="button"
            onClick={() => {
              setDirection("decapsulation");
              setStepIndex(4);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
              direction === "decapsulation"
                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5 mr-1" />
            Dekapsulasi (Terima)
          </button>
        </div>
      </div>

      {/* Visual Header Box Stack */}
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 text-center space-y-3">
        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
          PDU Struktur: {current.pdu}
        </span>
        <div className="p-4 bg-gray-800 rounded-lg font-mono text-xs text-blue-300 font-bold border border-blue-500/40">
          {current.header}
        </div>
      </div>

      {/* Explanation Box */}
      <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-1">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
          {current.layer}
        </h4>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          {current.explanation}
        </p>
      </div>

      {/* Step Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-gray-500 font-semibold">
          Langkah {stepIndex + 1} dari {steps.length}
        </span>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => setStepIndex((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
