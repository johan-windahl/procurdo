import type { Metadata } from "next";
import Link from "next/link";
import { buildWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Vad är en offentlig upphandling?",
  description:
    "Lär dig vad offentlig upphandling innebär: vem som upphandlar, hur processen ser ut och hur du hittar aktuella upphandlingar och ramavtal.",
  keywords: [
    "vad är en offentlig upphandling",
    "offentlig upphandling",
    "offentliga upphandlingar",
    "upphandling process",
    "ramavtal",
  ],
  alternates: { canonical: "/sv-se/faq/vad-ar-en-offentlig-upphandling" },
  openGraph: {
    title: "Vad är en offentlig upphandling?",
    description:
      "En guide till grunderna i offentlig upphandling – roller, steg och tips.",
    url: "https://www.procurdo.com/sv-se/faq/vad-ar-en-offentlig-upphandling",
    siteName: "Procurdo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vad är en offentlig upphandling?",
    description:
      "Vad är offentlig upphandling och hur fungerar processen?",
  },
};

const websiteJsonLd = buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" });

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Vad är en offentlig upphandling?',
  about: 'Offentlig upphandling',
  inLanguage: 'sv-SE',
} as const;

export default function WhatIsPublicProcurementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#e1f0fb] blur-3xl opacity-60 dark:opacity-20" />
          <div className="absolute bottom-[-100px] left-[-100px] h-[360px] w-[360px] rounded-full bg-[#bcffae] blur-3xl opacity-50 dark:opacity-20" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
          <h1 className="text-3xl font-semibold tracking-tight">Vad är en offentlig upphandling?</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Offentlig upphandling är processen där statliga och kommunala myndigheter
            köper varor, tjänster eller byggentreprenader. Målet är att säkerställa
            konkurrens, transparens och effektiv användning av skattemedel.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <article className="text-sm md:text-base leading-relaxed space-y-4">
              <h2>Vilka upphandlar?</h2>
              <p>
                Upphandlande myndigheter är t.ex. statliga verk, regioner och kommuner
                samt offentligt styrda bolag. De annonserar upphandlingar öppet så att
                leverantörer kan konkurrera på lika villkor.
              </p>
              <h2>Processen i korthet</h2>
              <ol>
                <li>Behov identifieras och krav specificeras.</li>
                <li>Annons publiceras – ofta på EU:s TED och nationella databaser.</li>
                <li>Frågor och svar samt eventuella förtydliganden.</li>
                <li>Anbud lämnas in inom angiven tid.</li>
                <li>Utvärdering enligt förutbestämda kriterier.</li>
                <li>Tilldelningsbeslut och avtalsspärr.</li>
                <li>Avtal tecknas och följs upp.</li>
              </ol>
              <h2>Vanliga begrepp</h2>
              <ul>
                <li><strong>CPV-koder</strong>: standardiserade kodningar för varor och tjänster.</li>
                <li><strong>Ramavtal</strong>: avtal som anger villkor för framtida avrop.</li>
                <li><strong>Tröskelvärde</strong>: beloppsgränser som påverkar förfarande och annonsering.</li>
              </ul>
              <h2>Tips till leverantörer</h2>
              <ul>
                <li>Bevaka rätt CPV-koder och geografier.</li>
                <li>Läs kravbilden noga och ställ frågor i tid.</li>
                <li>Visa relevanta referenser och möt ska‑krav tydligt.</li>
              </ul>
              <p>
                Vill du se aktuella annonser? {" "}
                <Link href="/sv-se/sok-upphandling" className="underline">Sök upphandlingar</Link>.
              </p>
            </article>
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl border p-4 bg-card">
              <h3 className="font-semibold">Snabbfakta</h3>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• Offentliga medel → transparenskrav</li>
                <li>• Annonsering i TED över tröskelvärden</li>
                <li>• Utvärdering enligt förhandlade kriterier</li>
              </ul>
            </div>
            <div className="rounded-xl border p-4">
              <h3 className="font-semibold">Relaterat</h3>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>
                  <Link href="/sv-se/faq/lagen-om-offentlig-upphandling" className="underline">
                    Lagen om offentlig upphandling (LOU)
                  </Link>
                </li>
                <li>
                  <Link href="/sv-se/sok-upphandling?q=ramavtal" className="underline">
                    Sök ramavtal
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
