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
    title: "Dasar Jaringan & Topologi",
    href: "/learn/path-1-pengenalan-jaringan",
    description: "Konsep LAN/WAN, Model OSI 7 Layer, dan perangkat keras jaringan.",
  },
  {
    title: "IPv4 & Subnetting CIDR",
    href: "/learn/path-3-ipv4-subnetting",
    description: "Kalkulasi host usable, netmask, dan pembagian subnetting VLSM.",
  },
  {
    title: "Protokol Jaringan & TCP/IP",
    href: "/learn/path-2-protokol-tcpip",
    description: "TCP 3-Way Handshake, UDP, dan alur enkapsulasi paket data.",
  },
  {
    title: "NAT & Layanan Jaringan",
    href: "/learn/path-4-network-services-security",
    description: "DHCP DORA, hierarki DNS resolving, dan translasi NAT/PAT.",
  },
  {
    title: "Wireless & Troubleshooting",
    href: "/learn/path-5-wireless-troubleshooting",
    description: "Wi-Fi 6, frekuensi 2.4/5GHz, WPA3, dan metodologi pelacakan masalah.",
  },
];

const labsList = [
  {
    title: "Subnetting Calculator",
    href: "/labs/lab-subnetting",
    description: "Hitung alokasi network, broadcast, dan range IP host usable.",
  },
  {
    title: "VLAN Builder & Tagging",
    href: "/labs/lab-vlan",
    description: "Segmentasi port access dan trunking IEEE 802.1Q switch.",
  },
  {
    title: "Host IP & Gateway Config",
    href: "/labs/lab-ip-config",
    description: "Simulasi konfigurasi alamat IP workstation dan default gateway.",
  },
  {
    title: "Static Routing & LPM",
    href: "/labs/lab-routing",
    description: "Evaluasi jalur tabel routing dengan Longest Prefix Match.",
  },
];

const challengesList = [
  {
    title: "Branch Office Offline",
    href: "/challenges/branch-office-offline",
    description: "Diagnosa workstation kantor cabang yang gagal ping internet.",
  },
  {
    title: "Inter-VLAN Routing Bug",
    href: "/challenges/inter-vlan-routing-bug",
    description: "Lacak masalah isolasi dan komunikasi antar divisi jaringan.",
  },
  {
    title: "DHCP Scope Exhaustion",
    href: "/challenges/dhcp-scope-exhaustion",
    description: "Atasi masalah kehabisan alokasi pool IP address pada server DHCP.",
  },
];

const consultantCases = [
  {
    title: "Kantor Notaris & PPAT (SOHO)",
    href: "/consultant/small-office-notaris",
    description: "Budget 15 Juta • 12 PC Klien, Router & Wi-Fi Access Point.",
  },
  {
    title: "Laboratorium Komputer SMK TKJ",
    href: "/consultant/smk-tkj-school-lab",
    description: "Budget 75 Juta • 2 Lab @ 36 PC, Server Sekolah & VLAN Guru.",
  },
  {
    title: "Warnet & Gaming Center",
    href: "/consultant/warnet-gaming-center",
    description: "Budget 25 Juta • 30 PC Gaming, Dual-WAN Load Balance.",
  },
  {
    title: "Gedung Korporat Multi-Lantai",
    href: "/consultant/multi-floor-corporate",
    description: "Budget 120 Juta • 100 Node, Backbone Fiber Optic 10G SFP+.",
  },
  {
    title: "Kantor Logistik & Gudang",
    href: "/consultant/medium-office-logistics",
    description: "Budget 50 Juta • 40 PC, Segmentasi 3 VLAN & Wi-Fi Gudang.",
  },
];

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* 1. Left: Brand Logo (40x40px) */}
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

          {/* 2. Center: Desktop 2-Column Floating Navigation Menu */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <NavigationMenu>
              <NavigationMenuList className="gap-6 lg:gap-8">
                {/* 1. Dashboard */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={
                      <Link
                        href="/dashboard"
                        className={`${navigationMenuTriggerStyle()} ${
                          pathname === "/dashboard"
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 font-semibold"
                            : ""
                        }`}
                      >
                        Dashboard
                      </Link>
                    }
                  />
                </NavigationMenuItem>

                {/* 2. Belajar (2 Columns Dropdown) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger isActive={pathname.startsWith("/learn")}>
                    Belajar
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[640px]">
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {learnPaths.map((path) => (
                          <ListItem key={path.title} title={path.title} href={path.href}>
                            {path.description}
                          </ListItem>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-800 pt-2.5 mt-1 px-2">
                        <Link
                          href="/learn"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          Lihat seluruh kurikulum →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. Labs (2 Columns Dropdown) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger isActive={pathname.startsWith("/labs")}>
                    Labs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[640px]">
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {labsList.map((lab) => (
                          <ListItem key={lab.title} title={lab.title} href={lab.href}>
                            {lab.description}
                          </ListItem>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-800 pt-2.5 mt-1 px-2">
                        <Link
                          href="/labs"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          Lihat seluruh praktikum →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. Challenges (2 Columns Dropdown) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger isActive={pathname.startsWith("/challenges")}>
                    Challenges
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[620px]">
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {challengesList.map((ch) => (
                          <ListItem key={ch.title} title={ch.title} href={ch.href}>
                            {ch.description}
                          </ListItem>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-800 pt-2.5 mt-1 px-2">
                        <Link
                          href="/challenges"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          Lihat seluruh tantangan →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 5. Konsultasi (2 Columns Dropdown) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger isActive={pathname.startsWith("/consultant")}>
                    Konsultasi
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[640px]">
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {consultantCases.map((cs) => (
                          <ListItem key={cs.title} title={cs.title} href={cs.href}>
                            {cs.description}
                          </ListItem>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-800 pt-2.5 mt-1 px-2 flex items-center justify-between">
                        <Link
                          href="/consultant"
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Katalog Kasus Konsultasi →
                        </Link>
                        <Link
                          href="/consultant/portfolio"
                          className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:underline"
                        >
                          Portofolio Proyek Saya →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 3. Right: Theme Toggle & Vertical Text Slide Auth Buttons */}
          <div className="flex items-center justify-end flex-1 gap-4 sm:gap-5">
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
                  className="p-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/40 transition-colors"
                  title="Keluar"
                  aria-label="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Secondary Button: Masuk (Compact 36px height, 80px min-width) */}
                <Button
                  variant="outline-dark"
                  asChild
                  className="group h-9 min-w-[80px] px-3.5 rounded-lg text-xs font-semibold overflow-hidden cursor-pointer"
                >
                  <Link href="/sign-in">
                    <SlidingButtonLabel
                      text="Masuk"
                      className="text-gray-900 dark:text-white font-semibold"
                    />
                  </Link>
                </Button>

                {/* Primary CTA: Mulai Gratis (Compact 36px height, 116px min-width) */}
                <Button
                  variant="solid-light"
                  asChild
                  className="group h-9 min-w-[116px] px-4 rounded-lg text-xs font-semibold overflow-hidden cursor-pointer"
                >
                  <Link href="/sign-up">
                    <SlidingButtonLabel
                      text="Mulai Gratis"
                      className="text-white dark:text-[#0a0a0a] font-semibold"
                    />
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile hamburger menu */}
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
              <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2.5">
                <Button
                  variant="outline-dark"
                  asChild
                  className="w-full h-[42px] rounded-xl justify-center text-sm font-semibold"
                >
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button
                  variant="solid-light"
                  asChild
                  className="w-full h-[42px] rounded-xl justify-center text-sm font-semibold"
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

function SlidingButtonLabel({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className="relative inline-block h-4 overflow-hidden select-none">
      <span className="flex flex-col transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1/2 will-change-transform">
        <span className={`h-4 flex items-center justify-center leading-none ${className || ""}`}>
          {text}
        </span>
        <span className={`h-4 flex items-center justify-center leading-none ${className || ""}`}>
          {text}
        </span>
      </span>
    </span>
  );
}

function ListItem({
  title,
  children,
  href,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  href: string;
  title: string;
}) {
  return (
    <div {...props} className={className}>
      <NavigationMenuLink
        render={
          <Link
            href={href}
            className="block select-none rounded-lg p-2.5 text-left transition-colors hover:bg-gray-100/80 dark:hover:bg-gray-800/70"
          >
            <div className="flex flex-col gap-0.5">
              <div className="font-semibold text-xs text-gray-900 dark:text-white leading-snug">
                {title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-normal line-clamp-2">
                {children}
              </div>
            </div>
          </Link>
        }
      />
    </div>
  );
}
