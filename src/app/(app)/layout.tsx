import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/navigation/app-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-black dark:text-white">
      <AppHeader user={user} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
