import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LabRunner, LabDef } from "@/features/labs/components/lab-runner";

const LAB_DETAILS: Record<string, LabDef> = {
  "subnetting-calculator": {
    slug: "subnetting-calculator",
    title: "Subnetting & CIDR Calculation Lab",
    category: "Subnetting",
    difficulty: "Beginner",
    description: "Hitung parameter Network ID, Broadcast Address, dan jumlah usable host pada prefix /26.",
    instructions: [
      "Periksa alamat IPv4 yang diberikan (192.168.1.130/26).",
      "Gunakan rumus subnetting: Prefix /26 membagi oktet terakhir menjadi blok 64 (0, 64, 128, 192).",
      "Tentukan Network ID (192.168.1.128) dan Broadcast IP (192.168.1.191).",
      "Kalkulasikan jumlah host usable: (2^(32-26)) - 2 = 62 host.",
      "Klik tombol 'Validasi & Kumpulkan Lab' untuk menyelesaikan evaluasi.",
    ],
    xpReward: 100,
  },
  "ip-configuration": {
    slug: "ip-configuration",
    title: "Static IPv4 Configuration Lab",
    category: "IP Config",
    difficulty: "Beginner",
    description: "Konfigurasikan alamat IP, Subnet Mask, dan Default Gateway pada PC klien agar dapat menjangkau server.",
    instructions: [
      "Web Server internal berada pada alamat 192.168.10.50 dengan Subnet Mask 255.255.255.0 (/24).",
      "Default Gateway router lokal adalah 192.168.10.1.",
      "Isikan alamat IP PC Klien yang valid dalam rentang 192.168.10.2 s/d 192.168.10.254 (jangan gunakan IP yang konflik).",
      "Pastikan Subnet Mask dan Default Gateway sesuai.",
      "Kumpulkan lab untuk memverifikasi konektivitas.",
    ],
    xpReward: 100,
  },
  "vlan-segmentation": {
    slug: "vlan-segmentation",
    title: "VLAN Segmentation Lab",
    category: "Switching",
    difficulty: "Intermediate",
    description: "Terapkan isolasi broadcast domain dengan menetapkan Port 1-2 ke VLAN 10 dan Port 3-4 ke VLAN 20.",
    instructions: [
      "Buka workbench VLAN switch pada tab di bawah.",
      "Tetapkan Port Fa0/1 dan Fa0/2 ke VLAN 10 (Sales).",
      "Tetapkan Port Fa0/3 dan Fa0/4 ke VLAN 20 (Engineering).",
      "Uji pengiriman frame broadcast dan pastikan frame tidak bocor antar VLAN.",
      "Kumpulkan lab untuk evaluasi.",
    ],
    xpReward: 100,
  },
  "static-routing": {
    slug: "static-routing",
    title: "Static & Default Routing Lab",
    category: "Routing",
    difficulty: "Intermediate",
    description: "Konfigurasikan rute default 0.0.0.0/0 pada router menuju next-hop gateway 192.168.1.254.",
    instructions: [
      "Pelajari topologi 2-subnet yang terpisah oleh router gateway.",
      "Tetapkan Default Route: Destination 0.0.0.0, Prefix /0, Next-Hop 192.168.1.254.",
      "Lakukan pengujian rute Longest Prefix Match.",
      "Kumpulkan lab setelah rute aktif.",
    ],
    xpReward: 100,
  },
  "troubleshooting": {
    slug: "troubleshooting",
    title: "Diagnostic CLI Troubleshooting Lab",
    category: "Troubleshooting",
    difficulty: "Intermediate",
    description: "Gunakan perintah ipconfig, ping, arp, dan tracert untuk mengidentifikasi titik putus jaringan.",
    instructions: [
      "Jalankan `ipconfig /all` untuk memeriksa konfigurasi adapter klien.",
      "Jalankan `ping 192.168.1.1` untuk memastikan koneksi ke gateway lokal stabil.",
      "Jalankan `ping 8.8.8.8` untuk menguji akses jaringan internet.",
      "Periksa tabel pemetaan MAC dengan perintah `arp -a`.",
      "Kumpulkan lab setelah melakukan seluruh langkah diagnostik.",
    ],
    xpReward: 100,
  },
};

export default async function LabDetailPage(props: {
  params: Promise<{ labSlug: string }>;
}) {
  await getCurrentUser();
  const { labSlug } = await props.params;

  const lab = LAB_DETAILS[labSlug];
  if (!lab) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      <Link
        href="/labs"
        className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Kembali ke Katalog Lab
      </Link>

      <LabRunner lab={lab} />
    </div>
  );
}
