import React from "react";
import Link from "next/link";
import { Briefcase, ArrowRight, Building, Gamepad2, Truck, GraduationCap, Building2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const CONSULTANT_CASES = [
  {
    slug: "small-office-notaris",
    title: "1. Kantor Notaris & PPAT (SOHO)",
    clientName: "Kantor Notaris & PPAT H. Suryadi, S.H.",
    description: "Perancangan jaringan LAN kantor notaris untuk 12 workstation staf, printer sharing, dan 2 Access Point Wi-Fi tamu.",
    budget: 15000000,
    difficulty: "Beginner",
    category: "Small Office",
    icon: Building,
  },
  {
    slug: "warnet-gaming-center",
    title: "2. Warnet & Esports Gaming Center",
    clientName: "CyberArena Esports Cafe",
    description: "Infrastruktur jaringan 30 PC Gaming dengan throughput tinggi, Dual-WAN ISP Failover, dan bandwidth management rendah latensi.",
    budget: 25000000,
    difficulty: "Intermediate",
    category: "Gaming & Cafe",
    icon: Gamepad2,
  },
  {
    slug: "medium-office-logistics",
    title: "3. Kantor Logistik & Gudang Distribusi",
    clientName: "PT Nusantara Express Logistics",
    description: "Jaringan 40 PC staf, server lokal, CCTV IP, dan segmentasi 3 VLAN (Staff, Server, Guest) dengan Wi-Fi 6.",
    budget: 50000000,
    difficulty: "Intermediate",
    category: "Medium Office",
    icon: Truck,
  },
  {
    slug: "smk-tkj-school-lab",
    title: "4. Laboratorium Jaringan Komputer SMK TKJ",
    clientName: "SMK Negeri 1 Teknologi",
    description: "Perancangan 2 Lab Komputer (@ 36 PC) + Ruang Guru & Server Room dengan arsitektur Core-Distribution Switch dan VLAN.",
    budget: 75000000,
    difficulty: "Advanced",
    category: "School & Lab",
    icon: GraduationCap,
  },
  {
    slug: "multi-floor-corporate",
    title: "5. Gedung Korporat Multi-Lantai (3 Lantai)",
    clientName: "Gedung Menara Finansial 3-Lantai",
    description: "Infrastruktur enterprise 100 node dengan backbone Fiber Optic 10G SFP+, Redundant Core Switch, dan Wi-Fi 6 multi-SSID.",
    budget: 120000000,
    difficulty: "Advanced",
    category: "Enterprise",
    icon: Building2,
  },
];

export default async function ConsultantPage() {
  await getCurrentUser();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-4 h-4" />
            <span>Flagship Practical Experience</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Mode Konsultan Jaringan TI
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Berperanlah sebagai Konsultan Jaringan profesional. Analisis kebutuhan klien, pilih perangkat (BoQ), rancang topologi, atur IP/VLAN, dan ajukan proposal resmi untuk dinilai multi-dimensi.
          </p>
        </div>

        <Link
          href="/consultant/portfolio"
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex-shrink-0"
        >
          Portofolio Proyek Saya →
        </Link>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONSULTANT_CASES.map((cs) => {
          const Icon = cs.icon;
          return (
            <Link
              key={cs.slug}
              href={`/consultant/${cs.slug}`}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
                      {cs.difficulty}
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400 font-mono">
                      Budget: Rp {(cs.budget / 1000000).toFixed(0)} Juta
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cs.title}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {cs.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Ambil Kasus Konsultasi (+250 XP)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
