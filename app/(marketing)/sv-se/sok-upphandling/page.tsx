import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sök upphandlingar",
  description:
    "Sök och filtrera offentliga upphandlingar i Sverige. Hitta aktuella upphandlingar och ramavtal.",
};

export default function SearchProcurementsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Sök upphandlingar</h1>
      <p className="mt-2 text-muted-foreground">
        Den här sidan kommer snart. Här kommer du kunna söka bland offentliga upphandlingar, filtrera på myndighet och kategori samt spara bevakningar.
      </p>
    </div>
  );
}

