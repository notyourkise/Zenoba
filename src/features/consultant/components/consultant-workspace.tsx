"use client";

import React, { useState } from "react";
import { DEVICE_CATALOG } from "../catalog/devices";
import { BoQItem, calculateBoQ } from "../procurement/boq";
import {
  Plus,
  Minus,
  Loader2,
} from "lucide-react";

export interface CaseDef {
  slug: string;
  title: string;
  clientName: string;
  clientType: string;
  budget: number;
  description: string;
  wiredClientCount: number;
  apCount: number;
  requireVlan: boolean;
  requireDualWan?: boolean;
  requirePoe?: boolean;
  vlanList?: { vlanId: number; name: string; requiredHosts: number }[];
  difficulty: string;
}

export function ConsultantWorkspace({ caseData }: { caseData: CaseDef }) {
  const [activeTab, setActiveTab] = useState<"brief" | "boq" | "topology" | "ip_vlan" | "proposal">("brief");
  const [boqItems, setBoqItems] = useState<BoQItem[]>([
    { deviceId: "router-sbr-5g", quantity: 1 },
    { deviceId: "switch-poe-24g-370w", quantity: 1 },
    { deviceId: "ap-wifi6-ax3000", quantity: caseData.apCount || 2 },
    { deviceId: "cable-cat6-roll-305m", quantity: 1 },
    { deviceId: "patch-panel-cat6-24p", quantity: 1 },
  ]);

  const [vlanPlan] = useState([
    { vlanId: 10, name: "Operasional", subnet: "192.168.10.0", prefix: 24 },
    { vlanId: 20, name: "Manajemen & Server", subnet: "192.168.20.0", prefix: 24 },
    { vlanId: 30, name: "Tamu (Guest)", subnet: "192.168.30.0", prefix: 24 },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Compute live BoQ
  const boq = calculateBoQ(boqItems, caseData.budget, {
    requiredAccessPorts: caseData.wiredClientCount,
    requiredApCount: caseData.apCount,
    requireVlan: caseData.requireVlan,
    requireDualWan: caseData.requireDualWan,
  });

  const updateItemQty = (deviceId: string, delta: number) => {
    setBoqItems((prev) => {
      const existing = prev.find((i) => i.deviceId === deviceId);
      if (!existing) {
        if (delta > 0) return [...prev, { deviceId, quantity: delta }];
        return prev;
      }
      const newQty = Math.max(0, existing.quantity + delta);
      if (newQty === 0) {
        return prev.filter((i) => i.deviceId !== deviceId);
      }
      return prev.map((i) => (i.deviceId === deviceId ? { ...i, quantity: newQty } : i));
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/consultant/${caseData.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boqItems,
          vlanPlan: caseData.requireVlan ? vlanPlan : [],
          topologyData: { ready: true },
        }),
      });
      const data = await res.json();
      setResult(data);
      setActiveTab("proposal");
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBoqItems([
      { deviceId: "router-sbr-5g", quantity: 1 },
      { deviceId: "switch-poe-24g-370w", quantity: 1 },
      { deviceId: "ap-wifi6-ax3000", quantity: caseData.apCount || 2 },
    ]);
    setResult(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            IT Consultant Project &bull; Budget Rp {caseData.budget.toLocaleString("id-ID")} &bull; {caseData.difficulty}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {caseData.title}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Klien: <strong>{caseData.clientName}</strong>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("brief")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "brief"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500"
            }`}
          >
            1. Brief Klien
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("boq")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "boq"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500"
            }`}
          >
            2. Pengadaan (BoQ)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("topology")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "topology"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500"
            }`}
          >
            3. Topologi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ip_vlan")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "ip_vlan"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500"
            }`}
          >
            4. IP & VLAN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("proposal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "proposal"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500"
            }`}
          >
            5. Proposal & Skor
          </button>
        </div>
      </div>

      {/* TAB 1: BRIEF KLIEN */}
      {activeTab === "brief" && (
        <div className="space-y-6">
          <div className="p-6 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/60 space-y-3">
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              Latar Belakang & Kebutuhan Klien:
            </h3>
            <p className="text-xs text-indigo-900/90 dark:text-indigo-200/90 leading-relaxed">
              {caseData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-gray-500 font-bold">Pagu Anggaran (Budget):</span>
              <span className="text-base font-extrabold text-green-600 block">
                Rp {caseData.budget.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-gray-500 font-bold">Kabel Workstation:</span>
              <span className="text-base font-extrabold text-blue-600 block">
                {caseData.wiredClientCount} PC / Node
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-gray-500 font-bold">Jangkauan Nirkabel:</span>
              <span className="text-base font-extrabold text-indigo-600 block">
                Minimal {caseData.apCount} Access Point
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab("boq")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Lanjutkan ke Tahap 2: Pengadaan (BoQ) →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PENGADAAN (BoQ) */}
      {activeTab === "boq" && (
        <div className="space-y-6">
          {/* Budget & Capacity Live Gauge */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
            <div>
              <span className="text-gray-500 font-bold block">Total Pengadaan:</span>
              <span className={`text-base font-extrabold ${boq.isWithinBudget ? "text-green-600" : "text-red-600"}`}>
                Rp {boq.totalCost.toLocaleString("id-ID")}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-bold block">Sisa Anggaran:</span>
              <span className="text-base font-extrabold text-gray-900 dark:text-white">
                Rp {(caseData.budget - boq.totalCost).toLocaleString("id-ID")} ({boq.budgetUtilizationPct}%)
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-bold block">Total Port Switch:</span>
              <span className={`text-base font-extrabold ${boq.totalAccessPorts >= caseData.wiredClientCount ? "text-blue-600" : "text-amber-600"}`}>
                {boq.totalAccessPorts} / {caseData.wiredClientCount} Port
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-bold block">PoE Power:</span>
              <span className={`text-base font-extrabold ${boq.hasSufficientPoe ? "text-indigo-600" : "text-amber-600"}`}>
                {boq.totalPoeWatts}W (Req: {boq.requiredPoeWatts}W)
              </span>
            </div>
          </div>

          {/* Catalog Picker Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Nama Perangkat</th>
                  <th className="p-3">Spesifikasi Utama</th>
                  <th className="p-3">Harga Satuan</th>
                  <th className="p-3 text-center">Jumlah</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {DEVICE_CATALOG.map((device) => {
                  const qty = boqItems.find((i) => i.deviceId === device.id)?.quantity || 0;
                  const subtotal = device.price * qty;
                  return (
                    <tr key={device.id} className={qty > 0 ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""}>
                      <td className="p-3 font-semibold uppercase text-[10px] text-gray-500">
                        {device.category}
                      </td>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">
                        {device.name}
                      </td>
                      <td className="p-3 text-gray-500 max-w-xs leading-relaxed">
                        {device.description}
                      </td>
                      <td className="p-3 font-mono">
                        Rp {device.price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center space-x-1.5 border border-gray-300 dark:border-gray-600 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => updateItemQty(device.id, -1)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                            aria-label={`Kurangi jumlah ${device.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold font-mono">{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateItemQty(device.id, 1)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                            aria-label={`Tambah jumlah ${device.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        Rp {subtotal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              Reset BoQ
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("topology")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Lanjutkan ke Tahap 3: Topologi &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TOPOLOGI */}
      {activeTab === "topology" && (
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Struktur Arsitektur Topologi Proyek:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-1">
                <span className="font-bold block">1. WAN &amp; Gateway</span>
                <span className="text-gray-500 block">Uplink ISP Router Gateway</span>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-1">
                <span className="font-bold block">2. Distribution / Access Switch</span>
                <span className="text-gray-500 block">Managed Switch 802.1Q + PoE</span>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-1">
                <span className="font-bold block">3. Endpoints &amp; Wi-Fi 6 AP</span>
                <span className="text-gray-500 block">Workstations, CCTV, Access Points</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveTab("boq")}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              &larr; Kembali ke BoQ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ip_vlan")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Lanjutkan ke Tahap 4: IP &amp; VLAN &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: IP & VLAN */}
      {activeTab === "ip_vlan" && (
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Matriks Segmentasi VLAN &amp; Alokasi Subnet:
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-800 font-bold text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="p-3">VLAN ID</th>
                    <th className="p-3">Nama Segmen</th>
                    <th className="p-3">Subnet Network</th>
                    <th className="p-3">Prefix CIDR</th>
                    <th className="p-3">Default Gateway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {vlanPlan.map((v) => (
                    <tr key={v.vlanId}>
                      <td className="p-3 font-bold text-indigo-600">VLAN {v.vlanId}</td>
                      <td className="p-3 font-semibold">{v.name}</td>
                      <td className="p-3 font-mono">{v.subnet}</td>
                      <td className="p-3 font-mono">/{v.prefix} (254 Host)</td>
                      <td className="p-3 font-mono">{v.subnet.replace(".0", ".1")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveTab("topology")}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              ← Kembali ke Topologi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("proposal")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Lanjutkan ke Tahap 5: Proposal & Skor →
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: PROPOSAL & REVIEW */}
      {activeTab === "proposal" && (
        <div className="space-y-6">
          {/* Submission Result Cards */}
          {result ? (
            <div className="space-y-6">
              <div
                className={`p-6 rounded-2xl border space-y-3 ${
                  result.passed
                    ? "bg-green-50/80 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200"
                    : "bg-red-50/80 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-lg">
                  <div>
                    <span>{result.passed ? "Proposal Konsultan Diterima Klien!" : "Proposal Memerlukan Revisi"}</span>
                  </div>
                  <span className="text-2xl font-black">
                    Skor: {result.totalScore} / {result.maxTotalScore}
                  </span>
                </div>

                {result.xpResult?.awarded && (
                  <div className="inline-block px-3 py-1 bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-full text-xs font-bold">
                    +{result.xpResult.amount} XP Ditambahkan ke Akun! Total: {result.xpResult.totalXp} XP
                  </div>
                )}
              </div>

              {/* 5-Dimensional Score Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                {Object.entries(result.dimensions).map(([key, dim]: [string, any]) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <div
                    key={key}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white capitalize">
                        <span>{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-indigo-600 font-extrabold">
                          {dim.score}/{dim.maxScore}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        {dim.feedback}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Ringkasan Proposal Siap Ajukan:
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Anda telah menyusun rancangan Bill of Quantities (BoQ) total <strong>Rp {boq.totalCost.toLocaleString("id-ID")}</strong> ({boq.budgetUtilizationPct}% dari pagu anggaran), {boq.totalAccessPorts} Port Switch, dan {caseData.apCount} Access Point Wi-Fi 6. Klik tombol di bawah untuk menyerahkan proposal ke klien.
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("boq")}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              &larr; Ubah Rencana Pengadaan (BoQ)
            </button>

            <button
              type="button"
              disabled={loading || !boq.isWithinBudget}
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-md transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengevaluasi Proposal...
                </>
              ) : (
                "Kumpulkan Proposal Resmi (+250 XP)"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
