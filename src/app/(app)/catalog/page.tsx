import { getCurrentUser } from "@/lib/auth";
import { getCatalogForLearner } from "@/features/commerce/catalog";
import { CourseCatalogGrid } from "@/features/commerce/components/course-catalog-grid";
import { PackageCatalogGrid } from "@/features/commerce/components/package-catalog-grid";

export const metadata = {
  title: "Katalog Kursus — Zenoba",
  description: "Daftar kurikulum kursus mandiri dan paket bundling IT infrastructure Zenoba.",
};

export default async function CatalogPage() {
  const user = await getCurrentUser();
  const catalog = await getCatalogForLearner(user?.id);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Katalog Kursus
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Eksplorasi jalur pembelajaran infrastruktur IT. Fondasi Networking dapat diakses 100% gratis secara permanen.
        </p>
      </div>

      {/* Section 1: Single Courses */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Kursus Mandiri
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Pilih spesialisasi teknis yang ingin Anda dalami secara fokus dan terarah.
          </p>
        </div>
        <CourseCatalogGrid courses={catalog.courses} />
      </section>

      {/* Section 2: Combo Packages */}
      <section className="space-y-6 pt-6 border-t border-zinc-200 dark:border-white/10">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Paket Bundling
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Kombinasi modul tematik untuk akselerasi penguasaan domain infrastruktur lapangan.
          </p>
        </div>
        <PackageCatalogGrid packages={catalog.packages} />
      </section>
    </div>
  );
}
