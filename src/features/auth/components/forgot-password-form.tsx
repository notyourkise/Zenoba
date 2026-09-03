"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setError(body.error || "Unable to request a password reset.");
        return;
      }
      setMessage(body.message || "Check your email for the next step.");
    } catch {
      setError("Unable to request a password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#090b14]/95 p-6 text-white shadow-2xl shadow-sky-950/30 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Enter your account email and we&apos;ll send a reset link if the account exists.
      </p>

      {message && (
        <p role="status" className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2.5 text-sm text-emerald-200">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-200">
          {error}
        </p>
      )}

      <form aria-label="Request password reset" onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="recovery-email" className="text-sm font-medium text-slate-200">
            Email
          </label>
          <input
            id="recovery-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-1.5 h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-white px-4 text-sm font-bold text-black transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <Link
        href="/?auth=sign-in"
        className="mt-6 block text-center text-sm font-semibold text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        Back to sign in
      </Link>
    </div>
  );
}
