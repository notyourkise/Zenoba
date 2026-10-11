"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SlidingButtonLabel } from "@/components/ui/sliding-button-label";

type JourneyCheckpoint = {
  celestialName: string;
  learningPath: string;
  description: string;
  desktopPosition: { left: string; top: string };
  popupPlacement: "above" | "below";
  planetBackground: string;
  planetGlow: string;
};

const checkpoints: JourneyCheckpoint[] = [
  {
    celestialName: "Mercury",
    learningPath: "Network Foundations",
    description: "Mulai dari perangkat, topologi, dan cara data bergerak.",
    desktopPosition: { left: "18%", top: "8%" },
    popupPlacement: "below",
    planetBackground:
      "radial-gradient(circle at 32% 28%, #f8fafc 0 7%, #94a3b8 24%, #475569 59%, #1e293b 100%)",
    planetGlow:
      "0 0 0 7px rgba(148,163,184,0.12), 0 12px 24px rgba(148,163,184,0.25)",
  },
  {
    celestialName: "Venus",
    learningPath: "IPv4 & Subnetting",
    description: "Pahami alamat IP, CIDR, subnet, dan perencanaan host.",
    desktopPosition: { left: "38%", top: "24%" },
    popupPlacement: "below",
    planetBackground:
      "radial-gradient(circle at 30% 28%, #fef3c7 0 8%, #d6a856 30%, #8a5c24 68%, #422006 100%)",
    planetGlow:
      "0 0 0 7px rgba(214,168,86,0.12), 0 12px 24px rgba(214,168,86,0.24)",
  },
  {
    celestialName: "Mars",
    learningPath: "Switching & LAN",
    description: "Bangun LAN dengan Ethernet, VLAN, access, dan trunk.",
    desktopPosition: { left: "82%", top: "34%" },
    popupPlacement: "below",
    planetBackground:
      "radial-gradient(circle at 32% 27%, #fed7aa 0 7%, #c6613d 34%, #7c2d22 66%, #3b0d0b 100%)",
    planetGlow:
      "0 0 0 7px rgba(198,97,61,0.12), 0 12px 24px rgba(198,97,61,0.24)",
  },
  {
    celestialName: "Jupiter",
    learningPath: "Routing & Network Services",
    description: "Hubungkan jaringan melalui routing, DHCP, DNS, dan NAT.",
    desktopPosition: { left: "54%", top: "54%" },
    popupPlacement: "above",
    planetBackground:
      "repeating-linear-gradient(168deg, #e8d3b6 0 7px, #a77851 8px 13px, #5e3c2c 14px 19px, #d8b28b 20px 27px)",
    planetGlow:
      "0 0 0 7px rgba(216,178,139,0.12), 0 12px 24px rgba(216,178,139,0.22)",
  },
  {
    celestialName: "Saturn",
    learningPath: "Wireless & Troubleshooting",
    description: "Lacak gangguan, pahami wireless, dan ambil keputusan teknis.",
    desktopPosition: { left: "15%", top: "72%" },
    popupPlacement: "above",
    planetBackground:
      "radial-gradient(circle at 32% 28%, #fef9c3 0 8%, #cbb878 35%, #78643a 67%, #3f3218 100%)",
    planetGlow:
      "0 0 0 7px rgba(203,184,120,0.12), 0 12px 24px rgba(203,184,120,0.24)",
  },
  {
    celestialName: "Polaris",
    learningPath: "Network Planning & IT Consultant",
    description:
      "Rancang solusi utuh: topologi, IP plan, perangkat, dan anggaran.",
    desktopPosition: { left: "76%", top: "88%" },
    popupPlacement: "above",
    planetBackground:
      "radial-gradient(circle at 32% 28%, #ffffff 0 7%, #bfdbfe 31%, #3b82f6 62%, #172554 100%)",
    planetGlow:
      "0 0 0 7px rgba(96,165,250,0.14), 0 12px 26px rgba(96,165,250,0.3)",
  },
];

type JourneyDriftingPlanet = {
  id: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  bodyGradient: string;
  boxShadow?: string;
  hasSurfaceAtmosphere?: boolean;
};

const JOURNEY_DRIFTING_PLANETS: JourneyDriftingPlanet[] = [
  // --- ✨ SMALL DRIFTING PLANETS (With glowing white & colored starlight halos) ---
  {
    id: "journey-small-planet-1",
    top: "6%",
    size: 14, // Bright White Glowing Planet
    duration: "44s",
    delay: "-4s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 40%, #cbd5e1 80%, #64748b 100%)",
    boxShadow: "0 0 16px #ffffff, 0 0 28px rgba(255, 255, 255, 0.9), inset 0 0 6px #ffffff",
    hasSurfaceAtmosphere: false,
  },
  {
    id: "journey-small-planet-2",
    top: "19%",
    size: 16, // Arctic Cyan Glowing Planet
    duration: "52s",
    delay: "-26s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #e0f2fe 0%, #38bdf8 45%, #0369a1 100%)",
    boxShadow: "0 0 18px #38bdf8, 0 0 30px rgba(56, 189, 248, 0.85), inset 0 0 6px #ffffff",
    hasSurfaceAtmosphere: true,
  },
  {
    id: "journey-small-planet-3",
    top: "27%",
    size: 11, // Rocky Slate Micro Planet
    duration: "48s",
    delay: "-14s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #f1f5f9 0%, #94a3b8 50%, #334155 100%)",
    boxShadow: "0 0 8px rgba(148, 163, 184, 0.35)",
    hasSurfaceAtmosphere: false,
  },
  {
    id: "journey-small-planet-4",
    top: "37%",
    size: 15, // Radiant Warm Gold Glowing Planet
    duration: "40s",
    delay: "-20s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #fef08a 35%, #f59e0b 75%, #78350f 100%)",
    boxShadow: "0 0 18px #fde047, 0 0 32px rgba(250, 204, 21, 0.9), inset 0 0 6px #ffffff",
    hasSurfaceAtmosphere: true,
  },
  {
    id: "journey-small-planet-5",
    top: "47%",
    size: 12, // Super-Bright Pure White Glowing Pearl
    duration: "36s",
    delay: "-31s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 45%, #e2e8f0 100%)",
    boxShadow: "0 0 20px #ffffff, 0 0 36px rgba(255, 255, 255, 0.95), inset 0 0 8px #ffffff",
    hasSurfaceAtmosphere: false,
  },
  {
    id: "journey-small-planet-6",
    top: "52%",
    size: 13, // Sunset Coral Planet
    duration: "56s",
    delay: "-11s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffedd5 0%, #fb923c 45%, #9a3412 100%)",
    boxShadow: "0 0 14px rgba(251, 146, 60, 0.65), inset 0 0 5px rgba(255,255,255,0.4)",
    hasSurfaceAtmosphere: true,
  },
  {
    id: "journey-small-planet-7",
    top: "67%",
    size: 15, // Aurora Teal Glowing Planet
    duration: "46s",
    delay: "-22s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ccfbf1 0%, #2dd4bf 45%, #0f766e 100%)",
    boxShadow: "0 0 18px #2dd4bf, 0 0 30px rgba(45, 212, 191, 0.85), inset 0 0 6px #ffffff",
    hasSurfaceAtmosphere: true,
  },
  {
    id: "journey-small-planet-8",
    top: "76%",
    size: 10, // Copper / Dusty Ochre Micro Planet
    duration: "50s",
    delay: "-5s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #fed7aa 0%, #c2410c 50%, #431407 100%)",
    boxShadow: "0 0 8px rgba(234, 88, 12, 0.35)",
    hasSurfaceAtmosphere: false,
  },
  {
    id: "journey-small-planet-9",
    top: "89%",
    size: 13, // Radiant Bright White Planet
    duration: "38s",
    delay: "-16s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #ffffff 0%, #f1f5f9 45%, #94a3b8 100%)",
    boxShadow: "0 0 18px #ffffff, 0 0 32px rgba(255, 255, 255, 0.9), inset 0 0 6px #ffffff",
    hasSurfaceAtmosphere: false,
  },
  {
    id: "journey-small-planet-10",
    top: "94%",
    size: 14, // Sapphire Blue Glowing Planet
    duration: "49s",
    delay: "-39s",
    bodyGradient: "radial-gradient(circle at 30% 30%, #bfdbfe 0%, #3b82f6 45%, #1e3a8a 100%)",
    boxShadow: "0 0 16px #3b82f6, 0 0 28px rgba(59, 130, 246, 0.8), inset 0 0 5px #ffffff",
    hasSurfaceAtmosphere: true,
  },
];

function JourneyDriftingPlanets() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
    >
      <style>{`
        @keyframes driftPlanetLeftToRightJourney {
          0% {
            transform: translateX(-120px);
          }
          100% {
            transform: translateX(calc(100vw + 140px));
          }
        }
      `}</style>
      {JOURNEY_DRIFTING_PLANETS.map((planet) => (
        <div
          key={planet.id}
          className="absolute left-0 pointer-events-none select-none"
          style={{
            top: planet.top,
            animation: `driftPlanetLeftToRightJourney ${planet.duration} linear infinite`,
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
            {planet.hasSurfaceAtmosphere ? (
              <div
                className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.9) 0%, transparent 70%)",
                }}
              />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function StarField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-85"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="journeyStarGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.75" />
        </filter>
        <filter id="journeyStarGlowAmber" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#fb923c" floodOpacity="0.8" />
        </filter>
        <filter id="journeyStarGlowCyan" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38bdf8" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* ------------------------------------------------------------------- */}
      {/* RASI BINTANG 3: URSA MAJOR (BINTANG BIDUK / BIG DIPPER) - KIRI TENGAH */}
      {/* ------------------------------------------------------------------- */}
      <g id="constellation-ursa-major">
        {/* Connecting Lines */}
        <g stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round">
          {/* Handle (Gagang Gayung) */}
          <line x1="5%" y1="28%" x2="9%" y2="33%" />
          <line x1="9%" y1="33%" x2="13%" y2="39%" />
          {/* Bowl (Wadah Gayung) */}
          <line x1="13%" y1="39%" x2="18%" y2="38%" />
          <line x1="18%" y1="38%" x2="22%" y2="46%" />
          <line x1="22%" y1="46%" x2="17%" y2="48%" />
          <line x1="17%" y1="48%" x2="13%" y2="39%" />
        </g>

        {/* Node Stars */}
        <circle cx="9%" cy="33%" r="3" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />
        <circle cx="13%" cy="39%" r="3.5" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />
        <circle cx="18%" cy="38%" r="3" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />
        <circle cx="17%" cy="48%" r="3.2" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />

        {/* Major Pulsating Stars (Dubhe & Merak & Alkaid) */}
        <circle cx="5%" cy="28%" r="5" fill="#38bdf8" filter="url(#journeyStarGlowCyan)">
          <animate attributeName="opacity" values="0.45;1;0.45" dur="2.7s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;5.8;4" dur="2.7s" repeatCount="indefinite" />
        </circle>
        <circle cx="22%" cy="46%" r="5.5" fill="#ffffff" filter="url(#journeyStarGlow)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="4.5;6.2;4.5" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* RASI BINTANG 4: ORION (SANG PEMBURU & SABUK 3 BINTANG) - KANAN BAWAH */}
      {/* ------------------------------------------------------------------- */}
      <g id="constellation-orion">
        {/* Connecting Lines */}
        <g stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round">
          {/* Shoulders */}
          <line x1="77%" y1="72%" x2="86%" y2="68%" />
          {/* Orion's Belt (Sabuk Tiga Bintang) */}
          <line x1="80%" y1="78%" x2="82%" y2="80%" />
          <line x1="82%" y1="80%" x2="84%" y2="82%" />
          {/* Body Lines connecting shoulders to belt to knees */}
          <line x1="77%" y1="72%" x2="80%" y2="78%" />
          <line x1="80%" y1="78%" x2="79%" y2="90%" />
          <line x1="86%" y1="68%" x2="84%" y2="82%" />
          <line x1="84%" y1="82%" x2="88%" y2="92%" />
        </g>

        {/* Belt Stars & Node Stars */}
        <circle cx="86%" cy="68%" r="3.5" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />
        <circle cx="80%" cy="78%" r="3" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />
        <circle cx="82%" cy="80%" r="3.2" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />
        <circle cx="84%" cy="82%" r="3" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />
        <circle cx="79%" cy="90%" r="3.5" fill="#ffffff" opacity="0.6" filter="url(#journeyStarGlow)" />

        {/* Major Pulsating Stars (Betelgeuse Golden Amber & Rigel Cyan Blue) */}
        <circle cx="77%" cy="72%" r="6" fill="#fb923c" filter="url(#journeyStarGlowAmber)">
          <animate attributeName="opacity" values="0.45;1;0.45" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="r" values="4.8;6.8;4.8" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="88%" cy="92%" r="5.5" fill="#38bdf8" filter="url(#journeyStarGlowCyan)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="r" values="4.5;6.5;4.5" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Distant Micro Planet Dots with Soft Glowing Atmosphere Halos */}
      <g>
        {/* Cyan / Sapphire Micro Planets */}
        <circle cx="92%" cy="18%" r="4" fill="#38bdf8" opacity="0.85" />
        <circle cx="92%" cy="18%" r="9" fill="#38bdf8" opacity="0.2" />

        <circle cx="6%" cy="12%" r="3" fill="#38bdf8" opacity="0.8" />
        <circle cx="6%" cy="12%" r="6.5" fill="#38bdf8" opacity="0.18" />

        <circle cx="48%" cy="28%" r="3.5" fill="#38bdf8" opacity="0.8" />
        <circle cx="48%" cy="28%" r="7.5" fill="#38bdf8" opacity="0.18" />

        {/* Amber / Orange Micro Planets */}
        <circle cx="8%" cy="65%" r="4.5" fill="#fb923c" opacity="0.85" />
        <circle cx="8%" cy="65%" r="10" fill="#fb923c" opacity="0.2" />

        <circle cx="96%" cy="48%" r="3.8" fill="#f97316" opacity="0.8" />
        <circle cx="96%" cy="48%" r="8.5" fill="#f97316" opacity="0.18" />

        <circle cx="38%" cy="75%" r="3" fill="#f59e0b" opacity="0.75" />
        <circle cx="38%" cy="75%" r="6.5" fill="#f59e0b" opacity="0.15" />

        {/* Gold / Yellow Micro Planets */}
        <circle cx="84%" cy="88%" r="4" fill="#fde047" opacity="0.85" />
        <circle cx="84%" cy="88%" r="8.5" fill="#fde047" opacity="0.2" />

        <circle cx="22%" cy="38%" r="3.2" fill="#fde047" opacity="0.8" />
        <circle cx="22%" cy="38%" r="7" fill="#fde047" opacity="0.18" />

        {/* Purple / Amethyst Micro Planets */}
        <circle cx="94%" cy="80%" r="4" fill="#c084fc" opacity="0.85" />
        <circle cx="94%" cy="80%" r="8.5" fill="#c084fc" opacity="0.2" />

        <circle cx="14%" cy="88%" r="3.6" fill="#a855f7" opacity="0.8" />
        <circle cx="14%" cy="88%" r="8" fill="#a855f7" opacity="0.18" />

        <circle cx="60%" cy="15%" r="3" fill="#c084fc" opacity="0.75" />
        <circle cx="60%" cy="15%" r="6.5" fill="#c084fc" opacity="0.15" />

        {/* Emerald / Mint Micro Planets */}
        <circle cx="10%" cy="20%" r="3.5" fill="#34d399" opacity="0.8" />
        <circle cx="10%" cy="20%" r="7.5" fill="#34d399" opacity="0.18" />

        <circle cx="76%" cy="60%" r="4.2" fill="#10b981" opacity="0.85" />
        <circle cx="76%" cy="60%" r="9" fill="#10b981" opacity="0.2" />

        {/* Ruby / Rose Micro Planets */}
        <circle cx="88%" cy="34%" r="3.2" fill="#f43f5e" opacity="0.8" />
        <circle cx="88%" cy="34%" r="7" fill="#f43f5e" opacity="0.18" />

        <circle cx="32%" cy="92%" r="3.5" fill="#fb7185" opacity="0.8" />
        <circle cx="32%" cy="92%" r="7.5" fill="#fb7185" opacity="0.18" />
      </g>

      {/* White Micro-Stars */}
      <g fill="#ffffff">
        <circle cx="5%" cy="6%" r="1" opacity="0.6" />
        <circle cx="12%" cy="14%" r="1.3" opacity="0.75" />
        <circle cx="20%" cy="8%" r="0.9" opacity="0.5" />
        <circle cx="28%" cy="18%" r="1.4" opacity="0.8" />
        <circle cx="36%" cy="7%" r="0.8" opacity="0.4" />
        <circle cx="45%" cy="15%" r="1.2" opacity="0.7" />
        <circle cx="54%" cy="6%" r="0.9" opacity="0.5" />
        <circle cx="63%" cy="12%" r="1.5" opacity="0.85" />
        <circle cx="72%" cy="5%" r="0.8" opacity="0.4" />
        <circle cx="81%" cy="14%" r="1.3" opacity="0.75" />
        <circle cx="89%" cy="7%" r="0.9" opacity="0.5" />
        <circle cx="96%" cy="13%" r="1.2" opacity="0.7" />

        <circle cx="7%" cy="38%" r="1.1" opacity="0.6" />
        <circle cx="15%" cy="46%" r="1.4" opacity="0.8" />
        <circle cx="24%" cy="32%" r="0.8" opacity="0.45" />
        <circle cx="32%" cy="44%" r="1.3" opacity="0.75" />
        <circle cx="70%" cy="36%" r="1.2" opacity="0.7" />
        <circle cx="79%" cy="48%" r="0.9" opacity="0.5" />
        <circle cx="87%" cy="34%" r="1.4" opacity="0.8" />
        <circle cx="95%" cy="42%" r="1.1" opacity="0.65" />

        <circle cx="6%" cy="68%" r="1.3" opacity="0.75" />
        <circle cx="14%" cy="60%" r="0.8" opacity="0.4" />
        <circle cx="22%" cy="74%" r="1.4" opacity="0.8" />
        <circle cx="30%" cy="62%" r="0.9" opacity="0.5" />
        <circle cx="68%" cy="66%" r="1.3" opacity="0.75" />
        <circle cx="77%" cy="58%" r="0.8" opacity="0.4" />
        <circle cx="85%" cy="70%" r="1.4" opacity="0.8" />
        <circle cx="93%" cy="64%" r="0.9" opacity="0.5" />

        <circle cx="4%" cy="90%" r="1.2" opacity="0.7" />
        <circle cx="11%" cy="96%" r="1.4" opacity="0.8" />
        <circle cx="19%" cy="84%" r="0.9" opacity="0.5" />
        <circle cx="27%" cy="92%" r="1.3" opacity="0.75" />
        <circle cx="37%" cy="88%" r="0.8" opacity="0.4" />
        <circle cx="48%" cy="95%" r="1.4" opacity="0.85" />
        <circle cx="58%" cy="86%" r="0.9" opacity="0.5" />
        <circle cx="67%" cy="94%" r="1.3" opacity="0.75" />
        <circle cx="76%" cy="88%" r="0.8" opacity="0.4" />
        <circle cx="84%" cy="96%" r="1.4" opacity="0.8" />
        <circle cx="92%" cy="89%" r="0.9" opacity="0.5" />
        <circle cx="98%" cy="95%" r="1.2" opacity="0.7" />
      </g>

      {/* Cyan / Blue Micro-Stars */}
      <g fill="#38bdf8">
        <circle cx="9%" cy="22%" r="1.3" opacity="0.75" />
        <circle cx="25%" cy="16%" r="1" opacity="0.6" />
        <circle cx="58%" cy="14%" r="1.2" opacity="0.7" />
        <circle cx="84%" cy="20%" r="1.4" opacity="0.8" />
        <circle cx="16%" cy="52%" r="1.1" opacity="0.65" />
        <circle cx="74%" cy="46%" r="1.3" opacity="0.75" />
        <circle cx="90%" cy="54%" r="1" opacity="0.6" />
        <circle cx="18%" cy="82%" r="1.4" opacity="0.8" />
        <circle cx="62%" cy="88%" r="1.2" opacity="0.7" />
        <circle cx="88%" cy="84%" r="1.3" opacity="0.75" />
      </g>

      {/* Gold / Yellow Micro-Stars */}
      <g fill="#fde047">
        <circle cx="14%" cy="10%" r="1.2" opacity="0.8" />
        <circle cx="42%" cy="18%" r="1.4" opacity="0.85" />
        <circle cx="78%" cy="8%" r="1.1" opacity="0.7" />
        <circle cx="93%" cy="26%" r="1.3" opacity="0.75" />
        <circle cx="26%" cy="48%" r="1.2" opacity="0.7" />
        <circle cx="82%" cy="40%" r="1.4" opacity="0.85" />
        <circle cx="12%" cy="76%" r="1.1" opacity="0.7" />
        <circle cx="52%" cy="92%" r="1.3" opacity="0.8" />
        <circle cx="95%" cy="82%" r="1.4" opacity="0.85" />
      </g>

      {/* Orange / Amber Micro-Stars */}
      <g fill="#fb923c">
        <circle cx="10%" cy="30%" r="1.3" opacity="0.8" />
        <circle cx="26%" cy="18%" r="1.1" opacity="0.7" />
        <circle cx="44%" cy="36%" r="1.4" opacity="0.85" />
        <circle cx="62%" cy="18%" r="1.2" opacity="0.75" />
        <circle cx="79%" cy="32%" r="1.4" opacity="0.85" />
        <circle cx="96%" cy="18%" r="1.1" opacity="0.7" />
        <circle cx="8%" cy="60%" r="1.3" opacity="0.8" />
        <circle cx="24%" cy="46%" r="1.1" opacity="0.7" />
        <circle cx="48%" cy="62%" r="1.4" opacity="0.85" />
        <circle cx="68%" cy="46%" r="1.2" opacity="0.75" />
        <circle cx="86%" cy="60%" r="1.4" opacity="0.85" />
        <circle cx="19%" cy="86%" r="1.2" opacity="0.75" />
        <circle cx="39%" cy="94%" r="1.4" opacity="0.85" />
        <circle cx="59%" cy="82%" r="1.1" opacity="0.7" />
        <circle cx="79%" cy="96%" r="1.3" opacity="0.8" />
        <circle cx="95%" cy="80%" r="1.4" opacity="0.85" />
      </g>

      {/* Purple / Violet Micro-Stars */}
      <g fill="#c084fc">
        <circle cx="18%" cy="28%" r="1.3" opacity="0.75" />
        <circle cx="64%" cy="8%" r="1.1" opacity="0.65" />
        <circle cx="88%" cy="12%" r="1.4" opacity="0.8" />
        <circle cx="22%" cy="66%" r="1.3" opacity="0.75" />
        <circle cx="78%" cy="62%" r="1.1" opacity="0.65" />
        <circle cx="34%" cy="90%" r="1.4" opacity="0.8" />
        <circle cx="80%" cy="92%" r="1.3" opacity="0.75" />
      </g>

      {/* Emerald / Mint Micro-Stars */}
      <g fill="#34d399">
        <circle cx="30%" cy="12%" r="1.2" opacity="0.7" />
        <circle cx="76%" cy="24%" r="1.3" opacity="0.75" />
        <circle cx="10%" cy="56%" r="1.1" opacity="0.65" />
        <circle cx="86%" cy="74%" r="1.4" opacity="0.8" />
        <circle cx="44%" cy="86%" r="1.2" opacity="0.7" />
      </g>
    </svg>
  );
}

function ConstellationPath() {
  const windingPath =
    "M 259 72 C 340 110, 450 150, 547 216 C 680 300, 980 240, 1181 306 C 1320 360, 980 420, 778 486 C 580 550, 350 570, 216 648 C 100 720, 750 710, 1094 792";

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 1440 900"
    >
      <defs>
        <filter id="constellationGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* Subtle outer glow track */}
      <path
        d={windingPath}
        stroke="#ffffff"
        strokeWidth="8"
        strokeOpacity="0.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Thick luminous winding white connecting line */}
      <path
        d={windingPath}
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#constellationGlow)"
      />
    </svg>
  );
}

function PlanetButton({
  checkpoint,
  isSelected,
  onSelect,
  onFocus,
  onBlur,
}: {
  checkpoint: JourneyCheckpoint;
  isSelected: boolean;
  onSelect: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const isSaturn = checkpoint.celestialName === "Saturn";

  return (
    <div className="relative grid place-items-center">
      {/* Saturn Planetary Back Ring (Pure Clean Vector SVG Behind Planet) */}
      {isSaturn && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 h-28 w-28 z-0"
          viewBox="0 0 112 112"
          fill="none"
        >
          <ellipse
            cx="56"
            cy="56"
            rx="46"
            ry="14"
            transform="rotate(-22 56 56)"
            stroke="#ffffff"
            strokeWidth="3"
            strokeOpacity="0.95"
          />
          <ellipse
            cx="56"
            cy="56"
            rx="42"
            ry="11"
            transform="rotate(-22 56 56)"
            stroke="#fde047"
            strokeWidth="2"
            strokeOpacity="0.9"
          />
        </svg>
      )}

      <button
        type="button"
        aria-expanded={isSelected}
        aria-label={`${checkpoint.celestialName}, ${checkpoint.learningPath}`}
        className="group relative z-10 grid h-16 w-16 place-items-center rounded-full border border-white/45 transition duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 cursor-pointer"
        onClick={onSelect}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          background: checkpoint.planetBackground,
          boxShadow: checkpoint.planetGlow,
        }}
      >
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 h-2 w-5 rounded-full bg-white/30 blur-[1px]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full ring-1 ring-black/20"
        />
        <span className="sr-only">Buka detail {checkpoint.celestialName}</span>
      </button>

      {/* Saturn Planetary Front Ring (Pure Clean Vector SVG Clipped Over Planet Equator) */}
      {isSaturn && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 h-28 w-28 z-20"
          viewBox="0 0 112 112"
          fill="none"
        >
          <defs>
            <clipPath id="saturnFrontArcClip">
              <rect
                x="-20"
                y="56"
                width="152"
                height="60"
                transform="rotate(-22 56 56)"
              />
            </clipPath>
          </defs>
          <g clipPath="url(#saturnFrontArcClip)">
            <ellipse
              cx="56"
              cy="56"
              rx="46"
              ry="14"
              transform="rotate(-22 56 56)"
              stroke="#ffffff"
              strokeWidth="3"
              strokeOpacity="0.95"
            />
            <ellipse
              cx="56"
              cy="56"
              rx="42"
              ry="11"
              transform="rotate(-22 56 56)"
              stroke="#fde047"
              strokeWidth="2"
              strokeOpacity="0.9"
            />
          </g>
        </svg>
      )}
    </div>
  );
}

function CheckpointPopup({
  checkpoint,
  onClose,
}: {
  checkpoint: JourneyCheckpoint;
  onClose: () => void;
}) {
  return (
    <div
      id={`checkpoint-${checkpoint.celestialName.toLowerCase()}`}
      role="dialog"
      aria-label={`Detail ${checkpoint.celestialName}`}
      className="w-64 rounded-2xl border border-slate-500/80 bg-slate-950/95 p-4 text-left shadow-[0_18px_48px_rgba(0,0,0,0.5)] backdrop-blur-sm animate-in fade-in-50 zoom-in-95 duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
            {checkpoint.celestialName}
          </p>
          <h3 className="mt-1 text-base font-bold text-white">
            {checkpoint.learningPath}
          </h3>
        </div>
        <button
          type="button"
          className="shrink-0 text-xs font-semibold text-slate-300 underline decoration-slate-500 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-300">
        {checkpoint.description}
      </p>
    </div>
  );
}

type JourneyTrackInfo = {
  id: string;
  label: string;
  isComingSoon: boolean;
  title: string;
  description: string;
  upcomingModules?: string[];
};

const journeyTracks: JourneyTrackInfo[] = [
  {
    id: "network-engineer",
    label: "Network Engineer",
    isComingSoon: false,
    title: "IT Infrastructure Journey",
    description:
      "Enam destinasi untuk membangun keahlian IT Infrastructure, dari fondasi jaringan sampai merancang solusi sebagai konsultan.",
  },
  {
    id: "sysadmin-linux",
    label: "SysAdmin & Linux",
    isComingSoon: true,
    title: "SysAdmin & Linux Track",
    description:
      "Kurikulum terintegrasi untuk administrasi server Linux enterprise, system services, manajemen storage, hingga otomatisasi infrastruktur.",
    upcomingModules: [
      "Linux Filesystem Hierarchy & Permissions",
      "Systemd Services & Process Management",
      "Nginx & Web Service Hardening",
      "Docker & Microservices Deployment",
      "Bash Shell Scripting & Crontab Automation",
      "Enterprise Firewall (UFW & iptables)",
    ],
  },
  {
    id: "it-consultant",
    label: "IT Consultant",
    isComingSoon: true,
    title: "IT Consultant Track",
    description:
      "Rekayasa solusi enterprise, perancangan Bill of Quantities (BoQ), kalkulasi kapasitas perangkat, dan manajemen anggaran pengadaan.",
    upcomingModules: [
      "Enterprise Solution Architecture & Topology",
      "Bill of Quantities (BoQ) Engineering",
      "Procurement Budget & Margin Calculation",
      "Bandwidth & Capacity Planning",
      "High Availability & Disaster Recovery SLA",
      "Client Pitching & Technical Proposal",
    ],
  },
];

function JourneyTrackSlider({
  selectedTrack,
  onSelectTrack,
}: {
  selectedTrack: string;
  onSelectTrack: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current;
      if (!container) return;

      const activeButton = container.querySelector<HTMLButtonElement>(
        `button[data-track-id="${selectedTrack}"]`
      );

      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [selectedTrack]);

  return (
    <div className="flex justify-center mb-8">
      <div
        ref={containerRef}
        role="tablist"
        aria-label="Pilihan Trek IT Infrastructure Journey"
        className="relative inline-flex items-center rounded-full bg-[#18181f]/95 p-1.5 border border-slate-800/90 shadow-inner backdrop-blur-md gap-1"
      >
        {/* Smooth Sliding Active Pill Indicator */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-1.5 bottom-1.5 rounded-full bg-[#35353d] shadow-md shadow-black/40 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {journeyTracks.map((track) => {
          const isSelected = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              role="tab"
              type="button"
              data-track-id={track.id}
              aria-label={track.label}
              aria-selected={isSelected}
              onClick={() => onSelectTrack(track.id)}
              className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white select-none ${
                isSelected
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{track.label}</span>
              {track.isComingSoon ? (
                <span className="text-[9px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 leading-none">
                  Soon
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ItInfrastructureJourney() {
  const [selectedTrack, setSelectedTrack] = useState("network-engineer");
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [lockedPlanet, setLockedPlanet] = useState<string | null>(null);

  const activePlanet = lockedPlanet || hoveredPlanet;

  const currentTrack =
    journeyTracks.find((t) => t.id === selectedTrack) || journeyTracks[0];

  const handlePlanetClick = (celestialName: string) => {
    setLockedPlanet((current) => (current === celestialName ? null : celestialName));
  };

  const handlePlanetMouseEnter = (celestialName: string) => {
    setHoveredPlanet(celestialName);
  };

  const handlePlanetMouseLeave = () => {
    setHoveredPlanet(null);
  };

  const handlePlanetFocus = (celestialName: string) => {
    setHoveredPlanet(celestialName);
  };

  const handlePlanetBlur = () => {
    setHoveredPlanet(null);
  };

  const handleClosePopup = () => {
    setLockedPlanet(null);
    setHoveredPlanet(null);
  };

  return (
    <section
      aria-labelledby="infrastructure-journey-title"
      className="relative isolate overflow-hidden bg-[#030308] px-6 py-24 text-white sm:px-12 lg:px-20"
    >
      {/* Deep Cosmic Black Ambient Glow & Stacking */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.25)_0%,transparent_75%)] z-0" />
      <StarField />
      <JourneyDriftingPlanets />

      <div className="relative z-20 mx-auto max-w-7xl">
        {/* Sliding Journey Tabs Filter (Placed ABOVE title with smooth animated pill) */}
        <JourneyTrackSlider
          selectedTrack={selectedTrack}
          onSelectTrack={setSelectedTrack}
        />

        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="infrastructure-journey-title"
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            {currentTrack.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            {currentTrack.description}
          </p>
        </div>

        {/* Coming Soon Track State */}
        {currentTrack.isComingSoon ? (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-800/90 bg-[#0a0d18]/90 p-8 sm:p-12 text-center backdrop-blur-md shadow-[0_0_40px_rgba(15,23,42,0.6)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-5">
              <span>Fase Perancangan Kurikulum • Segera Hadir di Zenoba</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Trek {currentTrack.label} Sedang Dipersiapkan
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Jalur belajar dan laboratorium interaktif untuk trek ini sedang disusun bersama praktisi industri. Silakan mulai eksplorasi pada trek Network Engineer yang telah tersedia penuh.
            </p>

            {currentTrack.upcomingModules ? (
              <div className="text-left mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5 text-center">
                  Modul & Lab yang Akan Dirilis:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto">
                  {currentTrack.upcomingModules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-800/80 bg-slate-900/60 px-3.5 py-2.5 text-xs text-slate-200"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400/90 shrink-0" />
                      <span className="font-medium">{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setSelectedTrack("network-engineer")}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300/80 bg-white hover:bg-slate-100 px-6 text-sm font-semibold text-black !text-black dark:text-black dark:!text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-md cursor-pointer"
                style={{ color: "#000000" }}
              >
                <span className="font-bold text-black" style={{ color: "#000000" }}>
                  Buka Trek Network Engineer
                </span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Constellation View (Descending Journey Flow) */}
            <div className="relative mx-auto mt-14 hidden min-h-[900px] max-w-[1440px] lg:block">
              <ConstellationPath />
              {checkpoints.map((checkpoint) => {
                const isActive = activePlanet === checkpoint.celestialName;
                return (
                  <article
                    key={checkpoint.celestialName}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={checkpoint.desktopPosition}
                  >
                    <div
                      className="relative flex flex-col items-center"
                      onMouseEnter={() => handlePlanetMouseEnter(checkpoint.celestialName)}
                      onMouseLeave={handlePlanetMouseLeave}
                    >
                      {isActive && checkpoint.popupPlacement === "above" ? (
                        <div className="absolute bottom-20 z-30">
                          <CheckpointPopup
                            checkpoint={checkpoint}
                            onClose={handleClosePopup}
                          />
                        </div>
                      ) : null}

                      <PlanetButton
                        checkpoint={checkpoint}
                        isSelected={isActive}
                        onSelect={() => handlePlanetClick(checkpoint.celestialName)}
                        onFocus={() => handlePlanetFocus(checkpoint.celestialName)}
                        onBlur={handlePlanetBlur}
                      />

                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 pointer-events-none select-none">
                        {checkpoint.celestialName}
                      </p>

                      {isActive && checkpoint.popupPlacement === "below" ? (
                        <div className="absolute top-24 z-30">
                          <CheckpointPopup
                            checkpoint={checkpoint}
                            onClose={handleClosePopup}
                          />
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Mobile Vertical Timeline View */}
            <ol className="relative mt-12 space-y-7 border-l border-slate-600 pl-10 lg:hidden">
              {checkpoints.map((checkpoint) => {
                const isActive = activePlanet === checkpoint.celestialName;
                return (
                  <li key={checkpoint.celestialName} className="relative">
                    <div className="absolute -left-[3.9rem] top-0">
                      <PlanetButton
                        checkpoint={checkpoint}
                        isSelected={isActive}
                        onSelect={() => handlePlanetClick(checkpoint.celestialName)}
                      />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                      {checkpoint.celestialName}
                    </p>
                    <h3 className="mt-1 text-lg font-bold">
                      {checkpoint.learningPath}
                    </h3>
                    {isActive ? (
                      <div className="mt-3">
                        <CheckpointPopup
                          checkpoint={checkpoint}
                          onClose={handleClosePopup}
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>

            <div className="mt-14 flex justify-center">
              <Link
                href="/learn"
                style={{ color: "#000000" }}
                className="group inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300/80 bg-white hover:bg-slate-100 px-6 text-sm font-semibold text-black !text-black dark:text-black dark:!text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 shadow-md overflow-hidden cursor-pointer"
              >
                <SlidingButtonLabel
                  text="Lihat jalur belajar"
                  className="text-black !text-black dark:text-black dark:!text-black font-bold"
                  containerClassName="h-5"
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
