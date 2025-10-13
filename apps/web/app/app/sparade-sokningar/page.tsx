import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { SavedSearchesClient } from "./SavedSearchesClient";

export default async function SparadeSokningarPage() {
  await requireUser();
  return (
    <Suspense fallback={<div className="p-6">Laddar sparade sökningar...</div>}>
      <div className="px-4 py-10 sm:px-6">
        <SavedSearchesClient />
      </div>
    </Suspense>
  );
}
