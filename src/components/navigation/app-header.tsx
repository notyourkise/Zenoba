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
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. Left Side: Brand Logo */}
          <div className="flex items-center justify-start flex-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus:outline-none rounded-lg p-1 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Netloka
              </span>
            </Link>
          </div>

          {/* 2. Center: Desktop NavigationMenu */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <NavigationMenu>
              <NavigationMenuList className="gap-6 lg:gap-8">
                {/* Dashboard */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={
                      <Link
                        href="/dashboard"
                        className={`${navigationMenuTriggerStyle()} ${
                          pathname === "/dashboard"
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : ""
                        }`}
                      >
                        Dashboard
                      </Link>
                    }
                  />
                </NavigationMenuItem>

                {/* 1. Learn */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/learn")
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : ""
                    }
                  >
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[380px]">
                    <div className="p-2.5">
                      <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-2">
                        Kurikulum Jaringan (5 Paths)
                      </div>
                      <ul className="space-y-2">
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
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2.5 pt-2 px-2.5">
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

                {/* 2. Labs */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/labs")
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : ""
                    }
                  >
                    Labs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[360px]">
                    <div className="p-2.5">
                      <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-2">
                        Praktikum Interaktif (7 Labs)
                      </div>
                      <ul className="space-y-2">
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
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2.5 pt-2 px-2.5">
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

                {/* 3. Challenges */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/challenges")
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : ""
                    }
                  >
                    Challenges
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[360px]">
                    <div className="p-2.5">
                      <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-2">
                        Troubleshooting Kasus Nyata
                      </div>
                      <ul className="space-y-2">
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
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2.5 pt-2 px-2.5">
                        <Link
                          href="/challenges"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline block"
                        >
                          Lihat Seluruh Kasus →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. Consultant */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/consultant")
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : ""
                    }
                  >
                    Consultant
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[380px]">
                    <div className="p-2.5">
                      <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-2">
                        Studi Kasus Proyek Konsultan TI
                      </div>
                      <ul className="space-y-2">
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
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2.5 pt-2 px-2.5 flex items-center justify-between">
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
                          Portofolio Saya →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 3. Right Side: Shifted Left with Generous Spacing, Animated Lift Buttons, and Colors */}
          <div className="flex items-center justify-end flex-1 gap-5 pr-2 sm:pr-4">
            <ModeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              <div className="flex items-center gap-4">
                {/* Button Masuk / Login: Dark Theme = White BG / Black Text; Light Theme = Black BG / White Text */}
                <Button
                  asChild
                  className="group px-4 py-1.5 h-auto text-xs font-semibold border border-gray-300 dark:border-gray-700 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 shadow-sm"
                >
                  <Link href="/sign-in">
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                      Masuk
                    </span>
                  </Link>
                </Button>

                {/* Button Daftar / Register: Dark Theme = Black BG / White Text; Light Theme = White BG / Black Text */}
                <Button
                  asChild
                  className="group px-4 py-1.5 h-auto text-xs font-semibold border border-gray-300 dark:border-gray-700 bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-900 shadow-sm"
                >
                  <Link href="/sign-up">
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                      Daftar
                    </span>
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
          <div className="md:hidden py-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Dashboard
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Learn (5 Paths)
            </Link>
            <Link
              href="/labs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Labs (7 Praktikum)
            </Link>
            <Link
              href="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Challenges (Troubleshooting)
            </Link>
            <Link
              href="/consultant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Consultant Mode
            </Link>
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
