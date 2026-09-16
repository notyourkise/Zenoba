"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  ReviewItemView,
  ReviewSessionData,
} from "@/features/learning/review-service";
import type { ReviewRating } from "@/features/learning/review-scheduler";

interface ReviewSessionClientProps {
  sessionData: ReviewSessionData;
  initialOutcomeId?: string;
}

export function ReviewSessionClient({
  sessionData,
  initialOutcomeId,
}: ReviewSessionClientProps) {
  const [dueList, setDueList] = useState<ReviewItemView[]>(() => {
    if (!initialOutcomeId) return sessionData.dueReviews;
    const matchIndex = sessionData.dueReviews.findIndex(
      (item) => item.outcomeId === initialOutcomeId
    );
    if (matchIndex <= 0) return sessionData.dueReviews;
    // Bring requested outcome to front of the list
    const copy = [...sessionData.dueReviews];
    const [target] = copy.splice(matchIndex, 1);
    return [target, ...copy];
  });

  const [upcomingList, setUpcomingList] = useState<ReviewItemView[]>(
    sessionData.upcomingReviews
  );
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completedToday, setCompletedToday] = useState(
    sessionData.stats.completedTodayCount
  );

  const currentItem = dueList.length > 0 ? dueList[0] : null;

  async function handleRate(rating: ReviewRating) {
    if (!currentItem || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/learning/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcomeId: currentItem.outcomeId,
          rating,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan evaluasi review");
      }

      const data = await res.json();
      const updatedItem: ReviewItemView = data.item;

      // Update lists
      setDueList((prev) => prev.slice(1));
      setUpcomingList((prev) =>
        [...prev, updatedItem].sort(
          (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
        )
      );
      setShowKeyPoints(false);
      setCompletedToday((prev) => prev + 1);

      const ratingText =
        rating === "AGAIN"
          ? "Ulangi (dijadwalkan besok)"
          : rating === "HARD"
          ? `Sulit (dijadwalkan ${updatedItem.intervalDays} hari lagi)`
          : `Paham (dijadwalkan ${updatedItem.intervalDays} hari lagi)`;

      setFeedback(`Hasil tercatat: ${ratingText}`);
    } catch {
      setFeedback("Terjadi kendala jaringan saat menyimpan review. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Jatuh Tempo Hari Ini
          </div>
          <div className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-white">
            {dueList.length}
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Perlu diulas untuk menjaga retensi ingatan
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Selesai Diulas Hari Ini
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {completedToday}
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Materi berhasil diperkuat hari ini
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total Sasaran Terjadwal
          </div>
          <div className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-white">
            {sessionData.stats.totalTrackedCount}
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Kompetensi aktif dalam sistem pengulangan berkala
          </p>
        </div>
      </div>

      {/* Active Review Session */}
      {currentItem ? (
        <section aria-label="Sesi Review Aktif" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              Sesi Review Berkala
            </span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Tersisa {dueList.length} materi jatuh tempo
            </span>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-white dark:bg-zinc-900/80 shadow-xs space-y-6">
            {/* Context Breadcrumb */}
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {currentItem.pathTitle} · {currentItem.moduleTitle}
            </div>

            {/* Outcome Target */}
            <div>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white leading-snug">
                {currentItem.text}
              </h2>
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Kode Sasaran: <span className="font-mono">{currentItem.outcomeId}</span> · Berturut-turut dipahami: {currentItem.consecutiveSuccesses} kali
              </div>
            </div>

            {/* Prompt & Concept Check */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 space-y-3">
              <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Uji Daya Ingat Konsep
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Tanpa melihat materi bantuan terlebih dahulu, cobalah jelaskan atau sebutkan poin-poin utama dari kompetensi di atas dalam pikiran Anda.
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => setShowKeyPoints((prev) => !prev)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  {showKeyPoints ? "Sembunyikan Poin Kunci" : "Tampilkan Poin Kunci Konsep"}
                </button>
              </div>

              {showKeyPoints && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
                  <div className="font-medium text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Ringkasan Sasaran Pembelajaran:
                  </div>
                  <p>{currentItem.description || currentItem.text}</p>
                  {currentItem.lessonSlug && (
                    <div className="pt-2">
                      <Link
                        href={`/learn/${currentItem.pathSlug}/${currentItem.moduleSlug}/${currentItem.lessonSlug}`}
                        target="_blank"
                        className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Buka Materi Pelajaran Asli (Buka di tab baru)
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div
                role="status"
                className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-900 dark:text-blue-200 text-sm font-medium"
              >
                {feedback}
              </div>
            )}

            {/* Rating Actions */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Bagaimana pemahaman Anda saat ini?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRate("AGAIN")}
                  className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-left transition-colors disabled:opacity-50"
                >
                  <div className="font-bold text-sm text-rose-700 dark:text-rose-400">
                    Ulangi (AGAIN)
                  </div>
                  <div className="mt-1 text-xs text-rose-900/80 dark:text-rose-300/80">
                    Belum ingat / Perlu pelajari ulang
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    Jadwal: 1 hari lagi
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRate("HARD")}
                  className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-left transition-colors disabled:opacity-50"
                >
                  <div className="font-bold text-sm text-amber-700 dark:text-amber-400">
                    Sulit (HARD)
                  </div>
                  <div className="mt-1 text-xs text-amber-900/80 dark:text-amber-300/80">
                    Ingat sebagian / Butuh usaha ekstra
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    Jadwal bertahap moderat
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRate("GOOD")}
                  className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-colors disabled:opacity-50"
                >
                  <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                    Paham (GOOD)
                  </div>
                  <div className="mt-1 text-xs text-emerald-900/80 dark:text-emerald-300/80">
                    Paham dengan jelas dan percaya diri
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    Jadwal rentang lebih panjang
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Zero Due State */
        <div className="p-8 sm:p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-center space-y-4 shadow-xs">
          <div className="space-y-2 max-w-md mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Target Terpenuhi
            </span>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Semua Review Jatuh Tempo Telah Selesai
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Tidak ada materi yang memerlukan ulasan hari ini. Sistem akan menjadwalkan materi secara berkala untuk menjaga penguasaan konsep jangka panjang.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Kembali ke Dashboard
            </Link>
            <Link
              href="/learn/mastery"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
            >
              Status Penguasaan Materi
            </Link>
          </div>
        </div>
      )}

      {/* Upcoming Scheduled Reviews Section */}
      <section aria-label="Jadwal Review Mendatang" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Jadwal Review Mendatang
          </h3>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {upcomingList.length} sasaran terjadwal
          </span>
        </div>

        {upcomingList.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Belum ada jadwal review berikutnya. Selesaikan materi pembelajaran dan uji kompetensi untuk mengaktifkan jadwal pengulangan berkala.
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/60 shadow-xs">
            {upcomingList.map((item) => (
              <div
                key={item.outcomeId}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    {item.pathTitle} · {item.moduleTitle}
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">
                    {item.text}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Kode: <span className="font-mono">{item.outcomeId}</span> · Interval: {item.intervalDays} hari · Berturut-turut: {item.consecutiveSuccesses} kali
                  </div>
                </div>
                <div className="text-right sm:shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    Jatuh tempo dalam {item.daysRemaining} hari
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
