import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/features/profile/profile-form";
import { SettingsPasswordForm } from "@/features/settings/components/settings-password-form";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/?auth=sign-in");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Pengaturan Akun
        </h1>
        <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
          Kelola profil, kata sandi, dan preferensi akun Netloka Anda.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Profil & Akun */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0b0e19]">
          <div className="mb-5 border-b border-gray-100 pb-4 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informasi Akun
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Informasi identitas dasar akun pembelajaran Anda.
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Email
              </span>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {user.email}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Peran Akun
              </span>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {user.role || "LEARNER"}
                </span>
              </div>
            </div>
          </div>

          <ProfileForm initialName={user.name || ""} />
        </div>

        {/* Section 2: Keamanan (Ubah Password) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0b0e19]">
          <div className="mb-5 border-b border-gray-100 pb-4 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Keamanan Akun
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Perbarui kata sandi Anda langsung dengan mengisi password baru.
            </p>
          </div>

          <SettingsPasswordForm />
        </div>

        {/* Section 3: Preferensi Tampilan */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0b0e19]">
          <div className="mb-5 border-b border-gray-100 pb-4 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preferensi Tampilan
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Kustomisasi tampilan tema platform Netloka sesuai kenyamanan Anda.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Ganti Tema
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Beralih antara mode gelap (Cosmic Dark) dan mode terang.
              </p>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}