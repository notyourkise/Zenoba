"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  TROUBLESHOOTING_PRINCIPLE_OPTIONS,
  SERVICE_VERIFICATION_OPTIONS,
} from "@/features/learning/practice/troubleshooting/multi-incident";

interface MultiIncidentPlayerProps {
  isPathFinal?: boolean;
}

export function MultiIncidentPlayer({
  isPathFinal = false,
}: MultiIncidentPlayerProps) {
  // Incident 1: Wireless & APIPA
  const [apipaRootCause, setApipaRootCause] = useState<string>("");
  const [apipaCorrection, setApipaCorrection] = useState<string>("");

  // Incident 2: Switching & Inter-VLAN
  const [interVlanRootCause, setInterVlanRootCause] = useState<string>("");
  const [interVlanCorrection, setInterVlanCorrection] = useState<string>("");

  // Incident 3: Branch Office Gateway
  const [gatewayRootCause, setGatewayRootCause] = useState<string>("");
  const [gatewayCorrection, setGatewayCorrection] = useState<string>("");

  // Incident 4: Troubleshooting Methodology
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("");
  const [selectedVerification, setSelectedVerification] = useState<string>("");

  const [activeTab, setActiveTab] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    passed?: boolean;
    score?: number;
    maxScore?: number;
    feedback?: string[];
    criteriaResults?: Array<{
      id: string;
      title: string;
      passed: boolean;
      score: number;
      maxScore: number;
      feedback: string;
    }>;
    unmetOutcomes?: string[];
    xpResult?: { awarded: boolean; amount: number; totalXp: number } | null;
    error?: string;
    completedLessons?: number;
    totalLessons?: number;
  } | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: "multi-incident-investigation",
          apipaRootCause,
          apipaCorrection,
          interVlanRootCause,
          interVlanCorrection,
          gatewayRootCause,
          gatewayCorrection,
          troubleshootingPrincipleOption: selectedPrinciple,
          serviceVerificationOption: selectedVerification,
          isPathFinal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({
          error: data.error || "Gagal mengirim jawaban evaluasi.",
          completedLessons: data.completedLessons,
          totalLessons: data.totalLessons,
        });
      } else {
        setResult(data);
      }
    } catch {
      setResult({
        error: "Terjadi kesalahan jaringan saat mengirimkan jawaban.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenario Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isPathFinal
                ? "Ujian Akhir Kelulusan Path 5 (Wireless & Troubleshooting)"
                : "Capstone Troubleshooting Simulation"}
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              Investigasi & Remediasi Insiden Jaringan Multi-Skala
            </h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Passing Grade: 70 / 100
          </span>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong>Laporan Insiden Terintegrasi Tiket #TKJ-9500:</strong> Sebagai Lead Network Support, Anda ditugaskan menyelesaikan 3 insiden kritis di kantor pusat dan cabang, serta memverifikasi penegakan standar operasional troubleshooting ilmiah:
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${
              activeTab === 1
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            1. Insiden APIPA & Wi-Fi Ruang Rapat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${
              activeTab === 2
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            2. Insiden Trunking Inter-VLAN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(3)}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${
              activeTab === 3
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            3. Insiden Gateway Kantor Cabang
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(4)}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${
              activeTab === 4
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            4. Standar Metodologi & Verifikasi
          </button>
        </div>
      </div>

      {/* Tab 1: APIPA & Wi-Fi Incident */}
      {activeTab === 1 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-5 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Bagian 1 • Bobot 25 Poin
            </span>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              Insiden Alamat APIPA 169.254.x.x di Ruang Rapat
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              30 peserta training baru mengeluhkan status &apos;No Internet Access&apos;. Karyawan lama yang datang lebih pagi tetap terhubung lancar.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900 text-gray-200 font-mono text-xs space-y-1.5 overflow-x-auto">
            <div className="text-gray-400"># Output CLI dari Laptop Peserta Baru:</div>
            <div>C:\&gt; ipconfig /all</div>
            <div>Autoconfiguration IPv4 Address . : 169.254.12.88</div>
            <div>Subnet Mask . . . . . . . . . . . : 255.255.0.0</div>
            <div>Default Gateway . . . . . . . . . : </div>
            <div className="text-gray-400 mt-2"># Output Status Router DHCP Pool:</div>
            <div>Router# show ip dhcp pool GUEST_POOL</div>
            <div>Current index: 192.168.50.14 | Total addresses: 14 | Leased addresses: 14 (100% Full)</div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              A. Identifikasi Akar Masalah (Root Cause):
            </label>
            <div className="space-y-2">
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="apipaRootCause"
                  value="dhcp-pool-exhausted"
                  checked={apipaRootCause === "dhcp-pool-exhausted"}
                  onChange={(e) => setApipaRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Kapasitas DHCP Pool (/28 = hanya 14 host) telah habis terisi penuh oleh perangkat sebelumnya sehingga klien baru dialihkan ke IP APIPA.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="apipaRootCause"
                  value="wifi-jamming"
                  checked={apipaRootCause === "wifi-jamming"}
                  onChange={(e) => setApipaRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Gelombang frekuensi Wi-Fi mengalami jamming dari perangkat microwave di pantry kantor.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="apipaRootCause"
                  value="laptop-broken"
                  checked={apipaRootCause === "laptop-broken"}
                  onChange={(e) => setApipaRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Kartu Wi-Fi seluruh 30 peserta training rusak secara bersamaan.</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              B. Tindakan Korektif Terukur:
            </label>
            <div className="space-y-2">
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="apipaCorrection"
                  value="expand-dhcp-scope-24"
                  checked={apipaCorrection === "expand-dhcp-scope-24"}
                  onChange={(e) => setApipaCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Perluas subnet DHCP Scope menjadi /24 (254 host) atau persingkat waktu sewa (lease time) menjadi 2 jam untuk perangkat tamu.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="apipaCorrection"
                  value="reboot-all-laptops"
                  checked={apipaCorrection === "reboot-all-laptops"}
                  onChange={(e) => setApipaCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Minta seluruh 30 peserta merestart laptop berkali-kali tanpa mengubah setelan router.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="apipaCorrection"
                  value="disable-dhcp-server"
                  checked={apipaCorrection === "disable-dhcp-server"}
                  onChange={(e) => setApipaCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Matikan layanan DHCP server di router dan gunakan alamat IP statis manual untuk semua orang.</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Inter-VLAN Trunking Incident */}
      {activeTab === 2 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-5 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Bagian 2 • Bobot 25 Poin
            </span>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              Kegagalan Akses Server Inter-VLAN (Sales ke Database)
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Klien di VLAN 10 (Sales: 192.168.10.5) tidak dapat mengakses Database Server di VLAN 20 (192.168.20.10). Sesama klien di VLAN 10 dapat saling ping normal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900 text-gray-200 font-mono text-xs space-y-1.5 overflow-x-auto">
            <div className="text-gray-400"># Output CLI dari PC Sales:</div>
            <div>C:\&gt; ping 192.168.20.10</div>
            <div>Reply from 192.168.10.1: Destination host unreachable.</div>
            <div className="text-gray-400 mt-2"># Output Konfigurasi Port Switch Distribusi:</div>
            <div>Switch# show interfaces FastEthernet0/24 switchport</div>
            <div>Name: Fa0/24 (Uplink to Router)</div>
            <div>Operational Mode: static access | Access Mode VLAN: 1 (default)</div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              A. Identifikasi Akar Masalah (Root Cause):
            </label>
            <div className="space-y-2">
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="interVlanRootCause"
                  value="missing-8021q-trunk"
                  checked={interVlanRootCause === "missing-8021q-trunk"}
                  onChange={(e) => setInterVlanRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Port uplink Fa0/24 pada switch menuju Router dikonfigurasi sebagai Access Port (VLAN 1) alih-alih 802.1Q Trunk.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="interVlanRootCause"
                  value="database-password-changed"
                  checked={interVlanRootCause === "database-password-changed"}
                  onChange={(e) => setInterVlanRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Kata sandi database PostgreSQL telah diubah oleh database administrator.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="interVlanRootCause"
                  value="cable-unplugged"
                  checked={interVlanRootCause === "cable-unplugged"}
                  onChange={(e) => setInterVlanRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Kabel jaringan di server database dicabut oleh petugas kebersihan.</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              B. Tindakan Korektif Terukur:
            </label>
            <div className="space-y-2">
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="interVlanCorrection"
                  value="reconfigure-port-trunk"
                  checked={interVlanCorrection === "reconfigure-port-trunk"}
                  onChange={(e) => setInterVlanCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Ubah mode port switch Fa0/24 menjadi 802.1Q Trunk dan izinkan VLAN 10 serta VLAN 20 melintas ke sub-interface router.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="interVlanCorrection"
                  value="delete-all-vlans"
                  checked={interVlanCorrection === "delete-all-vlans"}
                  onChange={(e) => setInterVlanCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Hapus seluruh VLAN dari switch dan gabungkan seluruh komputer kantor ke VLAN 1 tanpa segmentasi.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="interVlanCorrection"
                  value="change-server-ip"
                  checked={interVlanCorrection === "change-server-ip"}
                  onChange={(e) => setInterVlanCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Ganti alamat IP Database Server menjadi 127.0.0.1.</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Branch Office Gateway Incident */}
      {activeTab === 3 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-5 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Bagian 3 • Bobot 25 Poin
            </span>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              Kantor Cabang Bandung Offline Total
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Seluruh workstation kantor cabang tidak dapat mengakses intranet kantor pusat maupun Internet. Lampu link switch menyala hijau normal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900 text-gray-200 font-mono text-xs space-y-1.5 overflow-x-auto">
            <div className="text-gray-400"># Output CLI dari Komputer Cabang:</div>
            <div>C:\&gt; ipconfig /all</div>
            <div>IPv4 Address . . . . . . . . . . . : 192.168.1.100</div>
            <div>Subnet Mask . . . . . . . . . . . : 255.255.255.0</div>
            <div>Default Gateway . . . . . . . . . : 192.168.1.254</div>
            <div>C:\&gt; ping 192.168.1.254</div>
            <div>Request timed out.</div>
            <div className="text-gray-400 mt-2"># Output Antarmuka Router Cabang:</div>
            <div>Router# show ip interface brief</div>
            <div>GigabitEthernet0/0 (LAN) : 192.168.1.1/24 - Status: Up, Protocol: Up</div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              A. Identifikasi Akar Masalah (Root Cause):
            </label>
            <div className="space-y-2">
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="gatewayRootCause"
                  value="wrong-default-gateway"
                  checked={gatewayRootCause === "wrong-default-gateway"}
                  onChange={(e) => setGatewayRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Konfigurasi Default Gateway pada opsi DHCP diarahkan ke IP yang salah (192.168.1.254), padahal IP antarmuka router LAN adalah 192.168.1.1.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="gatewayRootCause"
                  value="fiber-backbone-cut"
                  checked={gatewayRootCause === "fiber-backbone-cut"}
                  onChange={(e) => setGatewayRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Kabel fiber optik bawah laut ISP putus total sehingga hop pertama gateway tidak merespons.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="gatewayRootCause"
                  value="router-hardware-dead"
                  checked={gatewayRootCause === "router-hardware-dead"}
                  onChange={(e) => setGatewayRootCause(e.target.value)}
                  className="mt-0.5"
                />
                <span>Komponen motherboard router kantor cabang terbakar.</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              B. Tindakan Korektif Terukur:
            </label>
            <div className="space-y-2">
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="gatewayCorrection"
                  value="restore-gateway-192-168-1-1"
                  checked={gatewayCorrection === "restore-gateway-192-168-1-1"}
                  onChange={(e) => setGatewayCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Koreksi opsi default-router pada konfigurasi DHCP server menjadi 192.168.1.1 dan perbarui sewa IP pada klien dengan &apos;ipconfig /renew&apos;.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="gatewayCorrection"
                  value="reinstall-isp-router"
                  checked={gatewayCorrection === "reinstall-isp-router"}
                  onChange={(e) => setGatewayCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Memesan pemasangan sambungan ISP baru ke kantor cabang.</span>
              </label>
              <label className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="gatewayCorrection"
                  value="remove-default-gateway"
                  checked={gatewayCorrection === "remove-default-gateway"}
                  onChange={(e) => setGatewayCorrection(e.target.value)}
                  className="mt-0.5"
                />
                <span>Kosongkan kolom Default Gateway agar komputer mencari rute sendiri melalui broadcast.</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Troubleshooting Methodology */}
      {activeTab === 4 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-5 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Bagian 4 • Bobot 25 Poin
            </span>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              Standar Prosedur Operasional Troubleshooting &amp; Verifikasi
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Sebagai teknisi profesional, setiap tindakan perbaikan wajib memenuhi standar disiplin isolasi variabel dan protokol pengujian pemulihan fungsional penuh.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              A. Prinsip Eksekusi Perbaikan (Isolasi Variabel &amp; Rollback):
            </label>
            <div className="space-y-2">
              {TROUBLESHOOTING_PRINCIPLE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="troubleshootingPrinciple"
                    value={opt.id}
                    checked={selectedPrinciple === opt.id}
                    onChange={(e) => setSelectedPrinciple(e.target.value)}
                    className="mt-0.5"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              B. Protokol Verifikasi Pemulihan Layanan (Beyond Ping):
            </label>
            <div className="space-y-2">
              {SERVICE_VERIFICATION_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="serviceVerification"
                    value={opt.id}
                    checked={selectedVerification === opt.id}
                    onChange={(e) => setSelectedVerification(e.target.value)}
                    className="mt-0.5"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submission Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Pastikan seluruh bagian (Insiden 1 s.d. 4) telah Anda analisis sebelum mengirimkan lembar investigasi.
          </div>
          <button
            type="button"
            disabled={
              loading ||
              !apipaRootCause ||
              !apipaCorrection ||
              !interVlanRootCause ||
              !interVlanCorrection ||
              !gatewayRootCause ||
              !gatewayCorrection ||
              !selectedPrinciple ||
              !selectedVerification
            }
            onClick={handleSubmit}
            className="px-6 py-3 text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Menganalisis &amp; Memverifikasi Bukti...</span>
              </>
            ) : (
              <span>Kirim Hasil Investigasi Insiden</span>
            )}
          </button>
        </div>

        {/* Error / Prerequisite Block */}
        {result?.error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300 space-y-1">
            <div className="font-bold">Gagal Mengirim Ujian Akhir:</div>
            <div>{result.error}</div>
            {result.completedLessons !== undefined &&
              result.totalLessons !== undefined && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Progres Anda: {result.completedLessons} dari {result.totalLessons} materi selesai.
                </div>
              )}
          </div>
        )}

        {/* Result Evaluation Output */}
        {result && !result.error && (
          <div
            className={`p-5 rounded-xl border space-y-4 ${
              result.passed
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/60"
                : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-bold uppercase tracking-wider ${
                  result.passed
                    ? "text-green-700 dark:text-green-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {result.passed ? "LULUS UJIAN AKHIR" : "BELUM LULUS (PERLU PERBAIKAN)"}
              </span>
              <span className="text-base font-extrabold text-gray-900 dark:text-white">
                Skor: {result.score} / {result.maxScore}
              </span>
            </div>

            {result.criteriaResults && result.criteriaResults.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Rincian Evaluasi 4 Kriteria:
                </span>
                {result.criteriaResults.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                      <span>{c.title}</span>
                      <span
                        className={
                          c.passed
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {c.score} / {c.maxScore} Poin
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {c.feedback}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {result.xpResult && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center justify-between">
                <span>Hadiah Pengalaman (XP):</span>
                <span>
                  {result.xpResult.awarded
                    ? `+${result.xpResult.amount} XP Diberikan! (Total: ${result.xpResult.totalXp} XP)`
                    : "XP telah diklaim sebelumnya (Idempotent)."}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
