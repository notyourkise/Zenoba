"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User, Settings, Shield, Award, HelpCircle, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ProfileForm } from "@/features/profile/profile-form";
import { SettingsPasswordForm } from "@/features/settings/components/settings-password-form";
import { SecurityTwoFactorCard } from "@/features/settings/components/security-two-factor-card";
import { SecurityConnectedAccountsCard } from "@/features/settings/components/security-connected-accounts-card";
import { ModeToggle } from "@/components/ui/mode-toggle";

export type AccountTab = "profile" | "settings" | "security" | "certificates" | "support";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AccountTab;
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
  onUserUpdated?: (user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
    headline?: string | null;
    streakCount?: number;
    lastStreakDate?: string | null;
  }) => void;
}

export function AccountModal({
  isOpen,
  onClose,
  initialTab = "profile",
  user,
  onUserUpdated,
}: AccountModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<AccountTab>(initialTab);
  const [nameOverride, setNameOverride] = React.useState<string | null>(null);
  const displayName = nameOverride ?? user?.name ?? "";
  const [avatar, setAvatar] = React.useState<string | null>(user?.image || null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  // Headline state & handlers
  const initialHeadline =
    user?.headline ||
    (user?.role === "ADMIN" || user?.email === "dev@zenoba.tech"
      ? "Developer"
      : "Siswa SMK TKJ - IT Infrastructure");
  const [headline, setHeadline] = React.useState(initialHeadline);
  const [isEditingHeadline, setIsEditingHeadline] = React.useState(false);
  const [headlineInput, setHeadlineInput] = React.useState(initialHeadline);
  const [headlineSaving, setHeadlineSaving] = React.useState(false);
  const [headlineError, setHeadlineError] = React.useState<string | null>(null);

  const handleSaveHeadline = async () => {
    const trimmed = headlineInput.trim();
    if (!trimmed) return;
    setHeadlineSaving(true);
    setHeadlineError(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status");
      setHeadline(trimmed);
      setIsEditingHeadline(false);
      if (user) {
        onUserUpdated?.({ ...user, headline: trimmed });
      }
      router.refresh();
    } catch (err) {
      setHeadlineError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setHeadlineSaving(false);
    }
  };

  // CLI Preferences state
  const [cliPrompt, setCliPrompt] = React.useState(() => {
    if (typeof window === "undefined") return "linux";
    try {
      const saved = localStorage.getItem("zenoba_cli_pref");
      return saved ? JSON.parse(saved).prompt || "linux" : "linux";
    } catch {
      return "linux";
    }
  });

  const [cliFontSize, setCliFontSize] = React.useState(() => {
    if (typeof window === "undefined") return "14";
    try {
      const saved = localStorage.getItem("zenoba_cli_pref");
      return saved ? JSON.parse(saved).fontSize || "14" : "14";
    } catch {
      return "14";
    }
  });

  const [cliTypingSpeed, setCliTypingSpeed] = React.useState(() => {
    if (typeof window === "undefined") return "normal";
    try {
      const saved = localStorage.getItem("zenoba_cli_pref");
      return saved ? JSON.parse(saved).speed || "normal" : "normal";
    } catch {
      return "normal";
    }
  });

  // Notification & Privacy state
  const [leaderboardVisible, setLeaderboardVisible] = React.useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("zenoba_privacy_pref");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.leaderboard === "boolean") return parsed.leaderboard;
      }
      return true;
    } catch {
      return true;
    }
  });

  const [streakReminder, setStreakReminder] = React.useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("zenoba_privacy_pref");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.streak === "boolean") return parsed.streak;
      }
      return true;
    } catch {
      return true;
    }
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  const saveCliPref = (key: string, value: string) => {
    try {
      const updated = {
        prompt: key === "prompt" ? value : cliPrompt,
        fontSize: key === "fontSize" ? value : cliFontSize,
        speed: key === "speed" ? value : cliTypingSpeed,
      };
      localStorage.setItem("zenoba_cli_pref", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const savePrivacyPref = (key: string, value: boolean) => {
    try {
      const updated = {
        leaderboard: key === "leaderboard" ? value : leaderboardVisible,
        streak: key === "streak" ? value : streakReminder,
      };
      localStorage.setItem("zenoba_privacy_pref", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/webp", 0.85);
        uploadProfileImage(dataUrl);
      };
      img.onerror = () => {
        setUploadError("Gagal membaca file gambar");
        setUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError("Gagal membaca file gambar");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async (imageUrl: string | null) => {
    setUploading(true);
    setUploadError(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui foto profil");
      }

      setAvatar(imageUrl);
      if (user) {
        onUserUpdated?.({ ...user, image: imageUrl });
      }
      router.refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal memperbarui foto profil");
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest<HTMLElement>(".overflow-y-auto");
      if (!scrollable) {
        e.preventDefault();
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const isAtTop = scrollTop <= 0 && e.deltaY < 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(".overflow-y-auto")) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "NL";

  const memberCode = user.id ? `#NL-${user.id.slice(-4).toUpperCase()}` : "#NL-TKJ";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in-0 duration-150 overscroll-contain"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Modal Akun"
        className="relative flex w-full max-w-3xl flex-col max-h-[min(520px,calc(100vh-3.5rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/15 dark:bg-[#090b14] md:flex-row overscroll-contain"
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

          <nav className="flex gap-1 md:flex-col overflow-x-auto md:overflow-x-visible pb-1 md:pb-0" aria-label="Menu Akun">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex shrink-0 md:shrink items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer",
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <User className="h-4 w-4 shrink-0" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex shrink-0 md:shrink items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer",
                activeTab === "settings"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>Pengaturan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={cn(
                "flex shrink-0 md:shrink items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer",
                activeTab === "security"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <Shield className="h-4 w-4 shrink-0" />
              <span>Keamanan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("certificates")}
              className={cn(
                "flex shrink-0 md:shrink items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer",
                activeTab === "certificates"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <Award className="h-4 w-4 shrink-0" />
              <span>Sertifikat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("support")}
              className={cn(
                "flex shrink-0 md:shrink items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer",
                activeTab === "support"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              <span>Bantuan</span>
            </button>
          </nav>
        </div>

        {/* Konten Tab Modal */}
        <div className="flex-1 overflow-y-auto p-6 md:p-7 overscroll-contain">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Profil Pengguna
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  Identitas akun pembelajaran dan portofolio IT infrastructure Anda.
                </p>
              </div>

              {/* 1. Kartu Info Akun & Foto Profil */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar Container */}
                  <div className="relative group shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-500/20 overflow-hidden">
                      {avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={avatar}
                          alt={displayName || "Foto profil"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                  </div>

                  {/* Info User */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="truncate text-base font-bold text-gray-900 dark:text-white">
                        {displayName || "Learner Zenoba"}
                      </p>
                      <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500">
                        {memberCode}
                      </span>
                    </div>
                    <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {user.role || "LEARNER"}
                      </span>
                      {!isEditingHeadline ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-gray-600 dark:text-slate-300">
                            {headline}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setHeadlineInput(headline);
                              setIsEditingHeadline(true);
                            }}
                            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer"
                          >
                            Ubah
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={headlineInput}
                            onChange={(e) => setHeadlineInput(e.target.value)}
                            maxLength={100}
                            placeholder="Contoh: Developer"
                            className="h-6 px-2 text-[11px] rounded border border-gray-300 dark:border-white/20 bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            disabled={headlineSaving}
                            onClick={handleSaveHeadline}
                            className="h-6 px-2 rounded bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                          >
                            {headlineSaving ? "..." : "Simpan"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingHeadline(false)}
                            className="h-6 px-1.5 text-[10px] text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      )}
                    </div>
                    {headlineError && (
                      <p className="text-[10px] text-rose-600 dark:text-rose-400">
                        {headlineError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Upload Foto Controls */}
                <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-white/5 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
                    >
                      {uploading ? "Mengunggah..." : "Ubah Foto Profil"}
                    </button>
                    {avatar && (
                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => uploadProfileImage(null)}
                        className="h-8 px-2.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-slate-500">
                    PNG, JPG, WebP (Maks. 5MB)
                  </span>
                </div>

                {uploadError && (
                  <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                    {uploadError}
                  </p>
                )}
              </div>

              {/* 2. Gamifikasi & Level Progression */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02] space-y-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                    Level 1
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Cable Puller (Beginner)
                  </h4>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1.5">
                    <span>Progres XP</span>
                    <span>0 / 1.000 XP menuju Level 2</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                    <div className="h-full bg-blue-600 dark:bg-sky-500 rounded-full" style={{ width: "4%" }} />
                  </div>
                </div>
              </div>

              {/* 3. Ringkasan 4 Pilar Zenoba */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  Capaian 4 Pilar Zenoba
                </h4>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs dark:border-white/5 dark:bg-white/[0.03]">
                    <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Learn</span>
                    <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">0 / 15</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Modul Tuntas</p>
                  </div>
                  <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs dark:border-white/5 dark:bg-white/[0.03]">
                    <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Labs</span>
                    <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">0</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Skenario CLI</p>
                  </div>
                  <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs dark:border-white/5 dark:bg-white/[0.03]">
                    <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Challenges</span>
                    <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">0</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Troubleshooting</p>
                  </div>
                  <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs dark:border-white/5 dark:bg-white/[0.03]">
                    <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">Consultant</span>
                    <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">0</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Proyek UKK</p>
                  </div>
                </div>
              </div>

              {/* 4. Lencana Keahlian (Skill Badges) */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  Lencana Keahlian (Badges)
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-center opacity-60">
                    <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Subnetting Master</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Terkunci</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-center opacity-60">
                    <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Topology Architect</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Terkunci</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-center opacity-60">
                    <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">VLAN Segmenter</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Terkunci</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-center opacity-60">
                    <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">UKK Ready</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Terkunci</span>
                  </div>
                </div>
              </div>

              {/* 5. Form Ubah Nama Display (Tanpa icon pencil!) */}
              <div className="pt-1">
                <ProfileForm
                  initialName={displayName}
                  onNameUpdated={(newName) => {
                    setNameOverride(newName);
                    if (user) {
                      onUserUpdated?.({ ...user, name: newName });
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Pengaturan Akun & Preferensi
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  Kustomisasi simulator terminal, keamanan, dan preferensi platform Anda.
                </p>
              </div>

              {/* 1. Preferensi Terminal Simulator CLI */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4.5 dark:border-white/10 dark:bg-white/[0.02] space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Preferensi Terminal Simulator CLI
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                    Sesuaikan gaya shell simulator interaktif di halaman Labs dan materi.
                  </p>
                </div>

                {/* Gaya Prompt */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Gaya Prompt Shell
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCliPrompt("linux");
                        saveCliPref("prompt", "linux");
                      }}
                      className={cn(
                        "p-2.5 rounded-lg border text-left transition text-xs cursor-pointer",
                        cliPrompt === "linux"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold"
                          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-gray-600 dark:text-slate-300",
                      )}
                    >
                      <div className="font-semibold">Linux Bash</div>
                      <div className="font-mono text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                        learner@zenoba:~$
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCliPrompt("cisco");
                        saveCliPref("prompt", "cisco");
                      }}
                      className={cn(
                        "p-2.5 rounded-lg border text-left transition text-xs cursor-pointer",
                        cliPrompt === "cisco"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold"
                          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-gray-600 dark:text-slate-300",
                      )}
                    >
                      <div className="font-semibold">Cisco IOS</div>
                      <div className="font-mono text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                        Router#
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCliPrompt("mikrotik");
                        saveCliPref("prompt", "mikrotik");
                      }}
                      className={cn(
                        "p-2.5 rounded-lg border text-left transition text-xs cursor-pointer",
                        cliPrompt === "mikrotik"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold"
                          : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-gray-600 dark:text-slate-300",
                      )}
                    >
                      <div className="font-semibold">MikroTik</div>
                      <div className="font-mono text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                        [admin@MK] &gt;
                      </div>
                    </button>
                  </div>
                </div>

                {/* Ukuran Font & Kecepatan Ketik */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                      Ukuran Font Simulator
                    </label>
                    <select
                      value={cliFontSize}
                      onChange={(e) => {
                        setCliFontSize(e.target.value);
                        saveCliPref("fontSize", e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.04] text-xs text-gray-900 dark:text-white"
                    >
                      <option value="12">Kecil (12px)</option>
                      <option value="14">Sedang (14px - Default)</option>
                      <option value="16">Besar (16px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                      Animasi Ketik CLI
                    </label>
                    <select
                      value={cliTypingSpeed}
                      onChange={(e) => {
                        setCliTypingSpeed(e.target.value);
                        saveCliPref("speed", e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.04] text-xs text-gray-900 dark:text-white"
                    >
                      <option value="normal">Animasi Mengetik</option>
                      <option value="instant">Instan (Langsung Muncul)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Preferensi Tampilan */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Tema Tampilan
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Pilih mode terang, gelap, atau ikuti tema sistem perangkat Anda.
                  </p>
                </div>
                <ModeToggle />
              </div>

              {/* 3. Privasi & Pengingat */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02] space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Privasi & Notifikasi Belajar
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      Tampilkan di Papan Peringkat (Leaderboard)
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">
                      Tampilkan nama Anda pada daftar capaian XP teratas mingguan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !leaderboardVisible;
                      setLeaderboardVisible(next);
                      savePrivacyPref("leaderboard", next);
                    }}
                    className={cn(
                      "h-6 w-11 rounded-full transition-colors cursor-pointer relative p-0.5",
                      leaderboardVisible ? "bg-blue-600" : "bg-gray-300 dark:bg-white/20",
                    )}
                    aria-label="Toggle leaderboard visibility"
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full bg-white transition-transform shadow-xs",
                        leaderboardVisible ? "translate-x-5" : "translate-x-0",
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      Pengingat Api Harian
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">
                      Notifikasi pengingat belajar agar api konsistensi harian Anda tetap menyala.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !streakReminder;
                      setStreakReminder(next);
                      savePrivacyPref("streak", next);
                    }}
                    className={cn(
                      "h-6 w-11 rounded-full transition-colors cursor-pointer relative p-0.5",
                      streakReminder ? "bg-blue-600" : "bg-gray-300 dark:bg-white/20",
                    )}
                    aria-label="Toggle streak reminder"
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full bg-white transition-transform shadow-xs",
                        streakReminder ? "translate-x-5" : "translate-x-0",
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* 4. Keluar dari Akun (Logout) */}
              <div className="rounded-xl border border-rose-200/80 bg-rose-50/50 p-4.5 dark:border-rose-900/30 dark:bg-rose-950/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-300">
                    Keluar dari Akun
                  </h4>
                  <p className="mt-0.5 text-xs text-rose-700/80 dark:text-rose-400/80">
                    Akhiri sesi pembelajaran Anda pada perangkat ini dengan aman.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/?auth=sign-in" })}
                  className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 transition cursor-pointer shrink-0"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Keamanan Akun
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  Kelola kata sandi, metode autentikasi, dan status keamanan akun Anda.
                </p>
              </div>

              {/* 1. Ubah Password Langsung */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4.5 dark:border-white/10 dark:bg-white/[0.02]">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Ubah Kata Sandi
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                    Masukkan password baru dan konfirmasi password langsung tanpa perlu password saat ini.
                  </p>
                </div>
                <SettingsPasswordForm />
              </div>

              {/* 2. Autentikasi Dua Faktor (2FA) */}
              <SecurityTwoFactorCard />

              {/* 3. Akun Terhubung (Google) */}
              <SecurityConnectedAccountsCard userEmail={user?.email} />

              {/* 4. Informasi Autentikasi & Akun */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4.5 dark:border-white/10 dark:bg-white/[0.02] space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Informasi Autentikasi
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-white/5">
                    <span className="text-gray-500 dark:text-slate-400">Email Terdaftar</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{user?.email || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-white/5">
                    <span className="text-gray-500 dark:text-slate-400">Status Akun</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Terverifikasi
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-slate-200">Perangkat Saat Ini</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">Desktop (Windows) - Browser Web</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Sesi Aktif
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Tips Keamanan */}
              <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 dark:border-blue-950/40 dark:bg-blue-950/15">
                <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Tips Keamanan Akun
                </h4>
                <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                  Gunakan kata sandi unik minimal 8 karakter dengan kombinasi huruf dan angka. Selalu lakukan logout jika menggunakan komputer bersama di laboratorium sekolah.
                </p>
              </div>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Sertifikat Kelulusan & Kompetensi
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  Kredensial digital resmi terverifikasi yang didapatkan setelah menyelesaikan jalur pembelajaran.
                </p>
              </div>

              {/* Sertifikat Target */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-5 dark:border-white/10 dark:bg-white/[0.02] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-200/60 dark:border-white/5">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-1.5 uppercase tracking-wider">
                      Jalur Pembelajaran Utama
                    </span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      Kompetensi Fondasi Jaringan Komputer
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      Standar kurikulum SMK TKJ & IT Network Fundamentals.
                    </p>
                  </div>
                  <span className="inline-flex items-center self-start sm:self-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                    Sedang Berjalan
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-slate-300">
                  <p className="font-semibold text-gray-800 dark:text-slate-200">
                    Cakupan Materi Sertifikasi:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-gray-500 dark:text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                      <span>Pengalamatan IPv4 & Subnetting CIDR</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                      <span>Segmentasi VLAN & IEEE 802.1Q</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                      <span>Routing Statis & Longest Prefix Match</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                      <span>Diagnostik & Troubleshooting Terminal CLI</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-gray-200/60 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] text-gray-400 dark:text-slate-500">
                    Syarat: Tuntaskan seluruh modul kurikulum dan capai skor evaluasi ≥ 80%.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/my-learning");
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer shrink-0"
                  >
                    Buka Modul Belajar
                  </button>
                </div>
              </div>

              {/* Status Sertifikat Digital */}
              <div className="rounded-xl border border-dashed border-gray-200 dark:border-white/10 p-5 text-center space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                  Belum Ada Sertifikat yang Diterbitkan
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-md mx-auto">
                  Setiap sertifikat kelulusan yang Anda raih akan dilengkapi ID Kredensial unik dan QR Code verifikasi resmi yang dapat ditautkan ke LinkedIn atau portofolio UKK Anda.
                </p>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Pusat Bantuan & Panduan
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  Solusi cepat kendala teknis, panduan simulator terminal CLI, dan kontak tim Zenoba.
                </p>
              </div>

              {/* 1. Pertanyaan Umum (FAQ) */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  Pertanyaan yang Sering Diajukan (FAQ)
                </h4>

                <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02] space-y-1.5">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Bagaimana jika simulator terminal CLI macet atau tidak merespons?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                    Ketik perintah <code className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 font-mono text-[11px]">clear</code> atau <code className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 font-mono text-[11px]">reset</code> pada jendela simulator, atau segarkan (refresh) halaman peramban Anda. Progres belajar dan akumulasi XP yang sudah tersimpan di cloud tidak akan hilang.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02] space-y-1.5">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Bagaimana cara menjaga api konsistensi harian (streak)?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                    Akses platform Zenoba minimal satu kali sehari dan lakukan aktivitas belajar (membaca materi, menyelesaikan kuis, atau menjalankan skenario lab). Jangan lupa klik tombol api pada profil sebelum pukul 00:00 WITA.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02] space-y-1.5">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Bagaimana cara membuka modul yang masih terkunci?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                    Pastikan Anda telah menyelesaikan modul prasyarat sebelumnya secara berurutan. Untuk modul spesialisasi tambahan, Anda dapat memeriksa status paket Anda di menu Katalog Kursus.
                  </p>
                </div>
              </div>

              {/* 2. Pintasan Keyboard Simulator CLI */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4.5 dark:border-white/10 dark:bg-white/[0.02] space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Pintasan Keyboard Simulator CLI
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-mono text-[10px] font-semibold text-gray-800 dark:text-white">
                      Ctrl + C
                    </kbd>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                      Batalkan perintah yang sedang berjalan
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-mono text-[10px] font-semibold text-gray-800 dark:text-white">
                      ↑ / ↓
                    </kbd>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                      Akses riwayat perintah sebelumnya
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-mono text-[10px] font-semibold text-gray-800 dark:text-white">
                      Tab
                    </kbd>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                      Autokomplit nama perintah & argumen
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Kontak Dukungan */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-4.5 dark:border-white/10 dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Butuh Bantuan Lebih Lanjut?
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                    Tim instruktur dan support Zenoba siap membantu kendala teknis atau pertanyaan materi Anda.
                  </p>
                </div>
                <a
                  href="mailto:support@zenoba.tech?subject=Bantuan%20Platform%20Zenoba"
                  className="inline-flex items-center justify-center rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-xs font-semibold text-white dark:text-gray-900 shadow-xs hover:bg-gray-800 dark:hover:bg-gray-100 transition shrink-0"
                >
                  Hubungi Tim Support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}