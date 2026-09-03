"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  initialName: string;
}

export function ProfileForm({ initialName }: ProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui nama");
      }

      setSuccess("Nama profil berhasil diperbarui!");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui nama");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-5 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Nama Tampilan
        </h4>
        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setSuccess(null);
              setError(null);
            }}
            className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
          >
            Ubah
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="p-3 text-xs rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="p-3 text-xs rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          >
            {success}
          </div>
        )}

        <div>
          <label htmlFor="display-name-input" className="sr-only">
            Nama Tampilan
          </label>
          <input
            id="display-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            placeholder="Masukkan nama tampilan Anda"
            className={`w-full px-3.5 py-2.5 rounded-lg text-sm transition-colors border ${
              isEditing
                ? "bg-white dark:bg-white/[0.04] border-gray-300 dark:border-white/15 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                : "bg-gray-100/70 dark:bg-white/[0.02] border-transparent text-gray-700 dark:text-slate-300 cursor-default"
            }`}
          />
        </div>

        {isEditing && (
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setName(initialName);
                setIsEditing(false);
                setError(null);
              }}
              className="h-9 px-3 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-semibold transition cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}
      </form>
    </div>
  );
}