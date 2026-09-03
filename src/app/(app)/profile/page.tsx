import { getCurrentUser } from "@/lib/auth";
import { LearnerAccountRouteModal } from "@/components/navigation/learner-account-route-modal";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return <LearnerAccountRouteModal initialTab="profile" user={user} />;
}