import * as React from "react";
import Link from "next/link";
import type { UserRole } from "@/generated/prisma/client";
import { searchDeveloperUsers } from "@/features/developer/users/queries";

export const metadata = {
  title: "Direktori Pengguna — Developer Zenoba",
};

export default async function DeveloperUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  const resolvedParams = (await searchParams) ?? {};
  const query = resolvedParams.q?.trim() || "";
  const rawRole = resolvedParams.role;
  const validRole: UserRole | undefined =
    rawRole === "LEARNER" || rawRole === "INTERNAL_LEARNER" || rawRole === "DEVELOPER"
      ? rawRole
      : undefined;
  const currentPage = Math.max(1, Number(resolvedParams.page) || 1);

  const data = await searchDeveloperUsers({
    query: query.length >= 2 ? query : undefined,
    role: validRole,
    page: currentPage,
    limit: 20,
  });

  function buildUrl(params: { q?: string; role?: string; page?: number }) {
    const sp = new URLSearchParams();
    const newQ = params.q !== undefined ? params.q : query;
    const newRole = params.role !== undefined ? params.role : validRole;
    const newPage = params.page !== undefined ? params.page : currentPage;

    if (newQ) sp.set("q", newQ);
    if (newRole) sp.set("role", newRole);
    if (newPage > 1) sp.set("page", String(newPage));

    const qs = sp.toString();
    return qs ? `/developer/users?${qs}` : "/developer/users";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Direktori Pengguna
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Daftar seluruh akun pengguna Zenoba, filter berdasarkan peran, dan periksa detail individu.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-lg bg-[#080d1a] border border-slate-800 space-y-4">
        <form method="GET" action="/developer/users" className="flex flex-col sm:flex-row gap-3">
          {validRole && <input type="hidden" name="role" value={validRole} />}
          <div className="flex-1">
            <label htmlFor="search-input" className="sr-only">
              Cari nama atau email
            </label>
            <input
              id="search-input"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Cari berdasarkan nama atau email (min 2 karakter)..."
              className="w-full px-3.5 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cari Pengguna
          </button>
          {query && (
            <Link
              href={buildUrl({ q: "" })}
              className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 transition text-center"
            >
              Reset
            </Link>
          )}
        </form>

        {/* Role Filters */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Filter Peran:</span>
          {[
            { label: "Semua", value: undefined },
            { label: "LEARNER", value: "LEARNER" },
            { label: "INTERNAL_LEARNER", value: "INTERNAL_LEARNER" },
            { label: "DEVELOPER", value: "DEVELOPER" },
          ].map((tab) => {
            const isActive = validRole === tab.value;
            return (
              <Link
                key={tab.label}
                href={buildUrl({ role: tab.value, page: 1 })}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Users Table / Card list */}
      <div className="rounded-lg bg-[#080d1a] border border-slate-800 overflow-hidden">
        {data.users.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-medium text-slate-300">
              Tidak ada pengguna yang sesuai dengan kriteria pencarian.
            </p>
            <p className="text-xs text-slate-500">
              Coba gunakan kata kunci pencarian yang berbeda atau reset filter peran.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-4 py-3">Pengguna</th>
                  <th scope="col" className="px-4 py-3">Peran</th>
                  <th scope="col" className="px-4 py-3 hidden sm:table-cell">Terdaftar</th>
                  <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{user.name || "—"}</div>
                      <div className="text-xs font-mono text-slate-400">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          user.role === "DEVELOPER"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : user.role === "INTERNAL_LEARNER"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/developer/users/${user.id}`}
                        className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {data.totalPages > 1 && (
          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Halaman {data.page} dari {data.totalPages} (Total {data.total} pengguna)
            </span>
            <div className="flex items-center gap-2">
              {data.page > 1 && (
                <Link
                  href={buildUrl({ page: data.page - 1 })}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium"
                >
                  &larr; Sebelumnya
                </Link>
              )}
              {data.page < data.totalPages && (
                <Link
                  href={buildUrl({ page: data.page + 1 })}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium"
                >
                  Selanjutnya &rarr;
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
