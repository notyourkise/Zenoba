import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getMyPackages } from "@/features/commerce/entitlements";

export const metadata = {
  title: "Paket Saya — Netloka",
  description: "Daftar lisensi dan paket pembelajaran yang Anda miliki.",
};

export default async function MyPackagesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const packages = await getMyPackages(user.id);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Paket & Lisensi Saya
        </h1>
        <p className="mt-2 text-base text-zinc-400 max-w-2xl">
          Daftar kepemilikan akses seumur hidup untuk kursus dan paket mandiri Anda di Netloka.
        </p>
      </div>

      {packages.length === 0 ? (
        <div className="p-10 rounded-xl border border-white/10 bg-zinc-950 text-center space-y-4">
          <p className="text-base text-zinc-300 font-medium">
            Belum ada paket berbayar yang dimiliki.
          </p>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Semua kursus premium yang Anda beli di masa mendatang akan tercatat sebagai hak akses seumur hidup di sini.
          </p>
          <div>
            <Link
              href="/catalog"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              Lihat Katalog Kursus
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-zinc-400 font-medium">
                <th className="py-3 px-4">Kursus</th>
                <th className="py-3 px-4">Tanggal Diperoleh</th>
                <th className="py-3 px-4">Tipe Akses</th>
                <th className="py-3 px-4">Referensi Pesanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-white/5">
                  <td className="py-3 px-4 font-semibold">{pkg.courseTitle}</td>
                  <td className="py-3 px-4 text-zinc-400">
                    {new Date(pkg.grantedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {pkg.sourceType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-zinc-400">
                    {pkg.orderReference || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
