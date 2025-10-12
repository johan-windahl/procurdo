import { auth, currentUser } from "@clerk/nextjs/server";

export type AuthedUser = {
  id: string;
  email: string | null;
};

export async function requireUser(): Promise<AuthedUser> {
  const { userId } = await auth();
  if (!userId) {
    // Clerk middleware should protect already; this is a safety net
    throw new Error("Unauthorized");
  }
  const user = await currentUser();
  return {
    id: userId,
    email: user?.emailAddresses?.[0]?.emailAddress ?? null,
  };
}
