"use client";

import * as React from "react";

export interface ElevationDialogProps {
  isElevated?: boolean;
  remainingSeconds?: number;
  onElevated?: () => void;
  onRevoked?: () => void;
  triggerText?: string;
}

export function ElevationDialog({
  isElevated: controlledIsElevated,
  remainingSeconds: controlledRemainingSeconds,
  onElevated,
  onRevoked,
  triggerText = "Elevate Privileges",
}: ElevationDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [internalElevated, setInternalElevated] = React.useState(false);
  const [countdown, setCountdown] = React.useState(controlledRemainingSeconds ?? 0);
  const [prevControlledRemaining, setPrevControlledRemaining] = React.useState(controlledRemainingSeconds);

  if (controlledRemainingSeconds !== undefined && controlledRemainingSeconds !== prevControlledRemaining) {
    setPrevControlledRemaining(controlledRemainingSeconds);
    setCountdown(controlledRemainingSeconds);
  }

  const isElevated = controlledIsElevated !== undefined ? controlledIsElevated : internalElevated;

  React.useEffect(() => {
    if (controlledIsElevated === undefined) {
      fetch("/api/developer/elevation")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.isElevated) {
            setInternalElevated(true);
            setCountdown(data.remainingSeconds || 0);
          }
        })
        .catch(() => {});
    }
  }, [controlledIsElevated]);

  React.useEffect(() => {
    if (!isElevated || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setInternalElevated(false);
          onRevoked?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isElevated, countdown, onRevoked]);

  const handleOpen = () => {
    setError(null);
    setPassword("");
    setCode("");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/developer/elevation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal melakukan elevasi hak akses.");
      }

      setIsOpen(false);
      setPassword("");
      setCode("");
      setInternalElevated(true);
      if (data.expiresAt) {
        const diffSeconds = Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000));
        setCountdown(diffSeconds || 600);
      }
      onElevated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal melakukan elevasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepDown = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/developer/elevation", {
        method: "DELETE",
      });

      if (response.ok) {
        setInternalElevated(false);
        setCountdown(0);
        onRevoked?.();
      }
    } catch (err) {
      console.error("[ElevationDialog] Failed to step down:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step-down UI if already elevated
  if (isElevated) {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    const timeDisplay = `${minutes}m ${seconds.toString().padStart(2, "0")}s`;

    return (
      <div className="flex items-center gap-3 bg-zinc-900 border border-emerald-500/30 px-3 py-1.5 rounded text-xs text-zinc-300">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
        <span>
          <strong className="text-emerald-400 font-medium">Ter-elevasi:</strong> {timeDisplay} tersisa
        </span>
        <button
          type="button"
          onClick={handleStepDown}
          disabled={isSubmitting}
          className="ml-2 underline text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400 rounded px-1"
        >
          {isSubmitting ? "Mencabut..." : "Step Down / Cabut Elevasi"}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        {triggerText}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="elevation-dialog-title"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md w-full shadow-2xl text-zinc-200">
            <h2 id="elevation-dialog-title" className="text-base font-semibold text-zinc-100">
              Elevasi Sesi Developer
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Operasi mutasi memerlukan elevasi dengan kata sandi dan kode 2FA. Sesi elevasi berlaku selama 10 menit.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-3 p-2 bg-red-950/50 border border-red-800/50 text-red-300 text-xs rounded"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label htmlFor="elevation-password" className="block text-xs font-medium text-zinc-300">
                  Kata Sandi
                </label>
                <input
                  id="elevation-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>

              <div>
                <label htmlFor="elevation-code" className="block text-xs font-medium text-zinc-300">
                  Kode 2FA / Backup Code
                </label>
                <input
                  id="elevation-code"
                  name="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                  disabled={isSubmitting}
                  className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 font-mono"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
                >
                  {isSubmitting ? "Memproses..." : "Konfirmasi Elevasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
