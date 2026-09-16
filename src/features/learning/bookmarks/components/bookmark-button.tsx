"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookmarkButtonProps {
  lessonId: string;
  initialBookmarked?: boolean;
  className?: string;
  showLabel?: boolean;
  onToggle?: (isBookmarked: boolean) => void;
}

export function BookmarkButton({
  lessonId,
  initialBookmarked = false,
  className,
  showLabel = true,
  onToggle,
}: BookmarkButtonProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState<boolean>(initialBookmarked);
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/learning/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Unauthenticated: redirect or ignore
          router.push("/sign-in");
          return;
        }
        throw new Error("Gagal memperbarui bookmark");
      }

      const data = await res.json();
      const nextState = Boolean(data.bookmarked);
      setBookmarked(nextState);
      if (onToggle) {
        onToggle(nextState);
      }
    } catch {
      // Revert or ignore transient failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer disabled:opacity-50",
        bookmarked
          ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60"
          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700/70",
        className
      )}
      aria-label={bookmarked ? "Hapus dari bookmark" : "Simpan ke bookmark"}
      title={bookmarked ? "Hapus dari bookmark" : "Simpan ke bookmark"}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Bookmark
          className={cn("w-3.5 h-3.5", bookmarked && "fill-current")}
          aria-hidden="true"
        />
      )}
      {showLabel && (
        <span>{bookmarked ? "Tersimpan" : "Simpan"}</span>
      )}
    </button>
  );
}
