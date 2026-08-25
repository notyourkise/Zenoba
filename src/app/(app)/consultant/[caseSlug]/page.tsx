import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { ConsultantWorkspace, CaseDef } from "@/features/consultant/components/consultant-workspace";

const CASE_DETAILS: Record<string, CaseDef> = {
  "small-office-notaris": {
    slug: "small-office-notaris",
    title: "Proyek: Jaringan LAN & Wi-Fi Kantor Notaris",
    clientName: "Kantor Notaris & PPAT H. Suryadi, S.H.",
    clientType: "small-office",
    budget: 15000000,
    wiredClientCount: 12,
    apCount: 2,
    requireVlan: false,
    requirePoe: true,
    difficulty: "Beginner",
    description: "Kantor Notaris membutuhkan instalasi jaringan LAN baru untuk 12 workstation staf, 2 printer jaringan, dan 2 Access Point Wi-Fi untuk ruang tunggu klien. Klien mengutamakan kestabilan koneksi dan anggaran hemat.",
  },
  "warnet-gaming-center": {
    slug: "warnet-gaming-center",
    title: "Proyek: Infrastruktur Jaringan Esports Arena",
    clientName: "CyberArena Esports Cafe",
    clientType: "warnet",
    budget: 25000000,
    wiredClientCount: 30,
    apCount: 2,
    requireVlan: false,
    requireDualWan: true,
    requirePoe: false,
    difficulty: "Intermediate",
    description: "CyberArena membuka cabang baru dengan 30 PC gaming spesifikasi tinggi. Klien membutuhkan router Dual-WAN untuk failover otomatis 2 ISP (IndiHome + Biznet) agar tidak ada disconnect saat turnamen.",
  },
  "medium-office-logistics": {
    slug: "medium-office-logistics",
    title: "Proyek: Segmentasi Jaringan Perusahaan Logistik",
    clientName: "PT Nusantara Express Logistics",
    clientType: "medium-office",
    budget: 50000000,
    wiredClientCount: 40,
    apCount: 3,
    requireVlan: true,
    requireDualWan: true,
    requirePoe: true,
    vlanList: [
      { vlanId: 10, name: "Staff Operasional", requiredHosts: 40 },
      { vlanId: 20, name: "Server & CCTV", requiredHosts: 10 },
      { vlanId: 30, name: "Wi-Fi Tamu (Guest)", requiredHosts: 30 },
    ],
    difficulty: "Intermediate",
    description: "Perusahaan logistik memerlukan jaringan baru untuk 40 workstation staf, 6 IP camera CCTV, dan Wi-Fi tamu. Wajib menerapkan isolasi VLAN demi keamanan data transaksi internal.",
  },
  "smk-tkj-school-lab": {
    slug: "smk-tkj-school-lab",
    title: "Proyek: Laboratorium Komputer SMK TKJ",
    clientName: "SMK Negeri 1 Teknologi",
    clientType: "school",
    budget: 75000000,
    wiredClientCount: 72,
    apCount: 4,
    requireVlan: true,
    requirePoe: true,
    vlanList: [
      { vlanId: 10, name: "Lab Komputer 1", requiredHosts: 36 },
      { vlanId: 20, name: "Lab Komputer 2", requiredHosts: 36 },
      { vlanId: 99, name: "Guru & Manajemen", requiredHosts: 20 },
    ],
    difficulty: "Advanced",
    description: "SMK Negeri 1 Teknologi meremajakan 2 Lab Komputer (@ 36 PC) dan koneksi ke Ruang Guru. Kebutuhan: Switch managed berkecepatan Gigabit, alokasi bandwidth merata, dan pembagian segmen per lab.",
  },
  "multi-floor-corporate": {
    slug: "multi-floor-corporate",
    title: "Proyek: Infrastruktur Enterprise Gedung 3 Lantai",
    clientName: "Gedung Menara Finansial 3-Lantai",
    clientType: "enterprise",
    budget: 120000000,
    wiredClientCount: 100,
    apCount: 6,
    requireVlan: true,
    requireDualWan: true,
    requirePoe: true,
    vlanList: [
      { vlanId: 10, name: "Lantai 1 Front Office", requiredHosts: 30 },
      { vlanId: 20, name: "Lantai 2 Finance & HR", requiredHosts: 40 },
      { vlanId: 30, name: "Lantai 3 Executive", requiredHosts: 30 },
      { vlanId: 50, name: "Wi-Fi Tamu", requiredHosts: 50 },
    ],
    difficulty: "Advanced",
    description: "Perancangan jaringan gedung 3 lantai dengan total 100 node kabel dan 6 Access Point Wi-Fi 6. Membutuhkan backbone Fiber Optic 10G antar lantai, Core Switch L3 terpusat di Server Room Lantai 1, dan segmentasi per divisi.",
  },
};

export default async function CaseDetailPage(props: {
  params: Promise<{ caseSlug: string }>;
}) {
  await getCurrentUser();
  const { caseSlug } = await props.params;

  const caseData = CASE_DETAILS[caseSlug];
  if (!caseData) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      <Link
        href="/consultant"
        className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Kembali ke Katalog Kasus Konsultan
      </Link>

      <ConsultantWorkspace caseData={caseData} />
    </div>
  );
}
