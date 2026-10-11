"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { TRANSPORT_OUTAGE_OPTIONS } from "@/features/learning/practice/services/named-service-outage";

interface NamedServicePlayerProps {
  isPathFinal?: boolean;
}

export function NamedServicePlayer({
  isPathFinal = false,
}: NamedServicePlayerProps) {
  // Default buggy states reflecting the outage incident:
  const [gateway, setGateway] = useState<string>("192.168.1.254"); // Buggy: wrong gateway
  const [dnsServer, setDnsServer] = useState<string>("192.168.1.99"); // Buggy: dead DNS server
  const [natEnabled, setNatEnabled] = useState<boolean>(false); // Buggy: NAT overload disabled
  const [selectedReason, setSelectedReason] = useState<string>("");

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
          challengeId: "named-service-outage",
          dhcpDefaultGateway: gateway,
          dhcpDnsServer: dnsServer,
          natOverloadEnabled: natEnabled,
          transportOutageReasonOption: selectedReason,
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
      {/* Scenario Briefing */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isPathFinal
                ? "Ujian Akhir Kelulusan Path 4 (Routing & Network Services)"
                : "Capstone Troubleshooting Challenge"}
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              Investigasi Gangguan Layanan Enterprise (Named-Service Outage)
            </h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Passing Grade: 70 / 100
          </span>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong>Laporan Insiden Tiket #TKJ-9042:</strong> Seluruh workstation di lantai 2 divisi operasional mengeluhkan tidak bisa membuka aplikasi portal web perusahaan (<code>https://portal.zenoba.internal</code>) maupun Internet. Hasil analisis awal menunjukkan:
        </p>

        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 space-y-2 text-xs font-mono text-gray-700 dark:text-gray-300">
          <div>• Router LAN Interface (Gig0/0): <strong>192.168.1.1/24</strong> (Status UP)</div>
          <div>• Router WAN Interface (Gig0/1): <strong>203.0.113.2/30</strong> (Gateway ISP: 203.0.113.1)</div>
          <div>• Internal DNS Server: <strong>192.168.1.10</strong> (Berjalan normal di VLAN Server)</div>
          <div>• DHCP Scope (LAN): Mendistribusikan Gateway <code>192.168.1.254</code> dan DNS <code>192.168.1.99</code></div>
          <div>• Router NAT: Perintah NAT Overload belum aktif pada interface WAN (Gig0/1)</div>
          <div>• Pengujian Ping ke server web (192.168.1.50) berhasil reply, namun port web HTTP 80/443 tertutup firewall</div>
        </div>
      </div>

      {/* Task 1: DHCP Default Gateway */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Bagian 1: Koreksi Parameter Default Gateway pada DHCP Scope
          </span>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Konfigurasikan IP Default Gateway yang Valid
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Klien menerima Default Gateway <code>192.168.1.254</code> yang tidak aktif di jaringan. Tentukan IP antarmuka router lokal yang tepat:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { ip: "192.168.1.254", label: "192.168.1.254 (Konfigurasi Lama - Offline)" },
            { ip: "192.168.1.1", label: "192.168.1.1 (Router Interface Gig0/0 LAN)" },
            { ip: "203.0.113.1", label: "203.0.113.1 (Router Gateway ISP Luar)" },
          ].map((item) => (
            <button
              key={item.ip}
              type="button"
              onClick={() => setGateway(item.ip)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                gateway === item.ip
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task 2: DHCP DNS Server */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Bagian 2: Koreksi Resolver DNS Server pada DHCP Scope
          </span>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Pilih Resolver DNS Operasional untuk Klien
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Klien gagal menyelesaikan FQDN karena DNS <code>192.168.1.99</code> tidak ada. Pilih resolver yang valid agar nama domain internal dan eksternal dapat di-resolve:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { ip: "192.168.1.99", label: "192.168.1.99 (Konfigurasi Lama - Mati)" },
            { ip: "192.168.1.10", label: "192.168.1.10 (Internal DNS Server Perusahaan)" },
            { ip: "8.8.8.8", label: "8.8.8.8 (Google Public DNS Resolver)" },
          ].map((item) => (
            <button
              key={item.ip}
              type="button"
              onClick={() => setDnsServer(item.ip)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                dnsServer === item.ip
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task 3: NAT Overload (PAT) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Bagian 3: Status Fitur NAT/PAT Overload pada Router WAN
          </span>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Aktivasi Translasi Port Address Translation (PAT)
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Paket dari subnet LAN (<code>192.168.1.0/24</code>) dibuang oleh router ISP karena membawa IP privat RFC 1918 tanpa translasi alamat publik.
          </p>
        </div>

        <label className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 cursor-pointer">
          <input
            type="checkbox"
            checked={natEnabled}
            onChange={(e) => setNatEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            Aktifkan Port Address Translation (PAT / NAT Overload) pada Interface WAN (Gig0/1)
          </span>
        </label>
      </div>

      {/* Task 4: Transport vs Network Layer Diagnostic Logic */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Bagian 4: Analisis Keterjangkauan Layer 3 vs Status Port Layer 4
          </span>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Mengapa Ping Berhasil Namun Web Browser Gagal Membuka Aplikasi?
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Pilih penjelasan teknis paling tepat yang membedakan kegagalan Layer 3 versus Layer 4/7:
          </p>
        </div>

        <div className="space-y-2">
          {TRANSPORT_OUTAGE_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition-colors text-xs ${
                selectedReason === opt.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-semibold"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              <input
                type="radio"
                name="transportReason"
                value={opt.id}
                checked={selectedReason === opt.id}
                onChange={() => setSelectedReason(opt.id)}
                className="mt-0.5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span>{opt.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <span className="text-xs font-bold text-gray-900 dark:text-white block">
            Kirim Solusi Investigasi Gangguan Layanan
          </span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Pastikan seluruh konfigurasi gateway, resolver DNS, PAT, dan analisis diagnostik telah diperiksa.
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !selectedReason}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Memproses...</span>
            </>
          ) : (
            <span>Evaluasi Perbaikan Sekarang</span>
          )}
        </button>
      </div>

      {/* Evaluation Results Display */}
      {result && (
        <div
          className={`p-6 rounded-2xl border space-y-4 animate-in fade-in duration-300 ${
            result.error
              ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200"
              : result.passed
              ? "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-950 dark:text-green-100"
              : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100"
          }`}
        >
          {result.error ? (
            <div>
              <h3 className="text-sm font-bold">
                Pengiriman Tidak Dapat Diproses
              </h3>
              <p className="text-xs mt-1 text-red-700 dark:text-red-300">
                {result.error}
              </p>
              {result.completedLessons !== undefined &&
                result.totalLessons !== undefined && (
                  <p className="text-xs font-bold mt-2">
                    Progres Anda: {result.completedLessons} dari{" "}
                    {result.totalLessons} materi terselesaikan.
                  </p>
                )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold">
                    {result.passed
                      ? "Evaluasi LULUS! Gangguan Layanan Berhasil Dipulihkan"
                      : "Evaluasi Belum Lulus"}
                  </h3>
                  <p className="text-xs opacity-80 mt-0.5">
                    Skor Anda: <strong>{result.score}</strong> / {result.maxScore}
                  </p>
                </div>
                {result.xpResult?.awarded && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-200">
                    +{result.xpResult.amount} XP Didapatkan!
                  </span>
                )}
              </div>

              {/* Criteria Breakdown */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  Rincian Penilaian Kriteria:
                </span>
                {result.criteriaResults?.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-white/60 dark:bg-black/30 border border-black/5 dark:border-white/5 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{c.title}</span>
                      <span
                        className={`font-mono font-bold ${
                          c.passed
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {c.score} / {c.maxScore} Poin
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90">{c.feedback}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
