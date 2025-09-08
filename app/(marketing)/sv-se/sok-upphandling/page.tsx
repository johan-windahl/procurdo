import type { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";
import { Suspense } from "react";
import { buildWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hitta upphandlingar och ramavtal gratis",
  description:
    "Sök och filtrera offentliga upphandlingar gratis. Hitta aktuella upphandlingar och ramavtal med CPV-koder, fritext, datum och plats.",
  keywords: [
    "sök upphandling",
    "offentliga upphandlingar",
    "offentliga upphandlingar gratis",
    "aktuella upphandlingar",
    "ramavtal",
    "sök ramavtal",
  ],
  alternates: {
    canonical: "/sv-se/sok-upphandling",
  },
  openGraph: {
    title: "Hitta upphandlingar och ramavtal gratis",
    description:
      "Filtrera upphandlingar och ramavtal på CPV-koder, fritext, datum och plats.",
    url: "https://www.procurdo.com/sv-se/sok-upphandling",
    siteName: "Procurdo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hitta upphandlingar och ramavtal gratis",
    description:
      "Filtrera upphandlingar och ramavtal på CPV-koder, fritext, datum och plats.",
  },
};

const websiteJsonLd = buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" });

export default function SearchProcurementsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Suspense fallback={null}>
        <SearchPageClient />
      </Suspense>
    </>
  );
}
