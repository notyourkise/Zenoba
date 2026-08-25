import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/auth";

/**
 * Get current session on the server
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get current authenticated user on the server
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Alias for getCurrentUser
 */
export const currentUser = getCurrentUser;

/**
 * Check if current session is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}
