import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
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
  const user = await getCurrentUser();
  const { caseSlug } = await props.params;

  const caseData = CASE_DETAILS[caseSlug];
  if (!caseData) {
    notFound();
  }

  // Check prerequisite if this is an advanced case (cases 2-5)
  let isLocked = false;
  if (caseSlug !== "small-office-notaris") {
    if (!user?.id) {
      isLocked = true;
    } else {
      const foundationalPassed = await prisma.consultantProject.findFirst({
        where: {
          userId: user.id,
          case: { slug: "small-office-notaris" },
          passed: true,
        },
      });
      isLocked = !foundationalPassed;
    }
  }

  if (isLocked) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Link
          href="/consultant"
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          &larr; Kembali ke Katalog Kasus Konsultan
        </Link>

        <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            Prasyarat Belum Terpenuhi
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Akses Studi Kasus Masih Terkunci
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Studi kasus <strong>{caseData.title}</strong> merupakan proyek lanjutan. Anda wajib menyelesaikan dan mendapatkan kelulusan (skor &ge; 70) pada studi kasus fondasi terlebih dahulu.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/consultant/small-office-notaris"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Buka Studi Kasus Fondasi (SOHO Notaris) &rarr;
            </Link>
            <Link
              href="/consultant"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      <Link
        href="/consultant"
        className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        &larr; Kembali ke Katalog Kasus Konsultan
      </Link>

      <ConsultantWorkspace caseData={caseData} />
    </div>
  );
}
