"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORKSPACE_NAV_ITEMS } from "./learner-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";

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

  // Close drawer on path change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 bg-black border-b border-white/10 text-white sticky top-0 z-30">
        <Link
          href="/dashboard"
          className="font-bold text-base tracking-wider text-white"
        >
          NETLOKA
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
          <div className="relative w-4/5 max-w-xs bg-zinc-950 border-r border-white/10 h-full flex flex-col z-10 text-white shadow-2xl">
            <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
              <span className="font-bold text-base tracking-wider text-white">
                NETLOKA
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Tutup menu navigasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {WORKSPACE_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/10 text-white font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAccountModal();
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/15 flex items-center justify-center text-xs font-semibold text-zinc-200 overflow-hidden shrink-0">
                  {user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name || "Avatar"} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || user?.email?.split("@")[0] || "Learner"}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {user?.headline || "Akun & Pengaturan"}
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
