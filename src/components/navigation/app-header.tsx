"use client";

import * as React from "react";
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
  Zap,
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

const learnPaths = [
  {
    title: "Path 1: Dasar Jaringan & Topologi",
    href: "/learn/path-1-pengenalan-jaringan",
    description: "Konsep LAN/WAN, Model OSI 7 Layer, dan perangkat keras jaringan.",
    icon: Network,
  },
  {
    title: "Path 2: Protokol Jaringan & TCP/IP",
    href: "/learn/path-2-protokol-tcpip",
    description: "TCP 3-Way Handshake, UDP, dan alur enkapsulasi paket data.",
    icon: Server,
  },
  {
    title: "Path 3: IPv4 & Subnetting CIDR / VLSM",
    href: "/learn/path-3-ipv4-subnetting",
    description: "Kalkulasi host usable, netmask, dan pembagian subnet bertingkat.",
    icon: Calculator,
  },
  {
    title: "Path 4: Layanan Jaringan & NAT",
    href: "/learn/path-4-network-services-security",
    description: "DHCP DORA, hierarki DNS resolving, dan translasi NAT/PAT.",
    icon: ShieldCheck,
  },
  {
    title: "Path 5: Wireless & Troubleshooting",
    href: "/learn/path-5-wireless-troubleshooting",
    description: "Wi-Fi 6, frekuensi 2.4/5GHz, WPA3, dan metodologi pelacakan masalah.",
    icon: Radio,
  },
];

const labsList = [
  {
    title: "Lab 1: Subnetting Calculator",
    href: "/labs/lab-subnetting",
    description: "Hitung alokasi network, broadcast, dan range IP host usable.",
    icon: Calculator,
  },
  {
    title: "Lab 2: Host IP & Gateway Config",
    href: "/labs/lab-ip-config",
    description: "Simulasi konfigurasi alamat IP workstation dan default gateway.",
    icon: Server,
  },
  {
    title: "Lab 4: VLAN Builder & Tagging",
    href: "/labs/lab-vlan",
    description: "Segmentasi port access dan trunking IEEE 802.1Q switch.",
    icon: Network,
  },
  {
    title: "Lab 5: Static Routing & LPM",
    href: "/labs/lab-routing",
    description: "Evaluasi jalur tabel routing dengan Longest Prefix Match.",
    icon: Zap,
  },
];

const challengesList = [
  {
    title: "Kasus 1: Branch Office Offline",
    href: "/challenges/branch-office-offline",
    description: "Diagnosa dan perbaiki workstation kantor cabang yang gagal ping internet.",
  },
  {
    title: "Kasus 2: Inter-VLAN Routing Bug",
    href: "/challenges/inter-vlan-routing-bug",
    description: "Lacak masalah isolasi dan komunikasi antar divisi HRD & Keuangan.",
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. Left Side: Brand Logo */}
          <div className="flex items-center justify-start flex-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                N
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Netloka
              </span>
            </Link>
          </div>

          {/* 2. Center: Desktop NavigationMenu */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {/* Dashboard Direct Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={
                      <Link
                        href="/dashboard"
                        className={`${navigationMenuTriggerStyle()} ${
                          pathname === "/dashboard"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                            : ""
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                        Dashboard
                      </Link>
                    }
                  />
                </NavigationMenuItem>

                {/* 1. Learn Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/learn")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[520px] p-4">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Kurikulum Jaringan Komputer
                        </span>
                        <Link
                          href="/learn"
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          Semua Path <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {learnPaths.map((path) => (
                          <ListItem
                            key={path.title}
                            title={path.title}
                            href={path.href}
                            icon={path.icon}
                          >
                            {path.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 2. Labs Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/labs")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }
                  >
                    <FlaskConical className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                    Labs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[500px] p-4">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Interactive Practice Labs (7 Labs)
                        </span>
                        <Link
                          href="/labs"
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          Semua Labs <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {labsList.map((lab) => (
                          <ListItem
                            key={lab.title}
                            title={lab.title}
                            href={lab.href}
                            icon={lab.icon}
                          >
                            {lab.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. Challenges Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/challenges")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }
                  >
                    <Bug className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                    Challenges
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[380px] p-4">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                          Troubleshooting Challenges
                        </span>
                        <Link
                          href="/challenges"
                          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                        >
                          Semua Skenario <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <ul className="grid grid-cols-1 gap-2">
                        {challengesList.map((ch) => (
                          <ListItem
                            key={ch.title}
                            title={ch.title}
                            href={ch.href}
                            icon={Terminal}
                          >
                            {ch.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. Consultant Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      pathname.startsWith("/consultant")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }
                  >
                    <ClipboardList className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                    Consultant
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[520px] p-4">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>IT Consultant Mode</span>
                        </div>
                        <Link
                          href="/consultant"
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          Semua Kasus <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
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
                      <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                        <Link
                          href="/consultant/portfolio"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                        >
                          <div>
                            <div className="font-bold text-xs text-indigo-700 dark:text-indigo-300">
                              Portofolio Proyek Konsultan Saya →
                            </div>
                            <div className="text-xs text-indigo-600 dark:text-indigo-400">
                              Lihat riwayat rancangan jaringan dan skor BoQ Anda.
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 3. Right Side: User Controls & ModeToggle */}
          <div className="flex items-center justify-end flex-1 gap-3">
            <ModeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="p-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/40 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                  title="Keluar"
                  aria-label="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-500" />
              Dashboard
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              Learn (5 Paths Kurikulum)
            </Link>
            <Link
              href="/labs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 gap-2"
            >
              <FlaskConical className="w-4 h-4 text-emerald-500" />
              Labs (7 Praktikum Interaktif)
            </Link>
            <Link
              href="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 gap-2"
            >
              <Bug className="w-4 h-4 text-rose-500" />
              Challenges (Troubleshooting Kasus Nyata)
            </Link>
            <Link
              href="/consultant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 gap-2"
            >
              <ClipboardList className="w-4 h-4 text-indigo-500" />
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

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link
            href={href}
            className="block select-none rounded-lg p-2.5 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
          >
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center font-bold text-gray-900 dark:text-white leading-none gap-1.5">
                {Icon && <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                <span>{title}</span>
              </div>
              <div className={`line-clamp-2 text-xs text-gray-500 dark:text-gray-400 ${Icon ? "pl-5" : ""}`}>
                {children}
              </div>
            </div>
          </Link>
        }
      />
    </li>
  );
}
