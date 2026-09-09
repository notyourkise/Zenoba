import { requireLearnerActor } from "@/features/authorization/guards";
import { getCurrentUser } from "@/lib/auth";
import { LearnerWorkspaceShell } from "@/components/navigation/learner-workspace-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireLearnerActor();
  const user = await getCurrentUser();

  return (
    <LearnerWorkspaceShell user={user}>
      {children}
    </LearnerWorkspaceShell>
  );
}
