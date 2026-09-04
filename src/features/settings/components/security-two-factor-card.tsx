"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SecurityTwoFactorCardProps {
  initialEnabled?: boolean;
  hasPassword?: boolean;
}

export function SecurityTwoFactorCard({
  initialEnabled = false,
  hasPassword = true,
}: SecurityTwoFactorCardProps) {
  const [isEnabled, setIsEnabled] = React.useState(initialEnabled);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/user/security")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && typeof data.twoFactorEnabled === "boolean") {
          setIsEnabled(data.twoFactorEnabled);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Setup state
  const [isSettingUp, setIsSettingUp] = React.useState(false);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string | null>(null);
  const [secretKey, setSecretKey] = React.useState<string | null>(null);
  const [verifyCode, setVerifyCode] = React.useState("");
  const [backupCodes, setBackupCodes] = React.useState<string[] | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Disable state
  const [isDisabling, setIsDisabling] = React.useState(false);
  const [disablePassword, setDisablePassword] = React.useState("");

  // Start 2FA setup
  const handleStartSetup = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/security/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memulai penyiapan 2FA.");
      }

      setQrCodeUrl(data.qrCodeDataUrl);
      setSecretKey(data.secret);
      setIsSettingUp(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memulai 2FA.");
    } finally {
      setLoading(false);
    }
  };

  // Confirm verification code
  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode || verifyCode.trim().length !== 6) {
      setError("Masukkan 6 digit kode dari aplikasi authenticator.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/security/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code: verifyCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kode verifikasi tidak valid.");
      }

      setIsEnabled(true);
      setBackupCodes(data.backupCodes || []);
      setSuccessMessage("Autentikasi Dua Faktor (2FA) berhasil diaktifkan!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memverifikasi kode.");
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/security/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "disable",
          password: disablePassword,
          code: !hasPassword ? disablePassword : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menonaktifkan 2FA.");
      }

      setIsEnabled(false);
      setIsDisabling(false);
      setDisablePassword("");
      setBackupCodes(null);
      setIsSettingUp(false);
      setSuccessMessage("2FA telah dinonaktifkan.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menonaktifkan 2FA.");
    } finally {
      setLoading(false);
    }
  };

  const copySecretKey = () => {
    if (!secretKey) return;
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyBackupCodes = () => {
    if (!backupCodes) return;
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4.5 dark:border-white/10 dark:bg-white/[0.02] space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Autentikasi Dua Faktor (2FA)
            </h4>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                isEnabled
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-gray-200/80 text-gray-600 dark:bg-white/10 dark:text-slate-400 border-gray-300 dark:border-white/10",
              )}
            >
              {isEnabled ? "Aktif" : "Tidak Aktif"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
            Amankan akun Anda dengan kode 6-digit dari aplikasi Google Authenticator atau Microsoft Authenticator.
          </p>
        </div>

        {!isEnabled && !isSettingUp && (
          <button
            type="button"
            disabled={loading}
            onClick={handleStartSetup}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 cursor-pointer shrink-0"
          >
            {loading ? "Memproses..." : "Aktifkan 2FA"}
          </button>
        )}

        {isEnabled && !isDisabling && (
          <button
            type="button"
            onClick={() => setIsDisabling(true)}
            className="inline-flex items-center justify-center rounded-lg border border-rose-300 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 px-3.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition cursor-pointer shrink-0"
          >
            Nonaktifkan
          </button>
        )}
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

      {/* STEP: Setting Up (Scan QR Code) */}
      {isSettingUp && !backupCodes && (
        <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 space-y-4">
          <div className="border-b border-gray-100 dark:border-white/5 pb-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
              Langkah 1: Pindai QR Code
            </h5>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              Buka aplikasi Google Authenticator di ponsel Anda, lalu pindai QR code di bawah ini atau masukkan kunci secara manual.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {qrCodeUrl ? (
              <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-xs shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="2FA QR Code"
                  className="w-36 h-36 object-contain"
                />
              </div>
            ) : (
              <div className="w-36 h-36 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                Membuat QR...
              </div>
            )}

            <div className="flex-1 space-y-2.5 w-full">
              <div>
                <span className="text-[11px] font-semibold text-gray-700 dark:text-slate-300">
                  Kunci Penyiapan Manual:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10 font-mono text-xs text-blue-600 dark:text-blue-400 select-all break-all">
                    {secretKey}
                  </code>
                  <button
                    type="button"
                    onClick={copySecretKey}
                    className="px-2 py-1 rounded border border-gray-300 dark:border-white/15 text-[10px] font-semibold hover:bg-gray-100 dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              </div>

              <form onSubmit={handleConfirmCode} className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-slate-300">
                  Langkah 2: Masukkan 6 Digit Kode dari Aplikasi
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                    className="h-9 px-3 w-36 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/[0.04] text-center font-mono text-sm tracking-widest text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || verifyCode.length !== 6}
                    className="h-9 px-4 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Verifikasi..." : "Verifikasi & Aktifkan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingUp(false);
                      setQrCodeUrl(null);
                      setSecretKey(null);
                      setVerifyCode("");
                    }}
                    className="h-9 px-3 rounded-lg border border-gray-300 dark:border-white/15 text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* STEP: Backup Codes Display */}
      {backupCodes && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Simpan Kode Cadangan (Recovery Codes)
            </h5>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              Simpan kode pemulihan ini di tempat yang aman. Anda dapat menggunakannya jika ponsel atau aplikasi authenticator hilang. Setiap kode hanya dapat digunakan satu kali.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {backupCodes.map((code, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-white dark:bg-black/40 border border-amber-200/80 dark:border-amber-900/40 text-center font-mono text-xs font-semibold text-gray-800 dark:text-zinc-200 select-all"
              >
                {code}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={copyBackupCodes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition cursor-pointer"
            >
              {copied ? "Kode Cadangan Tersalin!" : "Salin Semua Kode"}
            </button>
            <button
              type="button"
              onClick={() => {
                setBackupCodes(null);
                setIsSettingUp(false);
              }}
              className="text-xs font-semibold text-gray-600 dark:text-slate-300 hover:underline cursor-pointer"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}

      {/* STEP: Disabling Form */}
      {isDisabling && (
        <form
          onSubmit={handleDisable2FA}
          className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-3"
        >
          <div>
            <h5 className="text-xs font-bold text-rose-900 dark:text-rose-300">
              Konfirmasi Nonaktifkan 2FA
            </h5>
            <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 mt-0.5">
              {hasPassword
                ? "Masukkan kata sandi akun Anda untuk mematikan autentikasi dua faktor."
                : "Masukkan 6 digit kode dari authenticator untuk mematikan 2FA."}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type={hasPassword ? "password" : "text"}
              placeholder={hasPassword ? "Kata Sandi Akun" : "Kode 6-digit"}
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              className="h-9 px-3 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-white/[0.04] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 flex-1 max-w-xs"
            />
            <button
              type="submit"
              disabled={loading || !disablePassword}
              className="h-9 px-4 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Memproses..." : "Konfirmasi Nonaktifkan"}
            </button>
            <button
              type="button"
              onClick={() => setIsDisabling(false)}
              className="h-9 px-3 rounded-lg border border-gray-300 dark:border-white/15 text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
