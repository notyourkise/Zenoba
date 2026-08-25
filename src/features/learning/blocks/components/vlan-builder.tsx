"use client";

import React, { useState } from "react";
import { Shield, Layers } from "lucide-react";
import { evaluateL2Reachability, SimInterface } from "@/features/network-logic/simulation/topology";

export function VlanBuilder() {
  const [port1Vlan, setPort1Vlan] = useState<number>(10);
  const [port2Vlan, setPort2Vlan] = useState<number>(10);
  const [port3Vlan, setPort3Vlan] = useState<number>(20);

  const iface1: SimInterface = {
    id: "p1",
    name: "Port 1 (PC Sales)",
    macAddress: "00:11:11:11:11:11",
    mode: "access",
    vlanId: port1Vlan,
  };

  const iface2: SimInterface = {
    id: "p2",
    name: "Port 2 (PC Finance)",
    macAddress: "00:22:22:22:22:22",
    mode: "access",
    vlanId: port2Vlan,
  };

  // Test reachability between Port 1 and Port 2
  const reachability = evaluateL2Reachability(iface1, iface2);

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 pb-3">
        <Layers className="w-4 h-4" />
        <span>Interactive VLAN Port & Broadcast Segmentation Builder</span>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Ubah nomor VLAN pada Port 1 dan Port 2 switch di bawah untuk melihat bagaimana VLAN mengisolasi broadcast domain dan komunikasi Layer 2:
      </p>

      {/* Port Configuration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Port 1 */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 space-y-2">
          <span className="text-xs font-bold text-gray-900 dark:text-white block">
            Port 1 — PC Sales
          </span>
          <span className="text-[10px] text-gray-500 block">Mode: Access</span>
          <select
            value={port1Vlan}
            onChange={(e) => setPort1Vlan(Number(e.target.value))}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-bold font-mono"
          >
            <option value={10}>VLAN 10 (Sales)</option>
            <option value={20}>VLAN 20 (Engineering)</option>
            <option value={30}>VLAN 30 (Guest)</option>
          </select>
        </div>

        {/* Port 2 */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 space-y-2">
          <span className="text-xs font-bold text-gray-900 dark:text-white block">
            Port 2 — PC Finance
          </span>
          <span className="text-[10px] text-gray-500 block">Mode: Access</span>
          <select
            value={port2Vlan}
            onChange={(e) => setPort2Vlan(Number(e.target.value))}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-bold font-mono"
          >
            <option value={10}>VLAN 10 (Sales)</option>
            <option value={20}>VLAN 20 (Engineering)</option>
            <option value={30}>VLAN 30 (Guest)</option>
          </select>
        </div>

        {/* Port 3 */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 space-y-2 opacity-75">
          <span className="text-xs font-bold text-gray-900 dark:text-white block">
            Port 3 — Server
          </span>
          <span className="text-[10px] text-gray-500 block">Mode: Access (VLAN {port3Vlan})</span>
          <select
            value={port3Vlan}
            onChange={(e) => setPort3Vlan(Number(e.target.value))}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-bold font-mono"
          >
            <option value={10}>VLAN 10</option>
            <option value={20}>VLAN 20</option>
            <option value={30}>VLAN 30</option>
          </select>
        </div>
      </div>

      {/* Real-time Layer 2 Evaluation Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
          reachability.reachable
            ? "bg-green-50/80 dark:bg-green-950/40 border-green-300 text-green-900 dark:text-green-200"
            : "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200"
        }`}
      >
        <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">
            Status Konektivitas L2 Port 1 $\leftrightarrow$ Port 2: {reachability.reachable ? "TERHUBUNG (Same VLAN)" : "TERISOLASI (Different VLAN)"}
          </span>
          <p className="opacity-90">{reachability.reason}</p>
        </div>
      </div>
    </div>
  );
}
