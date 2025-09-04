import type { Metadata } from "next";
import Link from "next/link";
import { buildWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Lagen om offentlig upphandling (LOU)",
  description:
    "En översikt av LOU (2016:1145): principer, förfaranden, tröskelvärden och vad leverantörer bör känna till i offentlig upphandling.",
  keywords: [
    "lagen om offentlig upphandling",
    "LOU",
    "offentlig upphandling lag",
    "tröskelvärden upphandling",
    "upphandlingsförfaranden",
  ],
  alternates: { canonical: "/sv-se/faq/lagen-om-offentlig-upphandling" },
  openGraph: {
    title: "Lagen om offentlig upphandling (LOU)",
    description:
      "Vad säger LOU? En praktisk guide till principer, tröskelvärden och förfaranden.",
    url: "https://www.procurdo.com/sv-se/faq/lagen-om-offentlig-upphandling",
    siteName: "Procurdo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lagen om offentlig upphandling (LOU)",
    description:
      "Överblick av LOU: grundprinciper, annonsering, tröskelvärden och tilldelning.",
  },
};

const websiteJsonLd = buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" });

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Lagen om offentlig upphandling (LOU)',
  about: 'LOU 2016:1145',
  inLanguage: 'sv-SE',
} as const;

export default function LOUPage() {
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
          <div className="absolute top-40 right-[-120px] h-[380px] w-[380px] rounded-full bg-[#bca3f9] blur-3xl opacity-50 dark:opacity-20" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
          <h1 className="text-3xl font-semibold tracking-tight">Lagen om offentlig upphandling (LOU)</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            LOU, lag (2016:1145), reglerar hur offentliga myndigheter annonserar,
            utvärderar och tilldelar kontrakt. Syftet är konkurrens, likabehandling
            och transparens.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <article className="text-sm md:text-base leading-relaxed space-y-4">
              <h2>Grundprinciper</h2>
              <ul>
                <li><strong>Likabehandling och icke‑diskriminering</strong> av leverantörer.</li>
                <li><strong>Transparens</strong> i krav, tidsfrister och utvärdering.</li>
                <li><strong>Proportionalitet</strong> – kraven ska stå i rimlig proportion till uppdraget.</li>
                <li><strong>Ömsesidigt erkännande</strong> inom EU.</li>
              </ul>
              <h2>Vanliga förfaranden</h2>
              <ul>
                <li><strong>Öppet</strong> eller <strong>selektivt</strong> förfarande.</li>
                <li><strong>Förhandlat förfarande</strong> (med/utan föregående annonsering) i särskilda fall.</li>
                <li><strong>Förenklat förfarande</strong> under tröskelvärden.</li>
                <li><strong>Direktupphandling</strong> i begränsade situationer.</li>
              </ul>
              <h2>Tröskelvärden och annonsering</h2>
              <p>
                Över gällande tröskelvärden ska upphandlingar normalt annonseras i EU:s
                databas TED. Under tröskelvärden gäller nationella regler med enklare
                förfaranden. Värdet beräknas på kontraktets totala omfattning.
              </p>
              <h2>Utvärdering och tilldelning</h2>
              <p>
                Utvärdering sker enligt förutbestämda kriterier, t.ex. pris eller bästa
                förhållande mellan pris och kvalitet. Tilldelningsbeslut kan överprövas.
              </p>
              <h2>Praktiska råd</h2>
              <ul>
                <li>Följ tidsfrister och ställ frågor i tid vid oklarheter.</li>
                <li>Mappa krav mot dina styrkor och visa relevanta referenser.</li>
                <li>Använd <strong>CPV‑koder</strong> för att bevaka rätt upphandlingar.</li>
              </ul>
              <p>
                Se aktuella annonser och ramavtal: {" "}
                <Link href="/sv-se/sok-upphandling" className="underline">Sök upphandlingar</Link>.
              </p>
            </article>
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl border p-4 bg-card">
              <h3 className="font-semibold">Snabbfakta LOU</h3>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• Lag (2016:1145)</li>
                <li>• EU‑harmoniserade principer</li>
                <li>• Annonsering i TED över tröskelvärden</li>
              </ul>
            </div>
            <div className="rounded-xl border p-4">
              <h3 className="font-semibold">Relaterat</h3>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>
                  <Link href="/sv-se/faq/vad-ar-en-offentlig-upphandling" className="underline">
                    Vad är en offentlig upphandling?
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
