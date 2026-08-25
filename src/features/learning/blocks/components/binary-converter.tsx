"use client";

import React, { useState } from "react";
import { Binary, RotateCcw } from "lucide-react";

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

export function BinaryConverter() {
  const [bits, setBits] = useState<number[]>([1, 1, 0, 0, 0, 0, 0, 0]); // Default: 192 (128 + 64)

  const toggleBit = (index: number) => {
    setBits((prev) => {
      const updated = [...prev];
      updated[index] = updated[index] === 1 ? 0 : 1;
      return updated;
    });
  };

  const decimalValue = bits.reduce(
    (acc, bit, idx) => acc + bit * BIT_VALUES[idx],
    0
  );

  const handleReset = () => {
    setBits([0, 0, 0, 0, 0, 0, 0, 0]);
  };

  const activeSumFormula = bits
    .map((b, idx) => (b === 1 ? BIT_VALUES[idx] : null))
    .filter(Boolean)
    .join(" + ") || "0";

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Binary className="w-4 h-4" />
          <span>Interactive 8-Bit Binary to Decimal Converter</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
        Klik setiap bit di bawah (0 atau 1) untuk melihat bagaimana kombinasi nilai pangkat 2 (128 s/d 1) menghasilkan angka desimal satu oktet IPv4 (0 s/d 255):
      </p>

      {/* 8-Bit Toggle Grid */}
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
        {BIT_VALUES.map((val, idx) => {
          const isActive = bits[idx] === 1;

          return (
            <button
              key={val}
              type="button"
              onClick={() => toggleBit(idx)}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-between ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-md scale-102"
                  : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-300"
              }`}
            >
              <span className="text-[10px] font-bold opacity-80 mb-1">{val}</span>
              <span className="text-xl sm:text-2xl font-black font-mono">
                {bits[idx]}
              </span>
              <span className="text-[9px] mt-1 opacity-70">
                {isActive ? "ON" : "OFF"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Result Display */}
      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-0.5">
            Formula Penjumlahan Bit Aktif:
          </span>
          <span className="text-xs font-mono font-semibold text-blue-900 dark:text-blue-300">
            {activeSumFormula} = {decimalValue}
          </span>
        </div>

        <div className="flex items-center space-x-3 sm:border-l sm:border-blue-200 dark:sm:border-blue-800 sm:pl-4">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Nilai Desimal:
          </span>
          <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            {decimalValue}
          </span>
        </div>
      </div>
    </div>
  );
}
