import React from "react";
import Link from "next/link";
import { SlidingButtonLabel } from "@/components/ui/sliding-button-label";

const footerLinkClass =
  "relative inline-block text-slate-400 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-white after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)]";

type FooterDriftingPlanet = {
  id: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  bodyGradient: string;
  boxShadow?: string;
  hasAtmosphere?: boolean;
};

const FOOTER_DRIFTING_PLANETS: FooterDriftingPlanet[] = [
  {
    id: "footer-planet-1",
    top: "8%",
    size: 14, // Arctic Cyan Glowing Planet
    duration: "46s",
    delay: "-3s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #e0f2fe 0%, #38bdf8 45%, #0369a1 100%)",
    boxShadow: "0 0 16px #38bdf8, 0 0 28px rgba(56, 189, 248, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "footer-planet-2",
    top: "18%",
    size: 11, // Starlight White Glowing Planet
    duration: "52s",
    delay: "-24s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 40%, #cbd5e1 80%, #475569 100%)",
    boxShadow: "0 0 14px #ffffff, 0 0 24px rgba(255, 255, 255, 0.9)",
  },
  {
    id: "footer-planet-3",
    top: "28%",
    size: 15, // Radiant Warm Gold Glowing Planet
    duration: "42s",
    delay: "-12s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fde047 35%, #eab308 75%, #713f12 100%)",
    boxShadow: "0 0 18px #fde047, 0 0 32px rgba(250, 204, 21, 0.9), inset 0 0 6px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "footer-planet-4",
    top: "40%",
    size: 10, // Amber Micro Planet
    duration: "56s",
    delay: "-32s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #fef08a 0%, #f59e0b 50%, #78350f 100%)",
    boxShadow: "0 0 10px rgba(245, 158, 11, 0.5)",
  },
  {
    id: "footer-planet-5",
    top: "52%",
    size: 16, // Mint Emerald Glowing Planet
    duration: "40s",
    delay: "-18s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #f0fdf4 40%, #86efac 80%, #15803d 100%)",
    boxShadow: "0 0 18px #4ade80, 0 0 30px rgba(74, 222, 128, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "footer-planet-6",
    top: "64%",
    size: 11, // Teal Micro Planet
    duration: "50s",
    delay: "-8s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ccfbf1 0%, #2dd4bf 45%, #0f766e 100%)",
    boxShadow: "0 0 14px #2dd4bf, 0 0 24px rgba(45, 212, 191, 0.75)",
  },
  {
    id: "footer-planet-7",
    top: "75%",
    size: 14, // Coral / Orange Glowing Planet
    duration: "44s",
    delay: "-28s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffedd5 0%, #fb923c 45%, #9a3412 100%)",
    boxShadow: "0 0 16px #fb923c, 0 0 28px rgba(251, 146, 60, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "footer-planet-8",
    top: "84%",
    size: 12, // Slate Micro Planet
    duration: "54s",
    delay: "-15s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #f1f5f9 0%, #94a3b8 50%, #334155 100%)",
    boxShadow: "0 0 10px rgba(148, 163, 184, 0.4)",
  },
  {
    id: "footer-planet-9",
    top: "92%",
    size: 15, // Deep Sky Sapphire Glowing Planet
    duration: "48s",
    delay: "-38s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #bae6fd 0%, #0ea5e9 45%, #075985 100%)",
    boxShadow: "0 0 18px #0ea5e9, 0 0 30px rgba(14, 165, 233, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "footer-planet-10",
    top: "96%",
    size: 13, // Rose Ruby Glowing Planet
    duration: "42s",
    delay: "-6s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #fecdd3 0%, #f43f5e 45%, #881337 100%)",
    boxShadow: "0 0 16px #f43f5e, 0 0 26px rgba(244, 63, 94, 0.8)",
  },
];

function FooterStarField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90 z-0 select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="footerDotBloom" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.85" />
        </filter>
      </defs>

      {/* ------------------------------------------------------------------- */}
      {/* RASI BINTANG 1: CRUX (SALIB SELATAN) — SISI KIRI                    */}
      {/* ------------------------------------------------------------------- */}
      <g id="footer-constellation-crux">
        {/* Garis Rasi Crux (Solid Putih Tebal) */}
        <g stroke="#ffffff" strokeWidth="1.8" opacity="0.75">
          {/* Garis Vertikal Utama */}
          <line x1="8%" y1="24%" x2="10%" y2="44%" />
          {/* Garis Horizontal Palang */}
          <line x1="5%" y1="32%" x2="13%" y2="35%" />
        </g>

        {/* Titik Bintang Rasi Crux (Warna Putih Bersih dengan Kelap-Kelip Terang) */}
        {/* Acrux (Bawah - Bintang Utama Kelap-Kelip) */}
        <circle cx="10%" cy="44%" r="5" fill="#ffffff" filter="url(#footerDotBloom)">
          <animate attributeName="opacity" values="0.45;1;0.45" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;6;4" dur="2.4s" repeatCount="indefinite" />
        </circle>
        {/* Gacrux (Atas - Bintang Utama Kelap-Kelip) */}
        <circle cx="8%" cy="24%" r="4.5" fill="#ffffff" filter="url(#footerDotBloom)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="r" values="3.6;5.4;3.6" dur="2.8s" repeatCount="indefinite" />
        </circle>
        {/* Mimosa (Kiri) */}
        <circle cx="5%" cy="32%" r="3.5" fill="#ffffff" opacity="0.85" filter="url(#footerDotBloom)" />
        {/* Imai (Kanan) */}
        <circle cx="13%" cy="35%" r="3.5" fill="#ffffff" opacity="0.85" filter="url(#footerDotBloom)" />
        {/* Ginan (Bintang Pendukung) */}
        <circle cx="10.5%" cy="37%" r="2" fill="#ffffff" opacity="0.75" />
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* RASI BINTANG 2: CASSIOPEIA (POLA W) — SISI KANAN                    */}
      {/* ------------------------------------------------------------------- */}
      <g id="footer-constellation-cassiopeia">
        {/* Garis Rasi Cassiopeia (Solid Putih Tebal) */}
        <g stroke="#ffffff" strokeWidth="1.8" opacity="0.75">
          <line x1="82%" y1="36%" x2="85%" y2="24%" />
          <line x1="85%" y1="24%" x2="89%" y2="38%" />
          <line x1="89%" y1="38%" x2="93%" y2="28%" />
          <line x1="93%" y1="28%" x2="96%" y2="42%" />
        </g>

        {/* Titik Bintang Rasi Cassiopeia (Warna Putih Bersih dengan Kelap-Kelip Terang) */}
        {/* Caph */}
        <circle cx="82%" cy="36%" r="3.8" fill="#ffffff" opacity="0.85" filter="url(#footerDotBloom)" />
        {/* Schedar (Bintang Utama Kelap-Kelip) */}
        <circle cx="85%" cy="24%" r="5.2" fill="#ffffff" filter="url(#footerDotBloom)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="4.2;6.2;4.2" dur="2.2s" repeatCount="indefinite" />
        </circle>
        {/* Gamma Cassiopeiae / Navi (Bintang Utama Kelap-Kelip) */}
        <circle cx="89%" cy="38%" r="5" fill="#ffffff" filter="url(#footerDotBloom)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.7s" repeatCount="indefinite" />
          <animate attributeName="r" values="3.8;5.8;3.8" dur="2.7s" repeatCount="indefinite" />
        </circle>
        {/* Ruchbah */}
        <circle cx="93%" cy="28%" r="3.6" fill="#ffffff" opacity="0.85" filter="url(#footerDotBloom)" />
        {/* Segin */}
        <circle cx="96%" cy="42%" r="3.5" fill="#ffffff" opacity="0.8" filter="url(#footerDotBloom)" />
      </g>

      {/* 1. Stationary Bright Small Planets & Luminous Beacons */}
      <g>
        {/* Cyan Stationary Planet (Top Left) */}
        <circle cx="8%" cy="14%" r="4" fill="#38bdf8" opacity="0.95" />
        <circle cx="8%" cy="14%" r="10" fill="#38bdf8" opacity="0.25" />
        <circle cx="8%" cy="14%" r="18" fill="#38bdf8" opacity="0.08" />

        {/* Gold Stationary Planet (Top Right) */}
        <circle cx="92%" cy="16%" r="4.5" fill="#fde047" opacity="0.95" />
        <circle cx="92%" cy="16%" r="11" fill="#fde047" opacity="0.25" />
        <circle cx="92%" cy="16%" r="20" fill="#fde047" opacity="0.08" />

        {/* White Starlight Stationary Beacon (Mid Left) */}
        <circle cx="12%" cy="48%" r="3.5" fill="#ffffff" opacity="0.95" />
        <circle cx="12%" cy="48%" r="9" fill="#ffffff" opacity="0.3" />

        {/* Emerald Stationary Planet (Mid Right) */}
        <circle cx="88%" cy="52%" r="4" fill="#34d399" opacity="0.9" />
        <circle cx="88%" cy="52%" r="10" fill="#34d399" opacity="0.22" />

        {/* Coral Stationary Planet (Bottom Right) */}
        <circle cx="94%" cy="84%" r="4.2" fill="#fb923c" opacity="0.9" />
        <circle cx="94%" cy="84%" r="10.5" fill="#fb923c" opacity="0.24" />

        {/* Ruby Stationary Planet (Bottom Left) */}
        <circle cx="6%" cy="88%" r="3.6" fill="#f43f5e" opacity="0.85" />
        <circle cx="6%" cy="88%" r="9" fill="#f43f5e" opacity="0.2" />

        {/* Sapphire Stationary Beacon (Center Top) */}
        <circle cx="50%" cy="10%" r="3.5" fill="#0ea5e9" opacity="0.85" />
        <circle cx="50%" cy="10%" r="8.5" fill="#0ea5e9" opacity="0.2" />
      </g>

      {/* 2. Dense Stationary White Micro-Stars */}
      <g fill="#ffffff">
        <circle cx="4%" cy="6%" r="1.1" opacity="0.7" />
        <circle cx="16%" cy="22%" r="1.3" opacity="0.8" />
        <circle cx="24%" cy="12%" r="0.9" opacity="0.55" />
        <circle cx="32%" cy="28%" r="1.2" opacity="0.75" />
        <circle cx="42%" cy="16%" r="0.8" opacity="0.45" />
        <circle cx="58%" cy="24%" r="1.4" opacity="0.85" />
        <circle cx="68%" cy="14%" r="1" opacity="0.6" />
        <circle cx="76%" cy="30%" r="0.9" opacity="0.55" />
        <circle cx="84%" cy="10%" r="1.3" opacity="0.8" />
        <circle cx="96%" cy="26%" r="0.8" opacity="0.5" />
        <circle cx="5%" cy="44%" r="1.2" opacity="0.7" />
        <circle cx="20%" cy="62%" r="1.4" opacity="0.85" />
        <circle cx="34%" cy="48%" r="0.8" opacity="0.45" />
        <circle cx="48%" cy="66%" r="1.3" opacity="0.8" />
        <circle cx="62%" cy="50%" r="0.9" opacity="0.55" />
        <circle cx="74%" cy="64%" r="1.4" opacity="0.85" />
        <circle cx="82%" cy="46%" r="1" opacity="0.6" />
        <circle cx="95%" cy="62%" r="1.3" opacity="0.8" />
        <circle cx="10%" cy="80%" r="1" opacity="0.6" />
        <circle cx="22%" cy="92%" r="1.3" opacity="0.8" />
        <circle cx="38%" cy="78%" r="0.9" opacity="0.55" />
        <circle cx="52%" cy="90%" r="1.4" opacity="0.85" />
        <circle cx="66%" cy="76%" r="0.8" opacity="0.45" />
        <circle cx="78%" cy="94%" r="1.2" opacity="0.75" />
        <circle cx="90%" cy="80%" r="1.4" opacity="0.85" />
      </g>

      {/* 3. Blue & Cyan Micro-Stars */}
      <g fill="#38bdf8">
        <circle cx="11%" cy="10%" r="1.2" opacity="0.75" />
        <circle cx="28%" cy="4%" r="0.9" opacity="0.6" />
        <circle cx="45%" cy="18%" r="1.4" opacity="0.85" />
        <circle cx="64%" cy="8%" r="1.1" opacity="0.7" />
        <circle cx="80%" cy="20%" r="1.3" opacity="0.8" />
        <circle cx="15%" cy="36%" r="1.4" opacity="0.85" />
        <circle cx="36%" cy="56%" r="1.1" opacity="0.7" />
        <circle cx="54%" cy="38%" r="1.3" opacity="0.8" />
        <circle cx="72%" cy="56%" r="0.9" opacity="0.6" />
        <circle cx="91%" cy="36%" r="1.4" opacity="0.85" />
        <circle cx="14%" cy="72%" r="1.3" opacity="0.8" />
        <circle cx="30%" cy="84%" r="0.9" opacity="0.6" />
        <circle cx="49%" cy="70%" r="1.4" opacity="0.85" />
        <circle cx="70%" cy="84%" r="1.1" opacity="0.7" />
        <circle cx="86%" cy="72%" r="1.3" opacity="0.8" />
      </g>

      {/* 4. Gold & Amber Micro-Stars */}
      <g fill="#fde047">
        <circle cx="18%" cy="8%" r="1.2" opacity="0.85" />
        <circle cx="38%" cy="20%" r="1.4" opacity="0.9" />
        <circle cx="56%" cy="2%" r="1.1" opacity="0.75" />
        <circle cx="72%" cy="22%" r="1.3" opacity="0.8" />
        <circle cx="90%" cy="2%" r="1.2" opacity="0.8" />
        <circle cx="25%" cy="44%" r="1.1" opacity="0.75" />
        <circle cx="44%" cy="32%" r="1.3" opacity="0.85" />
        <circle cx="60%" cy="46%" r="1.4" opacity="0.9" />
        <circle cx="85%" cy="32%" r="1.1" opacity="0.75" />
        <circle cx="18%" cy="66%" r="1.4" opacity="0.9" />
        <circle cx="42%" cy="80%" r="1.1" opacity="0.75" />
        <circle cx="61%" cy="64%" r="1.3" opacity="0.8" />
        <circle cx="82%" cy="82%" r="1.4" opacity="0.9" />
      </g>
    </svg>
  );
}

function FooterDriftingPlanets() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
    >
      <style>{`
        @keyframes driftPlanetRightToLeftFooter {
          0% {
            transform: translateX(calc(100vw + 120px));
          }
          100% {
            transform: translateX(-140px);
          }
        }
      `}</style>
      {FOOTER_DRIFTING_PLANETS.map((planet) => (
        <div
          key={planet.id}
          className="absolute left-0 pointer-events-none select-none"
          style={{
            top: planet.top,
            animation: `driftPlanetRightToLeftFooter ${planet.duration} linear infinite`,
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

export function MarketingFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#030308] text-white border-t border-slate-900">
      <FooterStarField />
      <FooterDriftingPlanets />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 lg:px-16 pt-16 sm:pt-20 pb-12">
        {/* ========================================================================= */}
        {/* 1. FINAL CTA SECTION (Plain Text, No Card)                                */}
        {/* ========================================================================= */}
        <div className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight mb-4">
            Siap Melangkah dari Teori ke Praktik Nyata?
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Bergabung bersama ribuan pelajar, mahasiswa, dan calon praktisi IT untuk menguasai infrastruktur digital lewat simulasi interaktif langsung di browser.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            {/* Primary Action Button */}
            <Link
              href="/?auth=sign-up"
              style={{ color: "#000000" }}
              className="group inline-flex min-h-11 items-center justify-center rounded-full bg-white hover:bg-slate-100 px-7 text-sm font-bold text-black !text-black dark:text-black dark:!text-black transition-colors shadow-lg shadow-white/10 overflow-hidden cursor-pointer"
            >
              <SlidingButtonLabel
                text="Mulai Belajar Gratis"
                className="text-black !text-black dark:text-black dark:!text-black font-bold"
                containerClassName="h-5"
              />
            </Link>

            {/* Secondary Action Button */}
            <a
              href="#simulator-showcase"
              className="group inline-flex min-h-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-6 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors shadow-md overflow-hidden cursor-pointer"
            >
              <SlidingButtonLabel
                text="Eksplorasi Simulator"
                className="text-slate-200 font-semibold"
                containerClassName="h-5"
              />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FOOTER NAVIGATION GRID                                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900/90 text-xs text-slate-400">
          {/* Brand & Purpose Column (2 spans) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                NETLOKA<span className="text-sky-400">.</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Platform pembelajaran interaktif dan simulasi IT infrastructure modern untuk pelajar, pemula, dan calon praktisi teknologi di Indonesia.
            </p>
          </div>

          {/* Column 1: Ekosistem */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Ekosistem
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/learn" className={footerLinkClass}>
                  Modul Belajar
                </Link>
              </li>
              <li>
                <Link href="/labs" className={footerLinkClass}>
                  Laboratorium Interaktif
                </Link>
              </li>
              <li>
                <Link href="/challenges" className={footerLinkClass}>
                  Tantangan Kasus IT
                </Link>
              </li>
              <li>
                <Link href="/consultant" className={footerLinkClass}>
                  Proyek Konsultan IT
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Alat Simulator */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Alat Simulator
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#simulator-showcase" className={footerLinkClass}>
                  Terminal Diagnostik CLI
                </a>
              </li>
              <li>
                <a href="#simulator-showcase" className={footerLinkClass}>
                  Kalkulator Subnet IPv4
                </a>
              </li>
              <li>
                <a href="#simulator-showcase" className={footerLinkClass}>
                  Visualizer Alur ICMP
                </a>
              </li>
              <li>
                <a href="#simulator-showcase" className={footerLinkClass}>
                  Kalkulator Linux chmod
                </a>
              </li>
              <li>
                <a href="#simulator-showcase" className={footerLinkClass}>
                  Segmentasi VLAN & Trunking
                </a>
              </li>
              <li>
                <a href="#simulator-showcase" className={footerLinkClass}>
                  Power Budget Fiber Optic
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Jalur Belajar */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Jalur Belajar
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/learn" className={footerLinkClass}>
                  Network Foundations
                </Link>
              </li>
              <li>
                <Link href="/learn" className={footerLinkClass}>
                  IPv4 & Subnetting
                </Link>
              </li>
              <li>
                <Link href="/learn" className={footerLinkClass}>
                  Switching & LAN
                </Link>
              </li>
              <li>
                <Link href="/learn" className={footerLinkClass}>
                  Routing & Network Services
                </Link>
              </li>
              <li>
                <Link href="/learn" className={footerLinkClass}>
                  Wireless & Troubleshooting
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM COPYRIGHT                                                       */}
        {/* ========================================================================= */}
        <div className="pt-8 text-center">
          <nav aria-label="Legal documents" className="mb-4 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
            <Link href="/terms" className={footerLinkClass}>Terms</Link>
            <Link href="/privacy-policy" className={footerLinkClass}>Privacy Policy</Link>
          </nav>
          <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
            © 2026 Netloka. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>
    </footer>
  );
}
