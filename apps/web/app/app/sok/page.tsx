import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { SearchPageClient } from "./SearchPageClient";

export default async function SokPage() {
  await requireUser();
  return (
    <Suspense fallback={<div className="p-6">Laddar sökgränssnitt...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
