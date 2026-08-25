import { getCurrentUser } from "@/lib/auth";
import { UserCircle } from "lucide-react";
import { ProfileForm } from "@/features/profile/profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Silakan masuk terlebih dahulu untuk melihat profil Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profil Saya
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Kelola informasi akun dan preferensi pembelajaran Anda di Netloka.
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <UserCircle className="h-16 w-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.name || "Learner"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            <div className="pt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                {user.role || "LEARNER"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <ProfileForm initialName={user.name || ""} />
    </div>
  );
}
