"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, User, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface AppHeaderProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

const learnPaths = [
  {
    title: "Path 1: Dasar Jaringan & Topologi",
    href: "/learn/path-1-pengenalan-jaringan",
    description: "Konsep LAN/WAN, Model OSI 7 Layer, dan perangkat keras jaringan.",
  },
  {
    title: "Path 2: Protokol Jaringan & TCP/IP",
    href: "/learn/path-2-protokol-tcpip",
    description: "TCP 3-Way Handshake, UDP, dan alur enkapsulasi paket data.",
  },
  {
    title: "Path 3: IPv4 & Subnetting CIDR",
    href: "/learn/path-3-ipv4-subnetting",
    description: "Kalkulasi host usable, netmask, dan pembagian subnetting VLSM.",
  },
  {
    title: "Path 4: Layanan Jaringan & NAT",
    href: "/learn/path-4-network-services-security",
    description: "DHCP DORA, hierarki DNS resolving, dan translasi NAT/PAT.",
  },
  {
    title: "Path 5: Wireless & Troubleshooting",
    href: "/learn/path-5-wireless-troubleshooting",
    description: "Wi-Fi 6, frekuensi 2.4/5GHz, WPA3, dan metodologi pelacakan masalah.",
  },
];

const labsList = [
  {
    title: "Lab 1: Subnetting Calculator",
    href: "/labs/lab-subnetting",
    description: "Hitung alokasi network, broadcast, dan range IP host usable.",
  },
  {
    title: "Lab 2: Host IP & Gateway Config",
    href: "/labs/lab-ip-config",
    description: "Simulasi konfigurasi alamat IP workstation dan default gateway.",
  },
  {
    title: "Lab 4: VLAN Builder & Tagging",
    href: "/labs/lab-vlan",
    description: "Segmentasi port access dan trunking IEEE 802.1Q switch.",
  },
  {
    title: "Lab 5: Static Routing & LPM",
    href: "/labs/lab-routing",
    description: "Evaluasi jalur tabel routing dengan Longest Prefix Match.",
  },
];

const challengesList = [
  {
    title: "Kasus 1: Branch Office Offline",
    href: "/challenges/branch-office-offline",
    description: "Diagnosa workstation kantor cabang yang gagal ping internet.",
  },
  {
    title: "Kasus 2: Inter-VLAN Routing Bug",
    href: "/challenges/inter-vlan-routing-bug",
    description: "Lacak masalah isolasi dan komunikasi antar divisi jaringan.",
  },
  {
    title: "Kasus 3: DHCP Scope Exhaustion",
    href: "/challenges/dhcp-scope-exhaustion",
    description: "Atasi masalah kehabisan alokasi pool IP address pada server DHCP.",
  },
];

const consultantCases = [
  {
    title: "1. Kantor Notaris & PPAT (SOHO)",
    href: "/consultant/small-office-notaris",
    description: "Budget 15 Juta • 12 PC Klien, Router & Wi-Fi Access Point.",
  },
  {
    title: "2. Warnet & Esports Gaming Center",
    href: "/consultant/warnet-gaming-center",
    description: "Budget 25 Juta • 30 PC Gaming, Dual-WAN Load Balance.",
  },
  {
    title: "3. Kantor Logistik & Gudang",
    href: "/consultant/medium-office-logistics",
    description: "Budget 50 Juta • 40 PC, Segmentasi 3 VLAN & Wi-Fi Gudang.",
  },
  {
    title: "4. Laboratorium Komputer SMK TKJ",
    href: "/consultant/smk-tkj-school-lab",
    description: "Budget 75 Juta • 2 Lab @ 36 PC, Server Sekolah & VLAN Guru.",
  },
  {
    title: "5. Gedung Korporat Multi-Lantai",
    href: "/consultant/multi-floor-corporate",
    description: "Budget 120 Juta • 100 Node, Backbone Fiber Optic 10G SFP+.",
  },
];

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* 1. Left Side: Brand Logo (40x40px, Blue Primary Mark) */}
          <div className="flex items-center justify-start flex-1">
            <Link
              href="/"
              className="flex items-center gap-3 focus:outline-none rounded-lg p-1 hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Netloka
              </span>
            </Link>
          </div>

          {/* 2. Center: Desktop NavigationMenu with Active States & Bahasa Indonesia */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <NavigationMenu>
              <NavigationMenuList className="gap-1 lg:gap-2">
                {/* 1. Dashboard */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={
                      <Link
                        href="/dashboard"
                        className={`${navigationMenuTriggerStyle()} ${
                          pathname === "/dashboard"
                            ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-950/40"
                            : ""
                        }`}
                      >
                        Dashboard
                      </Link>
                    }
                  />
                </NavigationMenuItem>

                {/* 2. Belajar */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    isActive={pathname.startsWith("/learn")}
                  >
                    Belajar
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[380px]">
                    <div className="p-2">
                      <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-1.5">
                        Kurikulum Belajar (5 Paths)
                      </div>
                      <ul className="space-y-1">
                        {learnPaths.map((path) => (
                          <ListItem
                            key={path.title}
                            title={path.title}
                            href={path.href}
                          >
                            {path.description}
                          </ListItem>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 px-2">
                        <Link
                          href="/learn"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline block"
                        >
                          Lihat Seluruh Kurikulum →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. Labs */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    isActive={pathname.startsWith("/labs")}
                  >
                    Labs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[360px]">
                    <div className="p-2">
                      <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-1.5">
                        Praktikum Interaktif (7 Labs)
                      </div>
                      <ul className="space-y-1">
                        {labsList.map((lab) => (
                          <ListItem
                            key={lab.title}
                            title={lab.title}
                            href={lab.href}
                          >
                            {lab.description}
                          </ListItem>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 px-2">
                        <Link
                          href="/labs"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline block"
                        >
                          Lihat Seluruh Praktikum →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. Challenges */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    isActive={pathname.startsWith("/challenges")}
                  >
                    Challenges
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[360px]">
                    <div className="p-2">
                      <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-1.5">
                        Tantangan Kasus Nyata (3 Kasus)
                      </div>
                      <ul className="space-y-1">
                        {challengesList.map((ch) => (
                          <ListItem
                            key={ch.title}
                            title={ch.title}
                            href={ch.href}
                          >
                            {ch.description}
                          </ListItem>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 px-2">
                        <Link
                          href="/challenges"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline block"
                        >
                          Lihat Seluruh Tantangan →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 5. Konsultasi */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    isActive={pathname.startsWith("/consultant")}
                  >
                    Konsultasi
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[380px]">
                    <div className="p-2">
                      <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-1.5">
                        Studi Kasus Konsultasi TI
                      </div>
                      <ul className="space-y-1">
                        {consultantCases.map((cs) => (
                          <ListItem
                            key={cs.title}
                            title={cs.title}
                            href={cs.href}
                          >
                            {cs.description}
                          </ListItem>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 px-2 flex items-center justify-between">
                        <Link
                          href="/consultant"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Katalog Kasus →
                        </Link>
                        <Link
                          href="/consultant/portfolio"
                          className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:underline"
                        >
                          Portofolio Proyek →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 3. Right Side: Theme Toggle & Prominent Auth CTA [ Masuk ] [ Mulai Gratis ] */}
          <div className="flex items-center justify-end flex-1 gap-3 sm:gap-4">
            <ModeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden lg:inline text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/40 transition-colors"
                  title="Keluar"
                  aria-label="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* Secondary Button: Masuk */}
                <Button
                  variant="outline"
                  asChild
                  className="h-10 px-4 sm:px-5 rounded-lg text-sm font-medium border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <Link href="/sign-in">
                    Masuk
                  </Link>
                </Button>

                {/* Primary CTA: Mulai Gratis */}
                <Button
                  variant="default"
                  asChild
                  className="h-10 px-4 sm:px-5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25 border-transparent transition-all duration-150"
                >
                  <Link href="/sign-up">
                    Mulai Gratis
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 space-y-1 animate-in fade-in-50">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/learn")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Belajar (5 Paths)
            </Link>
            <Link
              href="/labs"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/labs")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Labs (7 Praktikum)
            </Link>
            <Link
              href="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/challenges")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Challenges (3 Kasus)
            </Link>
            <Link
              href="/consultant"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/consultant")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Konsultasi Proyek
            </Link>

            {!user && (
              <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                <Button
                  variant="outline"
                  asChild
                  className="w-full h-10 rounded-lg justify-center text-sm font-medium"
                >
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button
                  variant="default"
                  asChild
                  className="w-full h-10 rounded-lg justify-center text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    Mulai Gratis
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  title: string;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link
            href={href}
            className="block select-none rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
          >
            <div className="flex flex-col gap-0.5">
              <div className="font-semibold text-xs text-gray-900 dark:text-white leading-snug">
                {title}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal line-clamp-1">
                {children}
              </div>
            </div>
          </Link>
        }
      />
    </li>
  );
}
