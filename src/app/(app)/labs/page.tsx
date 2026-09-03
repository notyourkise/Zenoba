import React from "react";
import Link from "next/link";
import { Award, ArrowRight, Shield, Network, Terminal, Activity } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const INITIAL_LABS = [
  {
    slug: "subnetting-calculator",
    title: "1. Subnetting & CIDR Calculation Lab",
    description: "Hitung parameter Network ID, Broadcast Address, dan jumlah usable host pada prefix /26.",
    category: "Subnetting",
    difficulty: "Beginner",
    xpReward: 100,
    icon: Network,
  },
  {
    slug: "ip-configuration",
    title: "2. Static IPv4 Configuration Lab",
    description: "Konfigurasikan alamat IP, Subnet Mask, dan Default Gateway pada PC klien agar dapat menjangkau server.",
    category: "IP Config",
    difficulty: "Beginner",
    xpReward: 100,
    icon: Shield,
  },
  {
    slug: "vlan-segmentation",
    title: "3. VLAN Segmentation Lab",
    description: "Terapkan isolasi broadcast domain dengan menetapkan Port 1-2 ke VLAN 10 dan Port 3-4 ke VLAN 20.",
    category: "Switching",
    difficulty: "Intermediate",
    xpReward: 100,
    icon: Network,
  },
  {
    slug: "static-routing",
    title: "4. Static & Default Routing Lab",
    description: "Konfigurasikan rute default 0.0.0.0/0 pada router menuju next-hop gateway 192.168.1.254.",
    category: "Routing",
    difficulty: "Intermediate",
    xpReward: 100,
    icon: Activity,
  },
  {
    slug: "troubleshooting",
    title: "5. Diagnostic CLI Troubleshooting Lab",
    description: "Gunakan perintah ipconfig, ping, arp, dan tracert untuk mengidentifikasi titik putus jaringan.",
    category: "Troubleshooting",
    difficulty: "Intermediate",
    xpReward: 100,
    icon: Terminal,
  },
];

export default async function LabsPage() {
  await getCurrentUser();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Award className="w-4 h-4" />
          <span>Interactive Hands-on Practice</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Katalog Lab Interaktif
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
          Eksplorasi dan selesaikan skenario praktek mandiri untuk memperkuat pemahaman networking. Setiap lab yang berhasil diselesaikan memberikan +100 XP.
        </p>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INITIAL_LABS.map((lab) => {
          const Icon = lab.icon;
          return (
            <Link
              key={lab.slug}
              href={`/labs/${lab.slug}`}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
                      {lab.difficulty}
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      +{lab.xpReward} XP
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lab.title}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {lab.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Mulai Lab</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
