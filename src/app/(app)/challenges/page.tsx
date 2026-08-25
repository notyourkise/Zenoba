import React from "react";
import Link from "next/link";
import { Bug, ArrowRight, ShieldAlert, WifiOff, Network, Server } from "lucide-react";
import { SupportChallengePlayer } from "@/features/challenges/components/support-challenge-player";

export const REAL_WORLD_CHALLENGES = [
  {
    slug: "branch-office-down",
    title: "1. Kantor Cabang Offline Total",
    description: "Seluruh workstation di Kantor Cabang Bandung tidak dapat mengakses ERP dan Internet.",
    difficulty: "Intermediate",
    xpReward: 150,
    icon: WifiOff,
  },
  {
    slug: "inter-vlan-routing-bug",
    title: "2. Kegagalan Akses Server Inter-VLAN",
    description: "Klien di VLAN 10 (Sales) tidak dapat mengakses Database Server di VLAN 20.",
    difficulty: "Intermediate",
    xpReward: 150,
    icon: Network,
  },
  {
    slug: "dhcp-pool-exhausted",
    title: "3. Insiden Alamat IP APIPA 169.254.x.x",
    description: "Karyawan baru di lantai 2 mengeluhkan sambungan 'No Internet' dengan IP anomali.",
    difficulty: "Intermediate",
    xpReward: 150,
    icon: Server,
  },
];

export default function ChallengesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <Bug className="w-4 h-4" />
          <span>Real-World Scenario Challenges</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Tantangan Investigasi & Troubleshooting
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
          Uji keterampilan pemecahan masalah jaringan di skenario nyata tanpa panduan langsung. Analisis output CLI, buat hipotesis, dan temukan akar masalah (*root cause*).
        </p>
      </div>

      {/* Real-World Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REAL_WORLD_CHALLENGES.map((ch) => {
          const Icon = ch.icon;
          return (
            <Link
              key={ch.slug}
              href={`/challenges/${ch.slug}`}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
                      {ch.difficulty}
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      +{ch.xpReward} XP
                    </span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {ch.title}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {ch.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Mulai Investigasi</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Capstone Challenge Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <ShieldAlert className="w-4 h-4" />
          <span>Capstone IT Support Simulation</span>
        </div>
        <SupportChallengePlayer />
      </div>
    </div>
  );
}
