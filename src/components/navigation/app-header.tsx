"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlidingButtonLabel } from "@/components/ui/sliding-button-label";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

type NavigationCatalogItem = {
  title: string;
  description: string;
  status: "available" | "soon";
  href?: string;
};

type NavigationSection = {
  label: "Learn" | "Labs" | "Challenges" | "Consultant";
  href: string;
  ctaLabel: string;
  items: NavigationCatalogItem[];
  secondaryLink?: { href: string; label: string };
};

const navigationSections: NavigationSection[] = [
  {
    label: "Learn",
    href: "/learn",
    ctaLabel: "Explore all learning paths",
    items: [
      {
        title: "Networking",
        href: "/learn",
        status: "available",
        description:
          "Fondasi jaringan, IPv4, switching, routing, services, dan troubleshooting.",
      },
      {
        title: "Server & Linux",
        status: "soon",
        description:
          "Administrasi Linux, layanan server, storage, dan otomasi sistem.",
      },
      {
        title: "Cybersecurity",
        status: "soon",
        description:
          "Hardening, firewall, access control, monitoring, dan incident response.",
      },
      {
        title: "Cloud & DevOps",
        status: "soon",
        description:
          "Cloud fundamentals, container, deployment, observability, dan delivery workflow.",
      },
      {
        title: "CCTV & Surveillance",
        status: "soon",
        description:
          "Perencanaan kamera IP, NVR, bandwidth, storage, dan coverage area.",
      },
      {
        title: "Fiber Optic",
        status: "soon",
        description:
          "Media optik, link budget, splicing, OPM, dan troubleshooting jalur fiber.",
      },
      {
        title: "VoIP & PABX",
        status: "soon",
        description:
          "Konsep telephony IP, extension, trunk, codec, dan quality of service.",
      },
    ],
  },
  {
    label: "Labs",
    href: "/labs",
    ctaLabel: "Explore all labs",
    items: [
      {
        title: "Network Labs",
        href: "/labs",
        status: "available",
        description:
          "Praktik subnetting, VLAN, routing, services, dan terminal diagnostics.",
      },
      {
        title: "Linux Server Labs",
        status: "soon",
        description:
          "Praktik users, permissions, services, storage, dan network configuration.",
      },
      {
        title: "Security Labs",
        status: "soon",
        description:
          "Latihan hardening, firewall rules, audit, dan defensive monitoring.",
      },
      {
        title: "Cloud Labs",
        status: "soon",
        description:
          "Eksperimen deployment, container, secrets, dan cloud operations.",
      },
      {
        title: "Infrastructure Field Labs",
        status: "soon",
        description:
          "Praktik CCTV, fiber optic, VoIP, rack, power, dan dokumentasi lapangan.",
      },
    ],
  },
  {
    label: "Challenges",
    href: "/challenges",
    ctaLabel: "Explore all challenges",
    items: [
      {
        title: "Network Troubleshooting",
        href: "/challenges",
        status: "available",
        description:
          "Diagnosa gangguan konektivitas, VLAN, DHCP, routing, dan DNS.",
      },
      {
        title: "Server Incident Response",
        status: "soon",
        description:
          "Pulihkan service failure, permission issue, storage, dan resource bottleneck.",
      },
      {
        title: "Cyber Defense",
        status: "soon",
        description:
          "Analisis bukti, salah konfigurasi, akses mencurigakan, dan mitigasi insiden.",
      },
      {
        title: "Cloud Reliability",
        status: "soon",
        description:
          "Tangani deployment failure, availability issue, dan observability gap.",
      },
      {
        title: "Integrated Infrastructure",
        status: "soon",
        description:
          "Selesaikan kasus lintas jaringan, server, security, CCTV, fiber, dan VoIP.",
      },
    ],
  },
  {
    label: "Consultant",
    href: "/consultant",
    ctaLabel: "Explore consultant projects",
    secondaryLink: {
      href: "/consultant/portfolio",
      label: "My project portfolio",
    },
    items: [
      {
        title: "Network Planning Projects",
        href: "/consultant",
        status: "available",
        description:
          "Analisis kebutuhan, BoQ, topology, IP/VLAN plan, budget, dan scoring.",
      },
      {
        title: "Server Architecture",
        status: "soon",
        description:
          "Rancang compute, storage, service roles, redundancy, dan capacity plan.",
      },
      {
        title: "Security Architecture",
        status: "soon",
        description:
          "Susun segmentation, access control, firewall policy, dan security controls.",
      },
      {
        title: "CCTV, Fiber & VoIP Integration",
        status: "soon",
        description:
          "Gabungkan surveillance, backbone fiber, telephony, dan network services.",
      },
    ],
  },
];

const soonLearningDomains = navigationSections[0].items
  .filter((item) => item.status === "soon")
  .map((item) => item.title)
  .join(" · ");

export function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isTransparent, setIsTransparent] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const lastScrollYRef = React.useRef(0);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const lastScrollY = lastScrollYRef.current;

          if (currentScrollY <= 20) {
            setIsTransparent(false);
          } else if (currentScrollY > lastScrollY + 5) {
            setIsTransparent(true);
          } else if (currentScrollY < lastScrollY - 5) {
            setIsTransparent(false);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldBeTransparent = isTransparent && !isHovered && !mobileMenuOpen;

  return (
    <>
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          shouldBeTransparent
            ? "bg-white/30 dark:bg-gray-950/30 backdrop-blur-xs border-b border-gray-200/20 dark:border-gray-800/20 opacity-40 hover:opacity-100 hover:bg-white/95 hover:dark:bg-gray-950/95 hover:backdrop-blur-sm hover:border-gray-200/80 hover:dark:border-gray-800"
            : "bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-800 opacity-100 shadow-sm"
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* 1. Left: Brand Wordmark aligned to the responsive header gutter */}
            <div className="flex items-center justify-start flex-1">
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flex items-center focus:outline-none rounded-lg py-1 hover:opacity-90 transition-opacity group cursor-pointer"
                aria-label="Zenoba Home"
              >
                <span className="font-brand text-2xl sm:text-3xl font-bold tracking-wide text-black dark:text-white">
                  ZENOBA
                </span>
              </Link>
            </div>

            {/* 2. Center: Desktop 2-Column Floating Navigation Menu */}
            <div className="hidden md:flex items-center justify-center gap-4 flex-shrink-0">
              <NavigationMenu>
                <NavigationMenuList className="gap-6 lg:gap-8">
                  {navigationSections.map((section) => {
                    const splitIndex = Math.ceil(section.items.length / 2);
                    const columns = [
                      section.items.slice(0, splitIndex),
                      section.items.slice(splitIndex),
                    ];

                    return (
                      <NavigationMenuItem key={section.label}>
                        <NavigationMenuTrigger
                          isActive={pathname.startsWith(section.href)}
                        >
                          {section.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-[680px]">
                          <div className="flex flex-col gap-1.5">
                            <div className="grid grid-cols-2 divide-x divide-slate-800">
                              {columns.map((items, columnIndex) => (
                                <div
                                  key={columnIndex}
                                  className={cn(
                                    "flex flex-col divide-y divide-slate-800/70",
                                    columnIndex === 0 ? "pr-3" : "pl-3",
                                  )}
                                >
                                  {items.map((item) => (
                                    <CatalogItem key={item.title} item={item} />
                                  ))}
                                </div>
                              ))}
                            </div>
                            <div className="mt-1 flex items-center justify-between border-t border-slate-800 px-2 pt-2.5">
                              <Link
                                href={section.href}
                                className="text-xs font-medium text-sky-400 underline-offset-4 hover:text-sky-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                              >
                                {section.ctaLabel} →
                              </Link>
                              {section.secondaryLink && (
                                <Link
                                  href={section.secondaryLink.href}
                                  className="text-xs font-medium text-slate-400 underline-offset-4 hover:text-slate-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                >
                                  {section.secondaryLink.label} →
                                </Link>
                              )}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
              <Link
                href="/about"
                className="text-sm font-medium text-black transition-colors hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:text-white dark:hover:text-sky-300"
              >
                Tentang Zenoba
              </Link>
            </div>

            {/* 3. Right: Vertical Text Slide Auth Buttons */}
            <div className="flex items-center justify-end flex-1 gap-4 sm:gap-5">
              <div className="flex items-center gap-2.5">
                {/* Secondary Button: Masuk (Compact 36px height, 80px min-width) */}
                <Button
                  variant="outline-dark"
                  asChild
                  className="group h-9 min-w-[80px] px-3.5 rounded-lg text-sm font-semibold overflow-hidden cursor-pointer"
                >
                  <Link href="/?auth=sign-in">
                    <SlidingButtonLabel
                      text="Masuk"
                      className="text-black dark:text-white font-semibold"
                    />
                  </Link>
                </Button>

                {/* Primary CTA: Mulai Gratis (Compact 36px height, 116px min-width) */}
                <Button
                  variant="solid-light"
                  asChild
                  className="group h-9 min-w-[116px] px-4 rounded-lg text-sm font-semibold overflow-hidden cursor-pointer"
                >
                  <Link href="/?auth=sign-up">
                    <SlidingButtonLabel
                      text="Mulai Gratis"
                      className="text-white dark:text-[#0a0a0a] font-semibold"
                    />
                  </Link>
                </Button>
              </div>

              {/* Mobile hamburger menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 space-y-1 animate-in fade-in-50">
              {navigationSections.map((section) => (
                <Link
                  key={section.label}
                  href={section.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    pathname.startsWith(section.href)
                      ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                      : "text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
                  )}
                >
                  {section.label}
                </Link>
              ))}

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  pathname === "/about"
                    ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
                )}
              >
                Tentang Zenoba
              </Link>

              <div
                role="note"
                aria-label="Coming soon"
                className="mx-3.5 my-3 border-t border-gray-200 pt-3 dark:border-gray-800"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  Coming soon
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  {soonLearningDomains}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2.5">
                <Button
                  variant="outline-dark"
                  asChild
                  className="w-full h-9 px-3.5 rounded-lg justify-center text-sm font-semibold text-black dark:text-white"
                >
                  <Link
                    href="/?auth=sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                </Button>
                <Button
                  variant="solid-light"
                  asChild
                  className="w-full h-9 px-4 rounded-lg justify-center text-sm font-semibold"
                >
                  <Link
                    href="/?auth=sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mulai Gratis
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Invisible placeholder to preserve layout flow */}
      <div className="h-[72px] pointer-events-none" aria-hidden="true" />
    </>
  );
}

function CatalogItem({ item }: { item: NavigationCatalogItem }) {
  const content = (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold leading-snug text-white transition-colors group-hover:text-sky-300">
          {item.title}
        </span>
        {item.status === "soon" && (
          <span className="shrink-0 rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-200">
            Soon
          </span>
        )}
      </div>
      <span className="line-clamp-2 text-xs leading-normal text-slate-400 transition-colors group-hover:text-slate-300">
        {item.description}
      </span>
    </div>
  );

  if (item.status === "soon") {
    return (
      <div
        aria-disabled="true"
        className="cursor-not-allowed select-none py-1 opacity-75"
      >
        <div className="flex min-h-16 items-start rounded-lg p-2.5 text-left">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="py-1">
      <NavigationMenuLink
        render={
          <Link
            href={item.href ?? "/"}
            className="group flex min-h-16 select-none items-start rounded-lg p-2.5 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {content}
          </Link>
        }
      />
    </div>
  );
}
