import { requireLearnerActor } from "@/features/authorization/guards";
import { getCurrentUser } from "@/lib/auth";
import { touchUserActivity } from "@/features/analytics/activity";
import { LearnerWorkspaceShell } from "@/components/navigation/learner-workspace-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = await requireLearnerActor();
  await touchUserActivity(actor.id);
  const user = await getCurrentUser();

  return (
    <LearnerWorkspaceShell user={user}>
      {children}
    </LearnerWorkspaceShell>
  );
}
