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
              href="/dashboard"
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
                {/* Dashboard Link */}
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

                {/* Learn Menu with Rich Dropdown */}
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
                  <NavigationMenuContent className="w-[360px] p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Kurikulum Jaringan (5 Paths)
                      </span>
                      <Link
                        href="/learn"
                        className="text-[11px] font-bold text-gray-500 hover:text-blue-600 flex items-center"
                      >
                        Semua Path <ArrowRight className="w-3 h-3 ml-0.5" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <Link
                        href="/learn/path-1-pengenalan-jaringan"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">Path 1: Dasar Jaringan & Topologi</div>
                        <p className="text-[11px] text-gray-500">Konsep LAN/WAN, OSI Model & Hardware</p>
                      </Link>
                      <Link
                        href="/learn/path-3-ipv4-subnetting"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">Path 3: IPv4 & Subnetting CIDR</div>
                        <p className="text-[11px] text-gray-500">Kalkulasi Host, Netmask, dan VLSM</p>
                      </Link>
                      <Link
                        href="/learn/path-4-network-services-security"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                      >
                        <div className="font-bold text-xs text-gray-900 dark:text-white">Path 4: Layanan Jaringan & NAT</div>
                        <p className="text-[11px] text-gray-500">DHCP DORA, DNS Hierarchy, dan PAT</p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Labs Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href="/labs" />}
                    className={`${navigationMenuTriggerStyle()} ${
                      pathname.startsWith("/labs")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }`}
                  >
                    <FlaskConical className="w-3.5 h-3.5 mr-1.5" />
                    Labs
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Challenges Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href="/challenges" />}
                    className={`${navigationMenuTriggerStyle()} ${
                      pathname.startsWith("/challenges")
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                        : ""
                    }`}
                  >
                    <Bug className="w-3.5 h-3.5 mr-1.5" />
                    Challenges
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Consultant Menu with Dropdown */}
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
                  <NavigationMenuContent className="w-[320px] p-4 space-y-2">
                    <div className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>IT Consultant Mode</span>
                    </div>
                    <Link
                      href="/consultant"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                    >
                      <div className="font-bold text-xs text-gray-900 dark:text-white">Katalog Studi Kasus Klien</div>
                      <p className="text-[11px] text-gray-500">5 Kasus Proyek Nyata (Small Office - Enterprise)</p>
                    </Link>
                    <Link
                      href="/consultant/portfolio"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block border-t border-gray-100 dark:border-gray-800 pt-2"
                    >
                      <div className="font-bold text-xs text-indigo-600 dark:text-indigo-400">Portofolio Proyek Saya →</div>
                      <p className="text-[11px] text-gray-500">Riwayat proposal dan skor rancangan jaringan</p>
                    </Link>
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
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium text-xs">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden lg:inline text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
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
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learn (5 Paths)
            </Link>
            <Link
              href="/labs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Labs (7 Praktikum)
            </Link>
            <Link
              href="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bug className="w-4 h-4 mr-2" />
              Challenges (Troubleshooting)
            </Link>
            <Link
              href="/consultant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Consultant Mode
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
