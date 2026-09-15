"use client";

import React, { useState } from "react";
import { CheckCircle2, RotateCcw, Award } from "lucide-react";
import { useLearningDraft } from "../../drafts/use-learning-draft";

interface PinColor {
  id: string;
  name: string;
  bgClass: string;
}

const ALL_PINS: PinColor[] = [
  { id: "WO", name: "Putih-Oranye", bgClass: "bg-orange-100 text-orange-800 border-orange-400" },
  { id: "O", name: "Oranye", bgClass: "bg-orange-500 text-white border-orange-600" },
  { id: "WG", name: "Putih-Hijau", bgClass: "bg-green-100 text-green-800 border-green-400" },
  { id: "B", name: "Biru", bgClass: "bg-blue-600 text-white border-blue-700" },
  { id: "WB", name: "Putih-Biru", bgClass: "bg-blue-100 text-blue-800 border-blue-400" },
  { id: "G", name: "Hijau", bgClass: "bg-green-600 text-white border-green-700" },
  { id: "WBr", name: "Putih-Cokelat", bgClass: "bg-amber-100 text-amber-900 border-amber-400" },
  { id: "Br", name: "Cokelat", bgClass: "bg-amber-800 text-white border-amber-900" },
];

const T568B_CORRECT = ["WO", "O", "WG", "B", "WB", "G", "WBr", "Br"];
const T568A_CORRECT = ["WG", "G", "WO", "B", "WB", "O", "WBr", "Br"];

interface CableOrderExerciseProps {
  block?: {
    id?: string;
    [key: string]: unknown;
  };
  lessonId?: string;
}

interface CableOrderDraftPayload {
  standard: "T568B" | "T568A";
  currentSlots: string[];
}

export function CableOrderExercise({ block, lessonId }: CableOrderExerciseProps = {}) {
  const [standard, setStandard] = useState<"T568B" | "T568A">("T568B");
  const [currentSlots, setCurrentSlots] = useState<string[]>([]);
  const [validated, setValidated] = useState<boolean | null>(null);

  const activityId = block?.id || "cable_order";

  const { discardDraft } = useLearningDraft<CableOrderDraftPayload>({
    lessonId,
    activityId,
    payload: { standard, currentSlots },
    onRestore: (draftPayload) => {
      if (draftPayload) {
        if (draftPayload.standard === "T568A" || draftPayload.standard === "T568B") {
          setStandard(draftPayload.standard);
        }
        if (Array.isArray(draftPayload.currentSlots)) {
          setCurrentSlots(draftPayload.currentSlots);
        }
      }
    },
  });

  const correctSequence = standard === "T568B" ? T568B_CORRECT : T568A_CORRECT;

  const handleAddPin = (pinId: string) => {
    if (currentSlots.length < 8 && !currentSlots.includes(pinId)) {
      const updated = [...currentSlots, pinId];
      setCurrentSlots(updated);
      setValidated(null);
    }
  };

  const handleRemovePin = (index: number) => {
    const updated = currentSlots.filter((_, idx) => idx !== index);
    setCurrentSlots(updated);
    setValidated(null);
  };

  const handleReset = () => {
    discardDraft();
    setCurrentSlots([]);
    setValidated(null);
  };

  const handleCheck = () => {
    if (currentSlots.length === 8) {
      const isCorrect = currentSlots.every((id, idx) => id === correctSequence[idx]);
      setValidated(isCorrect);
      if (isCorrect) {
        discardDraft();
      }
    }
  };

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Award className="w-4 h-4" />
          <span>Interactive Crimping Standard (T568A / T568B)</span>
        </div>

        {/* Standard Switcher */}
        <div className="flex items-center space-x-1.5 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setStandard("T568B");
              handleReset();
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              standard === "T568B"
                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            T568B (Paling Umum)
          </button>
          <button
            type="button"
            onClick={() => {
              setStandard("T568A");
              handleReset();
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              standard === "T568A"
                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            T568A
          </button>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-gray-600 dark:text-gray-300">
        Klik pin warna di bawah untuk menyusun urutan 8 kawat konektor RJ-45 standar <strong>{standard}</strong> dari Pin 1 ke Pin 8:
      </p>

      {/* Selected RJ-45 Slots Visual */}
      <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 space-y-3">
        <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider flex justify-between">
          <span>RJ-45 Head (Pin 1)</span>
          <span>(Pin 8)</span>
        </div>
        <div className="grid grid-cols-8 gap-1.5 min-h-16">
          {Array.from({ length: 8 }).map((_, idx) => {
            const pinId = currentSlots[idx];
            const pinData = ALL_PINS.find((p) => p.id === pinId);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => pinId && handleRemovePin(idx)}
                className={`h-16 rounded-lg border-2 flex flex-col items-center justify-between p-1 transition-all text-[9px] font-bold ${
                  pinData
                    ? `${pinData.bgClass} hover:opacity-80`
                    : "border-dashed border-gray-700 bg-gray-800/60 text-gray-500"
                }`}
              >
                <span>#{idx + 1}</span>
                <span className="text-center leading-tight truncate w-full">
                  {pinData ? pinData.name : "Kosong"}
                </span>
                <span>{pinId || "-"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Pin Choices */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
          Pilihan Pin Warna:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_PINS.map((pin) => {
            const isUsed = currentSlots.includes(pin.id);

            return (
              <button
                key={pin.id}
                type="button"
                disabled={isUsed || currentSlots.length >= 8}
                onClick={() => handleAddPin(pin.id)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                  pin.bgClass
                } ${isUsed ? "opacity-30 cursor-not-allowed" : "hover:scale-102 shadow-sm"}`}
              >
                <span>{pin.name}</span>
                <span className="font-mono">{pin.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Feedback */}
      {validated !== null && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-xs font-bold ${
            validated
              ? "bg-green-50 dark:bg-green-950/60 border-green-300 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-950/60 border-red-300 text-red-800 dark:text-red-200"
          }`}
        >
          {validated ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>Urutan kawat pin RJ-45 standar {standard} tepat 100%! Siap untuk proses crimping.</span>
            </>
          ) : (
            <>
              <span>Urutan kawat belum tepat. Silakan ulas kembali standar pinout dan coba lagi.</span>
            </>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset Urutan
        </button>
        <button
          type="button"
          disabled={currentSlots.length < 8}
          onClick={handleCheck}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-colors shadow-sm"
        >
          Periksa Urutan Crimping
        </button>
      </div>
    </div>
  );
}
