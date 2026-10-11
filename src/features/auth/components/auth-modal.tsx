"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSafeAuthCallback } from "@/features/auth/callback-url";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export type AuthMode = "sign-in" | "sign-up";

type AuthModalProps = {
  mode: AuthMode | null;
  googleEnabled: boolean;
  callbackUrl?: string;
  registered?: boolean;
};

function safeCallbackUrl(callbackUrl?: string): string {
  return getSafeAuthCallback(callbackUrl) ?? "/dashboard";
}

function getContinueDestination(callbackUrl?: string): string {
  const safe = callbackUrl ? getSafeAuthCallback(callbackUrl) : null;
  if (safe) {
    return `/continue?callbackUrl=${encodeURIComponent(safe)}`;
  }
  return "/continue";
}

function authHref(mode: AuthMode, callbackUrl?: string): string {
  const parameters = new URLSearchParams({ auth: mode });
  if (callbackUrl) {
    parameters.set("callbackUrl", safeCallbackUrl(callbackUrl));
  }
  return `/?${parameters.toString()}`;
}

export function AuthModal({
  mode,
  googleEnabled,
  callbackUrl,
  registered = false,
}: AuthModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const closeModal = () => router.replace("/", { scroll: false });

  useEffect(() => {
    if (!mode) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLInputElement>("#auth-email")?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mode) return null;

  const isSignIn = mode === "sign-in";
  const destination = getContinueDestination(callbackUrl);

  const containFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled])',
      ) ?? [],
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleCredentialsSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        if (result.error.includes("2FA_REQUIRED")) {
          setTwoFactorRequired(true);
          setError(null);
          return;
        }
        setError("Invalid email or password.");
        return;
      }
      router.push(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        code: twoFactorCode.trim(),
        redirect: false,
      });
      if (result?.error) {
        setError("Kode 2FA tidak valid atau telah kedaluwarsa.");
        return;
      }
      router.push(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error || "Registration failed.");
        return;
      }

      const parameters = new URLSearchParams({
        auth: "sign-in",
        ...(callbackUrl ? { callbackUrl: safeCallbackUrl(callbackUrl) } : {}),
        registered: "true",
      });
      router.replace(`/?${parameters.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onKeyDown={containFocus}
        className="relative max-h-[calc(100vh-4rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/15 bg-[#090b14]/95 p-6 text-white shadow-2xl shadow-sky-950/40 sm:p-7"
      >
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close authentication dialog"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xl leading-none text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          ×
        </button>

        <div className="pr-10">
          <h2 id="auth-modal-title" className="text-xl font-bold tracking-tight">
            {isSignIn ? "Sign in to Zenoba" : "Create your Zenoba account"}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            {isSignIn
              ? "Continue your interactive IT infrastructure journey."
              : "Start learning through lessons, labs, and real-world challenges."}
          </p>
        </div>

        {registered && isSignIn && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2.5 text-sm text-emerald-200"
          >
            Account created. You can sign in now.
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-200"
          >
            {error}
          </p>
        )}

        {twoFactorRequired ? (
          <form
            aria-label="Two-factor authentication"
            onSubmit={handleTwoFactorSignIn}
            className="mt-6 space-y-4"
          >
            <div className="rounded-xl border border-sky-400/25 bg-sky-400/10 p-3 text-xs text-sky-200 leading-relaxed">
              Akun ini dilindungi oleh Autentikasi Dua Faktor (2FA). Masukkan 6 digit kode dari aplikasi authenticator Anda atau gunakan kode cadangan pemulihan.
            </div>

            <Field label="Kode 2FA / Kode Cadangan" id="auth-2fa-code">
              <input
                id="auth-2fa-code"
                type="text"
                required
                autoFocus
                value={twoFactorCode}
                onChange={(event) => setTwoFactorCode(event.target.value)}
                placeholder="Contoh: 123456 atau a1b2-c3d4"
                className={inputClasses}
              />
            </Field>

            <button
              type="submit"
              disabled={loading || !twoFactorCode.trim()}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-white px-4 text-sm font-bold text-black transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Memverifikasi..." : "Verifikasi & Masuk"}
            </button>

            <button
              type="button"
              onClick={() => {
                setTwoFactorRequired(false);
                setTwoFactorCode("");
                setError(null);
              }}
              className="flex h-9 w-full items-center justify-center rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              Kembali ke Login
            </button>
          </form>
        ) : (
          <>
            <form
              aria-label={isSignIn ? "Sign in" : "Create account"}
              onSubmit={isSignIn ? handleCredentialsSignIn : handleRegistration}
              className="mt-6 space-y-4"
            >
              <Field label="Email" id="auth-email">
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </Field>

              <Field
                label="Password"
                id="auth-password"
                action={
                  isSignIn ? (
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-sky-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                      Forgot password?
                    </Link>
                  ) : undefined
                }
              >
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  className={inputClasses}
                />
              </Field>

              {!isSignIn && (
                <Field label="Confirm password" id="auth-confirm-password">
                  <input
                    id="auth-confirm-password"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    className={inputClasses}
                  />
                </Field>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-white px-4 text-sm font-bold text-black transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading
                  ? isSignIn
                    ? "Signing in..."
                    : "Creating account..."
                  : isSignIn
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              or
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              disabled={!googleEnabled}
              onClick={() => signIn("google", { callbackUrl: destination })}
              className="flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-55 cursor-pointer"
            >
              <GoogleIcon className="h-4.5 w-4.5 shrink-0" />
              <span>Continue with Google</span>
              {!googleEnabled && (
                <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-0.5 text-xs uppercase tracking-wide text-amber-200">
                  Setup pending
                </span>
              )}
            </button>
          </>
        )}

        <p className="mt-5 text-center text-sm leading-relaxed text-slate-400">
          Read our{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby="auth-legal-tab-notice"
            className="text-white no-underline hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby="auth-legal-tab-notice"
            className="text-white no-underline hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Privacy Policy
          </Link>.
          <span id="auth-legal-tab-notice" className="sr-only">
            Each document opens in a new tab.
          </span>
        </p>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isSignIn ? "New to Zenoba?" : "Already have an account?"}{" "}
          <Link
            href={authHref(isSignIn ? "sign-up" : "sign-in", callbackUrl)}
            className="font-semibold text-white underline! underline-offset-4 decoration-white hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {isSignIn ? "Create account" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputClasses =
  "mt-1.5 h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20";

function Field({
  label,
  id,
  action,
  children,
}: {
  label: string;
  id: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
  );
}
