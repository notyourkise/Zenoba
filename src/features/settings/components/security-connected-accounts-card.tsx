"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

interface SecurityConnectedAccountsCardProps {
  initialIsGoogleLinked?: boolean;
  hasPassword?: boolean;
  userEmail?: string | null;
}

export function SecurityConnectedAccountsCard({
  initialIsGoogleLinked = false,
  hasPassword = true,
  userEmail,
}: SecurityConnectedAccountsCardProps) {
  const [isGoogleLinked, setIsGoogleLinked] = React.useState(initialIsGoogleLinked);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/user/security")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && typeof data.isGoogleLinked === "boolean") {
          setIsGoogleLinked(data.isGoogleLinked);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleConnectGoogle = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleDisconnectGoogle = async () => {
    if (!hasPassword) {
      setError(
        "Anda harus mengatur kata sandi terlebih dahulu sebelum memutuskan koneksi Google agar tidak terkunci dari akun Anda.",
      );
      setShowDisconnectConfirm(false);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/security/google", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memutuskan koneksi Google.");
      }

      setIsGoogleLinked(false);
      setShowDisconnectConfirm(false);
      setSuccessMessage("Akun Google berhasil diputuskan.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memutuskan akun Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4.5 dark:border-white/10 dark:bg-white/[0.02] space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Akun Terhubung (Connected Accounts)
        </h4>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
          Tautkan akun pihak ketiga seperti Google untuk kemudahan login dengan satu klik.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-300 text-xs">
          {successMessage}
        </div>
      )}

      {/* Google Account Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0">
            {/* SVG Google Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                Google
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.2 text-[9px] font-semibold border",
                  isGoogleLinked
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-slate-400 border-gray-200 dark:border-white/10",
                )}
              >
                {isGoogleLinked ? "Terhubung" : "Belum Terhubung"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate max-w-xs">
              {isGoogleLinked ? (userEmail || "Akun Google aktif") : "Masuk langsung menggunakan Akun Google"}
            </p>
          </div>
        </div>

        <div>
          {isGoogleLinked ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowDisconnectConfirm(true)}
              className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition cursor-pointer"
            >
              Putuskan
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleConnectGoogle}
              className="px-3.5 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition cursor-pointer"
            >
              Hubungkan
            </button>
          )}
        </div>
      </div>

      {/* Disconnect Confirmation Dialog */}
      {showDisconnectConfirm && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-3">
          <div>
            <h5 className="text-xs font-bold text-rose-900 dark:text-rose-300">
              Putuskan Koneksi Google?
            </h5>
            <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 mt-0.5">
              Anda tidak akan bisa lagi login dengan satu klik melalui akun Google ini. Anda harus menggunakan email dan kata sandi lokal untuk masuk.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleDisconnectGoogle}
              className="h-8 px-3.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Memproses..." : "Ya, Putuskan"}
            </button>
            <button
              type="button"
              onClick={() => setShowDisconnectConfirm(false)}
              className="h-8 px-3 rounded-lg border border-gray-300 dark:border-white/15 text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
