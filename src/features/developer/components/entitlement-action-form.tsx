"use client";

import * as React from "react";

export interface PackageOption {
  id: string;
  title: string;
  kind?: string;
  courseCount?: number;
}

export interface EntitlementActionFormProps {
  packages: PackageOption[];
  initialTargetUserId?: string;
  initialTargetUserEmail?: string;
  isElevated?: boolean;
  onSuccess?: (result: {
    action: "GRANT" | "REVOKE";
    targetUserId: string;
    packageId: string;
    affectedCourses: string[];
    idempotentReplay: boolean;
  }) => void;
}

export function EntitlementActionForm({
  packages,
  initialTargetUserId = "",
  initialTargetUserEmail,
  isElevated = true,
  onSuccess,
}: EntitlementActionFormProps) {
  const [targetUserId, setTargetUserId] = React.useState(initialTargetUserId);
  const [packageId, setPackageId] = React.useState(packages[0]?.id ?? "");
  const [action, setAction] = React.useState<"GRANT" | "REVOKE">("GRANT");
  const [reason, setReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Generate unique request ID per form submission
  const [requestId, setRequestId] = React.useState(() => {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "10000000-1000-4000-8000-100000000000";
  });

  const isReasonValid = reason.trim().length >= 12;
  const isFormValid = targetUserId.trim().length > 0 && packageId.length > 0 && isReasonValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/developer/entitlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          targetUserId: targetUserId.trim(),
          packageId,
          reason: reason.trim(),
          requestId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal melakukan mutasi hak akses paket.");
      }

      const replayNote = data.idempotentReplay ? " (Replay Idempoten)" : "";
      const actionText = action === "GRANT" ? "diberikan" : "dicabut";
      setFeedback({
        type: "success",
        message: `Hak akses paket berhasil ${actionText} untuk ${data.affectedCourses?.length ?? 0} kursus.${replayNote}`,
      });

      // Reset reason and refresh request ID for subsequent mutations
      setReason("");
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        setRequestId(crypto.randomUUID());
      }

      onSuccess?.(data);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Terjadi kesalahan saat memproses mutasi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#080d1a] border border-slate-800 rounded-lg p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-base font-semibold text-white">
          Formulir Penyesuaian Hak Akses Paket (Entitlement)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Setiap tindakan pemberian atau pencabutan kursus akan dicatat ke Developer Audit Log secara permanen dengan alasan tertulis. Riwayat transaksi pesanan historis tidak akan disentuh.
        </p>
      </div>

      {!isElevated && (
        <div
          role="alert"
          className="p-3 bg-amber-950/40 border border-amber-800/60 rounded text-xs text-amber-200"
        >
          <strong>Sesi Elevasi Belum Aktif:</strong> Mutasi hak akses membutuhkan sesi elevasi aktif (10 menit). Gunakan tombol &quot;Elevate Privileges&quot; pada bagian atas halaman sebelum mengirimkan formulir.
        </div>
      )}

      {feedback && (
        <div
          role="alert"
          className={`p-3 rounded text-xs border ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
              : "bg-red-950/40 border-red-800/60 text-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target User ID */}
        <div>
          <label htmlFor="target-user-id" className="block text-xs font-medium text-slate-300">
            Target Pengguna (User ID / CUID)
          </label>
          <input
            id="target-user-id"
            name="targetUserId"
            type="text"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="clrk..."
            required
            disabled={isSubmitting || !!initialTargetUserId}
            className="mt-1 block w-full bg-zinc-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-75"
          />
          {initialTargetUserEmail && (
            <p className="mt-1 text-[11px] text-slate-400 font-mono">
              Target email: {initialTargetUserEmail}
            </p>
          )}
        </div>

        {/* Action Toggle */}
        <div>
          <span className="block text-xs font-medium text-slate-300 mb-1.5">
            Aksi Mutasi
          </span>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Aksi Mutasi">
            <button
              type="button"
              role="radio"
              aria-checked={action === "GRANT"}
              onClick={() => setAction("GRANT")}
              disabled={isSubmitting}
              className={`px-3 py-2 text-xs font-medium rounded border text-center transition ${
                action === "GRANT"
                  ? "bg-emerald-950/50 border-emerald-600 text-emerald-300"
                  : "bg-zinc-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Beri Akses (Grant)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={action === "REVOKE"}
              onClick={() => setAction("REVOKE")}
              disabled={isSubmitting}
              className={`px-3 py-2 text-xs font-medium rounded border text-center transition ${
                action === "REVOKE"
                  ? "bg-red-950/50 border-red-600 text-red-300"
                  : "bg-zinc-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Cabut Akses (Revoke)
            </button>
          </div>
        </div>

        {/* Package Selector */}
        <div>
          <label htmlFor="package-select" className="block text-xs font-medium text-slate-300">
            Pilihan Paket Pembelajaran
          </label>
          <select
            id="package-select"
            name="packageId"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            disabled={isSubmitting || packages.length === 0}
            className="mt-1 block w-full bg-zinc-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {packages.length === 0 ? (
              <option value="">Tidak ada paket tersedia</option>
            ) : (
              packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title} {pkg.courseCount !== undefined ? `(${pkg.courseCount} Kursus)` : ""}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Reason Textarea */}
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="mutation-reason" className="block text-xs font-medium text-slate-300">
              Alasan Tertulis (Wajib, dicatat di Audit Log)
            </label>
            <span
              className={`text-[11px] ${
                reason.trim().length >= 12 ? "text-slate-400" : "text-amber-400"
              }`}
            >
              {reason.trim().length}/1000 (minimal 12 karakter)
            </span>
          </div>
          <textarea
            id="mutation-reason"
            name="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Pemberian akses beasiswa pelatihan siswa SMK TKJ atau tiket dukungan teknis #1234."
            required
            disabled={isSubmitting}
            className="mt-1 block w-full bg-zinc-950 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {!isReasonValid && reason.length > 0 && (
            <p className="mt-1 text-[11px] text-amber-400">
              Alasan harus terdiri dari minimal 12 karakter.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting || !isElevated}
            className={`w-full py-2 px-4 rounded text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              action === "GRANT"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            {isSubmitting
              ? "Memproses Mutasi..."
              : action === "GRANT"
              ? "Eksekusi Pemberian Akses Paket"
              : "Eksekusi Pencabutan Akses Paket"}
          </button>
        </div>
      </form>
    </div>
  );
}
