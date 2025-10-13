import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "Sök offentliga upphandlingar gratis | Procurdo Sverige",
  },
  description:
    "Hitta aktuella upphandlingar och sök ramavtal kostnadsfritt. Procurdo erbjuder enkelt sökverktyg för offentlig upphandling i hela Sverige. Kom igång idag!",
  keywords: [
    "offentlig upphandling",
    "offentliga upphandlingar",
    "sök upphandling",
    "upphandling bevakning",
    "ramavtal",
    "aktuella upphandlingar",
    "sök ramavtal",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sök offentliga upphandlingar gratis | Procurdo Sverige",
    description:
      "Hitta aktuella upphandlingar och sök ramavtal kostnadsfritt i Sverige.",
    url: "https://www.procurdo.com/",
    siteName: "Procurdo",
    type: "website",
    images: [
      {
        url: "/PROCURDO_twoline.png",
        width: 1200,
        height: 630,
        alt: "Procurdo – Sök offentliga upphandlingar gratis i Sverige",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sök offentliga upphandlingar gratis | Procurdo Sverige",
    description:
      "Hitta aktuella upphandlingar och sök ramavtal kostnadsfritt i Sverige.",
    images: ["/PROCURDO_twoline.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const websiteJsonLd = {
  ...buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" }),
  description: "Kostnadsfri sökning av offentliga upphandlingar i Sverige",
} as const;

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
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 md:py-28 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-muted-foreground">
            Offentliga upphandlingar • Sök ramavtal • Upphandling bevakning
          </p>
          <h1 className="new-home-h1 text-balance">
            Hitta upphandlingar och ramavtal gratis
          </h1>
          <p className="new-page-paragraph mt-4 max-w-3xl mx-auto">
            Procurdo gör offentlig upphandling tillgänglig för alla. Procurdo samlar offentliga upphandlingar från hela Sverige på ett ställe. Hitta aktuella upphandlingar, sök ramavtal och upptäck affärsmöjligheter utan kostnad.
          </p>
          <h2 className="sr-only">Sök upphandling enkelt – helt gratis</h2>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3">
            <Link href="/sok-upphandling" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto whitespace-nowrap">Sök upphandlingar nu</Button>
            </Link>
            <Link
              href="/sok-upphandling?q=ramavtal"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Utforska ramavtal
            </Link>
            <a
              href="#kommande-funktioner"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Läs mer om kommande funktioner
            </a>
          </div>
        </div>
      </section>

      <section id="funktioner" className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">
          Omfattande databas för offentlig upphandling
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Sök bland tusentals upphandlingar</h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• Filtrera på CPV-kod, fritext och geografisk plats</li>
              <li>• Hitta relevanta offentliga upphandlingar på sekunder</li>
              <li>• Alla sökningar är helt kostnadsfria</li>
            </ul>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Upptäck ramavtal</h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• Sök ramavtal från hela Sverige</li>
              <li>• Identifiera pågående avtalsperioder</li>
              <li>• Kostnadsfri åtkomst till grundläggande information</li>
            </ul>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">Enkelt och tillgängligt</h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• Ingen registrering krävs för grundsökning</li>
              <li>• Användarvänligt gränssnitt</li>
              <li>• Byggd för leverantörer i alla storlekar</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 rounded-xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Varför välja Procurdo för upphandling bevakning?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Demokratiserad tillgång till offentlig upphandling
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4 bg-white/70 dark:bg-transparent">
              <div className="h-8 w-8 rounded-md bg-[#bcffae] flex items-center justify-center text-[#1a7f37]">✅</div>
              <div>
                <h3 className="text-sm font-semibold">Gratis grundfunktioner</h3>
                <p className="text-sm text-muted-foreground">Offentlig information ska vara lätt tillgänglig för alla.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-4 bg-white/70 dark:bg-transparent">
              <div className="h-8 w-8 rounded-md bg-[#e1f0fb] flex items-center justify-center text-[#0a66c2]">🗺️</div>
              <div>
                <h3 className="text-sm font-semibold">Heltäckande för Sverige</h3>
                <p className="text-sm text-muted-foreground">Samlar upphandlingar från hela landet.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-4 bg-white/70 dark:bg-transparent">
              <div className="h-8 w-8 rounded-md bg-[#ffe6a7] flex items-center justify-center text-[#8a6200]">⚡</div>
              <div>
                <h3 className="text-sm font-semibold">Snabb och enkel sökning</h3>
                <p className="text-sm text-muted-foreground">Hitta relevanta möjligheter utan krångel.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-4 bg-white/70 dark:bg-transparent">
              <div className="h-8 w-8 rounded-md bg-[#bca3f9] flex items-center justify-center text-[#5b21b6]">🔎</div>
              <div>
                <h3 className="text-sm font-semibold">Transparens först</h3>
                <p className="text-sm text-muted-foreground">Inga dolda avgifter för grundläggande sökningar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kommande-funktioner" className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-24">
        <div className="rounded-xl border p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Fler verktyg på väg</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-[#e1f0fb] flex items-center justify-center text-[#0a66c2]">🔔</div>
                <div>
                  <h3 className="text-sm font-semibold">Upphandling bevakning</h3>
                  <p className="text-sm text-muted-foreground">Få notifieringar om nya upphandlingar inom ditt område.</p>
                </div>
              </div>
              <span className="mt-3 inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Utvecklas nu</span>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-[#ffe6a7] flex items-center justify-center text-[#8a6200]">📊</div>
                <div>
                  <h3 className="text-sm font-semibold">Avancerad analys</h3>
                  <p className="text-sm text-muted-foreground">Djupare insikter för premium‑användare.</p>
                </div>
              </div>
              <span className="mt-3 inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Planerad</span>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-[#bcffae] flex items-center justify-center text-[#1a7f37]">🔗</div>
                <div>
                  <h3 className="text-sm font-semibold">API‑åtkomst</h3>
                  <p className="text-sm text-muted-foreground">Integrera Procurdo med dina befintliga system.</p>
                </div>
              </div>
              <span className="mt-3 inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Framtida</span>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Alla grundläggande sökfunktioner förblir alltid kostnadsfria.
          </p>
        </div>
      </section>

      {/** Priser section intentionally omitted for now */}

      <section id="kontakt" className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-24">
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
