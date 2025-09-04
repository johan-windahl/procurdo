import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Offentliga upphandlingar i Sverige – Gratis sök",
  description:
    "Sök offentliga upphandlingar gratis. Filtrera och bevaka aktuella upphandlingar och ramavtal – enkelt att komma igång.",
  keywords: [
    "offentlig upphandling",
    "offentliga upphandlingar",
    "upphandling",
    "sök upphandling",
    "offentliga upphandlingar gratis",
    "aktuella upphandlingar",
    "upphandling bevakning",
    "ramavtal",
    "sök ramavtal",
  ],
  alternates: {
    canonical: "/sv-se",
  },
};

const websiteJsonLd = buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" });

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[#e1f0fb] blur-3xl opacity-70 dark:opacity-25" />
          <div className="absolute top-40 right-[-100px] h-[420px] w-[420px] rounded-full bg-[#bca3f9] blur-3xl opacity-60 dark:opacity-20" />
          <div className="absolute -bottom-24 left-[-120px] h-[360px] w-[360px] rounded-full bg-[#bcffae] blur-3xl opacity-60 dark:opacity-20" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-muted-foreground">
            Offentliga upphandlingar • Upphandling bevakning • Sök ramavtal
          </p>
          <h1 className="new-home-h1 text-balance">Sök offentliga upphandlingar gratis</h1>
          <p className="new-page-paragraph mt-4 max-w-3xl mx-auto">
            Procurdo gör det enkelt att hitta aktuella upphandlingar, bevaka nya anbud och söka ramavtal inom offentlig upphandling. Det är gratis att söka – börja med din första upphandling redan idag.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link href="/sv-se/sok-upphandling">
              <Button size="lg">Sök upphandlingar</Button>
            </Link>
            <Link href="/sv-se/sok-upphandling?q=ramavtal" className="text-sm font-medium underline-offset-4 hover:underline">
              Sök ramavtal
            </Link>
            <a href="#funktioner" className="text-sm font-medium underline-offset-4 hover:underline">
              Läs mer
            </a>
          </div>
        </div>
      </section>

      <section id="funktioner" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Sök upphandling</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Filtrera på CPV-kod, fritext och plats. Hitta offentliga upphandlingar och sök ramavtal på sekunder.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Upphandling bevakning</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Spara sökningar och få aviseringar. Missa aldrig en aktuell upphandling.
              (Kommer snart)
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Offentliga upphandlingar gratis</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Kom igång utan kostnad. Testa funktioner för att söka och bevaka upphandlingar och se hur Procurdo kan hjälpa dig att vinna fler anbud.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Varför Procurdo?
          </h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <li>• Täckning av offentliga upphandlingar i hela Sverige</li>
            <li>• Snabb sökfunktion för upphandlingar och ramavtal</li>
            <li>• Enkelt att filtrera, analysera och bevaka upphandlingar</li>
            <li>• Byggd för leverantörer som vill växa via offentlig sektor</li>
          </ul>
        </div>
      </section>

      {/** Priser section intentionally omitted for now */}

      <section id="kontakt" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="rounded-xl border p-8">
          <h2 className="text-2xl font-semibold">Har du frågor?</h2>
          <p className="mt-2 text-muted-foreground">
            Kontakta oss på <a className="underline" href="mailto:hello@procurdo.com">hello@procurdo.com</a>
          </p>
        </div>
      </section>
    </>
  );
}
