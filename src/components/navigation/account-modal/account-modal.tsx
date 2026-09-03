"use client";

import * as React from "react";
import { User, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileForm } from "@/features/profile/profile-form";
import { SettingsPasswordForm } from "@/features/settings/components/settings-password-form";
import { ModeToggle } from "@/components/ui/mode-toggle";

export type AccountTab = "profile" | "settings";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AccountTab;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export function AccountModal({
  isOpen,
  onClose,
  initialTab = "profile",
  user,
}: AccountModalProps) {
  const [activeTab, setActiveTab] = React.useState<AccountTab>(initialTab);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const initials = user.name
    ? user.name.slice(0, 2).toUpperCase()
    : user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "NL";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in-0 duration-150"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Modal Akun"
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/15 dark:bg-[#090b14] md:flex-row md:min-h-[520px]"
      >
        {/* Tombol X Close di Atas Kanan */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Sidebar Navigasi Modal */}
        <div className="w-full shrink-0 border-b border-gray-200 bg-gray-50/70 p-4 dark:border-white/10 dark:bg-white/[0.02] md:w-56 md:border-b-0 md:border-r">
          <div className="mb-4 hidden pr-8 md:block">
            <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Akun Saya
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Kelola profil & pengaturan
            </p>
          </div>

          <nav className="flex gap-1 md:flex-col" aria-label="Menu Akun">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex flex-1 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors md:flex-initial",
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex flex-1 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors md:flex-initial",
                activeTab === "settings"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Konten Tab Modal */}
        <div className="flex-1 overflow-y-auto p-6 md:p-7 max-h-[calc(85vh-4rem)]">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Profil Pengguna
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  Identitas akun pembelajaran Netloka Anda.
                </p>
              </div>

              {/* Kartu Info Akun */}
              <div className="flex items-center gap-4 rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-500/20">
                  {initials}
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-base font-semibold text-gray-900 dark:text-white">
                    {user.name || "Learner Netloka"}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                    {user.email}
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {user.role || "LEARNER"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Ubah Nama Display */}
              <div className="pt-2">
                <ProfileForm initialName={user.name || ""} />
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Pengaturan Keamanan & Preferensi
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  Perbarui kata sandi dan sesuaikan preferensi akun.
                </p>
              </div>

              {/* Section Ubah Password Langsung */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4.5 dark:border-white/10 dark:bg-white/[0.02]">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Ubah Password
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                    Masukkan password baru dan konfirmasi password langsung tanpa password saat ini.
                  </p>
                </div>
                <SettingsPasswordForm />
              </div>

              {/* Section Preferensi Tema */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Tema Tampilan
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Beralih antara mode gelap (Cosmic Dark) dan mode terang.
                  </p>
                </div>
                <ModeToggle />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}