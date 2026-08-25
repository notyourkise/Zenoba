"use client";

import React, { useState } from "react";
import { CheckCircle2, RotateCcw, Award } from "lucide-react";
import { calculateSubnetDetails } from "@/features/network-logic/ipv4/ipv4";

export function SubnetPractice() {
  const [problemIndex, setProblemIndex] = useState<number>(0);
  const [userNetId, setUserNetId] = useState<string>("");
  const [userBroadcast, setUserBroadcast] = useState<string>("");
  const [userUsable, setUserUsable] = useState<string>("");
  const [validated, setValidated] = useState<boolean | null>(null);

  const practiceProblems = [
    { ip: "192.168.1.130", prefix: 26 },
    { ip: "10.0.50.20", prefix: 28 },
    { ip: "172.16.100.15", prefix: 29 },
    { ip: "192.168.10.5", prefix: 30 },
  ];

  const currentProb = practiceProblems[problemIndex];
  const solution = calculateSubnetDetails(currentProb.ip, currentProb.prefix);

  const handleCheck = () => {
    const isNetCorrect = userNetId.trim() === solution.networkAddress;
    const isBcastCorrect = userBroadcast.trim() === solution.broadcastAddress;
    const isUsableCorrect = Number(userUsable.trim()) === solution.usableHosts;

    setValidated(isNetCorrect && isBcastCorrect && isUsableCorrect);
  };

  const handleNextProblem = () => {
    setProblemIndex((prev) => (prev + 1) % practiceProblems.length);
    setUserNetId("");
    setUserBroadcast("");
    setUserUsable("");
    setValidated(null);
  };

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Award className="w-4 h-4" />
          <span>Subnetting Challenge Generator</span>
        </div>
        <span className="text-xs text-gray-500 font-semibold">
          Soal #{problemIndex + 1} dari {practiceProblems.length}
        </span>
      </div>

      {/* Target Question Box */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700 text-center space-y-1">
        <span className="text-xs text-gray-500 block">Diberikan Alamat Host & Prefix:</span>
        <div className="text-xl sm:text-2xl font-black font-mono text-gray-900 dark:text-white">
          {currentProb.ip} /{currentProb.prefix}
        </div>
      </div>

      {/* Answer Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
            Network ID:
          </label>
          <input
            type="text"
            value={userNetId}
            onChange={(e) => {
              setUserNetId(e.target.value);
              setValidated(null);
            }}
            placeholder="misal: 192.168.1.128"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 font-mono text-xs outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
            Broadcast IP:
          </label>
          <input
            type="text"
            value={userBroadcast}
            onChange={(e) => {
              setUserBroadcast(e.target.value);
              setValidated(null);
            }}
            placeholder="misal: 192.168.1.191"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 font-mono text-xs outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
            Jumlah Host Usable:
          </label>
          <input
            type="number"
            value={userUsable}
            onChange={(e) => {
              setUserUsable(e.target.value);
              setValidated(null);
            }}
            placeholder="misal: 62"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 font-mono text-xs outline-none"
          />
        </div>
      </div>

      {/* Validation Result */}
      {validated !== null && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-xs font-bold ${
            validated
              ? "bg-green-50 dark:bg-green-950/60 border-green-300 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-950/60 border-red-300 text-red-800 dark:text-red-200"
          }`}
        >
          {validated ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>Luar biasa! Seluruh perhitungan Network ID, Broadcast, dan Host Usable Anda tepat 100%.</span>
            </>
          ) : (
            <span>Perhitungan belum tepat. Pastikan Anda menghitung Network ID dan Host Bits dengan benar.</span>
          )}
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleNextProblem}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Soal Baru
        </button>

        <button
          type="button"
          disabled={!userNetId || !userBroadcast || !userUsable}
          onClick={handleCheck}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-sm transition-colors"
        >
          Periksa Jawaban
        </button>
      </div>
    </div>
  );
}
