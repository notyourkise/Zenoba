"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function ResetPasswordForm({ token }: { token?: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    token ? null : "This password reset link is invalid or incomplete.",
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!token) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setError(body.error || "Unable to reset your password.");
        return;
      }
      setMessage(body.message || "Your password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Unable to reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#090b14]/95 p-6 text-white shadow-2xl shadow-sky-950/30 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Create a new password</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Choose a password with at least eight characters.
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

      {!message && (
        <form aria-label="Reset password" onSubmit={handleSubmit} className="mt-6 space-y-4">
          <PasswordField
            id="new-password"
            label="New password"
            value={password}
            onChange={setPassword}
          />
          <PasswordField
            id="confirm-new-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <button
            type="submit"
            disabled={!token || loading}
            className="mt-1 h-11 w-full rounded-xl bg-white px-4 text-sm font-bold text-black transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      )}

      <Link
        href="/?auth=sign-in"
        className="mt-6 block text-center text-sm font-semibold text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        {message ? "Sign in" : "Back to sign in"}
      </Link>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        id={id}
        type="password"
        required
        minLength={8}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        className="mt-1.5 h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-sm text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
      />
    </div>
  );
}
