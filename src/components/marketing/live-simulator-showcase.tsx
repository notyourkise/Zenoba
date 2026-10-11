"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { executeSimulatedCommand } from "@/features/network-logic/terminal/terminal-simulator";
import {
  calculateSubnetDetails,
  isValidIpv4,
} from "@/features/network-logic/ipv4/ipv4";
import { SlidingButtonLabel } from "@/components/ui/sliding-button-label";

export type ShowcaseTab =
  | "terminal"
  | "subnet"
  | "packet"
  | "chmod"
  | "vlan"
  | "fiber"
  | "raid"
  | "cctv"
  | "tls";

const PRESET_COMMANDS = [
  {
    label: "ping 192.168.1.1",
    cmd: "ping 192.168.1.1",
    desc: "Uji konektivitas gateway",
  },
  {
    label: "ipconfig /all",
    cmd: "ipconfig /all",
    desc: "Lihat konfigurasi IP & MAC",
  },
  { label: "arp -a", cmd: "arp -a", desc: "Periksa tabel mapping ARP" },
  {
    label: "tracert 8.8.8.8",
    cmd: "tracert 8.8.8.8",
    desc: "Lacak hop router menuju DNS",
  },
  {
    label: "nslookup zenoba.tech",
    cmd: "nslookup zenoba.tech",
    desc: "Query DNS server",
  },
  {
    label: "netstat -an",
    cmd: "netstat -an",
    desc: "Daftar port & socket aktif",
  },
  { label: "help", cmd: "help", desc: "Daftar seluruh perintah" },
];

function ShowcaseStarField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90 z-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Distant Micro Planet Dots with Soft Glowing Halos */}
      <g>
        {/* Cyan / Sapphire Micro Planets */}
        <circle cx="93%" cy="14%" r="4" fill="#38bdf8" opacity="0.85" />
        <circle cx="93%" cy="14%" r="9" fill="#38bdf8" opacity="0.2" />

        <circle cx="7%" cy="25%" r="3.2" fill="#38bdf8" opacity="0.8" />
        <circle cx="7%" cy="25%" r="7" fill="#38bdf8" opacity="0.18" />

        <circle cx="45%" cy="18%" r="3.5" fill="#38bdf8" opacity="0.8" />
        <circle cx="45%" cy="18%" r="7.5" fill="#38bdf8" opacity="0.18" />

        {/* Amber / Orange Micro Planets */}
        <circle cx="9%" cy="72%" r="4.5" fill="#fb923c" opacity="0.85" />
        <circle cx="9%" cy="72%" r="10" fill="#fb923c" opacity="0.2" />

        <circle cx="95%" cy="58%" r="3.8" fill="#f97316" opacity="0.8" />
        <circle cx="95%" cy="58%" r="8.5" fill="#f97316" opacity="0.18" />

        <circle cx="36%" cy="82%" r="3" fill="#f59e0b" opacity="0.75" />
        <circle cx="36%" cy="82%" r="6.5" fill="#f59e0b" opacity="0.15" />

        {/* Gold / Yellow Micro Planets */}
        <circle cx="82%" cy="90%" r="4" fill="#fde047" opacity="0.85" />
        <circle cx="82%" cy="90%" r="8.5" fill="#fde047" opacity="0.2" />

        <circle cx="20%" cy="42%" r="3.2" fill="#fde047" opacity="0.8" />
        <circle cx="20%" cy="42%" r="7" fill="#fde047" opacity="0.18" />

        {/* Coral Micro Planets */}
        <circle cx="92%" cy="84%" r="4" fill="#fb923c" opacity="0.85" />
        <circle cx="92%" cy="84%" r="8.5" fill="#fb923c" opacity="0.2" />

        <circle cx="16%" cy="90%" r="3.6" fill="#f97316" opacity="0.8" />
        <circle cx="16%" cy="90%" r="8" fill="#f97316" opacity="0.18" />

        <circle cx="62%" cy="12%" r="3" fill="#38bdf8" opacity="0.75" />
        <circle cx="62%" cy="12%" r="6.5" fill="#38bdf8" opacity="0.15" />

        {/* Emerald / Mint Micro Planets */}
        <circle cx="12%" cy="15%" r="3.5" fill="#34d399" opacity="0.8" />
        <circle cx="12%" cy="15%" r="7.5" fill="#34d399" opacity="0.18" />

        <circle cx="78%" cy="55%" r="4.2" fill="#10b981" opacity="0.85" />
        <circle cx="78%" cy="55%" r="9" fill="#10b981" opacity="0.2" />

        {/* Ruby / Rose Micro Planets */}
        <circle cx="86%" cy="30%" r="3.2" fill="#f43f5e" opacity="0.8" />
        <circle cx="86%" cy="30%" r="7" fill="#f43f5e" opacity="0.18" />

        <circle cx="30%" cy="94%" r="3.5" fill="#fb7185" opacity="0.8" />
        <circle cx="30%" cy="94%" r="7.5" fill="#fb7185" opacity="0.18" />
      </g>

      {/* 1. White Micro-Stars */}
      <g fill="#ffffff">
        <circle cx="4%" cy="8%" r="1.1" opacity="0.65" />
        <circle cx="11%" cy="22%" r="1.3" opacity="0.75" />
        <circle cx="19%" cy="14%" r="0.9" opacity="0.5" />
        <circle cx="27%" cy="32%" r="1.2" opacity="0.7" />
        <circle cx="35%" cy="10%" r="0.8" opacity="0.45" />
        <circle cx="43%" cy="26%" r="1.4" opacity="0.85" />
        <circle cx="51%" cy="16%" r="1" opacity="0.6" />
        <circle cx="59%" cy="34%" r="0.9" opacity="0.5" />
        <circle cx="67%" cy="12%" r="1.3" opacity="0.75" />
        <circle cx="75%" cy="28%" r="0.8" opacity="0.45" />
        <circle cx="83%" cy="18%" r="1.2" opacity="0.7" />
        <circle cx="91%" cy="30%" r="1.4" opacity="0.85" />
        <circle cx="97%" cy="14%" r="0.9" opacity="0.5" />
        <circle cx="7%" cy="48%" r="1.2" opacity="0.7" />
        <circle cx="16%" cy="62%" r="1.4" opacity="0.8" />
        <circle cx="25%" cy="52%" r="0.8" opacity="0.45" />
        <circle cx="34%" cy="68%" r="1.3" opacity="0.75" />
        <circle cx="42%" cy="56%" r="0.9" opacity="0.5" />
        <circle cx="53%" cy="64%" r="1.4" opacity="0.85" />
        <circle cx="61%" cy="50%" r="1" opacity="0.6" />
        <circle cx="71%" cy="66%" r="1.3" opacity="0.75" />
        <circle cx="80%" cy="54%" r="0.8" opacity="0.45" />
        <circle cx="89%" cy="62%" r="1.2" opacity="0.7" />
        <circle cx="96%" cy="52%" r="1.4" opacity="0.85" />
        <circle cx="5%" cy="84%" r="1" opacity="0.6" />
        <circle cx="13%" cy="94%" r="1.3" opacity="0.75" />
        <circle cx="22%" cy="82%" r="0.9" opacity="0.5" />
        <circle cx="31%" cy="92%" r="1.4" opacity="0.85" />
        <circle cx="40%" cy="80%" r="0.8" opacity="0.45" />
        <circle cx="49%" cy="96%" r="1.2" opacity="0.7" />
        <circle cx="58%" cy="84%" r="1.4" opacity="0.8" />
        <circle cx="68%" cy="94%" r="0.9" opacity="0.5" />
        <circle cx="77%" cy="82%" r="1.3" opacity="0.75" />
        <circle cx="86%" cy="96%" r="1" opacity="0.6" />
        <circle cx="94%" cy="86%" r="1.4" opacity="0.85" />
        <circle cx="98%" cy="94%" r="0.8" opacity="0.45" />
      </g>

      {/* 2. Blue / Sky-Blue Micro-Stars */}
      <g fill="#38bdf8">
        <circle cx="8%" cy="16%" r="1.2" opacity="0.7" />
        <circle cx="23%" cy="8%" r="0.9" opacity="0.55" />
        <circle cx="38%" cy="20%" r="1.4" opacity="0.8" />
        <circle cx="56%" cy="10%" r="1.1" opacity="0.65" />
        <circle cx="72%" cy="22%" r="1.3" opacity="0.75" />
        <circle cx="88%" cy="10%" r="1" opacity="0.6" />
        <circle cx="12%" cy="42%" r="1.4" opacity="0.85" />
        <circle cx="28%" cy="58%" r="1.1" opacity="0.65" />
        <circle cx="46%" cy="44%" r="1.3" opacity="0.75" />
        <circle cx="64%" cy="58%" r="0.9" opacity="0.55" />
        <circle cx="82%" cy="42%" r="1.4" opacity="0.8" />
        <circle cx="95%" cy="60%" r="1.1" opacity="0.65" />
        <circle cx="10%" cy="78%" r="1.3" opacity="0.75" />
        <circle cx="26%" cy="90%" r="0.9" opacity="0.55" />
        <circle cx="45%" cy="76%" r="1.4" opacity="0.8" />
        <circle cx="63%" cy="90%" r="1.1" opacity="0.65" />
        <circle cx="84%" cy="78%" r="1.3" opacity="0.75" />
        <circle cx="92%" cy="92%" r="1.2" opacity="0.7" />
      </g>

      {/* 3. Yellow / Gold Micro-Stars */}
      <g fill="#fde047">
        <circle cx="15%" cy="12%" r="1.2" opacity="0.8" />
        <circle cx="32%" cy="24%" r="1.4" opacity="0.85" />
        <circle cx="48%" cy="6%" r="1.1" opacity="0.7" />
        <circle cx="65%" cy="26%" r="1.3" opacity="0.75" />
        <circle cx="85%" cy="6%" r="1.2" opacity="0.75" />
        <circle cx="93%" cy="24%" r="1.4" opacity="0.85" />
        <circle cx="18%" cy="50%" r="1.1" opacity="0.7" />
        <circle cx="36%" cy="38%" r="1.3" opacity="0.8" />
        <circle cx="55%" cy="52%" r="1.4" opacity="0.85" />
        <circle cx="74%" cy="38%" r="1.1" opacity="0.7" />
        <circle cx="90%" cy="48%" r="1.3" opacity="0.8" />
        <circle cx="15%" cy="72%" r="1.4" opacity="0.85" />
        <circle cx="35%" cy="86%" r="1.1" opacity="0.7" />
        <circle cx="54%" cy="70%" r="1.3" opacity="0.75" />
        <circle cx="73%" cy="88%" r="1.4" opacity="0.85" />
        <circle cx="88%" cy="72%" r="1.1" opacity="0.7" />
      </g>

      {/* 4. Orange / Amber Micro-Stars */}
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
    </svg>
  );
}

type ShowcaseDriftingPlanet = {
  id: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  bodyGradient: string;
  boxShadow?: string;
  hasAtmosphere?: boolean;
};

const SHOWCASE_DRIFTING_PLANETS: ShowcaseDriftingPlanet[] = [
  {
    id: "showcase-small-planet-1",
    top: "5%",
    size: 14, // Arctic Cyan Glowing Planet
    duration: "46s",
    delay: "-3s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #e0f2fe 0%, #38bdf8 45%, #0369a1 100%)",
    boxShadow:
      "0 0 16px #38bdf8, 0 0 28px rgba(56, 189, 248, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "showcase-small-planet-2",
    top: "14%",
    size: 11, // Starlight White Glowing Planet
    duration: "52s",
    delay: "-24s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 40%, #cbd5e1 80%, #475569 100%)",
    boxShadow: "0 0 14px #ffffff, 0 0 24px rgba(255, 255, 255, 0.9)",
  },
  {
    id: "showcase-small-planet-3",
    top: "23%",
    size: 15, // Radiant Warm Gold Glowing Planet
    duration: "42s",
    delay: "-12s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #ffffff 0%, #fde047 35%, #eab308 75%, #713f12 100%)",
    boxShadow:
      "0 0 18px #fde047, 0 0 32px rgba(250, 204, 21, 0.9), inset 0 0 6px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "showcase-small-planet-4",
    top: "34%",
    size: 10, // Amber Micro Planet
    duration: "56s",
    delay: "-32s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #fef08a 0%, #f59e0b 50%, #78350f 100%)",
    boxShadow: "0 0 10px rgba(245, 158, 11, 0.5)",
  },
  {
    id: "showcase-small-planet-5",
    top: "44%",
    size: 16, // Mint Emerald Glowing Planet
    duration: "40s",
    delay: "-18s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #ffffff 0%, #f0fdf4 40%, #86efac 80%, #15803d 100%)",
    boxShadow:
      "0 0 18px #4ade80, 0 0 30px rgba(74, 222, 128, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "showcase-small-planet-6",
    top: "55%",
    size: 11, // Teal Micro Planet
    duration: "50s",
    delay: "-8s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #ccfbf1 0%, #2dd4bf 45%, #0f766e 100%)",
    boxShadow: "0 0 14px #2dd4bf, 0 0 24px rgba(45, 212, 191, 0.75)",
  },
  {
    id: "showcase-small-planet-7",
    top: "66%",
    size: 14, // Coral / Orange Glowing Planet
    duration: "44s",
    delay: "-28s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #ffedd5 0%, #fb923c 45%, #9a3412 100%)",
    boxShadow:
      "0 0 16px #fb923c, 0 0 28px rgba(251, 146, 60, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "showcase-small-planet-8",
    top: "76%",
    size: 12, // Slate Micro Planet
    duration: "54s",
    delay: "-15s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #f1f5f9 0%, #94a3b8 50%, #334155 100%)",
    boxShadow: "0 0 10px rgba(148, 163, 184, 0.4)",
  },
  {
    id: "showcase-small-planet-9",
    top: "85%",
    size: 15, // Deep Sky Sapphire Glowing Planet
    duration: "48s",
    delay: "-38s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #bae6fd 0%, #0ea5e9 45%, #075985 100%)",
    boxShadow:
      "0 0 18px #0ea5e9, 0 0 30px rgba(14, 165, 233, 0.85), inset 0 0 5px #ffffff",
    hasAtmosphere: true,
  },
  {
    id: "showcase-small-planet-10",
    top: "93%",
    size: 13, // Rose Ruby Glowing Planet
    duration: "42s",
    delay: "-6s",
    bodyGradient:
      "radial-gradient(circle at 30% 30%, #fecdd3 0%, #f43f5e 45%, #881337 100%)",
    boxShadow: "0 0 16px #f43f5e, 0 0 26px rgba(244, 63, 94, 0.8)",
  },
];

function ShowcaseDriftingPlanets() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
    >
      <style>{`
        @keyframes driftPlanetRightToLeftShowcase {
          0% {
            transform: translateX(calc(100vw + 120px));
          }
          100% {
            transform: translateX(-140px);
          }
        }
      `}</style>
      {SHOWCASE_DRIFTING_PLANETS.map((planet) => (
        <div
          key={planet.id}
          className="absolute left-0 pointer-events-none select-none"
          style={{
            top: planet.top,
            animation: `driftPlanetRightToLeftShowcase ${planet.duration} linear infinite`,
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

function HostPcDevice({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
        isActive
          ? "scale-110 drop-shadow-[0_0_24px_rgba(56,189,248,0.95)]"
          : "drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:scale-105"
      } h-20 sm:h-24`}
    >
      <svg
        aria-hidden="true"
        className="w-16 h-14 sm:w-20 sm:h-16 text-slate-300"
        viewBox="0 0 64 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Monitor Screen Frame */}
        <rect
          x="4"
          y="4"
          width="38"
          height="26"
          rx="3"
          fill="#0b0f19"
          stroke={isActive ? "#38bdf8" : "#475569"}
          strokeWidth="2"
        />
        {/* Screen Display Glass with CLI lines */}
        <rect x="7" y="7" width="32" height="20" rx="1.5" fill="#030712" />
        <line
          x1="10"
          y1="12"
          x2="18"
          y2="12"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="10"
          y1="17"
          x2="28"
          y2="17"
          stroke="#34d399"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="10"
          y1="22"
          x2="22"
          y2="22"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="34" cy="12" r="1.5" fill="#fbbf24" />
        {/* Monitor Stand Neck */}
        <rect x="21" y="30" width="4" height="6" fill="#334155" />
        {/* Monitor Stand Base */}
        <path
          d="M14 36H32"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Desktop PC Tower Beside Monitor */}
        <rect
          x="46"
          y="8"
          width="14"
          height="28"
          rx="2"
          fill="#0f172a"
          stroke={isActive ? "#38bdf8" : "#334155"}
          strokeWidth="1.8"
        />
        {/* Optical Drive / Slot */}
        <line
          x1="49"
          y1="12"
          x2="57"
          y2="12"
          stroke="#64748b"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* USB Ports */}
        <rect x="49" y="16" width="3" height="2" fill="#38bdf8" rx="0.5" />
        <rect x="54" y="16" width="3" height="2" fill="#38bdf8" rx="0.5" />
        {/* Power Button LED */}
        <circle
          cx="53"
          cy="24"
          r="1.8"
          fill={isActive ? "#38bdf8" : "#10b981"}
        />
        {/* Tower Cooling Grilles */}
        <line
          x1="49"
          y1="30"
          x2="57"
          y2="30"
          stroke="#334155"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="49"
          y1="33"
          x2="57"
          y2="33"
          stroke="#334155"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[10px] sm:text-xs font-mono font-bold text-white mt-1">
        PC-1
      </span>
    </div>
  );
}

function SwitchDevice({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
        isActive
          ? "scale-110 drop-shadow-[0_0_24px_rgba(245,158,11,0.95)]"
          : "drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:scale-105"
      } h-20 sm:h-24`}
    >
      <svg
        aria-hidden="true"
        className="w-18 h-12 sm:w-22 sm:h-14 text-slate-300"
        viewBox="0 0 64 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Switch 1U Rackmount Chassis */}
        <rect
          x="3"
          y="7"
          width="58"
          height="22"
          rx="2.5"
          fill="#0b0f19"
          stroke={isActive ? "#fbbf24" : "#475569"}
          strokeWidth="2"
        />
        {/* Left Rack Ears & Mounting Screw Holes */}
        <rect x="3" y="7" width="5" height="22" fill="#1e293b" />
        <circle cx="5.5" cy="11" r="1.2" fill="#475569" />
        <circle cx="5.5" cy="25" r="1.2" fill="#475569" />
        {/* Right Rack Ears & Mounting Screw Holes */}
        <rect x="56" y="7" width="5" height="22" fill="#1e293b" />
        <circle cx="58.5" cy="11" r="1.2" fill="#475569" />
        <circle cx="58.5" cy="25" r="1.2" fill="#475569" />

        {/* 8x RJ45 Port Matrix */}
        <rect
          x="12"
          y="14"
          width="5"
          height="5"
          rx="1"
          fill="#020617"
          stroke="#38bdf8"
          strokeWidth="0.9"
        />
        <rect
          x="19"
          y="14"
          width="5"
          height="5"
          rx="1"
          fill="#020617"
          stroke="#38bdf8"
          strokeWidth="0.9"
        />
        <rect
          x="26"
          y="14"
          width="5"
          height="5"
          rx="1"
          fill="#020617"
          stroke="#fbbf24"
          strokeWidth="0.9"
        />
        <rect
          x="33"
          y="14"
          width="5"
          height="5"
          rx="1"
          fill="#020617"
          stroke="#fbbf24"
          strokeWidth="0.9"
        />
        <rect
          x="40"
          y="14"
          width="5"
          height="5"
          rx="1"
          fill="#020617"
          stroke="#34d399"
          strokeWidth="0.9"
        />

        {/* Port Status Link LEDs */}
        <circle cx="14.5" cy="11" r="1" fill="#38bdf8" />
        <circle cx="21.5" cy="11" r="1" fill="#38bdf8" />
        <circle
          cx="28.5"
          cy="11"
          r="1"
          fill={isActive ? "#fbbf24" : "#475569"}
        />
        <circle
          cx="35.5"
          cy="11"
          r="1"
          fill={isActive ? "#fbbf24" : "#475569"}
        />
        <circle cx="42.5" cy="11" r="1" fill="#34d399" />

        {/* SFP+ Optical Uplink Cage */}
        <rect
          x="48"
          y="13"
          width="5"
          height="7"
          rx="0.8"
          fill="#1e293b"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <circle cx="50.5" cy="10.5" r="0.9" fill="#10b981" />
      </svg>
      <span className="text-[10px] sm:text-xs font-mono font-bold text-white mt-1">
        SW-1
      </span>
    </div>
  );
}

function RouterDevice({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
        isActive
          ? "scale-110 drop-shadow-[0_0_24px_rgba(6,182,212,0.95)]"
          : "drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:scale-105"
      } h-20 sm:h-24`}
    >
      <svg
        aria-hidden="true"
        className="w-18 h-14 sm:w-22 sm:h-16 text-slate-300"
        viewBox="0 0 64 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dual High-Gain Dipole Antennas */}
        <line
          x1="12"
          y1="3"
          x2="16"
          y2="15"
          stroke={isActive ? "#22d3ee" : "#64748b"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="12"
          cy="3"
          r="1.5"
          fill={isActive ? "#22d3ee" : "#94a3b8"}
        />
        <line
          x1="52"
          y1="3"
          x2="48"
          y2="15"
          stroke={isActive ? "#22d3ee" : "#64748b"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="52"
          cy="3"
          r="1.5"
          fill={isActive ? "#22d3ee" : "#94a3b8"}
        />

        {/* Router Main Chassis */}
        <rect
          x="4"
          y="15"
          width="56"
          height="22"
          rx="3"
          fill="#0b0f19"
          stroke={isActive ? "#22d3ee" : "#475569"}
          strokeWidth="2"
        />

        {/* Central Dynamic Routing Symbol */}
        <circle
          cx="32"
          cy="26"
          r="7"
          stroke={isActive ? "#22d3ee" : "#0284c7"}
          strokeWidth="1.5"
          fill="#030712"
        />
        <path
          d="M28 26H36M33 23L36 26L33 29M32 22V30M29 25L32 22L35 25"
          stroke={isActive ? "#22d3ee" : "#38bdf8"}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Front Panel Activity LEDs */}
        <circle cx="11" cy="26" r="1.5" fill="#10b981" />
        <circle cx="16" cy="26" r="1.5" fill="#38bdf8" />
        <circle
          cx="21"
          cy="26"
          r="1.5"
          fill={isActive ? "#22d3ee" : "#475569"}
        />

        {/* Right Side Airflow Vent Slots */}
        <line
          x1="44"
          y1="22"
          x2="54"
          y2="22"
          stroke="#334155"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="44"
          y1="26"
          x2="54"
          y2="26"
          stroke="#334155"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="44"
          y1="30"
          x2="54"
          y2="30"
          stroke="#334155"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[10px] sm:text-xs font-mono font-bold text-white mt-1">
        RTR-GW
      </span>
    </div>
  );
}

function ServerDevice({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
        isActive
          ? "scale-110 drop-shadow-[0_0_24px_rgba(52,211,153,0.95)]"
          : "drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:scale-105"
      } h-20 sm:h-24`}
    >
      <svg
        aria-hidden="true"
        className="w-18 h-13 sm:w-22 sm:h-15 text-slate-300"
        viewBox="0 0 64 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Server 2U Data Center Rack Chassis */}
        <rect
          x="3"
          y="5"
          width="58"
          height="28"
          rx="2.5"
          fill="#0b0f19"
          stroke={isActive ? "#34d399" : "#475569"}
          strokeWidth="2"
        />

        {/* Left Side Rack Handle */}
        <rect x="4" y="9" width="3" height="20" rx="1" fill="#334155" />
        {/* Right Side Rack Handle */}
        <rect x="57" y="9" width="3" height="20" rx="1" fill="#334155" />

        {/* 4x Hot-Swap Enterprise Storage Drive Trays */}
        {/* Drive Bay 1 */}
        <rect
          x="10"
          y="9"
          width="18"
          height="9"
          rx="1"
          fill="#020617"
          stroke="#334155"
          strokeWidth="0.9"
        />
        <circle cx="13" cy="13.5" r="1.2" fill="#10b981" />
        <line
          x1="17"
          y1="13.5"
          x2="25"
          y2="13.5"
          stroke="#475569"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Drive Bay 2 */}
        <rect
          x="10"
          y="20"
          width="18"
          height="9"
          rx="1"
          fill="#020617"
          stroke="#334155"
          strokeWidth="0.9"
        />
        <circle
          cx="13"
          cy="24.5"
          r="1.2"
          fill={isActive ? "#34d399" : "#10b981"}
        />
        <line
          x1="17"
          y1="24.5"
          x2="25"
          y2="24.5"
          stroke="#475569"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Drive Bay 3 */}
        <rect
          x="31"
          y="9"
          width="18"
          height="9"
          rx="1"
          fill="#020617"
          stroke="#334155"
          strokeWidth="0.9"
        />
        <circle cx="34" cy="13.5" r="1.2" fill="#38bdf8" />
        <line
          x1="38"
          y1="13.5"
          x2="46"
          y2="13.5"
          stroke="#475569"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Drive Bay 4 */}
        <rect
          x="31"
          y="20"
          width="18"
          height="9"
          rx="1"
          fill="#020617"
          stroke="#334155"
          strokeWidth="0.9"
        />
        <circle
          cx="34"
          cy="24.5"
          r="1.2"
          fill={isActive ? "#34d399" : "#38bdf8"}
        />
        <line
          x1="38"
          y1="24.5"
          x2="46"
          y2="24.5"
          stroke="#475569"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Master Power & UID Status Indicators */}
        <circle
          cx="52.5"
          cy="13.5"
          r="1.5"
          fill={isActive ? "#34d399" : "#10b981"}
        />
        <circle cx="52.5" cy="24.5" r="1.5" fill="#38bdf8" />
      </svg>
      <span className="text-[10px] sm:text-xs font-mono font-bold text-white mt-1">
        SRV-1
      </span>
    </div>
  );
}

export const SHOWCASE_TABS: { id: ShowcaseTab; label: string }[] = [
  { id: "terminal", label: "Terminal Diagnostik CLI" },
  { id: "subnet", label: "Kalkulator Subnet IPv4" },
  { id: "packet", label: "Visualizer Alur Paket ICMP" },
  { id: "chmod", label: "Kalkulator Permission Linux" },
  { id: "vlan", label: "Segmentasi VLAN & Trunking" },
  { id: "fiber", label: "Power Budget Fiber Optic" },
  { id: "raid", label: "Kalkulator RAID Server" },
  { id: "cctv", label: "Kalkulator NVR & CCTV" },
  { id: "tls", label: "Visualizer Handshake SSL/TLS" },
];

const VISIBLE_TAB_COUNT = 3;

export function LiveSimulatorShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("terminal");
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [tabIndicatorStyle, setTabIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const handlePrevTabs = () => {
    setVisibleStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextTabs = () => {
    setVisibleStartIndex((prev) =>
      Math.min(SHOWCASE_TABS.length - VISIBLE_TAB_COUNT, prev + 1),
    );
  };

  const handleSelectTab = (tabId: ShowcaseTab) => {
    const activeIdx = SHOWCASE_TABS.findIndex((tab) => tab.id === tabId);

    setActiveTab(tabId);
    setVisibleStartIndex((currentStartIndex) => {
      if (activeIdx < currentStartIndex) {
        return activeIdx;
      }

      if (activeIdx >= currentStartIndex + VISIBLE_TAB_COUNT) {
        return activeIdx - VISIBLE_TAB_COUNT + 1;
      }

      return currentStartIndex;
    });
  };

  const visibleTabs = SHOWCASE_TABS.slice(
    visibleStartIndex,
    visibleStartIndex + VISIBLE_TAB_COUNT,
  );

  useEffect(() => {
    const updateIndicator = () => {
      const container = tabContainerRef.current;
      if (!container) return;

      const activeButton = container.querySelector<HTMLButtonElement>(
        `button[data-tab-id="${activeTab}"]`,
      );

      if (activeButton) {
        setTabIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
          opacity: 1,
        });
      } else {
        setTabIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab, visibleStartIndex]);

  // ==========================================
  // 1. TERMINAL STATE
  // ==========================================
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Zenoba OS [Version 2.4.18-simulated]",
    "(c) 2026 Zenoba Corporation. All rights reserved.",
    "",
    "Ketik perintah jaringan atau pilih tombol preset cepat di atas.",
    "Ketik 'help' untuk daftar lengkap perintah diagnostik yang didukung.",
    "",
  ]);
  const [commandInput, setCommandInput] = useState("");
  const [cmdHistoryList, setCmdHistoryList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const result = executeSimulatedCommand(trimmed);

    if (result.clear) {
      setTerminalHistory([]);
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        `C:\\Users\\Guest> ${trimmed}`,
        ...result.output,
        "",
      ]);
    }

    setCmdHistoryList((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);
    setCommandInput("");
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(commandInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistoryList.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, cmdHistoryList.length - 1);
        setHistoryIndex(nextIndex);
        setCommandInput(cmdHistoryList[nextIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCommandInput(cmdHistoryList[nextIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput("");
      }
    }
  };

  useEffect(() => {
    if (activeTab === "terminal" && terminalEndRef.current?.scrollIntoView) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory, activeTab]);

  // ==========================================
  // 2. SUBNET CALCULATOR STATE
  // ==========================================
  const [ipInput, setIpInput] = useState("192.168.10.15");
  const [cidrPrefix, setCidrPrefix] = useState(26);

  const subnetResult = isValidIpv4(ipInput)
    ? calculateSubnetDetails(ipInput, cidrPrefix)
    : null;

  // ==========================================
  // 3. PACKET FLOW SIMULATION STATE
  // ==========================================
  const [packetStep, setPacketStep] = useState<number>(0);
  const [isSimulatingPacket, setIsSimulatingPacket] = useState(false);
  const [packetLogs, setPacketLogs] = useState<string[]>([]);

  const runPacketSimulation = () => {
    if (isSimulatingPacket) return;
    setIsSimulatingPacket(true);
    setPacketStep(1);
    setPacketLogs([
      "[1/5] PC-1 (192.168.1.10) membuat paket ICMP Echo Request ke 10.0.0.5...",
    ]);

    setTimeout(() => {
      setPacketStep(2);
      setPacketLogs((prev) => [
        ...prev,
        "[2/5] Switch memeriksa frame L2 & meneruskan ke Router Gateway (192.168.1.1)...",
      ]);
    }, 900);

    setTimeout(() => {
      setPacketStep(3);
      setPacketLogs((prev) => [
        ...prev,
        "[3/5] Router mengevaluasi routing table, melakukan NAT, & meneruskan ke Server (10.0.0.5)...",
      ]);
    }, 1800);

    setTimeout(() => {
      setPacketStep(4);
      setPacketLogs((prev) => [
        ...prev,
        "[4/5] Server menerima ICMP Echo & membuat balasan ICMP Echo Reply...",
      ]);
    }, 2700);

    setTimeout(() => {
      setPacketStep(5);
      setPacketLogs((prev) => [
        ...prev,
        "[5/5] Sukses! PC-1 menerima balasan ICMP Echo Reply (RTT: 4ms, TTL: 64).",
      ]);
      setIsSimulatingPacket(false);
    }, 3600);
  };

  const resetPacketSimulation = () => {
    setPacketStep(0);
    setIsSimulatingPacket(false);
    setPacketLogs([]);
  };

  // ==========================================
  // 4. LINUX CHMOD PERMISSION STATE
  // ==========================================
  const [permOwner, setPermOwner] = useState({ r: true, w: true, x: true });
  const [permGroup, setPermGroup] = useState({ r: true, w: false, x: true });
  const [permOthers, setPermOthers] = useState({ r: true, w: false, x: true });
  const [testRole, setTestRole] = useState<"owner" | "group" | "others">(
    "group",
  );
  const [testAction, setTestAction] = useState<"read" | "write" | "execute">(
    "write",
  );

  const calcOctal = (p: { r: boolean; w: boolean; x: boolean }) =>
    (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);

  const chmodOctal = `${calcOctal(permOwner)}${calcOctal(permGroup)}${calcOctal(permOthers)}`;
  const chmodSymbol = `-${permOwner.r ? "r" : "-"}${permOwner.w ? "w" : "-"}${permOwner.x ? "x" : "-"}${permGroup.r ? "r" : "-"}${permGroup.w ? "w" : "-"}${permGroup.x ? "x" : "-"}${permOthers.r ? "r" : "-"}${permOthers.w ? "w" : "-"}${permOthers.x ? "x" : "-"}`;

  const getTestResult = () => {
    const roleObj =
      testRole === "owner"
        ? permOwner
        : testRole === "group"
          ? permGroup
          : permOthers;
    const isAllowed =
      testAction === "read"
        ? roleObj.r
        : testAction === "write"
          ? roleObj.w
          : roleObj.x;
    return isAllowed;
  };

  const applyChmodPreset = (o: number, g: number, ot: number) => {
    setPermOwner({ r: (o & 4) !== 0, w: (o & 2) !== 0, x: (o & 1) !== 0 });
    setPermGroup({ r: (g & 4) !== 0, w: (g & 2) !== 0, x: (g & 1) !== 0 });
    setPermOthers({ r: (ot & 4) !== 0, w: (ot & 2) !== 0, x: (ot & 1) !== 0 });
  };

  // ==========================================
  // 5. VLAN SEGMENTATION & TRUNKING STATE
  // ==========================================
  const [portVlans, setPortVlans] = useState<number[]>([
    10, 10, 10, 10, 20, 20, 20, 99,
  ]);
  const [vlanSourcePort, setVlanSourcePort] = useState(1);
  const [vlanTargetPort, setVlanTargetPort] = useState(2);
  const [isRouterOnStick, setIsRouterOnStick] = useState(false);
  const [vlanTestResult, setVlanTestResult] = useState<string | null>(null);

  const handleVlanPing = () => {
    const srcVlan = portVlans[vlanSourcePort - 1];
    const tgtVlan = portVlans[vlanTargetPort - 1];

    if (vlanSourcePort === vlanTargetPort) {
      setVlanTestResult(
        "Loopback: Port mengirim paket ke dirinya sendiri (Berhasil).",
      );
      return;
    }

    if (srcVlan === tgtVlan) {
      setVlanTestResult(
        `Sukses: Port ${vlanSourcePort} dan Port ${vlanTargetPort} berada di VLAN ${srcVlan} yang sama. Frame L2 diteruskan switch secara langsung!`,
      );
    } else if (isRouterOnStick) {
      setVlanTestResult(
        `Sukses (Inter-VLAN): Paket dari Port ${vlanSourcePort} (VLAN ${srcVlan}) dirutekan oleh Router-on-a-Stick via sub-interface ke Port ${vlanTargetPort} (VLAN ${tgtVlan})!`,
      );
    } else {
      setVlanTestResult(
        `Ditolak (Isolasi): Port ${vlanSourcePort} (VLAN ${srcVlan}) dan Port ${vlanTargetPort} (VLAN ${tgtVlan}) berbeda broadcast domain. Switch membuang frame karena tidak ada Inter-VLAN Routing!`,
      );
    }
  };

  // ==========================================
  // 6. FIBER OPTIC POWER BUDGET STATE
  // ==========================================
  const [fiberKm, setFiberKm] = useState(12);
  const [splicePoints, setSplicePoints] = useState(4);
  const [connectorPoints, setConnectorPoints] = useState(2);
  const [oltTxPower, setOltTxPower] = useState(3.0);

  const fiberLossPerKm = 0.35; // 1310nm standard single-mode
  const spliceLossPerPoint = 0.1;
  const connectorLossPerPoint = 0.5;
  const safetyMargin = 2.0;

  const totalFiberLoss =
    fiberKm * fiberLossPerKm +
    splicePoints * spliceLossPerPoint +
    connectorPoints * connectorLossPerPoint +
    safetyMargin;

  const opmRxPower = oltTxPower - totalFiberLoss;

  const getFiberStatus = () => {
    if (opmRxPower >= -20) {
      return {
        text: "Sempurna (Koneksi Prima)",
        color: "text-emerald-400",
        bg: "bg-emerald-950/60 border-emerald-500/40",
      };
    }
    if (opmRxPower >= -24.5) {
      return {
        text: "Standar Layak (SOP ISP)",
        color: "text-sky-300",
        bg: "bg-sky-950/60 border-sky-500/40",
      };
    }
    return {
      text: "Kritis / Redaman Drop (Loss Tinggi)",
      color: "text-rose-400",
      bg: "bg-rose-950/60 border-rose-500/40",
    };
  };

  // ==========================================
  // 7. RAID SERVER CALCULATOR STATE
  // ==========================================
  const [raidLevel, setRaidLevel] = useState<"0" | "1" | "5" | "6" | "10">("5");
  const [raidDiskCount, setRaidDiskCount] = useState(4);
  const [raidDiskSizeTb, setRaidDiskSizeTb] = useState(4);

  const getRaidSpecs = () => {
    const count = raidDiskCount;
    const size = raidDiskSizeTb;
    switch (raidLevel) {
      case "0":
        return {
          usable: count * size,
          parity: 0,
          tolerance: "0 disk (Tidak ada proteksi)",
          speed: `${count}x Read & Write`,
        };
      case "1":
        return {
          usable: size,
          parity: (count - 1) * size,
          tolerance: `${count - 1} disk`,
          speed: `${count}x Read, 1x Write`,
        };
      case "5":
        return {
          usable: (count - 1) * size,
          parity: 1 * size,
          tolerance: "1 disk",
          speed: `${count - 1}x Read & Write`,
        };
      case "6":
        return {
          usable: Math.max(0, (count - 2) * size),
          parity: 2 * size,
          tolerance: "2 disk bersamaan",
          speed: `${count - 2}x Read & Write`,
        };
      case "10":
        return {
          usable: (count / 2) * size,
          parity: (count / 2) * size,
          tolerance: "1 disk per sub-mirror",
          speed: `${count}x Read, ${(count / 2).toFixed(0)}x Write`,
        };
    }
  };

  // ==========================================
  // 8. CCTV NVR & BANDWIDTH STATE
  // ==========================================
  const [cctvCount, setCctvCount] = useState(8);
  const [cctvRes, setCctvRes] = useState<"1080p" | "2k" | "4k">("1080p");
  const [cctvCodec, setCctvCodec] = useState<"h264" | "h265">("h265");
  const [cctvDays, setCctvDays] = useState(30);

  const baseBitrateMbps =
    cctvRes === "1080p" ? 2.5 : cctvRes === "2k" ? 4.5 : 8.0;
  const effectiveBitrateMbps =
    cctvCodec === "h265" ? baseBitrateMbps * 0.5 : baseBitrateMbps;
  const totalCctvThroughputMbps = (cctvCount * effectiveBitrateMbps).toFixed(1);
  const totalStorageNvrTb = (
    (cctvCount * effectiveBitrateMbps * 3600 * 24 * cctvDays) /
    8 /
    1000 /
    1000
  ).toFixed(2);

  // ==========================================
  // 9. SSL/TLS HANDSHAKE STATE
  // ==========================================
  const [tlsStep, setTlsStep] = useState(1);

  return (
    <section
      id="simulator-showcase"
      aria-labelledby="simulator-showcase-title"
      className="relative isolate overflow-hidden bg-[#030308] px-4 sm:px-8 lg:px-16 py-20 sm:py-28 text-white scroll-mt-16"
    >
      {/* Deep Cosmic Black Ambient Glow & Dense Micro-Star Ornaments */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.25)_0%,transparent_75%)] z-0" />
      <ShowcaseStarField />
      <ShowcaseDriftingPlanets />

      <div className="relative z-20 mx-auto max-w-6xl">
        {/* Sliding Tab Switcher Pill with < and > controls (Max 3 visible at a time) */}
        <div className="flex items-center justify-center gap-2 mb-8 select-none">
          <button
            type="button"
            onClick={handlePrevTabs}
            disabled={visibleStartIndex === 0}
            aria-label="Geser tab simulator ke kiri"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-800 bg-[#18181f]/95 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
          >
            <span className="font-bold text-sm sm:text-base leading-none">
              ‹
            </span>
          </button>

          <div
            ref={tabContainerRef}
            role="tablist"
            aria-label="Pilihan simulator interaktif"
            className="relative inline-flex items-center rounded-full bg-[#18181f]/95 p-1.5 border border-slate-800/90 shadow-inner backdrop-blur-md gap-1"
          >
            {/* Smooth Sliding Active Pill Indicator */}
            {tabIndicatorStyle.opacity > 0 && (
              <div
                aria-hidden="true"
                className="absolute left-0 top-1.5 bottom-1.5 rounded-full bg-[#35353d] shadow-md shadow-black/40 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
                style={{
                  transform: `translateX(${tabIndicatorStyle.left}px)`,
                  width: `${tabIndicatorStyle.width}px`,
                  opacity: tabIndicatorStyle.opacity,
                }}
              />
            )}

            {visibleTabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`simulator-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  data-tab-id={tab.id}
                  aria-selected={isSelected}
                  aria-controls={`simulator-panel-${tab.id}`}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`relative z-10 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white select-none whitespace-nowrap ${
                    isSelected
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextTabs}
            disabled={
              visibleStartIndex >= SHOWCASE_TABS.length - VISIBLE_TAB_COUNT
            }
            aria-label="Geser tab simulator ke kanan"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-800 bg-[#18181f]/95 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
          >
            <span className="font-bold text-sm sm:text-base leading-none">
              ›
            </span>
          </button>
        </div>

        {/* Header Title & Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2
            id="simulator-showcase-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Uji Coba Simulator Jaringan & IT <br className="hidden sm:inline" />
            <span className="text-sky-400">Langsung di Web Tanpa Setup</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Eksplorasi kalkulator, visualizer protokol, diagnostik terminal CLI,
            hingga simulasi infrastruktur IT riil dengan kalkulasi deterministik
            presisi.
          </p>
        </div>

        <div
          id={`simulator-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`simulator-tab-${activeTab}`}
        >
          {/* ========================================================================= */}
          {/* TAB 1: TERMINAL DIAGNOSTIK CLI                                            */}
          {/* ========================================================================= */}
          {activeTab === "terminal" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
              {/* Terminal Window Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs font-medium text-slate-400">
                    guest@zenoba-simulator:~ (CLI Interactive)
                  </span>
                </div>
                <span className="rounded bg-sky-950/80 border border-sky-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-400">
                  Simulated Sandbox
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="border-b border-slate-800/80 bg-slate-900/40 px-4 py-2.5 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-slate-400 mr-1">
                  Preset Cepat:
                </span>
                {PRESET_COMMANDS.map((item) => (
                  <button
                    key={item.cmd}
                    type="button"
                    onClick={() => runCommand(item.cmd)}
                    className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-sky-950/80 text-sky-300 hover:text-sky-200 border border-slate-700 hover:border-sky-500/60 transition-all cursor-pointer"
                    title={item.desc}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Terminal Screen Body */}
              <div
                className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-200 h-80 sm:h-96 overflow-y-auto space-y-1 select-text bg-[#07090e]"
                onClick={() => inputRef.current?.focus()}
              >
                {terminalHistory.map((line, idx) => (
                  <div
                    key={idx}
                    className="whitespace-pre-wrap leading-relaxed"
                  >
                    {line.startsWith("C:\\Users\\Guest>") ? (
                      <span className="text-amber-400 font-bold">{line}</span>
                    ) : line.includes("Pinging") ||
                      line.includes("Reply from") ? (
                      <span className="text-sky-300">{line}</span>
                    ) : line.includes("Ping statistics") ||
                      line.includes("Approximate") ? (
                      <span className="text-emerald-400">{line}</span>
                    ) : line.includes("Perintah tidak dikenali") ? (
                      <span className="text-rose-400">{line}</span>
                    ) : (
                      <span className="text-slate-300">{line}</span>
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Interactive Terminal Input Line */}
              <form
                onSubmit={handleTerminalSubmit}
                className="flex items-center gap-2 border-t border-slate-800 bg-slate-900/80 px-4 py-3"
              >
                <span className="font-mono text-xs sm:text-sm font-bold text-sky-400">
                  guest@zenoba:&gt;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik perintah (contoh: ping 192.168.1.1, ipconfig, arp -a, help)..."
                  className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  aria-label="Input Perintah Terminal Simulator"
                  autoComplete="off"
                  spellCheck="false"
                />
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Kirim
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SUBNET CALCULATOR & VISUALIZER                                     */}
          {/* ========================================================================= */}
          {activeTab === "subnet" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Form Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label
                      htmlFor="ip-address-input"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                    >
                      Alamat IPv4
                    </label>
                    <input
                      id="ip-address-input"
                      type="text"
                      value={ipInput}
                      onChange={(e) => setIpInput(e.target.value)}
                      placeholder="Contoh: 192.168.1.1"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label
                        htmlFor="cidr-slider"
                        className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
                      >
                        Prefix CIDR:{" "}
                        <span className="font-mono text-sky-400 text-sm">
                          /{cidrPrefix}
                        </span>
                      </label>
                      <span className="font-mono text-xs text-slate-400">
                        {Math.pow(2, 32 - cidrPrefix)} Total IP
                      </span>
                    </div>
                    <input
                      id="cidr-slider"
                      type="range"
                      min="8"
                      max="30"
                      value={cidrPrefix}
                      onChange={(e) => setCidrPrefix(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>/8 (Class A)</span>
                      <span>/16 (Class B)</span>
                      <span>/24 (Class C)</span>
                      <span>/30 (PTP)</span>
                    </div>
                  </div>

                  {/* Preset Subnet Buttons */}
                  <div className="pt-2">
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Preset Praktik Cepat:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIpInput("192.168.1.100");
                          setCidrPrefix(24);
                        }}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 transition-colors cursor-pointer"
                      >
                        Class C (/24)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIpInput("10.0.0.1");
                          setCidrPrefix(26);
                        }}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 transition-colors cursor-pointer"
                      >
                        Private Subnet (/26)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Calculated Results */}
                <div className="lg:col-span-7">
                  {subnetResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                          <div className="text-[11px] text-slate-400 font-medium">
                            Network Address
                          </div>
                          <div className="font-mono text-sm font-bold text-sky-300 mt-1">
                            {subnetResult.networkAddress}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                          <div className="text-[11px] text-slate-400 font-medium">
                            Broadcast Address
                          </div>
                          <div className="font-mono text-sm font-bold text-sky-300 mt-1">
                            {subnetResult.broadcastAddress}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 col-span-2 sm:col-span-1">
                          <div className="text-[11px] text-slate-400 font-medium">
                            Subnet Mask
                          </div>
                          <div className="font-mono text-sm font-bold text-amber-300 mt-1">
                            {subnetResult.subnetMask}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-slate-400 font-medium">
                            Rentang Host yang Dapat Dipakai
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                            {subnetResult.usableHosts} Host Tersedia
                          </span>
                        </div>
                        <div className="font-mono text-sm font-bold text-emerald-300">
                          {subnetResult.firstUsableHost} —{" "}
                          {subnetResult.lastUsableHost}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                      Masukkan alamat IPv4 yang valid untuk melihat kalkulasi
                      subnet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PACKET FLOW & ICMP PING SIMULATION                                  */}
          {/* ========================================================================= */}
          {activeTab === "packet" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in duration-200">
              {/* Visual Topology Map */}
              <div className="relative py-10 px-2 sm:px-6">
                <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-gradient-to-r from-sky-500/40 via-amber-500/40 to-emerald-500/40 z-0" />

                <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-4 text-center">
                  {/* Node 1: PC Host */}
                  <div className="flex flex-col items-center">
                    <HostPcDevice
                      isActive={packetStep === 1 || packetStep === 5}
                    />
                    <span className="text-[11px] font-mono text-slate-300 font-bold mt-2">
                      192.168.1.10
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Source Host
                    </span>
                  </div>

                  {/* Node 2: Switch */}
                  <div className="flex flex-col items-center">
                    <SwitchDevice isActive={packetStep === 2} />
                    <span className="text-[11px] font-mono text-slate-300 font-bold mt-2">
                      VLAN 10
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Layer 2 Switch
                    </span>
                  </div>

                  {/* Node 3: Gateway Router */}
                  <div className="flex flex-col items-center">
                    <RouterDevice isActive={packetStep === 3} />
                    <span className="text-[11px] font-mono text-slate-300 font-bold mt-2">
                      192.168.1.1
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Default Gateway
                    </span>
                  </div>

                  {/* Node 4: Target Server */}
                  <div className="flex flex-col items-center">
                    <ServerDevice isActive={packetStep === 4} />
                    <span className="text-[11px] font-mono text-slate-300 font-bold mt-2">
                      10.0.0.5
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Target Server
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 my-6">
                <button
                  type="button"
                  onClick={runPacketSimulation}
                  disabled={isSimulatingPacket}
                  className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  {isSimulatingPacket
                    ? "Mentransmisikan Paket..."
                    : "Kirim Ping (ICMP Echo Request)"}
                </button>
                <button
                  type="button"
                  onClick={resetPacketSimulation}
                  disabled={isSimulatingPacket || packetLogs.length === 0}
                  className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Reset Alur
                </button>
              </div>

              {/* Real-time Transmission Event Logs */}
              <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 font-mono text-xs text-slate-300 min-h-[110px] space-y-1.5">
                <div className="text-slate-500 text-[11px] font-sans font-semibold uppercase mb-1">
                  Log Transmisi Protokol:
                </div>
                {packetLogs.length === 0 ? (
                  <div className="text-slate-500 italic">
                    Klik tombol &apos;Kirim Ping&apos; di atas untuk melihat
                    bagaimana paket ICMP dan routing bergerak melintasi layer
                    jaringan.
                  </div>
                ) : (
                  packetLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.includes("Sukses")
                          ? "text-emerald-400 font-bold"
                          : "text-sky-300"
                      }
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: LINUX CHMOD PERMISSION CALCULATOR & TESTER                           */}
          {/* ========================================================================= */}
          {activeTab === "chmod" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Permission Checkboxes */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {/* Owner */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2">
                      <div className="text-xs font-bold text-sky-300 uppercase">
                        Owner (u)
                      </div>
                      <div className="text-xl font-mono font-bold text-white">
                        {calcOctal(permOwner)}
                      </div>
                      <div className="space-y-1.5 text-left text-xs font-mono">
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permOwner.r}
                            onChange={(e) =>
                              setPermOwner({
                                ...permOwner,
                                r: e.target.checked,
                              })
                            }
                            className="accent-sky-500"
                          />
                          Read (4)
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permOwner.w}
                            onChange={(e) =>
                              setPermOwner({
                                ...permOwner,
                                w: e.target.checked,
                              })
                            }
                            className="accent-sky-500"
                          />
                          Write (2)
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permOwner.x}
                            onChange={(e) =>
                              setPermOwner({
                                ...permOwner,
                                x: e.target.checked,
                              })
                            }
                            className="accent-sky-500"
                          />
                          Exec (1)
                        </label>
                      </div>
                    </div>

                    {/* Group */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2">
                      <div className="text-xs font-bold text-amber-300 uppercase">
                        Group (g)
                      </div>
                      <div className="text-xl font-mono font-bold text-white">
                        {calcOctal(permGroup)}
                      </div>
                      <div className="space-y-1.5 text-left text-xs font-mono">
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permGroup.r}
                            onChange={(e) =>
                              setPermGroup({
                                ...permGroup,
                                r: e.target.checked,
                              })
                            }
                            className="accent-amber-500"
                          />
                          Read (4)
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permGroup.w}
                            onChange={(e) =>
                              setPermGroup({
                                ...permGroup,
                                w: e.target.checked,
                              })
                            }
                            className="accent-amber-500"
                          />
                          Write (2)
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permGroup.x}
                            onChange={(e) =>
                              setPermGroup({
                                ...permGroup,
                                x: e.target.checked,
                              })
                            }
                            className="accent-amber-500"
                          />
                          Exec (1)
                        </label>
                      </div>
                    </div>

                    {/* Others */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2">
                      <div className="text-xs font-bold text-emerald-300 uppercase">
                        Others (o)
                      </div>
                      <div className="text-xl font-mono font-bold text-white">
                        {calcOctal(permOthers)}
                      </div>
                      <div className="space-y-1.5 text-left text-xs font-mono">
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permOthers.r}
                            onChange={(e) =>
                              setPermOthers({
                                ...permOthers,
                                r: e.target.checked,
                              })
                            }
                            className="accent-emerald-500"
                          />
                          Read (4)
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permOthers.w}
                            onChange={(e) =>
                              setPermOthers({
                                ...permOthers,
                                w: e.target.checked,
                              })
                            }
                            className="accent-emerald-500"
                          />
                          Write (2)
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permOthers.x}
                            onChange={(e) =>
                              setPermOthers({
                                ...permOthers,
                                x: e.target.checked,
                              })
                            }
                            className="accent-emerald-500"
                          />
                          Exec (1)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Preset Chmod */}
                  <div className="pt-1">
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Preset Linux Standar:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyChmodPreset(7, 5, 5)}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 transition-colors cursor-pointer"
                      >
                        755 (Exec Script)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyChmodPreset(6, 4, 4)}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 transition-colors cursor-pointer"
                      >
                        644 (File Web/Config)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyChmodPreset(7, 0, 0)}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 transition-colors cursor-pointer"
                      >
                        700 (Private Key SSH)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyChmodPreset(7, 7, 7)}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-rose-300 transition-colors cursor-pointer"
                      >
                        777 (Full Open / Unsafe)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Output Command & Permission Tester */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                    <div className="text-xs text-slate-400 mb-1">
                      Perintah Terminal & Notasi Simbolik:
                    </div>
                    <div className="font-mono text-base font-bold text-sky-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                      <span>chmod {chmodOctal} script.sh</span>
                      <span className="text-xs text-amber-300">
                        {chmodSymbol}
                      </span>
                    </div>
                  </div>

                  {/* Live Permission Simulator Tester */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Uji Izin Akses Pengguna (*Permission Tester*):
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">
                          User Role:
                        </label>
                        <select
                          value={testRole}
                          onChange={(e) =>
                            setTestRole(
                              e.target.value as "owner" | "group" | "others",
                            )
                          }
                          className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                        >
                          <option value="owner">Owner (admin / root)</option>
                          <option value="group">
                            Group (www-data / staff)
                          </option>
                          <option value="others">
                            Others (guest / public)
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">
                          Aksi yang Dicoba:
                        </label>
                        <select
                          value={testAction}
                          onChange={(e) =>
                            setTestAction(
                              e.target.value as "read" | "write" | "execute",
                            )
                          }
                          className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                        >
                          <option value="read">
                            Read (Membaca file / cat)
                          </option>
                          <option value="write">
                            Write (Mengedit / menghapus)
                          </option>
                          <option value="execute">
                            Execute (Menjalankan script)
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div
                        className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between ${
                          getTestResult()
                            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                            : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                        }`}
                      >
                        <span>
                          Status:{" "}
                          {getTestResult()
                            ? "Akses Diizinkan (Permitted)"
                            : "Akses Ditolak (Permission Denied)"}
                        </span>
                        <span className="font-mono text-[11px]">
                          {getTestResult() ? "Exit Code: 0" : "Exit Code: 1"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: VLAN SEGMENTATION & TRUNKING                                        */}
          {/* ========================================================================= */}
          {activeTab === "vlan" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in duration-200">
              <div className="space-y-6">
                {/* Switch Ports Visualization */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Panel Port Switch 8-Port (Manageable Layer 2):
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-sky-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-500 inline-block" />{" "}
                        VLAN 10 (Siswa)
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />{" "}
                        VLAN 20 (Guru)
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />{" "}
                        Trunk (802.1Q)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {portVlans.map((vlan, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          vlan === 10
                            ? "bg-sky-950/40 border-sky-500/50 text-sky-300"
                            : vlan === 20
                              ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                              : "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                        }`}
                      >
                        <div className="text-[10px] font-mono text-slate-400">
                          Port {idx + 1}
                        </div>
                        <div className="text-xs font-bold font-mono mt-1">
                          {vlan === 99 ? "Trunk" : `VLAN ${vlan}`}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newVlans = [...portVlans];
                            newVlans[idx] =
                              vlan === 10 ? 20 : vlan === 20 ? 99 : 10;
                            setPortVlans(newVlans);
                          }}
                          className="mt-2 text-[10px] underline hover:text-white cursor-pointer"
                        >
                          Ubah
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inter-VLAN Ping Tester */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">Kirim Frame dari:</span>
                      <select
                        value={vlanSourcePort}
                        onChange={(e) =>
                          setVlanSourcePort(Number(e.target.value))
                        }
                        className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200"
                      >
                        {portVlans.map((_, i) => (
                          <option key={i} value={i + 1}>
                            Port {i + 1} (VLAN{" "}
                            {portVlans[i] === 99 ? "Trunk" : portVlans[i]})
                          </option>
                        ))}
                      </select>

                      <span className="text-slate-400">Menuju ke:</span>
                      <select
                        value={vlanTargetPort}
                        onChange={(e) =>
                          setVlanTargetPort(Number(e.target.value))
                        }
                        className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200"
                      >
                        {portVlans.map((_, i) => (
                          <option key={i} value={i + 1}>
                            Port {i + 1} (VLAN{" "}
                            {portVlans[i] === 99 ? "Trunk" : portVlans[i]})
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRouterOnStick}
                        onChange={(e) => setIsRouterOnStick(e.target.checked)}
                        className="accent-sky-500"
                      />
                      Aktifkan Router-on-a-Stick (Inter-VLAN Routing)
                    </label>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleVlanPing}
                      className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
                    >
                      Uji Transmisi VLAN Frame
                    </button>
                  </div>

                  {vlanTestResult && (
                    <div
                      className={`p-3 rounded-lg border text-xs font-mono ${
                        vlanTestResult.startsWith("Sukses")
                          ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                          : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                      }`}
                    >
                      {vlanTestResult}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: FIBER OPTIC POWER BUDGET CALCULATOR                                 */}
          {/* ========================================================================= */}
          {activeTab === "fiber" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-300">
                        Panjang Kabel Fiber Optik (km):
                      </label>
                      <span className="font-mono text-sky-400 font-bold">
                        {fiberKm} km
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={fiberKm}
                      onChange={(e) => setFiberKm(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-300">
                        Jumlah Titik Sambungan (Fusion Splice @0.1 dB):
                      </label>
                      <span className="font-mono text-amber-400 font-bold">
                        {splicePoints} titik
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={splicePoints}
                      onChange={(e) => setSplicePoints(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-300">
                        Jumlah Pasang Konektor SC/LC (@0.5 dB):
                      </label>
                      <span className="font-mono text-emerald-400 font-bold">
                        {connectorPoints} pasang
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={connectorPoints}
                      onChange={(e) =>
                        setConnectorPoints(Number(e.target.value))
                      }
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">
                      Daya Pancar Transmitter OLT (dBm):
                    </label>
                    <input
                      type="number"
                      value={oltTxPower}
                      onChange={(e) => setOltTxPower(Number(e.target.value))}
                      step="0.5"
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2 font-mono text-slate-200"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Total Redaman (Optical Loss)
                      </div>
                      <div className="font-mono text-2xl font-bold text-amber-300 mt-1">
                        {totalFiberLoss.toFixed(2)} dB
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Termasuk Safety Margin 2.0 dB
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Estimasi Nilai OPM Penerima (Rx)
                      </div>
                      <div className="font-mono text-2xl font-bold text-sky-400 mt-1">
                        {opmRxPower.toFixed(2)} dBm
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Standar OPM ONU / ONT
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${getFiberStatus().bg} space-y-1`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-300 font-semibold">
                        Status Kelayakan Sinyal Optik:
                      </span>
                      <span
                        className={`text-xs font-bold font-mono ${getFiberStatus().color}`}
                      >
                        {getFiberStatus().text}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                      Redaman ideal untuk layanan GPON/FTTH berada di antara -15
                      dBm s/d -24 dBm. Jika daya terima turun di bawah -27 dBm,
                      sinyal mengalami LOS (Loss of Signal) dan paket data
                      rentan drop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: RAID SERVER STORAGE CALCULATOR                                      */}
          {/* ========================================================================= */}
          {activeTab === "raid" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Tipe Level RAID:
                    </label>
                    <select
                      value={raidLevel}
                      onChange={(e) => {
                        const lvl = e.target.value as
                          "0" | "1" | "5" | "6" | "10";
                        setRaidLevel(lvl);
                        if (lvl === "5" && raidDiskCount < 3)
                          setRaidDiskCount(3);
                        if (lvl === "6" && raidDiskCount < 4)
                          setRaidDiskCount(4);
                        if (lvl === "10" && raidDiskCount % 2 !== 0)
                          setRaidDiskCount(4);
                      }}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2.5 text-slate-200 font-bold"
                    >
                      <option value="0">
                        RAID 0 — Striping (Performa Tinggi, No Redundancy)
                      </option>
                      <option value="1">
                        RAID 1 — Mirroring (Kloning Penuh, Aman)
                      </option>
                      <option value="5">
                        RAID 5 — Distributed Parity (Efisien & Populer)
                      </option>
                      <option value="6">
                        RAID 6 — Dual Parity (Tahan 2 Disk Mati)
                      </option>
                      <option value="10">
                        RAID 10 — 1+0 Stripe of Mirrors (Performa & Keamanan)
                      </option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-300">
                        Jumlah Harddisk (HDD/SSD):
                      </label>
                      <span className="font-mono text-sky-400 font-bold">
                        {raidDiskCount} unit
                      </span>
                    </div>
                    <input
                      type="range"
                      min={
                        raidLevel === "6" ? "4" : raidLevel === "5" ? "3" : "2"
                      }
                      max="8"
                      step={raidLevel === "10" ? "2" : "1"}
                      value={raidDiskCount}
                      onChange={(e) => setRaidDiskCount(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Kapasitas Per Disk (TB):
                    </label>
                    <select
                      value={raidDiskSizeTb}
                      onChange={(e) =>
                        setRaidDiskSizeTb(Number(e.target.value))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2 text-slate-200"
                    >
                      <option value="1">1 TB</option>
                      <option value="2">2 TB</option>
                      <option value="4">4 TB</option>
                      <option value="8">8 TB</option>
                      <option value="16">16 TB</option>
                    </select>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Kapasitas Bersih Usable
                      </div>
                      <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">
                        {getRaidSpecs().usable} TB
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Dapat ditulis data
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Kapasitas Redundansi / Parity
                      </div>
                      <div className="font-mono text-2xl font-bold text-amber-400 mt-1">
                        {getRaidSpecs().parity} TB
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Proteksi data cadangan
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-300">
                      <span className="text-slate-400">
                        Toleransi Kegagalan:
                      </span>
                      <span className="font-bold text-sky-300">
                        {getRaidSpecs().tolerance}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-300">
                      <span className="text-slate-400">
                        Performa Kecepatan:
                      </span>
                      <span className="font-bold text-emerald-300">
                        {getRaidSpecs().speed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: CCTV NVR STORAGE & BANDWIDTH CALCULATOR                             */}
          {/* ========================================================================= */}
          {activeTab === "cctv" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-300">
                        Jumlah Kamera IP CCTV:
                      </label>
                      <span className="font-mono text-sky-400 font-bold">
                        {cctvCount} unit
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="32"
                      value={cctvCount}
                      onChange={(e) => setCctvCount(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Resolusi Kamera:
                    </label>
                    <select
                      value={cctvRes}
                      onChange={(e) =>
                        setCctvRes(e.target.value as "1080p" | "2k" | "4k")
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2 text-slate-200"
                    >
                      <option value="1080p">
                        1080p FHD (Full HD ~ 2.5 Mbps)
                      </option>
                      <option value="2k">2K QHD (Quad HD ~ 4.5 Mbps)</option>
                      <option value="4k">4K UHD (Ultra HD ~ 8.0 Mbps)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Format Kompresi Video:
                    </label>
                    <select
                      value={cctvCodec}
                      onChange={(e) =>
                        setCctvCodec(e.target.value as "h264" | "h265")
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2 text-slate-200"
                    >
                      <option value="h265">
                        H.265 / HEVC (Hemat 50% Storage & Bitrate)
                      </option>
                      <option value="h264">H.264 / AVC (Standar Klasik)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-300">
                        Durasi Penyimpanan Rekaman:
                      </label>
                      <span className="font-mono text-amber-400 font-bold">
                        {cctvDays} Hari
                      </span>
                    </div>
                    <input
                      type="range"
                      min="7"
                      max="60"
                      step="7"
                      value={cctvDays}
                      onChange={(e) => setCctvDays(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Estimasi Kebutuhan HDD NVR
                      </div>
                      <div className="font-mono text-2xl font-bold text-sky-400 mt-1">
                        {totalStorageNvrTb} TB
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Rekaman kontinu 24/7
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Total Throughput Bandwidth LAN
                      </div>
                      <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">
                        {totalCctvThroughputMbps} Mbps
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Trafik switch POE
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-300">
                      <span className="text-slate-400">
                        Bitrate per Kamera:
                      </span>
                      <span className="font-bold">
                        {effectiveBitrateMbps.toFixed(2)} Mbps
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-300">
                      <span className="text-slate-400">
                        Rekomendasi Port POE:
                      </span>
                      <span className="font-bold text-sky-300">
                        Switch Gigabit POE+ (IEEE 802.3at)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: SSL/TLS HANDSHAKE VISUALIZER                                        */}
          {/* ========================================================================= */}
          {activeTab === "tls" && (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in duration-200">
              <div className="space-y-6">
                {/* Stepper Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => setTlsStep(1)}
                    className={`p-2.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                      tlsStep === 1
                        ? "bg-sky-950 border-sky-400 text-sky-300"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                    }`}
                  >
                    1. Client Hello
                  </button>
                  <button
                    type="button"
                    onClick={() => setTlsStep(2)}
                    className={`p-2.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                      tlsStep === 2
                        ? "bg-sky-950 border-sky-400 text-sky-300"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                    }`}
                  >
                    2. Server Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => setTlsStep(3)}
                    className={`p-2.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                      tlsStep === 3
                        ? "bg-sky-950 border-sky-400 text-sky-300"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                    }`}
                  >
                    3. Key Exchange
                  </button>
                  <button
                    type="button"
                    onClick={() => setTlsStep(4)}
                    className={`p-2.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                      tlsStep === 4
                        ? "bg-emerald-950 border-emerald-400 text-emerald-300"
                        : "bg-slate-900/60 border-slate-800 text-slate-400"
                    }`}
                  >
                    4. Secure Session
                  </button>
                </div>

                {/* Step Detail Card */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
                  {tlsStep === 1 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-sky-400 uppercase">
                        Langkah 1: Client Hello (Browser &rarr; Server)
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Browser klien mengirim pesan pembuka berisi versi TLS
                        tertinggi yang didukung (TLS 1.3), daftar algoritma
                        sandi (*Cipher Suites*), dan string acak *Client
                        Random*.
                      </p>
                      <div className="font-mono text-xs bg-slate-950 p-3 rounded border border-slate-800 text-sky-300">
                        Payload: TLS_AES_256_GCM_SHA384,
                        ECDHE_RSA_WITH_AES_256_GCM_SHA384
                      </div>
                    </div>
                  )}

                  {tlsStep === 2 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-sky-400 uppercase">
                        Langkah 2: Server Hello &amp; Certificate (Server &rarr;
                        Browser)
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Server memilih cipher suite terbaik dan mengirim
                        Sertifikat Digital SSL/TLS resmi (X.509) yang
                        ditandatangani oleh Certificate Authority (CA)
                        terpercaya.
                      </p>
                      <div className="font-mono text-xs bg-slate-950 p-3 rounded border border-slate-800 text-amber-300">
                        Issuer: Let&apos;s Encrypt / DigiCert &bull; Valid:
                        zenoba.tech &bull; Public Key: RSA 2048-bit
                      </div>
                    </div>
                  )}

                  {tlsStep === 3 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-sky-400 uppercase">
                        Langkah 3: Pertukaran Kunci Asimetris (ECDHE Key
                        Exchange)
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Klien memverifikasi tanda tangan sertifikat. Keduanya
                        melakukan pertukaran parameter matematis Diffie-Hellman
                        (ECDHE) untuk merumuskan *Master Secret* tanpa pernah
                        mengirim kunci rahasia secara terbuka di jaringan.
                      </p>
                      <div className="font-mono text-xs bg-slate-950 p-3 rounded border border-slate-800 text-emerald-400">
                        Algoritma: Curve25519 &bull; Kunci Rahasia Terenkripsi
                        Asimetris
                      </div>
                    </div>
                  )}

                  {tlsStep === 4 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-emerald-400 uppercase">
                        Langkah 4: Jalur Terenkripsi Simetris Aktif (HTTPS
                        Gembok Hijau)
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Handshake selesai! Kunci simetris berkecepatan tinggi
                        telah dibuat di kedua sisi. Semua request HTTP, form
                        password, dan data ditransmisikan dalam enkripsi AES-256
                        yang kebal dari penyadapan MITM (*Man-in-the-Middle*).
                      </p>
                      <div className="font-mono text-xs bg-emerald-950/40 p-3 rounded border border-emerald-500/40 text-emerald-300 font-bold">
                        Status: https:// Terenkripsi Penuh (AES-GCM-256)
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setTlsStep((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                      disabled={tlsStep === 1}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      &larr; Langkah Sebelumnya
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setTlsStep((prev) => (prev < 4 ? prev + 1 : 1))
                      }
                      className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {tlsStep === 4
                        ? "Mulai Ulang Handshake"
                        : "Langkah Selanjutnya &rarr;"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA Text within Showcase (No Card Container) */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Ingin eksplorasi materi dan lab lengkap?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
              Akses seluruh 5 Jalur Belajar, puluhan tantangan lab, dan proyek
              konsultan IT secara terstruktur.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/learn"
              style={{ color: "#000000" }}
              className="group inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-100 px-6 py-2.5 text-xs sm:text-sm font-bold text-black !text-black dark:text-black dark:!text-black transition-colors shadow-md overflow-hidden cursor-pointer"
            >
              <SlidingButtonLabel
                text="Mulai Belajar Sekarang"
                className="text-black !text-black dark:text-black dark:!text-black font-bold"
                containerClassName="h-4 sm:h-5"
              />
            </Link>
            <Link
              href="/labs"
              className="group inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors overflow-hidden cursor-pointer"
            >
              <SlidingButtonLabel
                text="Katalog Labs"
                className="text-slate-200 font-semibold"
                containerClassName="h-4 sm:h-5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
