"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseLearningDraftOptions<T> {
  lessonId?: string;
  activityId?: string;
  contentVersion?: string;
  payload: T;
  debounceMs?: number;
  enabled?: boolean;
  onRestore?: (payload: T) => void;
}

export type DraftStatus = "idle" | "restoring" | "saving" | "saved" | "error";

export interface UseLearningDraftReturn {
  status: DraftStatus;
  lastSavedAt: Date | null;
  error: string | null;
  saveNow: () => Promise<boolean>;
  discardDraft: () => Promise<boolean>;
}

export function useLearningDraft<T>({
  lessonId,
  activityId,
  contentVersion = "1.0",
  payload,
  debounceMs = 1000,
  enabled = true,
  onRestore,
}: UseLearningDraftOptions<T>): UseLearningDraftReturn {
  const [status, setStatus] = useState<DraftStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isRestoredRef = useRef(false);
  const lastSavedPayloadJsonRef = useRef<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const payloadRef = useRef(payload);
  const onRestoreRef = useRef(onRestore);

  useEffect(() => {
    payloadRef.current = payload;
    onRestoreRef.current = onRestore;
  }, [payload, onRestore]);

  // Restore draft on mount
  useEffect(() => {
    if (!enabled || !lessonId || !activityId) {
      return;
    }

    let isCancelled = false;

    async function fetchExistingDraft() {
      try {
        setStatus("restoring");
        const query = new URLSearchParams({
          lessonId: lessonId!,
          activityId: activityId!,
        });
        const res = await fetch(`/api/learning/drafts?${query.toString()}`);
        if (!res.ok) {
          if (!isCancelled) {
            setStatus("idle");
          }
          return;
        }

        const data = await res.json();
        if (isCancelled) return;

        if (data?.draft?.payload) {
          lastSavedPayloadJsonRef.current = JSON.stringify(data.draft.payload);
          onRestoreRef.current?.(data.draft.payload);
        } else {
          lastSavedPayloadJsonRef.current = JSON.stringify(payloadRef.current);
        }

        isRestoredRef.current = true;
        setStatus("idle");
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat draf");
          setStatus("idle");
        }
      }
    }

    fetchExistingDraft();

    return () => {
      isCancelled = true;
    };
  }, [lessonId, activityId, enabled]);

  // Save implementation
  const executeSave = useCallback(
    async (payloadToSave: T): Promise<boolean> => {
      if (!enabled || !lessonId || !activityId) {
        return false;
      }

      try {
        setStatus("saving");
        setError(null);

        const res = await fetch("/api/learning/drafts", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId,
            activityId,
            contentVersion,
            payload: payloadToSave,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        lastSavedPayloadJsonRef.current = JSON.stringify(payloadToSave);
        setLastSavedAt(new Date());
        setStatus("saved");
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Gagal menyimpan draf";
        setError(msg);
        setStatus("error");
        return false;
      }
    },
    [lessonId, activityId, contentVersion, enabled]
  );

  // Manual save trigger
  const saveNow = useCallback(async (): Promise<boolean> => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return executeSave(payloadRef.current);
  }, [executeSave]);

  // Discard draft
  const discardDraft = useCallback(async (): Promise<boolean> => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!lessonId || !activityId) {
      setStatus("idle");
      return true;
    }

    try {
      const query = new URLSearchParams({
        lessonId,
        activityId,
      });

      const res = await fetch(`/api/learning/drafts?${query.toString()}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      lastSavedPayloadJsonRef.current = "";
      setStatus("idle");
      setError(null);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus draf";
      setError(msg);
      setStatus("error");
      return false;
    }
  }, [lessonId, activityId]);

  // Debounced autosave watcher
  useEffect(() => {
    if (!enabled || !lessonId || !activityId || !isRestoredRef.current) {
      return;
    }

    const currentPayloadJson = JSON.stringify(payload);
    if (currentPayloadJson === lastSavedPayloadJsonRef.current) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      executeSave(payload);
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [payload, enabled, lessonId, activityId, debounceMs, executeSave]);

  return {
    status,
    lastSavedAt,
    error,
    saveNow,
    discardDraft,
  };
}
