import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { BevakningarClient } from "./BevakningarClient";

export default async function BevakningarPage() {
  await requireUser();
  return (
    <Suspense fallback={<div className="p-6">Laddar bevakningar...</div>}>
      <div className="px-4 py-10 sm:px-6">
        <BevakningarClient />
      </div>
    </Suspense>
  );
}
