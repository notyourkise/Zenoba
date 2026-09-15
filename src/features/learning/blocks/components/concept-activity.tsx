"use client";

import React, { useState } from "react";
import type { LessonBlock } from "../schema";
import { useLearningDraft } from "../../drafts/use-learning-draft";

interface ConceptActivityProps {
  block: LessonBlock & {
    id?: string;
    interactiveType?: string;
    config?: {
      scenario?: string;
      instruction?: string;
    };
  };
  lessonId?: string;
}

export function ConceptActivity({ block, lessonId }: ConceptActivityProps) {
  const interactiveType = block.interactiveType || "activity";
  const activityId = block.id || interactiveType;
  const instruction = block.config?.instruction || "Selesaikan latihan interaktif berikut.";

  // ==========================================
  // Classification Activity (Lesson 2)
  // ==========================================
  if (interactiveType === "classification") {
    const items = [
      { id: "pc", label: "PC Siswa", type: "endpoint" },
      { id: "cable", label: "Kabel UTP / RJ-45", type: "media" },
      { id: "laptop", label: "Laptop Guru", type: "endpoint" },
      { id: "wifi", label: "Gelombang Wi-Fi", type: "media" },
      { id: "printer", label: "Printer Jaringan", type: "endpoint" },
    ];

    return (
      <ClassificationPlayer
        items={items}
        instruction={instruction}
        lessonId={lessonId}
        activityId={activityId}
      />
    );
  }

  // ==========================================
  // Role Assignment Activity (Lesson 3)
  // ==========================================
  if (interactiveType === "role_assignment") {
    return (
      <RoleAssignmentPlayer
        instruction={instruction}
        lessonId={lessonId}
        activityId={activityId}
      />
    );
  }

  // ==========================================
  // Resource Selection / Match (Lesson 1 & 3)
  // ==========================================
  if (interactiveType === "resource_match" || interactiveType === "resource_selection") {
    return (
      <ResourceSelectionPlayer
        instruction={instruction}
        isL3={interactiveType === "resource_selection"}
        lessonId={lessonId}
        activityId={activityId}
      />
    );
  }

  // ==========================================
  // Message Flow Activity (Lesson 4)
  // ==========================================
  if (interactiveType === "message_flow") {
    return (
      <MessageFlowPlayer
        instruction={instruction}
        lessonId={lessonId}
        activityId={activityId}
      />
    );
  }

  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs">
      <div className="font-semibold">{instruction}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Classification Sub-player
// -----------------------------------------------------------------------------
function ClassificationPlayer({
  items,
  instruction,
  lessonId,
  activityId,
}: {
  items: { id: string; label: string; type: string }[];
  instruction: string;
  lessonId?: string;
  activityId?: string;
}) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useLearningDraft<{ selections: Record<string, string> }>({
    lessonId,
    activityId,
    payload: { selections },
    onRestore: (draftPayload) => {
      if (draftPayload?.selections) {
        setSelections(draftPayload.selections);
      }
    },
  });

  const handleSelect = (itemId: string, category: string) => {
    setSelections((prev) => ({ ...prev, [itemId]: category }));
    setSubmitted(false);
  };

  const allAssigned = items.every((item) => Boolean(selections[item.id]));
  const allCorrect =
    submitted && items.every((item) => selections[item.id] === item.type);

  return (
    <div className="my-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Latihan Interaktif: Klasifikasi Perangkat vs Media
        </span>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{instruction}</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const selected = selections[item.id];
          const isCorrect = submitted && selected === item.type;
          const isWrong = submitted && selected && selected !== item.type;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                isCorrect
                  ? "border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
                  : isWrong
                  ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40"
              }`}
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                {item.label}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelect(item.id, "endpoint")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selected === "endpoint"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Perangkat Akhir
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect(item.id, "media")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selected === "media"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Media Transmisi
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={!allAssigned}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 shadow-sm transition-colors"
        >
          Periksa Pengelompokan
        </button>

        {submitted && (
          <span
            className={`text-xs font-semibold ${
              allCorrect ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {allCorrect
              ? "Tepat sekali! Seluruh komponen telah terklasifikasi dengan benar."
              : "Ada klasifikasi yang belum tepat. Periksa kembali perangkat vs media."}
          </span>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Role Assignment Sub-player
// -----------------------------------------------------------------------------
function RoleAssignmentPlayer({
  instruction,
  lessonId,
  activityId,
}: {
  instruction: string;
  lessonId?: string;
  activityId?: string;
}) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChoose = (role: string) => {
    setSelectedRole(role);
    if (role === "client") {
      setFeedback(
        "Tepat! PC Siswa yang menekan tombol 'Cetak' bertindak sebagai Peminta Layanan (Client / Requester). Sedangkan Printer bertindak sebagai penyedia layanan cetak."
      );
    } else {
      setFeedback(
        "Belum tepat. PC yang meminta dokumen dicetak adalah inisiator permintaan (Client), bukan penyedia."
      );
    }
  };

  useLearningDraft<{ selectedRole: string | null }>({
    lessonId,
    activityId,
    payload: { selectedRole },
    onRestore: (draftPayload) => {
      if (draftPayload?.selectedRole) {
        handleChoose(draftPayload.selectedRole);
      }
    },
  });

  return (
    <div className="my-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Latihan Interaktif: Peran Client vs Server
        </span>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{instruction}</p>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-xs leading-relaxed">
        <strong>Skenario:</strong> Siswa di PC-08 mengirim dokumen tugas ke Printer Jaringan di ruang guru.
        Dalam transaksi ini, apa peran dari <strong>PC-08</strong>?
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => handleChoose("client")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            selectedRole === "client"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200"
          }`}
        >
          Peminta Layanan (Client / Requester)
        </button>
        <button
          type="button"
          onClick={() => handleChoose("server")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            selectedRole === "server"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200"
          }`}
        >
          Penyedia Layanan (Server / Provider)
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs leading-relaxed ${
            selectedRole === "client"
              ? "border-green-200 bg-green-50/70 text-green-800 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800"
              : "border-amber-200 bg-amber-50/70 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Resource Selection Sub-player
// -----------------------------------------------------------------------------
function ResourceSelectionPlayer({
  instruction,
  isL3,
  lessonId,
  activityId,
}: {
  instruction: string;
  isL3: boolean;
  lessonId?: string;
  activityId?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useLearningDraft<{ selected: string | null }>({
    lessonId,
    activityId,
    payload: { selected },
    onRestore: (draftPayload) => {
      if (draftPayload?.selected) {
        setSelected(draftPayload.selected);
      }
    },
  });

  return (
    <div className="my-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Latihan Interaktif: Solusi Berbagi Sumber Daya
        </span>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{instruction}</p>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-xs leading-relaxed">
        {isL3
          ? "Sebuah lab SMK ingin seluruh 30 siswa dapat membaca modul praktikum PDF yang sama secara serentak tanpa fotokopi dan tanpa colok flashdisk manual. Solusi apa yang paling efisien?"
          : "Di lab dengan 20 komputer dan 1 printer, solusi apa yang menghemat waktu tanpa siswa harus mengantre flashdisk ke komputer printer?"}
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setSelected("opt1")}
          className={`w-full text-left p-3 rounded-xl border text-xs transition-colors ${
            selected === "opt1"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 font-semibold"
              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
        >
          {isL3
            ? "Membuat folder bersama (shared folder) di server lokal lab yang dapat diakses langsung oleh seluruh PC siswa."
            : "Menghubungkan printer ke jaringan lab agar seluruh 20 komputer dapat mencetak ke printer yang sama."}
        </button>
        <button
          type="button"
          onClick={() => setSelected("opt2")}
          className={`w-full text-left p-3 rounded-xl border text-xs transition-colors ${
            selected === "opt2"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 font-semibold"
              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
        >
          {isL3
            ? "Membeli 30 flashdisk baru dan mengopi file satu per satu setiap pagi."
            : "Membeli 20 printer terpisah untuk masing-masing komputer."}
        </button>
      </div>

      {selected && (
        <div
          className={`p-3 rounded-xl border text-xs leading-relaxed ${
            selected === "opt1"
              ? "border-green-200 bg-green-50/70 text-green-800 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800"
              : "border-red-200 bg-red-50/70 text-red-800 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800"
          }`}
        >
          {selected === "opt1"
            ? "Benar! Solusi jaringan ini memangkas biaya perangkat keras dan meniadakan antrean fisik."
            : "Tidak efisien. Solusi ini memboroskan anggaran dan tidak memanfaatkan kemampuan jaringan komputer."}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Message Flow Ordering Sub-player
// -----------------------------------------------------------------------------
function MessageFlowPlayer({
  instruction,
  lessonId,
  activityId,
}: {
  instruction: string;
  lessonId?: string;
  activityId?: string;
}) {
  const [activeStep, setActiveStep] = useState(0);

  useLearningDraft<{ activeStep: number }>({
    lessonId,
    activityId,
    payload: { activeStep },
    onRestore: (draftPayload) => {
      if (typeof draftPayload?.activeStep === "number") {
        setActiveStep(draftPayload.activeStep);
      }
    },
  });

  const stages = [
    {
      title: "1. Pembuatan Permintaan (Request Creation)",
      desc: "Laptop klien menyusun pesan data permintaan berkas (Request).",
    },
    {
      title: "2. Pengiriman Melalui Media (Transmission)",
      desc: "Pesan dikirim melalui kabel/gelombang nirkabel melewati switch menuju tujuan.",
    },
    {
      title: "3. Penerimaan & Pemrosesan (Processing)",
      desc: "Komputer penyedia menerima pesan, membaca instruksi, dan memproses data yang diminta.",
    },
    {
      title: "4. Pengiriman Respons (Response Reply)",
      desc: "Penyedia mengirim status konfirmasi dan data kembali ke laptop klien peminta.",
    },
  ];

  return (
    <div className="my-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm space-y-4">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Latihan Interaktif: Siklus Komunikasi Request-Response
        </span>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{instruction}</p>
      </div>

      <div className="space-y-2">
        {stages.map((stg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-xs transition-colors ${
              activeStep === idx
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400"
            }`}
          >
            <div className="font-bold">{stg.title}</div>
            <div className="mt-0.5 opacity-90">{stg.desc}</div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setActiveStep((prev) => (prev < stages.length - 1 ? prev + 1 : 0))
          }
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
        >
          {activeStep === stages.length - 1 ? "Ulangi Alur" : "Langkah Alur Berikutnya"}
        </button>
        <span className="text-xs font-semibold text-gray-500">
          Tahap {activeStep + 1} dari {stages.length}
        </span>
      </div>
    </div>
  );
}
