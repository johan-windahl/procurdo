import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs/server";

export type AuthedUser = {
  id: string;
  email: string | null;
};

export async function requireUser(): Promise<AuthedUser> {
  const { userId } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/sv-se/app" });
  }
  const user = await currentUser();
  return {
    id: userId,
    email: user?.emailAddresses?.[0]?.emailAddress ?? null,
  };
}
