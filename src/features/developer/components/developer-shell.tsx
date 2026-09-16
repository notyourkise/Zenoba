"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ElevationDialog } from "./elevation-dialog";

export interface DeveloperActor {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  twoFactorEnabled?: boolean;
}

export interface DeveloperShellProps {
  actor: DeveloperActor;
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Ringkasan",
    href: "/developer",
    description: "Metrik agregat dan status operasional",
  },
  {
    name: "Pengguna",
    href: "/developer/users",
    description: "Direktori akun, progres, dan filter peran",
  },
  {
    name: "Akses & Paket",
    href: "/developer/access",
    description: "Audit paket dan status entitlement",
  },
  {
    name: "Kesehatan Kurikulum",
    href: "/developer/curriculum",
    description: "Integritas modul, kuis, dan capstone",
  },
  {
    name: "Analitik Pembelajaran",
    href: "/developer/learning",
    description: "Kesehatan asesmen, outcome, dan metrik kohor privasi",
  },
  {
    name: "Kesehatan Sistem",
    href: "/developer/system",
    description: "Status database, memori, dan environment",
  },
  {
    name: "Keamanan",
    href: "/developer/security",
    description: "Isolasi workspace dan kesiapan elevasi",
  },
  {
    name: "Akun Pengembang",
    href: "/developer/account",
    description: "Detail identitas sesi dan proteksi akun",
  },
];

export function DeveloperShell({ actor, children }: DeveloperShellProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Close mobile drawer on route change without cascading renders
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileOpen(false);
  }

  // Handle escape key to close mobile drawer
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  function isItemActive(href: string): boolean {
    if (href === "/developer") {
      return pathname === "/developer";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#080d1a]/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Buka menu navigasi pengembang"
              aria-expanded={isMobileOpen}
              className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Buka menu navigasi pengembang</span>
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                  Netloka Developer Workspace
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  DEVELOPER
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Portal Pemantauan & Operasional Terisolasi
              </p>
            </div>
          </div>

          {/* User Info & Sign Out */}
          <div className="flex items-center gap-3">
            <ElevationDialog />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200">{actor.name || actor.email}</p>
              <p className="text-xs text-slate-400 font-mono">{actor.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout (Sidebar + Body) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#080d1a] border-r border-slate-800 p-4 justify-between">
          <nav aria-label="Navigasi Pengembang" className="space-y-1">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Menu Operasional
            </p>
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    active
                      ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <div>{item.name}</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                    {item.description}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Read-Only Notice Box */}
          <div className="mt-6 p-3 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Mode Read-Only</p>
            <p>
              Operasi sistem, migrasi, dan konfigurasi server dikelola langsung via VPS CLI.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi pengembang"
          className="fixed inset-0 z-50 md:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#080d1a] border-r border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Menu Pengembang</h2>
                  <p className="text-xs text-slate-400">{actor.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Tutup menu navigasi pengembang"
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Tutup menu navigasi pengembang</span>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav aria-label="Navigasi Pengembang Mobile" className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setIsMobileOpen(false)}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                        active
                          ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-500"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full px-4 py-2 rounded-md text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
