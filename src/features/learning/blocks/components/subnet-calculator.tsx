"use client";

import React, { useState } from "react";
import { Calculator, CheckCircle2, HelpCircle } from "lucide-react";
import { calculateSubnetDetails, isValidIpv4, isValidPrefix } from "@/features/network-logic/ipv4/ipv4";

export function SubnetCalculator() {
  const [ipInput, setIpInput] = useState<string>("192.168.10.75");
  const [prefixInput, setPrefixInput] = useState<number>(26);

  const isValid = isValidIpv4(ipInput) && isValidPrefix(prefixInput);
  const details = isValid ? calculateSubnetDetails(ipInput, prefixInput) : null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 pb-3">
        <Calculator className="w-4 h-4" />
        <span>Interactive Subnet Calculator & Step-by-Step Reasoner</span>
      </div>

      {/* Input Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8 space-y-1">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Alamat IPv4:
          </label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="192.168.1.1"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="sm:col-span-4 space-y-1">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Prefix CIDR (/{prefixInput}):
          </label>
          <select
            value={prefixInput}
            onChange={(e) => setPrefixInput(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Array.from({ length: 25 }, (_, i) => i + 8).map((p) => (
              <option key={p} value={p}>
                /{p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {details ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700">
              <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">
                Network ID
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {details.networkAddress}
              </span>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700">
              <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">
                Broadcast IP
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {details.broadcastAddress}
              </span>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700">
              <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">
                Subnet Mask
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {details.subnetMask}
              </span>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700">
              <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">
                Usable Hosts
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {details.usableHosts} host
              </span>
            </div>
          </div>

          {/* Usable Host Range */}
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div>
              <span className="font-bold text-blue-900 dark:text-blue-200 block mb-0.5">
                Rentang Host Usable (First s/d Last Host):
              </span>
              <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                {details.firstUsableHost} — {details.lastUsableHost}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-gray-500">
              Kelas {details.ipClass} • {details.isPrivate ? "Private IP" : "Public IP"}
            </span>
          </div>

          {/* Step-by-Step Reasoner Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Langkah-Langkah Perhitungan Deterministik:</span>
            </h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-800 space-y-1.5 text-xs text-gray-700 dark:text-gray-300 font-mono">
              {details.calculationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-red-500 font-semibold">
          Format alamat IPv4 atau prefix tidak valid. Masukkan format yang benar (misal: 192.168.1.1).
        </p>
      )}
    </div>
  );
}
