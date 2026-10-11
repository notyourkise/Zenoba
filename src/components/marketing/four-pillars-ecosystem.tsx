"use client";

import React, { useState } from "react";

const DRIFTING_PLANETS = [
  // 1. Large Celestial Anchor Planet (Golden Terra)
  {
    id: "drift-planet-1",
    top: "14%",
    size: 38,
    duration: "46s",
    delay: "-16s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #fde047 0%, #d97706 50%, #451a03 100%)",
    boxShadow: "0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(217, 119, 6, 0.3)",
  },
  // 2. Ultra-Bright Radiant Cyan Micro Planet (Bercahaya Terang)
  {
    id: "drift-micro-bright-cyan",
    top: "22%",
    size: 14,
    duration: "32s",
    delay: "-8s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #7dd3fc 40%, #0284c7 80%, #0369a1 100%)",
    boxShadow: "0 0 10px #ffffff, 0 0 22px #38bdf8, 0 0 38px rgba(56, 189, 248, 0.9)",
  },
  // 3. Ultra-Bright Radiant Pure White Micro Planet (Putih Terang Bersinar)
  {
    id: "drift-micro-bright-white-1",
    top: "32%",
    size: 13,
    duration: "35s",
    delay: "-21s",
    bodyGradient: "radial-gradient(circle at 35% 30%, #ffffff 0%, #f8fafc 40%, #e2e8f0 75%, #94a3b8 100%)",
    boxShadow: "0 0 14px #ffffff, 0 0 26px rgba(255, 255, 255, 0.95), 0 0 44px rgba(255, 255, 255, 0.7)",
  },
  // 4. Large Celestial Anchor Planet (Emerald Sphere)
  {
    id: "drift-planet-2",
    top: "50%",
    size: 42,
    duration: "52s",
    delay: "-32s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #6ee7b7 0%, #059669 45%, #064e3b 100%)",
    boxShadow: "0 0 22px rgba(52, 211, 153, 0.55), 0 0 44px rgba(5, 150, 105, 0.3)",
  },
  // 5. Ultra-Bright Radiant Gold Star Planet (Bercahaya Terang)
  {
    id: "drift-micro-bright-gold",
    top: "42%",
    size: 12,
    duration: "28s",
    delay: "-18s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fef08a 40%, #eab308 80%, #713f12 100%)",
    boxShadow: "0 0 10px #ffffff, 0 0 24px #fde047, 0 0 40px rgba(250, 204, 21, 0.9)",
  },
  // 6. Ultra-Bright Radiant Amethyst Micro Planet (Bercahaya Terang)
  {
    id: "drift-micro-bright-purple",
    top: "64%",
    size: 15,
    duration: "38s",
    delay: "-14s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #d8b4fe 40%, #9333ea 80%, #3b0764 100%)",
    boxShadow: "0 0 10px #ffffff, 0 0 22px #c084fc, 0 0 38px rgba(168, 85, 247, 0.9)",
  },
  // 7. Ultra-Bright Radiant Amber Micro Planet (Bercahaya Terang)
  {
    id: "drift-micro-bright-amber",
    top: "74%",
    size: 11,
    duration: "30s",
    delay: "-24s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fed7aa 40%, #f97316 80%, #7c2d12 100%)",
    boxShadow: "0 0 10px #ffffff, 0 0 20px #fb923c, 0 0 36px rgba(249, 115, 22, 0.9)",
  },
  // 8. Ultra-Bright Radiant Pure White Micro Planet (Putih Terang Bersinar Bawah)
  {
    id: "drift-micro-bright-white-2",
    top: "82%",
    size: 11,
    duration: "29s",
    delay: "-9s",
    bodyGradient: "radial-gradient(circle at 35% 30%, #ffffff 0%, #f1f5f9 45%, #cbd5e1 80%, #64748b 100%)",
    boxShadow: "0 0 12px #ffffff, 0 0 24px rgba(255, 255, 255, 0.95), 0 0 40px rgba(255, 255, 255, 0.65)",
  },
  // 9. Large Celestial Anchor Planet (Deep Sapphire)
  {
    id: "drift-planet-3",
    top: "88%",
    size: 36,
    duration: "48s",
    delay: "-4s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #93c5fd 0%, #2563eb 45%, #0f172a 100%)",
    boxShadow: "0 0 20px rgba(96, 165, 250, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)",
  },
];

function FourPillarsConstellations() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-75 z-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="pillarStarGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.75" />
        </filter>
        <filter id="pillarStarGlowCyan" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38bdf8" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* ------------------------------------------------------------------- */}
      {/* RASI BINTANG 1: CASSIOPEIA (W-SHAPE) - KIRI ATAS                     */}
      {/* ------------------------------------------------------------------- */}
      <g id="constellation-cassiopeia">
        {/* Connecting Lines */}
        <g stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round">
          <line x1="5%" y1="20%" x2="9%" y2="32%" />
          <line x1="9%" y1="32%" x2="13%" y2="23%" />
          <line x1="13%" y1="23%" x2="17%" y2="36%" />
          <line x1="17%" y1="36%" x2="22%" y2="26%" />
        </g>

        {/* Node Stars */}
        <circle cx="9%" cy="32%" r="3" fill="#ffffff" opacity="0.6" filter="url(#pillarStarGlow)" />
        <circle cx="13%" cy="23%" r="3.2" fill="#ffffff" opacity="0.6" filter="url(#pillarStarGlow)" />
        <circle cx="17%" cy="36%" r="3" fill="#ffffff" opacity="0.6" filter="url(#pillarStarGlow)" />

        {/* Major Pulsating Stars (Caph & Schedar) */}
        <circle cx="5%" cy="20%" r="5" fill="#38bdf8" filter="url(#pillarStarGlowCyan)">
          <animate attributeName="opacity" values="0.45;1;0.45" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;5.8;4" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="22%" cy="26%" r="5.5" fill="#ffffff" filter="url(#pillarStarGlow)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="r" values="4.5;6.2;4.5" dur="2.3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* RASI BINTANG 2: CYGNUS (ANGSA / SALIB UTARA) - KANAN ATAS            */}
      {/* ------------------------------------------------------------------- */}
      <g id="constellation-cygnus">
        {/* Connecting Lines */}
        <g stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round">
          {/* Main Spine (Tulang Belakang Angsa) */}
          <line x1="77%" y1="14%" x2="82%" y2="25%" />
          <line x1="82%" y1="25%" x2="86%" y2="34%" />
          <line x1="86%" y1="34%" x2="91%" y2="46%" />
          {/* Wings (Bentangan Sayap Angsa) */}
          <line x1="75%" y1="30%" x2="82%" y2="25%" />
          <line x1="82%" y1="25%" x2="90%" y2="21%" />
        </g>

        {/* Node Stars */}
        <circle cx="82%" cy="25%" r="3.5" fill="#ffffff" opacity="0.6" filter="url(#pillarStarGlow)" />
        <circle cx="86%" cy="34%" r="3" fill="#ffffff" opacity="0.6" filter="url(#pillarStarGlow)" />
        <circle cx="75%" cy="30%" r="3" fill="#ffffff" opacity="0.6" filter="url(#pillarStarGlow)" />
        <circle cx="90%" cy="21%" r="3.2" fill="#ffffff" opacity="0.6" filter="url(#pillarStarGlow)" />

        {/* Major Pulsating Stars (Deneb & Albireo) */}
        <circle cx="77%" cy="14%" r="5.5" fill="#ffffff" filter="url(#pillarStarGlow)">
          <animate attributeName="opacity" values="0.45;1;0.45" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="4.5;6.5;4.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="91%" cy="46%" r="5" fill="#fde047" filter="url(#pillarStarGlow)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.1s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;5.8;4" dur="2.1s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function FourPillarsMilkyWay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 50px, black 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50px, black 100%)",
      }}
    >
      {/* 🌟 Luminous Galactic Connection Bridge (Seamlessly flooding the top-right entry from Dashboard) */}
      <div
        className="absolute top-0 right-0 w-[640px] h-[480px] opacity-65 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 25%, rgba(254, 240, 138, 0.28) 0%, rgba(245, 158, 11, 0.18) 25%, rgba(45, 212, 191, 0.12) 50%, rgba(56, 189, 248, 0.06) 70%, transparent 85%)",
          filter: "blur(48px)",
        }}
      />

      {/* Diagonal Galactic Band Container: Raised Higher Up (-top-[55%] -rotate-[34deg]) */}
      <div className="absolute -top-[55%] -left-[15%] w-[170%] h-[170%] -rotate-[34deg] origin-center">
        {/* Layer 1: Broad Diffuse Multi-Color Cosmic Atmosphere (Amber, Teal, Cyan, Coral Halo) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[640px] opacity-55"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.12) 0%, rgba(45, 212, 191, 0.10) 28%, rgba(56, 189, 248, 0.08) 52%, rgba(251, 146, 60, 0.05) 70%, transparent 85%)",
            filter: "blur(70px)",
          }}
        />

        {/* Layer 2: Multi-Color Continuous Luminous Starlight River */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[280px] opacity-60"
          style={{
            background:
              "linear-gradient(to right, rgba(251, 146, 60, 0.08) 0%, rgba(245, 158, 11, 0.18) 25%, rgba(255, 255, 255, 0.35) 45%, rgba(254, 240, 138, 0.25) 55%, rgba(45, 212, 191, 0.14) 80%, rgba(56, 189, 248, 0.06) 100%)",
            filter: "blur(32px)",
          }}
        />

        {/* Layer 3: Vibrant Core Color Spine (Teal, Gold, White, Amber, Cyan Blend) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150px] opacity-55"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(56, 189, 248, 0.12) 15%, rgba(245, 158, 11, 0.24) 35%, rgba(255, 255, 255, 0.45) 50%, rgba(254, 240, 138, 0.3) 62%, rgba(45, 212, 191, 0.15) 85%, transparent 100%)",
            filter: "blur(20px)",
          }}
        />

        {/* Layer 4: Dense Multi-Colored Glittering Stars & Stardust SVG (NO PURPLE) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-85"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="fpMwStarGlowWhite" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffffff" floodOpacity="0.85" />
            </filter>
            <filter id="fpMwStarGlowGold" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fde047" floodOpacity="0.85" />
            </filter>
            <filter id="fpMwStarGlowCyan" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.85" />
            </filter>
            <filter id="fpMwStarGlowTeal" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2dd4bf" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* ⭐ Major Pulsating Multi-Color Stars */}
          <circle cx="50%" cy="49%" r="4" fill="#ffffff" filter="url(#fpMwStarGlowWhite)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="r" values="3.5;4.5;3.5" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="42%" cy="51%" r="3.5" fill="#fde047" filter="url(#fpMwStarGlowGold)">
            <animate attributeName="opacity" values="0.5;0.95;0.5" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="58%" cy="48%" r="3.5" fill="#38bdf8" filter="url(#fpMwStarGlowCyan)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="34%" cy="47%" r="3.2" fill="#2dd4bf" filter="url(#fpMwStarGlowTeal)">
            <animate attributeName="opacity" values="0.5;0.95;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="66%" cy="52%" r="3.2" fill="#ffffff" filter="url(#fpMwStarGlowWhite)" />
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

export function FourPillarsEcosystem() {
  const [activePlanet, setActivePlanet] = useState<string | null>(null);

  return (
    <section
      id="jelajahi"
      aria-labelledby="four-pillars-title"
      className="relative isolate overflow-hidden bg-[#030308] pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 text-white scroll-mt-16"
    >
      {/* Constellations */}
      <FourPillarsConstellations />

      {/* 🌌 CONTINUOUS DIAGONAL MILKY WAY (TOP-RIGHT TO BOTTOM-LEFT, CONNECTING FROM DASHBOARD) */}
      <FourPillarsMilkyWay />

      {/* ========================================================================= */}
      {/* CONTINUOUS DRIFTING LARGE PLANETS (RIGHT TO LEFT ACROSS FULL SCREEN)       */}
      {/* ========================================================================= */}
      <style>{`
        @keyframes driftPlanetRightToLeft {
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
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden="true">
        {DRIFTING_PLANETS.map((planet) => (
          <div
            key={planet.id}
            className="absolute left-0"
            style={{
              top: planet.top,
              animation: `driftPlanetRightToLeft ${planet.duration} linear infinite`,
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
                boxShadow: planet.boxShadow,
              }}
            />
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* DENSE CELESTIAL STARFIELD & DISTANT PLANET NODES (DARK DASHBOARD MATCH)   */}
      {/* ========================================================================= */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-90 mix-blend-screen z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Distant Planet Dots with Soft Glowing Atmosphere */}
        <g>
          {/* Distant Cyan Ice Planet */}
          <circle cx="94%" cy="28%" r="4" fill="#38bdf8" opacity="0.8" />
          <circle cx="94%" cy="28%" r="8" fill="#38bdf8" opacity="0.2" />

          {/* Distant Amber Gas Giant */}
          <circle cx="6%" cy="72%" r="4.5" fill="#f59e0b" opacity="0.75" />
          <circle cx="6%" cy="72%" r="9" fill="#f59e0b" opacity="0.2" />

          {/* Distant Violet Exoplanet */}
          <circle cx="91%" cy="84%" r="3.5" fill="#c084fc" opacity="0.7" />
          <circle cx="91%" cy="84%" r="7" fill="#c084fc" opacity="0.18" />

          {/* Distant Emerald Terrestrial Planet */}
          <circle cx="12%" cy="22%" r="3.2" fill="#34d399" opacity="0.65" />
          <circle cx="12%" cy="22%" r="6.5" fill="#34d399" opacity="0.15" />
        </g>

        {/* Dense White Micro-Stars (100+ points across canvas) */}
        <g fill="#ffffff">
          <circle cx="3%" cy="8%" r="0.9" opacity="0.5" />
          <circle cx="8%" cy="16%" r="1.3" opacity="0.75" />
          <circle cx="14%" cy="6%" r="0.8" opacity="0.4" />
          <circle cx="19%" cy="12%" r="1.4" opacity="0.8" />
          <circle cx="25%" cy="5%" r="0.9" opacity="0.5" />
          <circle cx="31%" cy="15%" r="1.2" opacity="0.7" />
          <circle cx="38%" cy="9%" r="0.8" opacity="0.4" />
          <circle cx="44%" cy="14%" r="1.5" opacity="0.85" />
          <circle cx="53%" cy="6%" r="0.9" opacity="0.5" />
          <circle cx="60%" cy="11%" r="1.2" opacity="0.7" />
          <circle cx="67%" cy="4%" r="0.8" opacity="0.4" />
          <circle cx="73%" cy="15%" r="1.4" opacity="0.8" />
          <circle cx="80%" cy="8%" r="0.9" opacity="0.5" />
          <circle cx="86%" cy="13%" r="1.3" opacity="0.75" />
          <circle cx="93%" cy="5%" r="0.8" opacity="0.4" />
          <circle cx="97%" cy="12%" r="1.1" opacity="0.6" />

          <circle cx="4%" cy="32%" r="1.2" opacity="0.65" />
          <circle cx="10%" cy="42%" r="0.9" opacity="0.5" />
          <circle cx="16%" cy="35%" r="1.4" opacity="0.8" />
          <circle cx="22%" cy="48%" r="0.8" opacity="0.45" />
          <circle cx="28%" cy="30%" r="1.1" opacity="0.6" />
          <circle cx="71%" cy="38%" r="1.3" opacity="0.75" />
          <circle cx="78%" cy="46%" r="0.8" opacity="0.4" />
          <circle cx="85%" cy="33%" r="1.5" opacity="0.85" />
          <circle cx="92%" cy="41%" r="0.9" opacity="0.5" />
          <circle cx="96%" cy="48%" r="1.2" opacity="0.7" />

          <circle cx="5%" cy="62%" r="1.4" opacity="0.8" />
          <circle cx="11%" cy="55%" r="0.8" opacity="0.4" />
          <circle cx="18%" cy="68%" r="1.2" opacity="0.7" />
          <circle cx="24%" cy="60%" r="0.9" opacity="0.5" />
          <circle cx="75%" cy="64%" r="1.4" opacity="0.8" />
          <circle cx="82%" cy="58%" r="0.8" opacity="0.45" />
          <circle cx="88%" cy="67%" r="1.3" opacity="0.75" />
          <circle cx="95%" cy="59%" r="0.9" opacity="0.5" />

          <circle cx="2%" cy="88%" r="1.1" opacity="0.6" />
          <circle cx="9%" cy="94%" r="1.3" opacity="0.75" />
          <circle cx="15%" cy="82%" r="0.8" opacity="0.4" />
          <circle cx="21%" cy="90%" r="1.5" opacity="0.85" />
          <circle cx="29%" cy="85%" r="0.9" opacity="0.5" />
          <circle cx="36%" cy="93%" r="1.2" opacity="0.7" />
          <circle cx="43%" cy="86%" r="0.8" opacity="0.4" />
          <circle cx="51%" cy="95%" r="1.4" opacity="0.8" />
          <circle cx="59%" cy="88%" r="0.9" opacity="0.5" />
          <circle cx="68%" cy="92%" r="1.3" opacity="0.75" />
          <circle cx="76%" cy="84%" r="0.8" opacity="0.4" />
          <circle cx="84%" cy="91%" r="1.4" opacity="0.8" />
          <circle cx="93%" cy="87%" r="0.9" opacity="0.5" />
          <circle cx="98%" cy="94%" r="1.2" opacity="0.7" />
        </g>

        {/* Cyan / Sky Blue Micro-Stars */}
        <g fill="#38bdf8">
          <circle cx="7%" cy="24%" r="1.3" opacity="0.75" />
          <circle cx="23%" cy="18%" r="1" opacity="0.6" />
          <circle cx="35%" cy="6%" r="1.4" opacity="0.8" />
          <circle cx="56%" cy="15%" r="0.9" opacity="0.55" />
          <circle cx="77%" cy="22%" r="1.3" opacity="0.75" />
          <circle cx="89%" cy="18%" r="1.1" opacity="0.65" />
          <circle cx="8%" cy="49%" r="1.4" opacity="0.8" />
          <circle cx="27%" cy="54%" r="0.9" opacity="0.5" />
          <circle cx="73%" cy="52%" r="1.3" opacity="0.75" />
          <circle cx="91%" cy="50%" r="1.2" opacity="0.7" />
          <circle cx="13%" cy="86%" r="1.4" opacity="0.8" />
          <circle cx="33%" cy="91%" r="1.1" opacity="0.65" />
          <circle cx="63%" cy="84%" r="1.3" opacity="0.75" />
          <circle cx="87%" cy="82%" r="1" opacity="0.6" />
        </g>

        {/* Golden / Yellow Micro-Stars */}
        <g fill="#fde047">
          <circle cx="11%" cy="10%" r="1.2" opacity="0.8" />
          <circle cx="41%" cy="16%" r="1.4" opacity="0.85" />
          <circle cx="64%" cy="7%" r="1.1" opacity="0.7" />
          <circle cx="83%" cy="19%" r="1.3" opacity="0.75" />
          <circle cx="15%" cy="45%" r="1.2" opacity="0.7" />
          <circle cx="80%" cy="40%" r="1.4" opacity="0.8" />
          <circle cx="19%" cy="78%" r="1.1" opacity="0.7" />
          <circle cx="47%" cy="91%" r="1.3" opacity="0.8" />
          <circle cx="70%" cy="86%" r="1.2" opacity="0.75" />
          <circle cx="95%" cy="78%" r="1.4" opacity="0.85" />
        </g>

        {/* Purple / Violet Micro-Stars */}
        <g fill="#c084fc">
          <circle cx="17%" cy="15%" r="1.3" opacity="0.75" />
          <circle cx="49%" cy="9%" r="1.1" opacity="0.65" />
          <circle cx="70%" cy="12%" r="1.4" opacity="0.8" />
          <circle cx="90%" cy="8%" r="1.2" opacity="0.7" />
          <circle cx="21%" cy="65%" r="1.3" opacity="0.75" />
          <circle cx="77%" cy="60%" r="1.1" opacity="0.65" />
          <circle cx="26%" cy="88%" r="1.4" opacity="0.8" />
          <circle cx="55%" cy="93%" r="1.2" opacity="0.7" />
          <circle cx="81%" cy="89%" r="1.3" opacity="0.75" />
        </g>

        {/* Emerald / Mint Micro-Stars */}
        <g fill="#34d399">
          <circle cx="27%" cy="11%" r="1.2" opacity="0.7" />
          <circle cx="86%" cy="26%" r="1.3" opacity="0.75" />
          <circle cx="13%" cy="58%" r="1.1" opacity="0.65" />
          <circle cx="85%" cy="72%" r="1.4" opacity="0.8" />
          <circle cx="39%" cy="85%" r="1.2" opacity="0.7" />
          <circle cx="90%" cy="95%" r="1.1" opacity="0.65" />
        </g>
      </svg>

      {/* ========================================================================= */}

      {/* Deep Cosmic Navy Shadow Void Transition at the bottom with Colorful Micro-Stars */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-52 z-20 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#01040e] via-[#01040e] to-transparent" />
        <svg className="absolute inset-0 w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
          <g fill="#ffffff">
            <circle cx="8%" cy="70%" r="1.1" opacity="0.6" />
            <circle cx="20%" cy="35%" r="1.3" opacity="0.75" />
            <circle cx="34%" cy="80%" r="0.9" opacity="0.5" />
            <circle cx="49%" cy="40%" r="1.4" opacity="0.8" />
            <circle cx="65%" cy="75%" r="1.2" opacity="0.7" />
            <circle cx="78%" cy="30%" r="0.8" opacity="0.45" />
            <circle cx="92%" cy="65%" r="1.3" opacity="0.75" />
          </g>
          <g fill="#38bdf8">
            <circle cx="12%" cy="40%" r="1.2" opacity="0.7" />
            <circle cx="28%" cy="65%" r="1.4" opacity="0.8" />
            <circle cx="55%" cy="30%" r="1.1" opacity="0.65" />
            <circle cx="72%" cy="70%" r="1.3" opacity="0.75" />
            <circle cx="86%" cy="45%" r="0.9" opacity="0.55" />
          </g>
          <g fill="#fde047">
            <circle cx="16%" cy="75%" r="1.3" opacity="0.8" />
            <circle cx="40%" cy="45%" r="1.1" opacity="0.7" />
            <circle cx="60%" cy="80%" r="1.4" opacity="0.85" />
            <circle cx="83%" cy="55%" r="1.2" opacity="0.75" />
          </g>
          <g fill="#c084fc">
            <circle cx="24%" cy="50%" r="1.2" opacity="0.7" />
            <circle cx="44%" cy="75%" r="1.5" opacity="0.8" />
            <circle cx="68%" cy="35%" r="1.1" opacity="0.65" />
            <circle cx="96%" cy="60%" r="1.3" opacity="0.75" />
          </g>
          <g fill="#34d399">
            <circle cx="30%" cy="30%" r="1.2" opacity="0.65" />
            <circle cx="58%" cy="65%" r="1.3" opacity="0.7" />
            <circle cx="89%" cy="35%" r="1.1" opacity="0.6" />
          </g>
        </svg>
      </div>

      <div className="relative z-30 mx-auto max-w-6xl">
        {/* ========================================================================= */}
        {/* Header: Main Title & Subtitle (Topmost layer, unaffected by shadow)      */}
        {/* ========================================================================= */}
        <div className="relative z-30 text-center max-w-2xl mx-auto space-y-3 mb-10 lg:mb-14">
          <h2
            id="four-pillars-title"
            className="text-2xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight text-white uppercase"
            style={{
              textShadow: "0 0 20px rgba(251,191,36,0.35)",
            }}
          >
            4 Pilar Pembelajaran Komprehensif
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Sumbu ekosistem pembelajaran terintegrasi yang menyelaraskan teori fundamental, laboratorium deterministik, investigasi insiden nyata, hingga rekayasa solusi industri enterprise.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW: Expansive Solar System with Connected Bridges & Tooltips    */}
        {/* ========================================================================= */}
        <div className="relative hidden lg:block w-full max-w-[1160px] mx-auto min-h-[520px]">
          {/* SVG: 4 Orbit Lines + Solid Information Bridge Beams between Sun and Planets */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full"
            viewBox="0 0 1160 520"
            fill="none"
          >
            <defs>
              {/* Information Bridge Gradients */}
              <linearGradient id="bridgeMerkurius" x1="580" y1="260" x2="490" y2="222" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="bridgeVenus" x1="580" y1="260" x2="731" y2="197" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="bridgeBumi" x1="580" y1="260" x2="363" y2="350" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="bridgeMars" x1="580" y1="260" x2="862" y2="377" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.95" />
              </linearGradient>

              {/* Glowing Filters */}
              <filter id="bridgeGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.7" />
              </filter>
            </defs>

            {/* 4 Clean Solar Orbit Circles (All strictly outside the 48px Sun radius) */}
            {/* Orbit 1: Merkurius */}
            <ellipse
              cx="580"
              cy="260"
              rx="110"
              ry="66"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeOpacity={activePlanet === "merkurius" ? "0.8" : "0.45"}
              strokeDasharray="5 5"
            />

            {/* Orbit 2: Venus */}
            <ellipse
              cx="580"
              cy="260"
              rx="185"
              ry="110"
              stroke="#f59e0b"
              strokeWidth="1.2"
              strokeOpacity={activePlanet === "venus" ? "0.8" : "0.4"}
              strokeDasharray="6 6"
            />

            {/* Orbit 3: Bumi */}
            <ellipse
              cx="580"
              cy="260"
              rx="265"
              ry="158"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeOpacity={activePlanet === "bumi" ? "0.8" : "0.35"}
              strokeDasharray="7 7"
            />

            {/* Orbit 4: Mars */}
            <ellipse
              cx="580"
              cy="260"
              rx="345"
              ry="205"
              stroke="#f87171"
              strokeWidth="1.2"
              strokeOpacity={activePlanet === "mars" ? "0.8" : "0.3"}
              strokeDasharray="8 8"
            />

            {/* 🌉 INFORMATION BRIDGES (Solid Continuous Connecting Lines from Sun to each Planet) */}
            {/* Sun -> Merkurius */}
            <path
              d="M 580 260 L 490 222"
              stroke="url(#bridgeMerkurius)"
              strokeWidth={activePlanet === "merkurius" ? "2.5" : "1.5"}
              strokeLinecap="round"
              filter="url(#bridgeGlow)"
              className="transition-all duration-300"
            />
            {/* Sun -> Venus */}
            <path
              d="M 580 260 L 731 197"
              stroke="url(#bridgeVenus)"
              strokeWidth={activePlanet === "venus" ? "2.5" : "1.5"}
              strokeLinecap="round"
              filter="url(#bridgeGlow)"
              className="transition-all duration-300"
            />
            {/* Sun -> Bumi */}
            <path
              d="M 580 260 L 363 350"
              stroke="url(#bridgeBumi)"
              strokeWidth={activePlanet === "bumi" ? "2.5" : "1.5"}
              strokeLinecap="round"
              filter="url(#bridgeGlow)"
              className="transition-all duration-300"
            />
            {/* Sun -> Mars */}
            <path
              d="M 580 260 L 862 377"
              stroke="url(#bridgeMars)"
              strokeWidth={activePlanet === "mars" ? "2.5" : "1.5"}
              strokeLinecap="round"
              filter="url(#bridgeGlow)"
              className="transition-all duration-300"
            />
          </svg>

          {/* ========================================================================= */}
          {/* ☀️ CENTER: PURE MATAHARI (SUN) SPHERE WITH INTERACTIVE TOOLTIP           */}
          {/* ========================================================================= */}
          <div
            className="absolute left-[580px] top-[260px] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
            onMouseEnter={() => setActivePlanet("matahari")}
            onMouseLeave={() => setActivePlanet(null)}
            onFocus={() => setActivePlanet("matahari")}
            onBlur={() => setActivePlanet(null)}
            tabIndex={0}
            aria-label="Matahari - Pusat Tata Surya Pembelajaran Zenoba"
          >
            {/* Central Sun Orb (Clean Spherical Natural Style) */}
            <div className="relative w-24 h-24 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.35),inset_0_0_15px_rgba(255,255,255,0.4)] border border-amber-300/80 overflow-hidden transition-transform duration-300 group-hover:scale-110">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #ffffff 0%, #fef08a 22%, #f59e0b 48%, #ea580c 75%, #7c2d12 100%)",
                }}
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
              >
                <circle cx="40" cy="35" r="18" fill="#fde047" opacity="0.7" />
                <circle cx="65" cy="60" r="20" fill="#f97316" opacity="0.6" />
              </svg>
              <div
                className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.95) 0%, rgba(254,240,138,0.4) 50%, transparent 80%)",
                }}
              />
            </div>

            {/* Tooltip: Zenoba Central Sun */}
            <div
              className={`pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/90 border border-amber-400/60 px-3 py-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] backdrop-blur-md transition-all duration-200 z-50 ${
                activePlanet === "matahari" ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <p className="text-xs font-bold text-amber-200">Zenoba (The Central Sun)</p>
              <p className="text-[10px] text-slate-300">Pusat Gravitasi & Ekosistem Pembelajaran IT</p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🪐 PLANET 1: MERKURIUS (Orbit 1: x=490, y=222) WITH TOOLTIP               */}
          {/* ========================================================================= */}
          <div
            className="absolute left-[490px] top-[222px] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
            onMouseEnter={() => setActivePlanet("merkurius")}
            onMouseLeave={() => setActivePlanet(null)}
            onFocus={() => setActivePlanet("merkurius")}
            onBlur={() => setActivePlanet(null)}
            tabIndex={0}
            aria-label="Planet Merkurius - Pilar 01 Learn"
          >
            <div className="relative w-6 h-6 rounded-full shadow-[0_0_15px_rgba(148,163,184,0.7),inset_0_0_6px_rgba(255,255,255,0.6)] border border-slate-300/80 overflow-hidden transition-transform duration-300 group-hover:scale-135">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #f1f5f9 0%, #94a3b8 35%, #475569 70%, #1e293b 100%)",
                }}
              />
              <div className="absolute inset-0 rounded-full opacity-40 bg-[radial-gradient(ellipse_at_70%_60%,#334155_0%,transparent_60%)]" />
            </div>

            {/* Tooltip: Merkurius */}
            <div
              className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/95 border border-slate-500/80 px-2.5 py-1.5 shadow-[0_0_15px_rgba(148,163,184,0.4)] backdrop-blur-md transition-all duration-200 z-50 ${
                activePlanet === "merkurius" ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <p className="text-xs font-bold text-white">Merkurius</p>
              </div>
              <p className="text-[10px] text-slate-300 font-medium">01 • Learn (Jalur Belajar)</p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🪐 PLANET 2: VENUS (Orbit 2: x=731, y=197) WITH TOOLTIP                  */}
          {/* ========================================================================= */}
          <div
            className="absolute left-[731px] top-[197px] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
            onMouseEnter={() => setActivePlanet("venus")}
            onMouseLeave={() => setActivePlanet(null)}
            onFocus={() => setActivePlanet("venus")}
            onBlur={() => setActivePlanet(null)}
            tabIndex={0}
            aria-label="Planet Venus - Pilar 02 Practice Labs"
          >
            <div className="relative w-7 h-7 rounded-full shadow-[0_0_18px_rgba(245,158,11,0.7),inset_0_0_7px_rgba(255,255,255,0.6)] border border-amber-300/80 overflow-hidden transition-transform duration-300 group-hover:scale-135">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #fef08a 0%, #f59e0b 35%, #b45309 70%, #78350f 100%)",
                }}
              />
              <div className="absolute inset-0 rounded-full opacity-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(254,240,138,0.3)_3px,rgba(254,240,138,0.3)_4px)]" />
            </div>

            {/* Tooltip: Venus */}
            <div
              className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/95 border border-amber-500/80 px-2.5 py-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] backdrop-blur-md transition-all duration-200 z-50 ${
                activePlanet === "venus" ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <p className="text-xs font-bold text-white">Venus</p>
              </div>
              <p className="text-[10px] text-amber-300 font-medium">02 • Practice Labs</p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🪐 PLANET 3: BUMI (Orbit 3: x=363, y=350) WITH TOOLTIP                   */}
          {/* ========================================================================= */}
          <div
            className="absolute left-[363px] top-[350px] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
            onMouseEnter={() => setActivePlanet("bumi")}
            onMouseLeave={() => setActivePlanet(null)}
            onFocus={() => setActivePlanet("bumi")}
            onBlur={() => setActivePlanet(null)}
            tabIndex={0}
            aria-label="Planet Bumi - Pilar 03 Challenges"
          >
            <div className="relative w-8 h-8 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.8),inset_0_0_8px_rgba(255,255,255,0.7)] border border-cyan-300/80 overflow-hidden transition-transform duration-300 group-hover:scale-135">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #60a5fa 0%, #0284c7 35%, #1e40af 70%, #0f172a 100%)",
                }}
              />
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen pointer-events-none">
                <path d="M 15 35 Q 35 15 55 30 Q 70 45 55 65 Q 35 75 20 55 Z" fill="#10b981" />
                <path d="M 60 25 Q 75 15 85 30 Q 80 50 65 45 Z" fill="#34d399" />
              </svg>
              <div className="absolute inset-0 rounded-full opacity-40 bg-[radial-gradient(ellipse_at_40%_40%,#ffffff_0%,transparent_60%)]" />
            </div>

            {/* Tooltip: Bumi */}
            <div
              className={`pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/95 border border-blue-500/80 px-2.5 py-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)] backdrop-blur-md transition-all duration-200 z-50 ${
                activePlanet === "bumi" ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-xs font-bold text-white">Bumi (Earth)</p>
              </div>
              <p className="text-[10px] text-blue-300 font-medium">03 • Challenges</p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🪐 PLANET 4: MARS (Orbit 4: x=862, y=377) WITH TOOLTIP                   */}
          {/* ========================================================================= */}
          <div
            className="absolute left-[862px] top-[377px] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
            onMouseEnter={() => setActivePlanet("mars")}
            onMouseLeave={() => setActivePlanet(null)}
            onFocus={() => setActivePlanet("mars")}
            onBlur={() => setActivePlanet(null)}
            tabIndex={0}
            aria-label="Planet Mars - Pilar 04 Consultant Project"
          >
            <div className="relative w-7 h-7 rounded-full shadow-[0_0_18px_rgba(239,68,68,0.75),inset_0_0_7px_rgba(255,255,255,0.6)] border border-rose-400/80 overflow-hidden transition-transform duration-300 group-hover:scale-135">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #fca5a5 0%, #ef4444 35%, #b91c1c 70%, #450a0a 100%)",
                }}
              />
              <div className="absolute top-0.5 right-1 w-1.5 h-0.5 bg-white/90 rounded-full blur-[0.5px]" />
              <div className="absolute inset-0 rounded-full opacity-35 bg-[radial-gradient(ellipse_at_40%_75%,#7f1d1d_0%,transparent_60%)]" />
            </div>

            {/* Tooltip: Mars */}
            <div
              className={`pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/95 border border-rose-500/80 px-2.5 py-1.5 shadow-[0_0_15px_rgba(244,63,94,0.4)] backdrop-blur-md transition-all duration-200 z-50 ${
                activePlanet === "mars" ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <p className="text-xs font-bold text-white">Mars</p>
              </div>
              <p className="text-[10px] text-rose-300 font-medium">04 • Consultant Project</p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LEFT COLUMN: PILLAR 01 & 03 (OPEN TYPOGRAPHY OUTSIDE ORBITS)              */}
          {/* ========================================================================= */}
          {/* 01: Learn */}
          <div
            className={`absolute left-0 top-6 w-[230px] text-left z-30 transition-all duration-300 ${
              activePlanet === "merkurius" ? "translate-x-1" : ""
            }`}
          >
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-600/80 text-slate-300 bg-slate-900/60">
              01
            </span>
            <h3 className="mt-2 text-base font-bold text-white tracking-wide">
              Learn (Jalur Belajar)
            </h3>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Jalur belajar modular berbasis micro-learning dan visualisasi interaktif data flow untuk memahami konsep fundamental IT, arsitektur sistem, dan teknologi modern.
            </p>
          </div>

          {/* 03: Challenges */}
          <div
            className={`absolute left-0 bottom-6 w-[230px] text-left z-30 transition-all duration-300 ${
              activePlanet === "bumi" ? "translate-x-1" : ""
            }`}
          >
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-blue-500/60 text-blue-300 bg-blue-950/60">
              03
            </span>
            <h3 className="mt-2 text-base font-bold text-white tracking-wide">
              Challenges
            </h3>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Tantangan troubleshooting skenario nyata tanpa bantuan panduan step-by-step untuk melatih intuisi diagnosa, pemecahan masalah, dan mitigasi insiden IT.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: PILLAR 02 & 04 (OPEN TYPOGRAPHY OUTSIDE ORBITS)             */}
          {/* ========================================================================= */}
          {/* 02: Practice Labs */}
          <div
            className={`absolute right-0 top-6 w-[230px] text-left z-30 transition-all duration-300 ${
              activePlanet === "venus" ? "-translate-x-1" : ""
            }`}
          >
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-amber-500/60 text-amber-300 bg-amber-950/60">
              02
            </span>
            <h3 className="mt-2 text-base font-bold text-white tracking-wide">
              Practice Labs
            </h3>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Laboratorium mandiri dengan evaluasi otomatis deterministik untuk konfigurasi sistem, simulasi teknis, dan pengujian infrastruktur IT secara presisi.
            </p>
          </div>

          {/* 04: Consultant Project */}
          <div
            className={`absolute right-0 bottom-6 w-[230px] text-left z-30 transition-all duration-300 ${
              activePlanet === "mars" ? "-translate-x-1" : ""
            }`}
          >
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-rose-500/60 text-rose-300 bg-rose-950/60">
              04
            </span>
            <h3 className="mt-2 text-base font-bold text-white tracking-wide">
              Consultant Project
            </h3>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Simulasi proyek konsultan IT profesional: analisis kebutuhan sistem enterprise, perancangan solusi teknis, kalkulasi BoQ, dan evaluasi anggaran riil.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE / TABLET VIEW: Responsive Clean Typography (No Card Boxes)         */}
        {/* ========================================================================= */}
        <div className="lg:hidden space-y-8">
          {/* Central Sun Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.55)] border-2 border-amber-300/70 overflow-hidden mb-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #fef08a 25%, #f59e0b 50%, #7c2d12 100%)",
                }}
              />
            </div>
            <p className="text-xs text-slate-300 max-w-sm">
              Zenoba sebagai pusat gravitasi pembelajaran IT yang mengorbitkan seluruh pilar keahlian teknologi modern.
            </p>
          </div>

          {/* 4 Pillars Clean List with Planet Spheres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 01 Merkurius */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 relative w-8 h-8 rounded-full shadow-[0_0_12px_rgba(148,163,184,0.6)] border border-slate-300/80 overflow-hidden mt-0.5">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #f1f5f9 0%, #94a3b8 35%, #475569 70%, #1e293b 100%)",
                  }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-slate-600/80 text-slate-300 bg-slate-900/60">
                  01
                </span>
                <h3 className="mt-1 text-sm font-bold text-white">Learn (Jalur Belajar)</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Jalur belajar modular berbasis micro-learning dan visualisasi interaktif data flow untuk memahami konsep fundamental IT, arsitektur sistem, dan teknologi modern.
                </p>
              </div>
            </div>

            {/* 02 Venus */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 relative w-8 h-8 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)] border border-amber-300/80 overflow-hidden mt-0.5">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #fef08a 0%, #f59e0b 35%, #b45309 70%, #78350f 100%)",
                  }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/60 text-amber-300 bg-amber-950/60">
                  02
                </span>
                <h3 className="mt-1 text-sm font-bold text-white">Practice Labs</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Laboratorium mandiri dengan evaluasi otomatis deterministik untuk konfigurasi sistem, simulasi teknis, dan pengujian infrastruktur IT secara presisi.
                </p>
              </div>
            </div>

            {/* 03 Bumi */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 relative w-8 h-8 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.7)] border border-cyan-300/80 overflow-hidden mt-0.5">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #60a5fa 0%, #0284c7 35%, #1e40af 70%, #0f172a 100%)",
                  }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-blue-500/60 text-blue-300 bg-blue-950/60">
                  03
                </span>
                <h3 className="mt-1 text-sm font-bold text-white">Challenges</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Tantangan troubleshooting skenario nyata tanpa bantuan panduan step-by-step untuk melatih intuisi diagnosa, pemecahan masalah, dan mitigasi insiden IT.
                </p>
              </div>
            </div>

            {/* 04 Mars */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 relative w-8 h-8 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.7)] border border-rose-400/80 overflow-hidden mt-0.5">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #fca5a5 0%, #ef4444 35%, #b91c1c 70%, #450a0a 100%)",
                  }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-rose-500/60 text-rose-300 bg-rose-950/60">
                  04
                </span>
                <h3 className="mt-1 text-sm font-bold text-white">Consultant Project</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Simulasi proyek konsultan IT profesional: analisis kebutuhan sistem enterprise, perancangan solusi teknis, kalkulasi BoQ, dan evaluasi anggaran riil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
