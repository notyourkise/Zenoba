import * as React from "react";

export default function DeveloperLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-6 animate-pulse"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-800 rounded" />
          <div className="h-4 w-72 bg-slate-850 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-3"
          >
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-8 w-16 bg-slate-700 rounded" />
          </div>
        ))}
      </div>

      <div className="h-64 rounded-lg bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="h-5 w-36 bg-slate-800 rounded" />
        <div className="h-4 w-full bg-slate-850 rounded" />
        <div className="h-4 w-5/6 bg-slate-850 rounded" />
      </div>

      <span className="sr-only">Memuat data operasional pengembang...</span>
    </div>
  );
}
