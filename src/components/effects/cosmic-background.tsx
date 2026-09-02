"use client";

import React from "react";

const HERO_DRIFTING_PLANETS = [
  {
    id: "hero-drift-1",
    top: "14%",
    size: 40, // Large Cyan Ice Giant
    duration: "42s",
    delay: "-12s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #67e8f9 0%, #0284c7 45%, #082f49 100%)",
    shadowColor: "rgba(56, 189, 248, 0.65)",
  },
  {
    id: "hero-drift-2",
    top: "48%",
    size: 44, // Extra Large Violet Giant
    duration: "54s",
    delay: "-30s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #c084fc 0%, #7e22ce 50%, #2e1065 100%)",
    shadowColor: "rgba(192, 132, 252, 0.65)",
  },
  {
    id: "hero-drift-3",
    top: "88%",
    size: 38, // Large Amber World in bottom shadow
    duration: "46s",
    delay: "-6s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #fed7aa 0%, #ea580c 55%, #431407 100%)",
    shadowColor: "rgba(251, 146, 60, 0.55)",
  },
];

function MilkyWayGalaxyBand() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
      style={{
        maskImage: "linear-gradient(to bottom, black 0%, black calc(100% - 50px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black calc(100% - 50px), transparent 100%)",
      }}
    >
      {/* Diagonal Galactic Band Container: Top-Left to Bottom-Right (rotate-[34deg]) */}
      <div className="absolute -top-[35%] -left-[25%] w-[170%] h-[170%] rotate-[34deg] origin-center">
        {/* Layer 1: Broad Diffuse Multi-Color Cosmic Atmosphere (Amber, Teal, Cyan, Coral Halo) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[620px] opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.18) 0%, rgba(45, 212, 191, 0.14) 28%, rgba(56, 189, 248, 0.12) 52%, rgba(251, 146, 60, 0.08) 70%, transparent 85%)",
            filter: "blur(70px)",
          }}
        />

        {/* Layer 2: Multi-Color Continuous Luminous Starlight River */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[260px] opacity-80"
          style={{
            background:
              "linear-gradient(to right, rgba(56, 189, 248, 0.08) 0%, rgba(45, 212, 191, 0.18) 20%, rgba(254, 240, 138, 0.38) 45%, rgba(255, 255, 255, 0.5) 55%, rgba(245, 158, 11, 0.28) 75%, rgba(251, 146, 60, 0.12) 100%)",
            filter: "blur(32px)",
          }}
        />

        {/* Layer 3: Vibrant Core Color Spine (Teal, Gold, White, Amber, Cyan Blend) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[140px] opacity-75"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(45, 212, 191, 0.22) 15%, rgba(254, 240, 138, 0.45) 38%, rgba(255, 255, 255, 0.7) 50%, rgba(245, 158, 11, 0.4) 65%, rgba(56, 189, 248, 0.2) 85%, transparent 100%)",
            filter: "blur(18px)",
          }}
        />

        {/* 🌟 Luminous Galactic Connection Bridge at Bottom-Right Seam */}
        <div
          className="absolute bottom-0 right-0 w-[540px] h-[380px] opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 75% 65%, rgba(254, 240, 138, 0.45) 0%, rgba(245, 158, 11, 0.3) 25%, rgba(45, 212, 191, 0.2) 50%, transparent 75%)",
            filter: "blur(44px)",
          }}
        />

        {/* Layer 4: Dense Multi-Colored Glittering Stars & Stardust SVG (NO PURPLE) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-95"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="mwStarGlowWhite" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffffff" floodOpacity="0.85" />
            </filter>
            <filter id="mwStarGlowGold" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fde047" floodOpacity="0.85" />
            </filter>
            <filter id="mwStarGlowCyan" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.85" />
            </filter>
            <filter id="mwStarGlowTeal" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2dd4bf" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* ⭐ Major Pulsating Multi-Color Stars */}
          <circle cx="50%" cy="49%" r="4" fill="#ffffff" filter="url(#mwStarGlowWhite)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="r" values="3.5;4.5;3.5" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="42%" cy="51%" r="3.5" fill="#fde047" filter="url(#mwStarGlowGold)">
            <animate attributeName="opacity" values="0.5;0.95;0.5" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="58%" cy="48%" r="3.5" fill="#38bdf8" filter="url(#mwStarGlowCyan)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="34%" cy="47%" r="3.2" fill="#2dd4bf" filter="url(#mwStarGlowTeal)">
            <animate attributeName="opacity" values="0.5;0.95;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="66%" cy="52%" r="3.2" fill="#ffffff" filter="url(#mwStarGlowWhite)" />
          <circle cx="25%" cy="50%" r="2.8" fill="#fde047" />
          <circle cx="75%" cy="49%" r="2.8" fill="#38bdf8" />
          <circle cx="18%" cy="48%" r="2.6" fill="#2dd4bf" />
          <circle cx="82%" cy="51%" r="2.6" fill="#fef08a" />

          {/* ✨ Warm Gold & Amber Stardust Cluster */}
          <g fill="#fde047">
            <circle cx="10%" cy="48%" r="1.4" opacity="0.85" />
            <circle cx="14%" cy="52%" r="1.6" opacity="0.85" />
            <circle cx="19%" cy="47%" r="1.8" opacity="0.9" />
            <circle cx="23%" cy="51%" r="1.3" opacity="0.8" />
            <circle cx="28%" cy="48%" r="1.9" opacity="0.9" />
            <circle cx="33%" cy="53%" r="1.5" opacity="0.85" />
            <circle cx="39%" cy="48%" r="2" opacity="0.95" />
            <circle cx="44%" cy="52%" r="1.6" opacity="0.85" />
            <circle cx="49%" cy="47%" r="1.9" opacity="0.95" />
            <circle cx="54%" cy="52%" r="1.5" opacity="0.85" />
            <circle cx="60%" cy="47%" r="1.8" opacity="0.9" />
            <circle cx="65%" cy="53%" r="1.6" opacity="0.85" />
            <circle cx="71%" cy="48%" r="1.9" opacity="0.9" />
            <circle cx="77%" cy="52%" r="1.5" opacity="0.85" />
            <circle cx="83%" cy="47%" r="1.7" opacity="0.85" />
            <circle cx="89%" cy="52%" r="1.4" opacity="0.8" />
          </g>

          {/* ✨ Radiant Cyan & Ice Blue Stardust Cluster */}
          <g fill="#38bdf8">
            <circle cx="12%" cy="53%" r="1.5" opacity="0.85" />
            <circle cx="17%" cy="47%" r="1.6" opacity="0.85" />
            <circle cx="22%" cy="53%" r="1.4" opacity="0.8" />
            <circle cx="27%" cy="46%" r="1.7" opacity="0.9" />
            <circle cx="32%" cy="52%" r="1.5" opacity="0.85" />
            <circle cx="37%" cy="47%" r="1.8" opacity="0.9" />
            <circle cx="43%" cy="53%" r="1.5" opacity="0.85" />
            <circle cx="48%" cy="48%" r="1.8" opacity="0.9" />
            <circle cx="53%" cy="53%" r="1.6" opacity="0.85" />
            <circle cx="59%" cy="48%" r="1.7" opacity="0.85" />
            <circle cx="64%" cy="52%" r="1.5" opacity="0.85" />
            <circle cx="70%" cy="47%" r="1.8" opacity="0.9" />
            <circle cx="76%" cy="53%" r="1.4" opacity="0.8" />
            <circle cx="81%" cy="48%" r="1.6" opacity="0.85" />
            <circle cx="87%" cy="53%" r="1.3" opacity="0.75" />
            <circle cx="92%" cy="48%" r="1.5" opacity="0.85" />
          </g>

          {/* ✨ Aurora Teal & Emerald Stardust Cluster */}
          <g fill="#2dd4bf">
            <circle cx="9%" cy="50%" r="1.3" opacity="0.8" />
            <circle cx="15%" cy="46%" r="1.5" opacity="0.85" />
            <circle cx="20%" cy="52%" r="1.4" opacity="0.8" />
            <circle cx="26%" cy="47%" r="1.8" opacity="0.9" />
            <circle cx="31%" cy="53%" r="1.5" opacity="0.85" />
            <circle cx="36%" cy="48%" r="1.7" opacity="0.9" />
            <circle cx="41%" cy="52%" r="1.4" opacity="0.8" />
            <circle cx="46%" cy="46%" r="1.8" opacity="0.9" />
            <circle cx="52%" cy="52%" r="1.5" opacity="0.85" />
            <circle cx="57%" cy="47%" r="1.7" opacity="0.85" />
            <circle cx="63%" cy="53%" r="1.4" opacity="0.8" />
            <circle cx="68%" cy="48%" r="1.8" opacity="0.9" />
            <circle cx="74%" cy="52%" r="1.5" opacity="0.85" />
            <circle cx="79%" cy="47%" r="1.7" opacity="0.85" />
            <circle cx="85%" cy="52%" r="1.4" opacity="0.8" />
            <circle cx="90%" cy="47%" r="1.6" opacity="0.85" />
          </g>

          {/* ✨ Pure White Sparkling Micro-Stars */}
          <g fill="#ffffff">
            <circle cx="11%" cy="49%" r="1.2" opacity="0.85" />
            <circle cx="16%" cy="51%" r="1.4" opacity="0.9" />
            <circle cx="21%" cy="48%" r="1.5" opacity="0.9" />
            <circle cx="29%" cy="51%" r="1.3" opacity="0.8" />
            <circle cx="35%" cy="49%" r="1.6" opacity="0.9" />
            <circle cx="40%" cy="51%" r="1.5" opacity="0.9" />
            <circle cx="45%" cy="48%" r="1.7" opacity="0.95" />
            <circle cx="51%" cy="51%" r="1.5" opacity="0.9" />
            <circle cx="56%" cy="49%" r="1.6" opacity="0.9" />
            <circle cx="62%" cy="51%" r="1.4" opacity="0.85" />
            <circle cx="67%" cy="49%" r="1.5" opacity="0.9" />
            <circle cx="73%" cy="51%" r="1.4" opacity="0.85" />
            <circle cx="78%" cy="49%" r="1.6" opacity="0.9" />
            <circle cx="84%" cy="50%" r="1.3" opacity="0.8" />
            <circle cx="88%" cy="49%" r="1.5" opacity="0.85" />
          </g>

          {/* ✨ Solar Coral & Sunset Amber Accent Points */}
          <g fill="#fb923c">
            <circle cx="18%" cy="52%" r="1.3" opacity="0.8" />
            <circle cx="30%" cy="47%" r="1.5" opacity="0.85" />
            <circle cx="42%" cy="53%" r="1.4" opacity="0.8" />
            <circle cx="55%" cy="47%" r="1.6" opacity="0.85" />
            <circle cx="66%" cy="52%" r="1.4" opacity="0.8" />
            <circle cx="80%" cy="48%" r="1.5" opacity="0.85" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function CosmicBackground({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none hidden dark:block bg-[#030308] ${className}`}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 🌌 DIAGONAL MILKY WAY GALAXY BAND (ATAS KIRI KE BAWAH KANAN)               */}
      {/* ========================================================================= */}
      <MilkyWayGalaxyBand />

      {/* ========================================================================= */}
      {/* CONTINUOUS DRIFTING LARGE PLANETS (RIGHT TO LEFT ACROSS HERO & SHADOWS)   */}
      {/* ========================================================================= */}
      <style>{`
        @keyframes driftPlanetRightToLeftHero {
          0% {
            transform: translate3d(105vw, 0, 0);
            opacity: 0;
          }
          2% {
            opacity: 0.9;
          }
          98% {
            opacity: 0.9;
          }
          100% {
            transform: translate3d(-15vw, 0, 0);
            opacity: 0;
          }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden z-10">
        {HERO_DRIFTING_PLANETS.map((planet) => (
          <div
            key={planet.id}
            className="absolute left-0"
            style={{
              top: planet.top,
              animation: `driftPlanetRightToLeftHero ${planet.duration} linear infinite`,
              animationDelay: planet.delay,
              willChange: "transform",
            }}
          >
            <div
              className="relative rounded-full"
              style={{
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                background: planet.bodyGradient,
                boxShadow: `0 0 ${planet.size * 0.75}px ${planet.shadowColor}`,
              }}
            />
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. DEEP SPACE SUBTLE AMBIENT NEBULA (VERY SUBTLE, CLEAN DEEP BLACK SPACE) */}
      {/* ========================================================================= */}
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-purple-900/15 via-indigo-950/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-950/15 via-slate-950/10 to-transparent blur-3xl" />

      {/* ========================================================================= */}
      {/* 2. TITIK-TITIK BINTANG BERTERBANGAN DARI KIRI KE KANAN (STARDUST DRIFT)   */}
      {/* ========================================================================= */}
      {/* Layer 1: Left-to-Right Floating Stardust (Fast Drift ~20s) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none animate-stardust-drift-1">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5%" cy="22%" r="2" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
          <circle cx="15%" cy="45%" r="1.5" fill="#a78bfa" filter="drop-shadow(0 0 3px #a78bfa)" />
          <circle cx="28%" cy="15%" r="2.5" fill="#67e8f9" filter="drop-shadow(0 0 5px #67e8f9)" />
          <circle cx="42%" cy="62%" r="1.8" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
          <circle cx="58%" cy="30%" r="2" fill="#fde047" filter="drop-shadow(0 0 4px #fde047)" />
          <circle cx="72%" cy="75%" r="1.5" fill="#c084fc" filter="drop-shadow(0 0 3px #c084fc)" />
          <circle cx="88%" cy="20%" r="2.2" fill="#ffffff" filter="drop-shadow(0 0 5px #ffffff)" />
        </svg>
      </div>

      {/* Layer 2: Left-to-Right Floating Stardust (Medium Drift ~28s) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none animate-stardust-drift-2">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="68%" r="1.8" fill="#67e8f9" filter="drop-shadow(0 0 4px #67e8f9)" />
          <circle cx="22%" cy="82%" r="2.2" fill="#ffffff" filter="drop-shadow(0 0 5px #ffffff)" />
          <circle cx="35%" cy="38%" r="1.5" fill="#fde047" filter="drop-shadow(0 0 3px #fde047)" />
          <circle cx="50%" cy="85%" r="2" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
          <circle cx="65%" cy="18%" r="1.8" fill="#a78bfa" filter="drop-shadow(0 0 4px #a78bfa)" />
          <circle cx="80%" cy="52%" r="2.5" fill="#67e8f9" filter="drop-shadow(0 0 5px #67e8f9)" />
          <circle cx="92%" cy="88%" r="1.5" fill="#ffffff" filter="drop-shadow(0 0 3px #ffffff)" />
        </svg>
      </div>

      {/* Layer 3: Left-to-Right Floating Micro-Particles (Slow Drift ~36s) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none animate-stardust-drift-3">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8%" cy="12%" r="1.5" fill="#ffffff" />
          <circle cx="20%" cy="55%" r="2" fill="#c084fc" filter="drop-shadow(0 0 3px #c084fc)" />
          <circle cx="38%" cy="78%" r="1.5" fill="#ffffff" />
          <circle cx="54%" cy="25%" r="2.2" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
          <circle cx="70%" cy="60%" r="1.8" fill="#fde047" filter="drop-shadow(0 0 4px #fde047)" />
          <circle cx="85%" cy="35%" r="2" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 3. STATIC & TWINKLING STARFIELD + 2 RASI BINTANG (TITIK 50% & 70% CAHAYA)  */}
      {/* ========================================================================= */}
      <svg className="absolute inset-0 w-full h-full opacity-95" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Normal Dots Bloom (Cahaya Standar ~50%) */}
          <filter id="normalDotBloom" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="0.5" />
          </filter>
          {/* Bright Dots Bloom (Cahaya Lebih Terang ~70%) */}
          <filter id="brightDotBloom" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ffffff" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* ----------------------------------------------------------------------- */}
        {/* RASI BINTANG 1: LEO (SANG SINGA) — GARIS PUTIH & TITIK NATURAL           */}
        {/* ----------------------------------------------------------------------- */}
        <g id="constellation-leo">
          {/* Garis Rasi Leo (Solid Putih Bersih) */}
          <g stroke="#ffffff" strokeWidth="1.6" opacity="0.65">
            {/* Badan Segitiga */}
            <line x1="7%" y1="36%" x2="13%" y2="28%" />
            <line x1="7%" y1="36%" x2="14%" y2="38%" />
            <line x1="13%" y1="28%" x2="22%" y2="27%" />
            <line x1="14%" y1="38%" x2="23%" y2="38%" />
            <line x1="22%" y1="27%" x2="23%" y2="38%" />
            {/* Kepala Sabit */}
            <line x1="22%" y1="27%" x2="19%" y2="20%" />
            <line x1="19%" y1="20%" x2="23%" y2="14%" />
            <line x1="23%" y1="14%" x2="27%" y2="17%" />
          </g>

          {/* Titik Cahaya Biasa (Diam / Statis) */}
          <circle cx="13%" cy="28%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="14%" cy="38%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="22%" cy="27%" r="3.5" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="19%" cy="20%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="23%" cy="14%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="27%" cy="17%" r="3.5" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />

          {/* ⭐ Titik Cahaya Besar Berkelap-Kelip (Twinkling Major Stars: Denebola & Regulus) */}
          <circle cx="7%" cy="36%" r="5" fill="#ffffff" filter="url(#brightDotBloom)">
            <animate attributeName="opacity" values="0.45;1;0.45" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="r" values="4;5.8;4" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="23%" cy="38%" r="6" fill="#ffffff" filter="url(#brightDotBloom)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="4.8;6.8;4.8" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ----------------------------------------------------------------------- */}
        {/* RASI BINTANG 2: SCORPIO (KALAJENGKING) — POSISI LEBIH NAIK KE ATAS       */}
        {/* ----------------------------------------------------------------------- */}
        <g id="constellation-scorpio">
          {/* Garis Rasi Scorpio (Solid Putih Bersih) */}
          <g stroke="#ffffff" strokeWidth="1.6" opacity="0.65">
            {/* Capit Kepala */}
            <line x1="74%" y1="46%" x2="72%" y2="51%" />
            <line x1="72%" y1="51%" x2="70%" y2="56%" />
            {/* Dada ke Jantung Antares */}
            <line x1="72%" y1="51%" x2="78%" y2="54%" />
            {/* Tulang Belakang */}
            <line x1="78%" y1="54%" x2="83%" y2="58%" />
            <line x1="83%" y1="58%" x2="86%" y2="64%" />
            {/* Lengkungan Ekor */}
            <line x1="86%" y1="64%" x2="84%" y2="71%" />
            <line x1="84%" y1="71%" x2="89%" y2="73%" />
            <line x1="89%" y1="73%" x2="93%" y2="68%" />
            <line x1="93%" y1="68%" x2="94%" y2="61%" />
          </g>

          {/* Titik Cahaya Biasa (Diam / Statis) */}
          <circle cx="74%" cy="46%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="72%" cy="51%" r="3.5" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="70%" cy="56%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="83%" cy="58%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="86%" cy="64%" r="3.5" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="84%" cy="71%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="89%" cy="73%" r="3" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />
          <circle cx="93%" cy="68%" r="3.5" fill="#ffffff" opacity="0.5" filter="url(#normalDotBloom)" />

          {/* ⭐ Titik Cahaya Besar Berkelap-Kelip (Twinkling Major Stars: Antares & Shaula) */}
          <circle cx="78%" cy="54%" r="6.5" fill="#ffffff" filter="url(#brightDotBloom)">
            <animate attributeName="opacity" values="0.45;1;0.45" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="5;7.2;5" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="94%" cy="61%" r="6" fill="#ffffff" filter="url(#brightDotBloom)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.1s" repeatCount="indefinite" />
            <animate attributeName="r" values="4.5;6.5;4.5" dur="2.1s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ===================================================================== */}
        {/* DENSE STATIONARY MICRO-STARFIELD (PUTIH, BIRU, KUNING SAJA)           */}
        {/* ===================================================================== */}
        {/* 1. White Micro-Stars (Putih Murni ~120+ Titik Diam) */}
        <g fill="#ffffff">
          {/* Top Canvas Stars */}
          <circle cx="2%" cy="5%" r="0.9" opacity="0.4" />
          <circle cx="6%" cy="12%" r="1.2" opacity="0.7" />
          <circle cx="10%" cy="3%" r="0.8" opacity="0.5" />
          <circle cx="15%" cy="9%" r="1.4" opacity="0.8" />
          <circle cx="18%" cy="4%" r="0.9" opacity="0.4" />
          <circle cx="24%" cy="8%" r="1.1" opacity="0.6" />
          <circle cx="29%" cy="2%" r="0.8" opacity="0.5" />
          <circle cx="34%" cy="11%" r="1.3" opacity="0.75" />
          <circle cx="39%" cy="4%" r="0.9" opacity="0.4" />
          <circle cx="44%" cy="8%" r="1.5" opacity="0.85" />
          <circle cx="50%" cy="3%" r="0.8" opacity="0.5" />
          <circle cx="55%" cy="10%" r="1.2" opacity="0.7" />
          <circle cx="61%" cy="5%" r="0.9" opacity="0.45" />
          <circle cx="66%" cy="12%" r="1.4" opacity="0.8" />
          <circle cx="71%" cy="3%" r="0.8" opacity="0.5" />
          <circle cx="77%" cy="7%" r="1.1" opacity="0.6" />
          <circle cx="82%" cy="2%" r="0.9" opacity="0.4" />
          <circle cx="87%" cy="9%" r="1.3" opacity="0.75" />
          <circle cx="91%" cy="4%" r="0.8" opacity="0.5" />
          <circle cx="96%" cy="8%" r="1.2" opacity="0.7" />

          {/* Upper-Mid Canvas Stars */}
          <circle cx="3%" cy="24%" r="1.1" opacity="0.6" />
          <circle cx="8%" cy="19%" r="0.8" opacity="0.4" />
          <circle cx="12%" cy="26%" r="1.3" opacity="0.75" />
          <circle cx="17%" cy="22%" r="0.9" opacity="0.5" />
          <circle cx="21%" cy="31%" r="1.5" opacity="0.8" />
          <circle cx="26%" cy="25%" r="0.8" opacity="0.4" />
          <circle cx="31%" cy="20%" r="1.2" opacity="0.65" />
          <circle cx="36%" cy="29%" r="0.9" opacity="0.5" />
          <circle cx="41%" cy="22%" r="1.4" opacity="0.8" />
          <circle cx="46%" cy="32%" r="0.8" opacity="0.45" />
          <circle cx="52%" cy="21%" r="1.1" opacity="0.6" />
          <circle cx="57%" cy="28%" r="0.9" opacity="0.5" />
          <circle cx="62%" cy="23%" r="1.3" opacity="0.75" />
          <circle cx="67%" cy="31%" r="0.8" opacity="0.4" />
          <circle cx="73%" cy="24%" r="1.5" opacity="0.85" />
          <circle cx="78%" cy="18%" r="0.9" opacity="0.5" />
          <circle cx="83%" cy="27%" r="1.2" opacity="0.7" />
          <circle cx="88%" cy="21%" r="0.8" opacity="0.4" />
          <circle cx="93%" cy="29%" r="1.4" opacity="0.8" />
          <circle cx="98%" cy="23%" r="0.9" opacity="0.5" />

          {/* Mid Canvas Stars */}
          <circle cx="2%" cy="44%" r="0.8" opacity="0.4" />
          <circle cx="7%" cy="51%" r="1.3" opacity="0.75" />
          <circle cx="11%" cy="42%" r="0.9" opacity="0.5" />
          <circle cx="16%" cy="48%" r="1.5" opacity="0.8" />
          <circle cx="20%" cy="41%" r="0.8" opacity="0.4" />
          <circle cx="25%" cy="53%" r="1.2" opacity="0.65" />
          <circle cx="30%" cy="45%" r="0.9" opacity="0.5" />
          <circle cx="35%" cy="50%" r="1.4" opacity="0.8" />
          <circle cx="40%" cy="43%" r="0.8" opacity="0.45" />
          <circle cx="45%" cy="52%" r="1.1" opacity="0.6" />
          <circle cx="51%" cy="46%" r="0.9" opacity="0.5" />
          <circle cx="56%" cy="54%" r="1.3" opacity="0.75" />
          <circle cx="61%" cy="42%" r="0.8" opacity="0.4" />
          <circle cx="66%" cy="50%" r="1.5" opacity="0.85" />
          <circle cx="71%" cy="44%" r="0.9" opacity="0.5" />
          <circle cx="76%" cy="53%" r="1.2" opacity="0.7" />
          <circle cx="81%" cy="41%" r="0.8" opacity="0.4" />
          <circle cx="86%" cy="49%" r="1.4" opacity="0.8" />
          <circle cx="92%" cy="45%" r="0.9" opacity="0.5" />
          <circle cx="97%" cy="52%" r="1.1" opacity="0.6" />

          {/* Lower-Mid Canvas Stars */}
          <circle cx="3%" cy="66%" r="1.2" opacity="0.7" />
          <circle cx="8%" cy="73%" r="0.8" opacity="0.4" />
          <circle cx="12%" cy="63%" r="1.4" opacity="0.8" />
          <circle cx="17%" cy="71%" r="0.9" opacity="0.5" />
          <circle cx="22%" cy="65%" r="1.1" opacity="0.6" />
          <circle cx="27%" cy="74%" r="0.8" opacity="0.45" />
          <circle cx="32%" cy="62%" r="1.3" opacity="0.75" />
          <circle cx="37%" cy="70%" r="0.9" opacity="0.5" />
          <circle cx="42%" cy="64%" r="1.5" opacity="0.85" />
          <circle cx="47%" cy="73%" r="0.8" opacity="0.4" />
          <circle cx="53%" cy="66%" r="1.2" opacity="0.65" />
          <circle cx="58%" cy="72%" r="0.9" opacity="0.5" />
          <circle cx="63%" cy="61%" r="1.4" opacity="0.8" />
          <circle cx="68%" cy="75%" r="0.8" opacity="0.4" />
          <circle cx="74%" cy="67%" r="1.1" opacity="0.6" />
          <circle cx="79%" cy="74%" r="0.9" opacity="0.5" />
          <circle cx="84%" cy="63%" r="1.3" opacity="0.75" />
          <circle cx="89%" cy="71%" r="0.8" opacity="0.45" />
          <circle cx="94%" cy="65%" r="1.5" opacity="0.8" />
          <circle cx="99%" cy="73%" r="0.9" opacity="0.5" />

          {/* Bottom Canvas Stars */}
          <circle cx="2%" cy="86%" r="0.9" opacity="0.5" />
          <circle cx="6%" cy="94%" r="1.3" opacity="0.75" />
          <circle cx="11%" cy="88%" r="0.8" opacity="0.4" />
          <circle cx="16%" cy="96%" r="1.5" opacity="0.85" />
          <circle cx="21%" cy="89%" r="0.9" opacity="0.5" />
          <circle cx="26%" cy="95%" r="1.1" opacity="0.6" />
          <circle cx="31%" cy="85%" r="0.8" opacity="0.4" />
          <circle cx="36%" cy="93%" r="1.4" opacity="0.8" />
          <circle cx="41%" cy="87%" r="0.9" opacity="0.5" />
          <circle cx="46%" cy="97%" r="1.2" opacity="0.7" />
          <circle cx="51%" cy="86%" r="0.8" opacity="0.45" />
          <circle cx="56%" cy="94%" r="1.3" opacity="0.75" />
          <circle cx="61%" cy="88%" r="0.9" opacity="0.5" />
          <circle cx="66%" cy="96%" r="1.5" opacity="0.8" />
          <circle cx="71%" cy="87%" r="0.8" opacity="0.4" />
          <circle cx="76%" cy="95%" r="1.1" opacity="0.6" />
          <circle cx="81%" cy="89%" r="0.9" opacity="0.5" />
          <circle cx="86%" cy="97%" r="1.4" opacity="0.8" />
          <circle cx="91%" cy="85%" r="0.8" opacity="0.45" />
          <circle cx="96%" cy="93%" r="1.2" opacity="0.7" />
        </g>

        {/* 2. Blue / Cyan Micro-Stars (Biru Langit Antariksa ~60+ Titik Diam) */}
        <g fill="#38bdf8">
          <circle cx="4%" cy="9%" r="1.3" opacity="0.75" />
          <circle cx="14%" cy="6%" r="0.9" opacity="0.5" />
          <circle cx="23%" cy="11%" r="1.4" opacity="0.8" />
          <circle cx="32%" cy="4%" r="0.8" opacity="0.45" />
          <circle cx="42%" cy="9%" r="1.2" opacity="0.7" />
          <circle cx="53%" cy="6%" r="1.5" opacity="0.85" />
          <circle cx="64%" cy="11%" r="0.9" opacity="0.5" />
          <circle cx="74%" cy="4%" r="1.3" opacity="0.75" />
          <circle cx="85%" cy="8%" r="0.8" opacity="0.45" />
          <circle cx="95%" cy="5%" r="1.4" opacity="0.8" />

          <circle cx="6%" cy="29%" r="0.9" opacity="0.5" />
          <circle cx="16%" cy="35%" r="1.3" opacity="0.75" />
          <circle cx="28%" cy="28%" r="0.8" opacity="0.4" />
          <circle cx="38%" cy="33%" r="1.5" opacity="0.85" />
          <circle cx="49%" cy="26%" r="0.9" opacity="0.5" />
          <circle cx="59%" cy="34%" r="1.2" opacity="0.7" />
          <circle cx="70%" cy="27%" r="0.8" opacity="0.45" />
          <circle cx="81%" cy="35%" r="1.4" opacity="0.8" />
          <circle cx="91%" cy="28%" r="0.9" opacity="0.5" />

          <circle cx="5%" cy="53%" r="1.3" opacity="0.7" />
          <circle cx="15%" cy="47%" r="0.8" opacity="0.45" />
          <circle cx="27%" cy="56%" r="1.4" opacity="0.8" />
          <circle cx="37%" cy="49%" r="0.9" opacity="0.5" />
          <circle cx="48%" cy="55%" r="1.2" opacity="0.65" />
          <circle cx="59%" cy="48%" r="1.5" opacity="0.85" />
          <circle cx="69%" cy="57%" r="0.8" opacity="0.4" />
          <circle cx="80%" cy="51%" r="1.3" opacity="0.75" />
          <circle cx="90%" cy="56%" r="0.9" opacity="0.5" />

          <circle cx="7%" cy="75%" r="0.9" opacity="0.5" />
          <circle cx="18%" cy="69%" r="1.4" opacity="0.8" />
          <circle cx="29%" cy="77%" r="0.8" opacity="0.4" />
          <circle cx="39%" cy="72%" r="1.2" opacity="0.7" />
          <circle cx="50%" cy="78%" r="0.9" opacity="0.5" />
          <circle cx="61%" cy="70%" r="1.5" opacity="0.85" />
          <circle cx="72%" cy="76%" r="0.8" opacity="0.45" />
          <circle cx="83%" cy="71%" r="1.3" opacity="0.75" />
          <circle cx="93%" cy="77%" r="0.9" opacity="0.5" />

          <circle cx="4%" cy="92%" r="1.3" opacity="0.75" />
          <circle cx="15%" cy="97%" r="0.8" opacity="0.45" />
          <circle cx="25%" cy="91%" r="1.4" opacity="0.8" />
          <circle cx="37%" cy="98%" r="0.9" opacity="0.5" />
          <circle cx="48%" cy="93%" r="1.2" opacity="0.7" />
          <circle cx="59%" cy="97%" r="0.8" opacity="0.4" />
          <circle cx="69%" cy="92%" r="1.5" opacity="0.85" />
          <circle cx="80%" cy="98%" r="0.9" opacity="0.5" />
          <circle cx="90%" cy="91%" r="1.3" opacity="0.75" />
        </g>

        {/* 3. Yellow / Gold Micro-Stars (Kuning Emas Kosmik ~45+ Titik Diam) */}
        <g fill="#fde047">
          <circle cx="8%" cy="4%" r="1.2" opacity="0.7" />
          <circle cx="20%" cy="9%" r="0.9" opacity="0.5" />
          <circle cx="31%" cy="3%" r="1.4" opacity="0.8" />
          <circle cx="47%" cy="7%" r="0.8" opacity="0.45" />
          <circle cx="58%" cy="2%" r="1.3" opacity="0.75" />
          <circle cx="69%" cy="8%" r="0.9" opacity="0.5" />
          <circle cx="80%" cy="3%" r="1.5" opacity="0.85" />
          <circle cx="92%" cy="7%" r="0.8" opacity="0.4" />

          <circle cx="10%" cy="25%" r="1.3" opacity="0.75" />
          <circle cx="24%" cy="22%" r="0.8" opacity="0.45" />
          <circle cx="34%" cy="27%" r="1.4" opacity="0.8" />
          <circle cx="45%" cy="21%" r="0.9" opacity="0.5" />
          <circle cx="56%" cy="26%" r="1.2" opacity="0.65" />
          <circle cx="67%" cy="20%" r="1.5" opacity="0.85" />
          <circle cx="77%" cy="28%" r="0.8" opacity="0.4" />
          <circle cx="89%" cy="23%" r="1.3" opacity="0.75" />

          <circle cx="9%" cy="46%" r="0.8" opacity="0.45" />
          <circle cx="21%" cy="51%" r="1.4" opacity="0.8" />
          <circle cx="33%" cy="44%" r="0.9" opacity="0.5" />
          <circle cx="44%" cy="53%" r="1.2" opacity="0.7" />
          <circle cx="55%" cy="47%" r="0.8" opacity="0.4" />
          <circle cx="66%" cy="52%" r="1.5" opacity="0.85" />
          <circle cx="78%" cy="46%" r="0.9" opacity="0.5" />
          <circle cx="88%" cy="54%" r="1.3" opacity="0.75" />

          <circle cx="11%" cy="68%" r="1.3" opacity="0.7" />
          <circle cx="23%" cy="75%" r="0.9" opacity="0.5" />
          <circle cx="35%" cy="67%" r="1.5" opacity="0.85" />
          <circle cx="46%" cy="74%" r="0.8" opacity="0.4" />
          <circle cx="57%" cy="69%" r="1.2" opacity="0.65" />
          <circle cx="68%" cy="76%" r="0.9" opacity="0.5" />
          <circle cx="79%" cy="68%" r="1.4" opacity="0.8" />
          <circle cx="91%" cy="75%" r="0.8" opacity="0.45" />

          <circle cx="8%" cy="91%" r="0.9" opacity="0.5" />
          <circle cx="19%" cy="95%" r="1.4" opacity="0.8" />
          <circle cx="30%" cy="89%" r="0.8" opacity="0.4" />
          <circle cx="42%" cy="96%" r="1.3" opacity="0.75" />
          <circle cx="53%" cy="90%" r="0.9" opacity="0.5" />
          <circle cx="64%" cy="97%" r="1.5" opacity="0.85" />
          <circle cx="75%" cy="91%" r="0.8" opacity="0.4" />
          <circle cx="87%" cy="95%" r="1.2" opacity="0.7" />
          <circle cx="97%" cy="89%" r="0.9" opacity="0.5" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 4. REALISTIC GARGANTUA BLACK HOLE (PULSA PELAN, INTERVAL 5S SETELAH REDUP)*/}
      {/* ========================================================================= */}
      <style>{`
        @keyframes blackHoleAccretionHeartbeat {
          0% {
            opacity: 0.68;
            filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.35));
          }
          27% {
            opacity: 1;
            filter: drop-shadow(0 0 25px rgba(249, 115, 22, 0.95)) drop-shadow(0 0 55px rgba(234, 88, 12, 0.75));
          }
          55% {
            opacity: 0.68;
            filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.35));
          }
          100% {
            opacity: 0.68;
            filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.35));
          }
        }
      `}</style>
      <div className="absolute top-[5%] right-[1%] sm:right-[4%] lg:right-[7%] w-[290px] sm:w-[360px] lg:w-[420px] h-[190px] sm:h-[240px] lg:h-[280px] opacity-95 pointer-events-none select-none">
        <svg
          viewBox="0 0 500 320"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Deep Volumetric Glow Filter */}
            <filter id="bhBloomPrecise" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur stdDeviation="2.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Intense White Core Flare Filter */}
            <filter id="bhCoreFlarePrecise" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f97316" floodOpacity="0.9" />
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#ea580c" floodOpacity="0.6" />
            </filter>

            {/* Equatorial Main Disk Horizontal Gradient (Concentric Center at 250) */}
            <linearGradient id="eqDiskGradCenter" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c2d12" stopOpacity="0" />
              <stop offset="12%" stopColor="#c2410c" stopOpacity="0.65" />
              <stop offset="30%" stopColor="#ea580c" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="70%" stopColor="#ea580c" stopOpacity="0.95" />
              <stop offset="88%" stopColor="#c2410c" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </linearGradient>

            {/* Exoplanet Gradient */}
            <radialGradient id="millerPlanetGradCenter" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="40%" stopColor="#1e293b" />
              <stop offset="85%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
          </defs>

          {/* Group centered at (250, 160) with subtle celestial tilt (-3deg) */}
          <g transform="rotate(-3 250 160)">
            {/* Heartbeat Pulsing Accretion Halo & Disk Wrapper */}
            <g style={{ animation: "blackHoleAccretionHeartbeat 11s ease-in-out infinite", transformOrigin: "250px 160px" }}>
              {/* 1. Ambient Volumetric Glow Aura (Centered) */}
              <ellipse
                cx="250"
                cy="160"
                rx="180"
                ry="110"
                fill="#ea580c"
                opacity="0.16"
                filter="blur(28px)"
              />

              {/* 2. Gravitational Lensing Upper Halo (Concentric Arch wrapping OVER Black Hole) */}
              <g filter="url(#bhBloomPrecise)">
                {/* Outer copper diffuse rim */}
                <path
                  d="M 145 160 A 105 105 0 0 1 355 160"
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="28"
                  opacity="0.35"
                />
                {/* Mid fiery amber band */}
                <path
                  d="M 165 160 A 85 85 0 0 1 335 160"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="16"
                  opacity="0.85"
                />
                {/* Inner luminous orange band */}
                <path
                  d="M 185 160 A 65 65 0 0 1 315 160"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="9"
                  opacity="0.95"
                />
                {/* Razor-sharp white-hot inner photon curve */}
                <path
                  d="M 194 160 A 56 56 0 0 1 306 160"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  opacity="1"
                />
              </g>

              {/* 3. Gravitational Lensing Lower Halo (Concentric Arch wrapping UNDER Black Hole) */}
              <g filter="url(#bhBloomPrecise)">
                {/* Outer faint lower rim */}
                <path
                  d="M 168 160 A 82 82 0 0 0 332 160"
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="18"
                  opacity="0.3"
                />
                {/* Mid orange lower band */}
                <path
                  d="M 182 160 A 68 68 0 0 0 318 160"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="10"
                  opacity="0.8"
                />
                {/* Inner thin white photon curve */}
                <path
                  d="M 194 160 A 56 56 0 0 0 306 160"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  opacity="0.95"
                />
              </g>

              {/* 4. Rear Equatorial Accretion Disk (Background Half behind Black Hole) */}
              <g filter="url(#bhBloomPrecise)">
                <ellipse
                  cx="250"
                  cy="160"
                  rx="235"
                  ry="24"
                  fill="none"
                  stroke="url(#eqDiskGradCenter)"
                  strokeWidth="18"
                  opacity="0.5"
                />
                <ellipse
                  cx="250"
                  cy="160"
                  rx="210"
                  ry="15"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="6"
                  opacity="0.85"
                />
                <ellipse
                  cx="250"
                  cy="160"
                  rx="190"
                  ry="9"
                  fill="none"
                  stroke="#ffedd5"
                  strokeWidth="3"
                  opacity="0.95"
                />
              </g>
            </g>

            {/* 5. Central Event Horizon (Shadow of Black Hole — Perfect Pure Jet Black Circle at Center) */}
            <circle
              cx="250"
              cy="160"
              r="55"
              fill="#000000"
            />

            {/* Innermost Concentric Photon Sphere Ring */}
            <circle
              cx="250"
              cy="160"
              r="56"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              opacity="1"
              filter="drop-shadow(0 0 4px #f97316)"
            />

            {/* 6. Foreground Equatorial Accretion Disk (Front Glowing Plane Cutting Across Center) */}
            <g
              filter="url(#bhCoreFlarePrecise)"
              style={{ animation: "blackHoleAccretionHeartbeat 11s ease-in-out infinite", transformOrigin: "250px 160px" }}
            >
              {/* Wide fiery front accretion plane */}
              <path
                d="M 15 160 Q 130 157, 250 160 Q 370 163, 485 160 L 485 162.5 Q 370 165.5, 250 162.5 Q 130 165.5, 15 162.5 Z"
                fill="url(#eqDiskGradCenter)"
                opacity="0.95"
              />

              {/* Intense Orange/Amber Front Stream */}
              <path
                d="M 40 159 Q 145 157.5, 250 159 Q 355 160.5, 460 159 L 460 161.5 Q 355 163, 250 161.5 Q 145 163, 40 161.5 Z"
                fill="#f97316"
                opacity="1"
              />

              {/* Intense White Core Laser Filament */}
              <line
                x1="80"
                y1="160"
                x2="420"
                y2="160"
                stroke="#ffffff"
                strokeWidth="2.8"
                strokeLinecap="round"
                opacity="1"
              />
            </g>

            {/* Dark Interstellar Dust Lanes in Front Accretion Stream */}
            <path
              d="M 70 162.5 Q 160 164, 250 162.5 Q 340 161, 430 162.5"
              fill="none"
              stroke="#030308"
              strokeWidth="1.6"
              opacity="0.8"
            />

            {/* 7. Miller's Exoplanet in Accretion Flow (Left Side, Balanced & Presisi) */}
            <g>
              <circle
                cx="85"
                cy="172"
                r="9"
                fill="url(#millerPlanetGradCenter)"
              />
              <path
                d="M 77 170 A 9 9 0 0 1 93 170 A 9 5.5 0 0 0 77 170 Z"
                fill="#fb923c"
                opacity="0.75"
                filter="blur(0.5px)"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 5. LARGE GAS GIANT PLANET ("NODE KEPLER" - CLEAN SPHERE WITHOUT RINGS)    */}
      {/* ========================================================================= */}
      <div className="absolute bottom-[32%] left-[3%] sm:left-[6%] w-28 h-28 sm:w-36 sm:h-36 opacity-90">
        {/* Atmosphere Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-xl" />

        {/* Planet Sphere with Atmospheric Bands */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-300 via-blue-600 to-slate-950 shadow-[inset_-12px_-12px_25px_rgba(0,0,0,0.85),0_0_24px_rgba(34,211,238,0.45)] overflow-hidden z-10">
          {/* Planet Cloud Bands */}
          <div className="absolute top-[25%] left-0 right-0 h-2 bg-white/20 blur-[1px] rotate-[-12deg]" />
          <div className="absolute top-[45%] left-0 right-0 h-3 bg-cyan-200/25 blur-[1px] rotate-[-12deg]" />
          <div className="absolute top-[68%] left-0 right-0 h-2.5 bg-blue-900/50 blur-[1px] rotate-[-12deg]" />
          {/* Shadow Crescent */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Small Orbiting Moon Node */}
        <div className="absolute top-[8%] right-[-10%] w-3.5 h-3.5 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-900 shadow-[0_0_8px_rgba(199,210,254,0.9)] z-30" />
      </div>

      {/* ========================================================================= */}
      {/* 6. 3x 8-POINTED STARBURST / QUASAR FLARE STARS (PERSIS REFERENSI GAMBAR)  */}
      {/* ========================================================================= */}
      {/* Starflare 1: Top-Left (Near Leo) - Purple Glow */}
      <div className="absolute top-[11%] left-[4%] sm:left-[8%] w-18 h-18 opacity-90 animate-whitehole-glow">
        {/* Core Photon Burst */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-white shadow-[0_0_15px_#ffffff,0_0_35px_#a855f7]" />
        {/* Horizontal & Vertical Main Light Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-24 bg-gradient-to-b from-transparent via-white to-transparent" />
        {/* 45-deg Diagonal Purple Flare Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-[1.2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-[1.2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent -rotate-45" />
      </div>

      {/* Starflare 2: Top-Center-Right (Near Black Hole) - Cyan/Blue Glow */}
      <div className="absolute top-[14%] right-[28%] sm:right-[34%] w-16 h-16 opacity-85 animate-whitehole-glow" style={{ animationDelay: "2s" }}>
        {/* Core Photon Burst */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#ffffff,0_0_35px_#38bdf8]" />
        {/* Horizontal & Vertical Main Light Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-22 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-22 bg-gradient-to-b from-transparent via-white to-transparent" />
        {/* 45-deg Diagonal Cyan Flare Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-13 h-[1.2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-13 h-[1.2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent -rotate-45" />
      </div>

      {/* Starflare 3: Bottom-Right (Above Scorpio) - Golden/Amber Glow */}
      <div className="absolute bottom-[45%] right-[12%] sm:right-[16%] w-18 h-18 opacity-85 animate-whitehole-glow" style={{ animationDelay: "3.5s" }}>
        {/* Core Photon Burst */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#ffffff,0_0_35px_#f59e0b]" />
        {/* Horizontal & Vertical Main Light Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-24 bg-gradient-to-b from-transparent via-white to-transparent" />
        {/* 45-deg Diagonal Golden Flare Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-[1.2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-[1.2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent -rotate-45" />
      </div>
    </div>
  );
}
