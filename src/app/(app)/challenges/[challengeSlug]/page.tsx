import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { ChallengeRunner, ChallengeDef } from "@/features/challenges/components/challenge-runner";
import { SupportChallengePlayer } from "@/features/challenges/components/support-challenge-player";
import { SchoolRoomAllocationPlayer } from "@/features/challenges/components/school-room-allocation-player";
import { StaffGuestVlanPlayer } from "@/features/challenges/components/staff-guest-vlan-player";
import { NamedServicePlayer } from "@/features/challenges/components/named-service-player";

const CHALLENGE_DETAILS: Record<string, ChallengeDef> = {
  "branch-office-down": {
    slug: "branch-office-down",
    title: "Insiden: Kantor Cabang Bandung Offline Total",
    difficulty: "Intermediate",
    description: "Seluruh karyawan di kantor cabang tidak dapat mengakses intranet kantor pusat maupun internet.",
    scenario: "Pukul 09:15 WIB, IT Helpdesk menerima 15 tiket komplain dari Kantor Cabang Bandung. Pengguna melaporkan bahwa browser menampilkan pesan 'DNS_PROBE_FINISHED_NO_INTERNET' dan aplikasi ERP tidak dapat dibuka.",
    symptoms: [
      "Lampu indikator link LAN pada switch menyala hijau normal.",
      "Workstation klien mendapatkan IP 192.168.1.100 melalui DHCP.",
      "Perintah `ping 192.168.1.1` (Gateway asli) mengalami Request Timed Out.",
      "Tabel routing pada adapter klien menunjukkan Default Gateway diarahkan ke 192.168.1.254.",
    ],
    options: [
      { id: "cable-cut", label: "Kabel Fiber Optik backbone ISP putus di jalan raya." },
      { id: "gateway-misconfig", label: "Konfigurasi Default Gateway router/DHCP salah arah ke IP 192.168.1.254 alih-alih 192.168.1.1." },
      { id: "dns-ddos", label: "Server DNS 1.1.1.1 sedang mengalami serangan DDoS global." },
      { id: "switch-burned", label: "Core switch kantor cabang terbakar komponen catu dayanya." },
    ],
    xpReward: 150,
  },
  "inter-vlan-routing-bug": {
    slug: "inter-vlan-routing-bug",
    title: "Insiden: Kegagalan Akses Server Inter-VLAN",
    difficulty: "Intermediate",
    description: "Klien di VLAN 10 (Sales) tidak dapat terhubung ke Database Server di VLAN 20.",
    scenario: "Departemen Sales baru saja dipindahkan ke VLAN 10 untuk meningkatkan keamanan. Namun setelah migrasi, aplikasi POS di VLAN 10 gagal berkomunikasi dengan Database Server di VLAN 20.",
    symptoms: [
      "PC Sales (192.168.10.5) dapat saling ping ke sesama PC Sales di VLAN 10.",
      "Database Server (192.168.20.10) dapat diakses oleh staf IT yang berada di VLAN 20.",
      "Ping dari PC Sales ke Database Server (192.168.20.10) Destination Host Unreachable.",
      "Port switch yang menuju router (Fa0/24) berstatus Access VLAN 1 bukan 802.1Q Trunk.",
    ],
    options: [
      { id: "missing-subinterface-trunk", label: "Port uplink Fa0/24 switch ke Router belum dikonfigurasi sebagai 802.1Q Trunk." },
      { id: "wrong-database-password", label: "Password database PostgreSQL diubah oleh database administrator." },
      { id: "ip-conflict", label: "Terjadi IP conflict antara Database Server dan Router." },
    ],
    xpReward: 150,
  },
  "dhcp-pool-exhausted": {
    slug: "dhcp-pool-exhausted",
    title: "Insiden: Alamat IP APIPA 169.254.x.x",
    difficulty: "Intermediate",
    description: "Karyawan baru di lantai 2 mendapatkan status 'No Internet Access' dengan IP aneh 169.254.12.88.",
    scenario: "Perusahaan menyelenggarakan training yang dihadiri 30 peserta baru di ruang rapat lantai 2. Peserta baru tidak bisa browsing, sedangkan karyawan lama yang datang lebih pagi tetap terhubung normal.",
    symptoms: [
      "Hasil perintah `ipconfig` pada laptop peserta: IPv4: 169.254.12.88 (APIPA auto-configuration).",
      "Kabel UTP dan Access Point Wi-Fi berfungsi dengan sinyal penuh.",
      "DHCP Server Scope di router disetel pada prefix /28 (hanya menyediakan 14 alamat IP).",
      "Tabel DHCP Leases router berstatus 14/14 Active Leases (Full).",
    ],
    options: [
      { id: "pool-exhaustion", label: "Kapasitas DHCP Scope (/28 = 14 host) telah habis terisi (Pool Exhaustion)." },
      { id: "virus-attack", label: "Laptop seluruh peserta terinfeksi virus ransomware." },
      { id: "wifi-frequency-jamming", label: "Sinyal Wi-Fi mengalami jamming frekuensi microwave." },
    ],
    xpReward: 150,
  },
};

export default async function ChallengeDetailPage(props: {
  params: Promise<{ challengeSlug: string }>;
  searchParams?: Promise<{ isPathFinal?: string }>;
}) {
  await getCurrentUser();
  const { challengeSlug } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const isPathFinal = searchParams?.isPathFinal === "true";

  if (challengeSlug === "first-day-it-support") {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-4">
        <Link
          href={isPathFinal ? "/learn/network-foundations" : "/challenges"}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {isPathFinal ? "Kembali ke Network Foundations" : "Kembali ke Katalog Tantangan"}
        </Link>

        <SupportChallengePlayer isPathFinal={isPathFinal} />
      </div>
    );
  }

  if (challengeSlug === "school-room-allocation") {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-4">
        <Link
          href={isPathFinal ? "/learn/ipv4-subnetting" : "/challenges"}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {isPathFinal ? "Kembali ke IPv4 & Subnetting" : "Kembali ke Katalog Tantangan"}
        </Link>

        <SchoolRoomAllocationPlayer isPathFinal={isPathFinal} />
      </div>
    );
  }

  if (challengeSlug === "staff-guest-vlan-repair") {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-4">
        <Link
          href={isPathFinal ? "/learn/switching-lan" : "/challenges"}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {isPathFinal ? "Kembali ke Switching & LAN" : "Kembali ke Katalog Tantangan"}
        </Link>

        <StaffGuestVlanPlayer isPathFinal={isPathFinal} />
      </div>
    );
  }

  if (challengeSlug === "named-service-outage") {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-4">
        <Link
          href={isPathFinal ? "/learn/network-services" : "/challenges"}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {isPathFinal ? "Kembali ke Routing & Layanan Jaringan" : "Kembali ke Katalog Tantangan"}
        </Link>

        <NamedServicePlayer isPathFinal={isPathFinal} />
      </div>
    );
  }

  const challenge = CHALLENGE_DETAILS[challengeSlug];
  if (!challenge) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      <Link
        href="/challenges"
        className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Kembali ke Katalog Tantangan
      </Link>

      <ChallengeRunner challenge={challenge} />
    </div>
  );
}
