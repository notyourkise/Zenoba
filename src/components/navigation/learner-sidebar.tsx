"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export const WORKSPACE_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-learning", label: "Pembelajaran Saya" },
  { href: "/catalog", label: "Katalog Kursus" },
  { href: "/my-packages", label: "Paket Saya" },
  { href: "/orders", label: "Riwayat Pesanan" },
];

export function LearnerSidebar({ user, onOpenAccountModal }: LearnerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-50 dark:bg-black border-r border-zinc-200 dark:border-white/10 shrink-0 h-screen sticky top-0 text-zinc-900 dark:text-white select-none transition-colors">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-white/10">
        <Link
          href="/dashboard"
          className="font-bold text-lg tracking-wider text-zinc-900 dark:text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded px-1"
        >
          NETLOKA
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto" aria-label="Navigasi Utama Workspace">
        {WORKSPACE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500",
                isActive
                  ? "bg-zinc-200 dark:bg-white/10 text-zinc-900 dark:text-white font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Account Profile Trigger at Bottom */}
      <div className="p-3 border-t border-zinc-200 dark:border-white/10">
        <button
          type="button"
          onClick={onOpenAccountModal}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-white/15 flex items-center justify-center text-sm font-semibold shrink-0 text-zinc-800 dark:text-zinc-200 overflow-hidden">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name || "Avatar"} className="w-full h-full object-cover" />
            ) : (
              (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
              {user?.name || user?.email?.split("@")[0] || "Learner"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {user?.headline || "Akun & Pengaturan"}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
