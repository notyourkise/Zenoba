"use client";

import React, { useState } from "react";
import { Activity, Play, RotateCcw } from "lucide-react";

export function IcmpPingVisualizer() {
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleStartPing = () => {
    setIsPinging(true);
    setLogs(["Mengirim 4 ICMP Echo Request ke 8.8.8.8..."]);

    const newLogs: string[] = [
      "Mengirim 4 ICMP Echo Request ke 8.8.8.8...",
      "Reply from 8.8.8.8: bytes=32 time=14ms TTL=117",
      "Reply from 8.8.8.8: bytes=32 time=12ms TTL=117",
      "Reply from 8.8.8.8: bytes=32 time=15ms TTL=117",
      "Reply from 8.8.8.8: bytes=32 time=13ms TTL=117",
      "Ping statistics for 8.8.8.8: Packets: Sent = 4, Received = 4, Lost = 0 (0% loss), Approximate round trip times: Minimum = 12ms, Maximum = 15ms, Average = 13ms",
    ];

    setLogs(newLogs);
    setIsPinging(false);
  };

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Activity className="w-4 h-4" />
          <span>Interactive ICMP (Internet Control Message Protocol) Ping Simulator</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Perintah <code>ping</code> mengirim paket <strong>ICMP Type 8 (Echo Request)</strong> ke host target. Jika target aktif, target membalas dengan <strong>ICMP Type 0 (Echo Reply)</strong> untuk mengukur latensi (RTT) dan kestabilan link:
      </p>

      {/* Action Button */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          disabled={isPinging}
          onClick={handleStartPing}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Play className="w-3.5 h-3.5 mr-1.5" />
          Eksekusi Simulasi Ping (8.8.8.8)
        </button>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={() => setLogs([])}
            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bersihkan Output</span>
          </button>
        )}
      </div>

      {/* Terminal Display */}
      {logs.length > 0 && (
        <div className="p-4 bg-gray-950 text-green-400 rounded-xl font-mono text-xs space-y-1 shadow-inner border border-gray-800 overflow-x-auto">
          {logs.map((line, idx) => (
            <div key={idx} className={line.startsWith("Ping statistics") ? "pt-2 text-gray-300 font-bold" : ""}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
