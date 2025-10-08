import { requireUser } from "@/lib/auth";

export default async function AppHomePage() {
  const user = await requireUser();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Välkommen</h1>
      <p className="mt-2 text-sm text-muted-foreground">Inloggad som {user.email || user.id}</p>
    </div>
  );
}

