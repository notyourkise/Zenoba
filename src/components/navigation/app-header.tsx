"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  FlaskConical,
  Bug,
  ClipboardList,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Calculator,
  Terminal,
  Network,
  Radio,
  Server,
  ShieldCheck,
} from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
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

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                N
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Netloka
              </span>
            </Link>

            {/* Desktop NavigationMenu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {/* 1. Dashboard Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href="/dashboard" />}
                    className={`${navigationMenuTriggerStyle()} ${
                      pathname === "/dashboard"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* 2. Learn Dropdown Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/learn")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[420px] p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Kurikulum Jaringan (5 Paths)
                      </span>
                      <Link
                        href="/learn"
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                      >
                        Buka Katalog <ArrowRight className="w-3 h-3 ml-0.5" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <Link
                        href="/learn/path-1-pengenalan-jaringan"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="flex items-center text-xs font-bold text-gray-900 dark:text-white">
                          <Network className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                          Path 1: Dasar Jaringan & Topologi
                        </div>
                        <p className="text-[11px] text-gray-500 pl-5">Konsep LAN/WAN, Model OSI 7 Layer & Hardware</p>
                      </Link>
                      <Link
                        href="/learn/path-2-protokol-tcpip"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="flex items-center text-xs font-bold text-gray-900 dark:text-white">
                          <Server className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                          Path 2: Protokol Jaringan & TCP/IP
                        </div>
                        <p className="text-[11px] text-gray-500 pl-5">TCP 3-Way Handshake, UDP, dan Alur Paket Enkapsulasi</p>
                      </Link>
                      <Link
                        href="/learn/path-3-ipv4-subnetting"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="flex items-center text-xs font-bold text-gray-900 dark:text-white">
                          <Calculator className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                          Path 3: IPv4 & Subnetting CIDR / VLSM
                        </div>
                        <p className="text-[11px] text-gray-500 pl-5">Kalkulasi Host Usable, Netmask, dan Desain Subnet</p>
                      </Link>
                      <Link
                        href="/learn/path-4-network-services-security"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="flex items-center text-xs font-bold text-gray-900 dark:text-white">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                          Path 4: Network Services (DHCP, DNS, NAT)
                        </div>
                        <p className="text-[11px] text-gray-500 pl-5">DHCP DORA, DNS Hierarchy Resolving, dan PAT Translation</p>
                      </Link>
                      <Link
                        href="/learn/path-5-wireless-troubleshooting"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="flex items-center text-xs font-bold text-gray-900 dark:text-white">
                          <Radio className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                          Path 5: Wireless Network & Troubleshooting
                        </div>
                        <p className="text-[11px] text-gray-500 pl-5">Wi-Fi 6, 2.4/5GHz, WPA3, dan Metodologi Troubleshooting</p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. Labs Dropdown Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/labs")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }
                  >
                    <FlaskConical className="w-3.5 h-3.5 mr-1.5" />
                    Labs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[380px] p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Interactive Practice Labs (7 Labs)
                      </span>
                      <Link
                        href="/labs"
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
                      >
                        Semua Labs <ArrowRight className="w-3 h-3 ml-0.5" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <Link
                        href="/labs/lab-subnetting"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">Lab 1: Subnetting CIDR Calculator</div>
                        <p className="text-[11px] text-gray-500">Hitung Network, Broadcast, & Usable IP Host</p>
                      </Link>
                      <Link
                        href="/labs/lab-ip-config"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">Lab 2: Host IP & Gateway Configuration</div>
                        <p className="text-[11px] text-gray-500">Konfigurasi alamat IP workstation & default route</p>
                      </Link>
                      <Link
                        href="/labs/lab-vlan"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">Lab 4: VLAN Builder & Port Tagging</div>
                        <p className="text-[11px] text-gray-500">Segmentasi Access & Trunk 802.1Q switch port</p>
                      </Link>
                      <Link
                        href="/labs/lab-routing"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">Lab 5: Static Routing Table & LPM</div>
                        <p className="text-[11px] text-gray-500">Evaluasi tabel routing & Longest Prefix Match</p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. Challenges Dropdown Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/challenges")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }
                  >
                    <Bug className="w-3.5 h-3.5 mr-1.5" />
                    Challenges
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[380px] p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Troubleshooting Challenges
                      </span>
                      <Link
                        href="/challenges"
                        className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center"
                      >
                        Katalog Skenario <ArrowRight className="w-3 h-3 ml-0.5" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <Link
                        href="/challenges/branch-office-offline"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center">
                          <Terminal className="w-3 h-3 mr-1 text-rose-500" />
                          Kasus 1: Branch Office Offline
                        </div>
                        <p className="text-[11px] text-gray-500 pl-4">Diagnosa workstation gagal ping internet & gateway</p>
                      </Link>
                      <Link
                        href="/challenges/inter-vlan-routing-bug"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center">
                          <Terminal className="w-3 h-3 mr-1 text-rose-500" />
                          Kasus 2: Inter-VLAN Routing Bug
                        </div>
                        <p className="text-[11px] text-gray-500 pl-4">Isolasi traffic antar divisi HRD & Keuangan gagal</p>
                      </Link>
                      <Link
                        href="/challenges/dhcp-scope-exhaustion"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center">
                          <Terminal className="w-3 h-3 mr-1 text-rose-500" />
                          Kasus 3: DHCP Scope Exhaustion
                        </div>
                        <p className="text-[11px] text-gray-500 pl-4">Klien baru tidak mendapatkan alokasi IP DHCP</p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 5. Consultant Dropdown Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/consultant")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }
                  >
                    <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                    Consultant
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[360px] p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>IT Consultant Mode</span>
                      </div>
                      <Link
                        href="/consultant"
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                      >
                        Semua Kasus <ArrowRight className="w-3 h-3 ml-0.5" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <Link
                        href="/consultant/small-office-notaris"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">1. Kantor Notaris & PPAT (SOHO)</div>
                        <p className="text-[11px] text-gray-500">Budget 15 Juta • 12 PC & Wi-Fi Client</p>
                      </Link>
                      <Link
                        href="/consultant/smk-tkj-school-lab"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">4. Lab Komputer SMK TKJ</div>
                        <p className="text-[11px] text-gray-500">Budget 75 Juta • 72 PC Lab & VLAN Sekolah</p>
                      </Link>
                      <Link
                        href="/consultant/multi-floor-corporate"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">5. Gedung Korporat Multi-Lantai</div>
                        <p className="text-[11px] text-gray-500">Budget 120 Juta • 10G SFP+ Backbone Fiber</p>
                      </Link>
                      <Link
                        href="/consultant/portfolio"
                        className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors block mt-1"
                      >
                        <div className="font-bold text-xs text-indigo-700 dark:text-indigo-300">Portofolio Proyek Saya →</div>
                        <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80">Lihat skor & status proposal rancangan</p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Controls & ModeToggle */}
          <div className="flex items-center space-x-3">
            <ModeToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden lg:inline text-xs font-semibold text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Keluar"
                  aria-label="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/sign-in"
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/sign-up"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LayoutDashboard className="w-4 h-4 mr-2 text-blue-500" />
              Dashboard
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
              Learn (5 Paths Kurikulum)
            </Link>
            <Link
              href="/labs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FlaskConical className="w-4 h-4 mr-2 text-emerald-500" />
              Labs (7 Praktikum Interaktif)
            </Link>
            <Link
              href="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bug className="w-4 h-4 mr-2 text-rose-500" />
              Challenges (Troubleshooting Kasus Nyata)
            </Link>
            <Link
              href="/consultant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ClipboardList className="w-4 h-4 mr-2 text-indigo-500" />
              Consultant Mode (5 Kasus Proyek)
            </Link>
            <Link
              href="/consultant/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 pl-8"
            >
              Portofolio Proyek Saya
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
