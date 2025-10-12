import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ – Offentlig upphandling",
  description:
    "Vanliga frågor om offentlig upphandling. Lär dig grunderna i LOU och vad en offentlig upphandling är – och kom igång att söka upphandlingar gratis.",
  alternates: { canonical: "/sv-se/faq" },
  openGraph: {
    title: "FAQ – Offentlig upphandling",
    description:
      "Läs om Lagen om offentlig upphandling (LOU) och vad offentlig upphandling innebär.",
    url: "https://www.procurdo.com/sv-se/faq",
    siteName: "Procurdo",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ – Offentlig upphandling",
    description:
      "Vanliga frågor och svar om offentlig upphandling och LOU.",
  },
};

const websiteJsonLd = buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" });

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Vad är en offentlig upphandling?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'En offentlig upphandling är när en statlig eller kommunal myndighet köper varor eller tjänster enligt särskilda regler. Syftet är att säkerställa konkurrens, likabehandling och effektiv användning av skattemedel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Vad innebär Lagen om offentlig upphandling (LOU)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LOU (2016:1145) reglerar hur offentliga myndigheter ska annonsera, utvärdera och tilldela kontrakt. Lagen anger bl.a. tröskelvärden, förfaranden och principer om transparens och likabehandling.',
      },
    },
  ],
} as const;

export default function FAQIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#e1f0fb] blur-3xl opacity-60 dark:opacity-20" />
          <div className="absolute top-40 right-[-120px] h-[380px] w-[380px] rounded-full bg-[#bca3f9] blur-3xl opacity-50 dark:opacity-20" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-muted-foreground">
            FAQ • Offentlig upphandling • LOU
          </p>
          <h1 className="new-home-h1 text-balance">FAQ – Offentlig upphandling</h1>
          <p className="new-page-paragraph mt-4 max-w-3xl mx-auto">
            Här samlar vi guider och svar på vanliga frågor om offentlig upphandling
            – från grunderna till lagen (LOU). Utforska ämnena nedan.
          </p>
          <div className="mt-8">
            <Link href="/sv-se/sok-upphandling">
              <Button size="lg">Sök upphandlingar</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/sv-se/faq/vad-ar-den-offentliga-sektorn" className="group rounded-xl border p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#e1f0fb] flex items-center justify-center text-[#0a66c2]">🏛️</div>
              <div>
                <h2 className="text-lg font-semibold group-hover:underline">Vad är den offentliga sektorn?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  En enkel förklaring av vad som ingår i offentlig sektor, hur den finansieras och varför den är viktig.
                </p>
              </div>
            </div>
          </Link>
          <Link href="/sv-se/faq/vad-ar-en-offentlig-upphandling" className="group rounded-xl border p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#e1f0fb] flex items-center justify-center text-[#0a66c2]">ℹ️</div>
              <div>
                <h2 className="text-lg font-semibold group-hover:underline">Vad är en offentlig upphandling?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  En introduktion till begreppen, rollerna och processen – från annons till tilldelning.
                </p>
              </div>
            </div>
          </Link>
          <Link href="/sv-se/faq/lagen-om-offentlig-upphandling" className="group rounded-xl border p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#bcffae] flex items-center justify-center text-[#1a7f37]">📜</div>
              <div>
                <h2 className="text-lg font-semibold group-hover:underline">Lagen om offentlig upphandling (LOU)</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Överblick av lagens principer, tröskelvärden och vanliga förfaranden.
                </p>
              </div>
            </div>
          </Link>
          <Link href="/sv-se/faq/finns-alla-upphandlingar" className="group rounded-xl border p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#ffe6a7] flex items-center justify-center text-[#8a6200]">🔎</div>
              <div>
                <h2 className="text-lg font-semibold group-hover:underline">Finns alla upphandlingar?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Varför Sverige saknar en komplett samlad databas, och hur annonsering fungerar nationellt och inom EU.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
