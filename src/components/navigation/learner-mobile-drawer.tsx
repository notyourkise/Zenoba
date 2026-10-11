"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORKSPACE_NAV_ITEMS, EXPLORATION_NAV_ITEMS } from "./learner-sidebar";

export interface LearnerMobileDrawerProps {
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

export function LearnerMobileDrawer({
  user,
  onOpenAccountModal,
}: LearnerMobileDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const toggleBtnRef = React.useRef<HTMLButtonElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const wasOpenRef = React.useRef(false);

  // Focus management & Escape key handling
  React.useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      document.body.style.overflow = "hidden";
      // Focus close button inside drawer for keyboard navigation
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
      if (wasOpenRef.current) {
        // Restore focus to toggle button when closed
        toggleBtnRef.current?.focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between h-16 px-5 bg-[#060913] border-b border-blue-900/20 text-white sticky top-0 z-30">
        <div>
          <Link
            href="/dashboard"
            className="font-black text-lg tracking-wider text-white block"
          >
            ZENOBA
          </Link>
          <span className="text-[10px] text-zinc-400 block -mt-0.5">
            Learn · Practice · Connect
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            aria-label="Buka menu navigasi"
            aria-expanded={isOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Dialog Backdrop & Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi seluler"
          className="fixed inset-0 z-50 md:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative w-4/5 max-w-xs bg-[#060913] border-r border-blue-900/30 h-full flex flex-col z-10 text-white shadow-2xl">
            <div className="h-16 flex items-center justify-between px-5 border-b border-blue-900/20">
              <div>
                <span className="font-black text-lg tracking-wider text-white block">
                  ZENOBA
                </span>
                <span className="text-[10px] text-zinc-400 block -mt-0.5">
                  Learn · Practice · Connect
                </span>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                aria-label="Tutup menu navigasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
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
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-600/30 border border-blue-400/30"
                            : "text-zinc-400 hover:text-white hover:bg-white/5",
                        )}
                      >
                        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-zinc-400")} />
                        <span>{item.label}</span>
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
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-600/30 border border-blue-400/30"
                            : "text-zinc-400 hover:text-white hover:bg-white/5",
                        )}
                      >
                        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-zinc-400")} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            <div className="p-4 border-t border-blue-900/20">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAccountModal();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0B1120] hover:bg-[#0F172A] border border-blue-900/30 text-left transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name || user?.email?.split("@")[0] || "Dev Zenoba"}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {user?.headline || (user?.role === "ADMIN" ? "Administrator" : "Developer")}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
