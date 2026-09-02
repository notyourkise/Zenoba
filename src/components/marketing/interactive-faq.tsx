"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqCategory = "all" | "access" | "curriculum" | "simulator" | "consultant";

interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "access",
    question: "Apakah Netloka dapat diakses dari laptop atau HP dengan spesifikasi rendah?",
    answer:
      "Ya! Seluruh simulasi terminal, kalkulator jaringan, dan visualisasi topologi Netloka berjalan 100% secara instan di peramban web modern (client-side simulation). Anda tidak memerlukan laptop spesifikasi tinggi dan tidak perlu mengunduh aplikasi berat bergiga-giga seperti simulator konvensional.",
  },
  {
    id: "faq-2",
    category: "curriculum",
    question: "Apakah materi Netloka sesuai dengan kurikulum SMK TKJ dan sertifikasi industri?",
    answer:
      "Tentu. Kurikulum Netloka dirancang selaras dengan Capaian Pembelajaran SMK Konsentrasi Keahlian Teknik Komputer & Jaringan (TKJ) Kurikulum Merdeka, sekaligus membekali fondasi kompetensi esensial untuk sertifikasi internasional seperti Cisco CCNA (200-301) dan MikroTik MTCNA.",
  },
  {
    id: "faq-3",
    category: "simulator",
    question: "Bagaimana cara kerja simulator terminal Netloka dan apakah aman?",
    answer:
      "Terminal dan lab di Netloka menggunakan sistem simulasi protokol jaringan deterministik di lingkungan browser yang terisolasi aman (sandboxed). Simulator tidak mengeksekusi perintah ke shell host perangkat Anda, sehingga 100% aman untuk bereksperimen tanpa risiko merusak sistem.",
  },
  {
    id: "faq-4",
    category: "consultant",
    question: "Apa itu Mode Proyek Konsultan IT dan bagaimana penilaiannya?",
    answer:
      "Mode Konsultan adalah simulasi berbasis studi kasus dunia nyata di mana Anda bertindak sebagai Network Architect. Anda akan menganalisis kebutuhan klien, memilih perangkat hardware (BoQ), mengelola alokasi anggaran, merancang topologi, dan dinilai otomatis berdasarkan keandalan teknis serta efisiensi biaya.",
  },
  {
    id: "faq-5",
    category: "access",
    question: "Apakah materi dasar dan simulator Netloka dapat diakses gratis?",
    answer:
      "Seluruh modul fondasi, 9 simulator interaktif di web, serta tantangan dasar dapat diakses secara gratis oleh seluruh siswa, guru, dan pembelajar jaringan mandiri di Indonesia.",
  },
  {
    id: "faq-6",
    category: "curriculum",
    question: "Apakah progres belajar dan perolehan XP tersimpan di profil akun?",
    answer:
      "Ya. Setiap materi yang Anda pelajari, latihan subnet yang Anda selesaikan, serta tantangan lab yang Anda tuntuntasakan akan langsung mencatat progres kelulusan modul dan mengakumulasi poin XP ke dalam profil akun Netloka Anda.",
  },
];

const CATEGORIES: { id: FaqCategory; label: string }[] = [
  { id: "all", label: "Semua Pertanyaan" },
  { id: "access", label: "Akses & Perangkat" },
  { id: "curriculum", label: "Kurikulum & TKJ" },
  { id: "simulator", label: "Simulasi & Terminal" },
  { id: "consultant", label: "Mode Konsultan" },
];

function FaqStarField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90 z-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Bright Glowing Starlight Beacons with Radiant Halos */}
      <g>
        {/* Cyan Beacon (Top Right) */}
        <circle cx="92%" cy="12%" r="4" fill="#38bdf8" opacity="0.9" />
        <circle cx="92%" cy="12%" r="10" fill="#38bdf8" opacity="0.25" />
        <circle cx="92%" cy="12%" r="18" fill="#38bdf8" opacity="0.08" />

        {/* White Starlight Beacon (Top Left) */}
        <circle cx="8%" cy="18%" r="3.5" fill="#ffffff" opacity="0.95" />
        <circle cx="8%" cy="18%" r="9" fill="#ffffff" opacity="0.3" />
        <circle cx="8%" cy="18%" r="16" fill="#ffffff" opacity="0.1" />

        {/* Gold Radiant Beacon (Mid Right) */}
        <circle cx="88%" cy="48%" r="4.5" fill="#fde047" opacity="0.9" />
        <circle cx="88%" cy="48%" r="11" fill="#fde047" opacity="0.25" />
        <circle cx="88%" cy="48%" r="20" fill="#fde047" opacity="0.08" />

        {/* Emerald Beacon (Mid Left) */}
        <circle cx="12%" cy="56%" r="3.8" fill="#34d399" opacity="0.85" />
        <circle cx="12%" cy="56%" r="9.5" fill="#34d399" opacity="0.22" />

        {/* Amber / Orange Beacon (Bottom Right) */}
        <circle cx="94%" cy="82%" r="4.2" fill="#fb923c" opacity="0.9" />
        <circle cx="94%" cy="82%" r="10.5" fill="#fb923c" opacity="0.24" />

        {/* Coral / Ruby Beacon (Bottom Left) */}
        <circle cx="15%" cy="88%" r="3.6" fill="#f43f5e" opacity="0.85" />
        <circle cx="15%" cy="88%" r="9" fill="#f43f5e" opacity="0.2" />

        {/* Sapphire Beacon (Center Top) */}
        <circle cx="48%" cy="8%" r="3.5" fill="#0ea5e9" opacity="0.85" />
        <circle cx="48%" cy="8%" r="8.5" fill="#0ea5e9" opacity="0.2" />

        {/* Teal Beacon (Center Bottom) */}
        <circle cx="52%" cy="92%" r="3.8" fill="#2dd4bf" opacity="0.85" />
        <circle cx="52%" cy="92%" r="9" fill="#2dd4bf" opacity="0.2" />
      </g>

      {/* 2. Dense White Micro-Stars */}
      <g fill="#ffffff">
        <circle cx="5%" cy="8%" r="1.1" opacity="0.7" />
        <circle cx="14%" cy="24%" r="1.3" opacity="0.8" />
        <circle cx="21%" cy="14%" r="0.9" opacity="0.55" />
        <circle cx="29%" cy="32%" r="1.2" opacity="0.75" />
        <circle cx="37%" cy="12%" r="0.8" opacity="0.45" />
        <circle cx="44%" cy="28%" r="1.4" opacity="0.85" />
        <circle cx="53%" cy="18%" r="1" opacity="0.6" />
        <circle cx="61%" cy="36%" r="0.9" opacity="0.55" />
        <circle cx="69%" cy="14%" r="1.3" opacity="0.8" />
        <circle cx="77%" cy="28%" r="0.8" opacity="0.5" />
        <circle cx="85%" cy="20%" r="1.2" opacity="0.75" />
        <circle cx="93%" cy="32%" r="1.4" opacity="0.85" />
        <circle cx="97%" cy="16%" r="0.9" opacity="0.5" />
        <circle cx="6%" cy="46%" r="1.2" opacity="0.7" />
        <circle cx="18%" cy="64%" r="1.4" opacity="0.85" />
        <circle cx="26%" cy="50%" r="0.8" opacity="0.45" />
        <circle cx="35%" cy="70%" r="1.3" opacity="0.8" />
        <circle cx="43%" cy="54%" r="0.9" opacity="0.55" />
        <circle cx="55%" cy="66%" r="1.4" opacity="0.85" />
        <circle cx="63%" cy="48%" r="1" opacity="0.6" />
        <circle cx="73%" cy="68%" r="1.3" opacity="0.8" />
        <circle cx="82%" cy="56%" r="0.8" opacity="0.5" />
        <circle cx="90%" cy="64%" r="1.2" opacity="0.75" />
        <circle cx="96%" cy="50%" r="1.4" opacity="0.85" />
        <circle cx="4%" cy="82%" r="1" opacity="0.6" />
        <circle cx="11%" cy="94%" r="1.3" opacity="0.8" />
        <circle cx="23%" cy="80%" r="0.9" opacity="0.55" />
        <circle cx="33%" cy="92%" r="1.4" opacity="0.85" />
        <circle cx="41%" cy="78%" r="0.8" opacity="0.45" />
        <circle cx="50%" cy="96%" r="1.2" opacity="0.75" />
        <circle cx="59%" cy="82%" r="1.4" opacity="0.85" />
        <circle cx="67%" cy="94%" r="0.9" opacity="0.5" />
        <circle cx="78%" cy="80%" r="1.3" opacity="0.8" />
        <circle cx="87%" cy="96%" r="1" opacity="0.65" />
        <circle cx="95%" cy="84%" r="1.4" opacity="0.85" />
      </g>

      {/* 3. Blue & Cyan Micro-Stars */}
      <g fill="#38bdf8">
        <circle cx="9%" cy="14%" r="1.2" opacity="0.75" />
        <circle cx="25%" cy="6%" r="0.9" opacity="0.6" />
        <circle cx="39%" cy="22%" r="1.4" opacity="0.85" />
        <circle cx="58%" cy="12%" r="1.1" opacity="0.7" />
        <circle cx="74%" cy="24%" r="1.3" opacity="0.8" />
        <circle cx="89%" cy="8%" r="1" opacity="0.65" />
        <circle cx="14%" cy="40%" r="1.4" opacity="0.85" />
        <circle cx="30%" cy="60%" r="1.1" opacity="0.7" />
        <circle cx="47%" cy="42%" r="1.3" opacity="0.8" />
        <circle cx="66%" cy="60%" r="0.9" opacity="0.6" />
        <circle cx="84%" cy="40%" r="1.4" opacity="0.85" />
        <circle cx="94%" cy="58%" r="1.1" opacity="0.7" />
        <circle cx="8%" cy="76%" r="1.3" opacity="0.8" />
        <circle cx="28%" cy="88%" r="0.9" opacity="0.6" />
        <circle cx="46%" cy="74%" r="1.4" opacity="0.85" />
        <circle cx="65%" cy="88%" r="1.1" opacity="0.7" />
        <circle cx="83%" cy="76%" r="1.3" opacity="0.8" />
        <circle cx="91%" cy="90%" r="1.2" opacity="0.75" />
      </g>

      {/* 4. Gold & Amber Micro-Stars */}
      <g fill="#fde047">
        <circle cx="16%" cy="10%" r="1.2" opacity="0.85" />
        <circle cx="34%" cy="22%" r="1.4" opacity="0.9" />
        <circle cx="50%" cy="4%" r="1.1" opacity="0.75" />
        <circle cx="66%" cy="24%" r="1.3" opacity="0.8" />
        <circle cx="86%" cy="4%" r="1.2" opacity="0.8" />
        <circle cx="94%" cy="22%" r="1.4" opacity="0.9" />
        <circle cx="20%" cy="48%" r="1.1" opacity="0.75" />
        <circle cx="38%" cy="36%" r="1.3" opacity="0.85" />
        <circle cx="57%" cy="50%" r="1.4" opacity="0.9" />
        <circle cx="76%" cy="36%" r="1.1" opacity="0.75" />
        <circle cx="92%" cy="46%" r="1.3" opacity="0.85" />
        <circle cx="17%" cy="70%" r="1.4" opacity="0.9" />
        <circle cx="37%" cy="84%" r="1.1" opacity="0.75" />
        <circle cx="56%" cy="68%" r="1.3" opacity="0.8" />
        <circle cx="75%" cy="86%" r="1.4" opacity="0.9" />
        <circle cx="89%" cy="70%" r="1.1" opacity="0.75" />
      </g>
    </svg>
  );
}

type FaqDriftingPlanet = {
  id: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  bodyGradient: string;
  boxShadow?: string;
  hasAtmosphere?: boolean;
};

const FAQ_DRIFTING_PLANETS: FaqDriftingPlanet[] = [
  {
    id: "faq-planet-1",
    top: "6%",
    size: 14, // Cyan Radiant Planet
    duration: "44s",
    delay: "-4s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #e0f2fe 0%, #38bdf8 45%, #0369a1 100%)",
    boxShadow: "0 0 16px #38bdf8, 0 0 28px rgba(56, 189, 248, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "faq-planet-2",
    top: "15%",
    size: 11, // Starlight White Glowing Planet
    duration: "52s",
    delay: "-26s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 40%, #cbd5e1 80%, #475569 100%)",
    boxShadow: "0 0 14px #ffffff, 0 0 24px rgba(255, 255, 255, 0.9)",
  },
  {
    id: "faq-planet-3",
    top: "25%",
    size: 15, // Golden Warm Luminous Planet
    duration: "40s",
    delay: "-14s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fde047 35%, #eab308 75%, #713f12 100%)",
    boxShadow: "0 0 18px #fde047, 0 0 32px rgba(250, 204, 21, 0.9), inset 0 0 6px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "faq-planet-4",
    top: "35%",
    size: 10, // Amber Micro Planet
    duration: "54s",
    delay: "-34s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #fef08a 0%, #f59e0b 50%, #78350f 100%)",
    boxShadow: "0 0 10px rgba(245, 158, 11, 0.5)",
  },
  {
    id: "faq-planet-5",
    top: "46%",
    size: 16, // Emerald Mint Luminous Planet
    duration: "38s",
    delay: "-20s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #f0fdf4 40%, #86efac 80%, #15803d 100%)",
    boxShadow: "0 0 18px #4ade80, 0 0 30px rgba(74, 222, 128, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "faq-planet-6",
    top: "56%",
    size: 11, // Teal Micro Planet
    duration: "48s",
    delay: "-9s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ccfbf1 0%, #2dd4bf 45%, #0f766e 100%)",
    boxShadow: "0 0 14px #2dd4bf, 0 0 24px rgba(45, 212, 191, 0.75)",
  },
  {
    id: "faq-planet-7",
    top: "67%",
    size: 14, // Coral / Orange Glowing Planet
    duration: "42s",
    delay: "-30s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffedd5 0%, #fb923c 45%, #9a3412 100%)",
    boxShadow: "0 0 16px #fb923c, 0 0 28px rgba(251, 146, 60, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "faq-planet-8",
    top: "77%",
    size: 12, // Slate Micro Planet
    duration: "50s",
    delay: "-16s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #f1f5f9 0%, #94a3b8 50%, #334155 100%)",
    boxShadow: "0 0 10px rgba(148, 163, 184, 0.4)",
  },
  {
    id: "faq-planet-9",
    top: "86%",
    size: 15, // Sapphire Deep Sky Glowing Planet
    duration: "46s",
    delay: "-40s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #bae6fd 0%, #0ea5e9 45%, #075985 100%)",
    boxShadow: "0 0 18px #0ea5e9, 0 0 30px rgba(14, 165, 233, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "faq-planet-10",
    top: "94%",
    size: 13, // Rose Ruby Glowing Planet
    duration: "40s",
    delay: "-7s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #fecdd3 0%, #f43f5e 45%, #881337 100%)",
    boxShadow: "0 0 16px #f43f5e, 0 0 26px rgba(244, 63, 94, 0.8)",
  },
];

function FaqDriftingPlanets() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
    >
      <style>{`
        @keyframes driftPlanetLeftToRightFaq {
          0% {
            transform: translateX(-140px);
          }
          100% {
            transform: translateX(calc(100vw + 120px));
          }
        }
      `}</style>
      {FAQ_DRIFTING_PLANETS.map((planet) => (
        <div
          key={planet.id}
          className="absolute left-0 pointer-events-none select-none"
          style={{
            top: planet.top,
            animation: `driftPlanetLeftToRightFaq ${planet.duration} linear infinite`,
            animationDelay: planet.delay,
            willChange: "transform",
          }}
        >
          <div
            className="rounded-full relative"
            style={{
              width: `${planet.size}px`,
              height: `${planet.size}px`,
              background: planet.bodyGradient,
              boxShadow: planet.boxShadow,
            }}
          >
            {planet.hasAtmosphere ? (
              <div
                className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(circle at 70% 70%, rgba(0,0,0,0.6) 0%, transparent 60%)",
                }}
              />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function InteractiveFaq() {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  const filteredFaqs =
    selectedCategory === "all"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-section-title"
      className="relative isolate overflow-hidden bg-[#030308] px-4 sm:px-8 lg:px-16 py-20 sm:py-28 text-white scroll-mt-16"
    >
      <FaqStarField />
      <FaqDriftingPlanets />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header Title (Tanpa badge pill) */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2
            id="faq-section-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Semua yang perlu Anda ketahui tentang metode belajar interaktif, kurikulum kejuruan, dan simulasi jaringan di Netloka.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 select-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List with Smooth CSS Grid Height Transition */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                  isOpen
                    ? "border-sky-500/40 bg-slate-900/90 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    : "border-slate-800/80 bg-slate-950/70 hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "rotate-180 bg-sky-500/20 text-sky-300 border-sky-500/40" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {/* Smooth Expand/Collapse Grid Transition */}
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
