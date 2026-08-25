"use client";

import React, { useState } from "react";
import { Globe, RotateCcw } from "lucide-react";

export function DnsQueryVisualizer() {
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      title: "1. Klien Meminta Resolusi 'netloka.biz.id'",
      resolver: "Browser / OS Cache",
      desc: "Browser memeriksa cache lokal. Jika belum ada, query DNS dikirim ke Recursive Resolver ISP (misal: 1.1.1.1 atau 8.8.8.8).",
      activeNode: "client",
    },
    {
      title: "2. Query ke Root DNS Server ('.')",
      resolver: "Root Name Server",
      desc: "Recursive Resolver bertanya ke Root DNS Server. Root Server tidak tahu IP lengkapnya, namun mengarahkan query ke TLD Server untuk domain '.id'.",
      activeNode: "root",
    },
    {
      title: "3. Query ke TLD Name Server ('.id')",
      resolver: "TLD Server (.id / PANDI)",
      desc: "TLD Server memeriksa registry '.id' dan mengarahkan resolver ke Authoritative Name Server milik domain 'netloka.biz.id'.",
      activeNode: "tld",
    },
    {
      title: "4. Query ke Authoritative Name Server",
      resolver: "Authoritative Server (Cloudflare / NS)",
      desc: "Authoritative Server memegang A Record resmi: 'netloka.biz.id -> 103.20.5.10'. Jawaban IP dikembalikan ke Recursive Resolver.",
      activeNode: "auth",
    },
    {
      title: "5. Hasil Dikembalikan ke Klien & Masuk Cache",
      resolver: "Klien Terkoneksi",
      desc: "Recursive Resolver meneruskan IP 103.20.5.10 ke browser klien dan menyimpannya di cache sesuai nilai TTL.",
      activeNode: "client",
    },
  ];

  const current = steps[step];

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Globe className="w-4 h-4" />
          <span>Interactive DNS (Domain Name System) Hierarchy Resolver</span>
        </div>
        <span className="text-xs font-bold text-gray-500">
          Langkah {step + 1} dari {steps.length}
        </span>
      </div>

      {/* Hierarchy Nodes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            current.activeNode === "client"
              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 font-bold text-blue-900 dark:text-blue-200 shadow-sm scale-102"
              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <span className="block font-bold">1. Klien / Resolver</span>
          <span className="text-[10px] opacity-75 font-mono">192.168.1.100</span>
        </div>

        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            current.activeNode === "root"
              ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 font-bold text-purple-900 dark:text-purple-200 shadow-sm scale-102"
              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <span className="block font-bold">2. Root Server</span>
          <span className="text-[10px] opacity-75 font-mono">Root Zone (.)</span>
        </div>

        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            current.activeNode === "tld"
              ? "bg-amber-50 dark:bg-amber-950/60 border-amber-500 font-bold text-amber-900 dark:text-amber-200 shadow-sm scale-102"
              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <span className="block font-bold">3. TLD Server</span>
          <span className="text-[10px] opacity-75 font-mono">.id / .com</span>
        </div>

        <div
          className={`p-3.5 rounded-xl border text-center transition-all ${
            current.activeNode === "auth"
              ? "bg-green-50 dark:bg-green-950/60 border-green-500 font-bold text-green-900 dark:text-green-200 shadow-sm scale-102"
              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <span className="block font-bold">4. Authoritative</span>
          <span className="text-[10px] opacity-75 font-mono">netloka.biz.id</span>
        </div>
      </div>

      {/* Query Explanation Banner */}
      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-1">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
          {current.title}
        </h4>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          {current.desc}
        </p>
      </div>

      {/* Step Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="inline-flex items-center text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Alur
        </button>

        <button
          type="button"
          onClick={() => setStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
        >
          {step === steps.length - 1 ? "Ulangi Resolusi" : "Langkah Resolusi Berikutnya"}
        </button>
      </div>
    </div>
  );
}
