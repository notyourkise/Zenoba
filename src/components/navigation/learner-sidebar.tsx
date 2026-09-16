"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  LayoutGrid,
  Package,
  History,
  Terminal,
  Wrench,
  Monitor,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface LearnerSidebarProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
    headline?: string | null;
    streakCount?: number;
    lastStreakDate?: string | null;
  } | null;
  onOpenAccountModal: () => void;
}

export interface NavItemConfig {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const WORKSPACE_NAV_ITEMS: NavItemConfig[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/my-learning", label: "Pembelajaran Saya", icon: BookOpen },
  { href: "/learn/search", label: "Pencarian Kurikulum", icon: Search },
  { href: "/catalog", label: "Katalog Kursus", icon: LayoutGrid },
  { href: "/my-packages", label: "Paket Saya", icon: Package },
  { href: "/orders", label: "Riwayat Pesanan", icon: History },
];

export const EXPLORATION_NAV_ITEMS: NavItemConfig[] = [
  { href: "/labs", label: "Interactive Labs", icon: Terminal },
  { href: "/challenges", label: "Troubleshooting Challenges", icon: Wrench },
  { href: "/consultant", label: "Simulasi Konsultan TI", icon: Monitor },
];

export function LearnerSidebar({ user, onOpenAccountModal }: LearnerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#060913] border-r border-blue-900/20 shrink-0 h-screen sticky top-0 text-white select-none">
      {/* Brand Header */}
      <div className="pt-7 pb-5 px-6">
        <Link
          href="/dashboard"
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          <span className="font-black text-xl tracking-wider text-white block">
            NETLOKA
          </span>
          <span className="text-[11px] text-zinc-400 font-medium tracking-normal block mt-1">
            Learn · Practice · Connect
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto" aria-label="Navigasi Utama Workspace">
        {/* MENU UTAMA */}
        <div>
          <h2 className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase px-3 mb-2">
            Menu Utama
          </h2>
          <div className="space-y-1.5">
            {WORKSPACE_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/30 font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-zinc-400")} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* EKSPLORASI */}
        <div>
          <h2 className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase px-3 mb-2">
            Eksplorasi
          </h2>
          <div className="space-y-1.5">
            {EXPLORATION_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/30 font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-zinc-400")} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Account Profile Trigger at Bottom */}
      <div className="p-4 border-t border-blue-900/20">
        <button
          type="button"
          onClick={onOpenAccountModal}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0B1120] hover:bg-[#0F172A] border border-blue-900/30 hover:border-blue-500/40 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {user?.name || user?.email?.split("@")[0] || "Dev Netloka"}
            </p>
            <p className="text-xs text-zinc-400 truncate">
              {user?.headline || (user?.role === "ADMIN" ? "Administrator" : "Developer")}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
