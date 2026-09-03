import { getCurrentUser } from "@/lib/auth";
import { LearnerWorkspaceShell } from "@/components/navigation/learner-workspace-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <LearnerWorkspaceShell user={user}>
      {children}
    </LearnerWorkspaceShell>
  );
}
