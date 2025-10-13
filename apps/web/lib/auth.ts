import { auth, currentUser } from "@clerk/nextjs/server";

export type AuthedUser = {
  id: string;
  email: string | null;
};

export async function requireUser(): Promise<AuthedUser> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/app" });
  }
  const user = await currentUser();
  return {
    id: userId,
    email: user?.emailAddresses?.[0]?.emailAddress ?? null,
  };
}
