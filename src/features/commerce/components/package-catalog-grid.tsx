import * as React from "react";
import type { CatalogPackageCard } from "../catalog";

interface PackageCatalogGridProps {
  packages: CatalogPackageCard[];
}

export function PackageCatalogGrid({ packages }: PackageCatalogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => {
        const isComingSoon = pkg.catalogStatus === "COMING_SOON";

        return (
          <div
            key={pkg.id}
            className="flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-zinc-950 text-white transition-all hover:border-white/20"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {pkg.kind === "COMBO" ? "Paket Bundling" : "Paket Mandiri"}
                </span>

                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    isComingSoon
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {pkg.availabilityLabel}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                {pkg.title}
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-3 mb-4">
                {pkg.description || "Paket kurikulum komprehensif."}
              </p>

              {/* Included courses */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Termasuk {pkg.courses.length} Kursus:
                </p>
                <ul className="space-y-1">
                  {pkg.courses.map((c) => (
                    <li
                      key={c.slug}
                      className="text-xs text-zinc-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{c.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500 font-medium">Biaya Paket</p>
                <p className="text-base font-bold text-white tracking-tight">
                  {pkg.priceLabel}
                </p>
              </div>

              <div>
                {isComingSoon ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-900 text-zinc-500 border border-white/5 cursor-not-allowed"
                  >
                    Segera Hadir
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-purple-600 text-white hover:bg-purple-500 transition-colors"
                  >
                    Beli Paket
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
