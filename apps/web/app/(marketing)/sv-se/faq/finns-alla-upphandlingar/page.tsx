import type { Metadata } from "next";
import Link from "next/link";
import { buildWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Finns alla upphandlingar?",
  description:
    "Finns alla offentliga upphandlingar samlade? Bakgrund, regelverk och varför Sverige saknar en komplett, samlad annonsdatabas – samt hur du bevakar brett.",
  keywords: [
    "alla upphandlingar",
    "alla offentliga upphandlingar",
    "offentlig upphandling",
  ],
  alternates: { canonical: "/sv-se/faq/finns-alla-upphandlingar" },
  openGraph: {
    title: "Finns alla upphandlingar?",
    description:
      "Varför finns ingen fullständig samlad databas i Sverige och hur annonsering fungerar (nationellt och inom EU).",
    url: "https://www.procurdo.com/sv-se/faq/finns-alla-upphandlingar",
    siteName: "Procurdo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finns alla upphandlingar?",
    description:
      "Svensk modell med flera annonsdatabaser, EU-annonsering och vad det betyder för täckning.",
  },
};

const websiteJsonLd = buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" });

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Finns alla upphandlingar?',
  about: 'Offentliga upphandlingar i Sverige',
  inLanguage: 'sv-SE',
} as const;

export default function AllTendersPage() {
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
          <h1 className="text-3xl font-semibold tracking-tight">Finns alla upphandlingar?</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Vi på Procurdo har alla EU‑upphandlingar och strävar efter att vara så kompletta som lagen tillåter i Sverige.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <article className="text-sm md:text-base leading-relaxed space-y-4">
              <p>
                Tyvärr inte. Det finns ingen enda databas eller tjänst i Sverige som innehåller samtliga offentliga upphandlingar. Detta beror på att Sverige har valt en unik modell med flera konkurrerande privata aktörer som driver separata annonsdatabaser, istället för en samlad statlig lösning.
              </p>

              <h2>Varför är det så?</h2>
              <h3 className="mt-2 font-semibold">Privatiserad annonsdatabasmarknad</h3>
              <p>
                Sverige är unikt bland EU- och OECD-länder genom att ha konkurrensutsatt marknaden för upphandlingsannonser till privata aktörer. Detta innebär att:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Myndigheter väljer vilken annonsdatabas de vill använda</li>
                <li>En upphandling publiceras vanligtvis endast i den valda databasen</li>
                <li>Det sker ingen automatisk datadelning mellan databaserna</li>
              </ul>

              <h3 className="mt-4 font-semibold">Upphovsrättsliga begränsningar</h3>
              <p>
                De privata annonsdatabaserna äger sina data och system, vilket begränsar möjligheterna till automatisk sammanställning av information från alla källor.
              </p>

              <h2>Var och när måste upphandlingar annonseras?</h2>
              <h3 className="mt-2 font-semibold">Direktupphandling</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Värde</strong>: Under direktupphandlingsgränsen (ca 75 000–200 000 kr exkl. moms beroende på myndighetstyp)</li>
                <li><strong>Annonsering</strong>: Ingen obligatorisk annonsering krävs</li>
              </ul>

              <h3 className="mt-4 font-semibold">Nationella upphandlingar</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Värde</strong>: Mellan direktupphandlingsgränsen och EU:s tröskelvärde</li>
                <li><strong>Annonsering</strong>: Måste publiceras i en registrerad svensk annonsdatabas</li>
                <li><strong>Exempel på tröskelvärden (2024)</strong>:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Statliga myndigheter: 1 546 202 kr</li>
                    <li>Övriga myndigheter: 2 389 585 kr</li>
                    <li>Byggentreprenader: 59 880 179 kr</li>
                  </ul>
                </li>
              </ul>

              <h3 className="mt-4 font-semibold">EU‑upphandlingar</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Värde</strong>: Över EU:s tröskelvärden</li>
                <li><strong>Annonsering</strong>: Måste publiceras i både TED (EU:s databas) och en registrerad svensk annonsdatabas</li>
              </ul>

              <h2>Vilka databaser finns det?</h2>
              <p>För att få fullständig täckning måste du söka i alla registrerade annonsdatabaser:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Mercell Annonsdatabas</strong> (64% av marknaden 2023)</li>
                <li><strong>e‑Avrop</strong> (20% av marknaden)</li>
                <li><strong>KommersAnnons.se</strong> (15,5% av marknaden)</li>
                <li><strong>Konstpool</strong> (minimal användning)</li>
                <li><strong>Clira Annonsdatabas</strong></li>
              </ul>

              <h2>Utreds förbättringar?</h2>
              <p>
                Ja, det pågår diskussioner om att förbättra situationen. Regeringen och Upphandlingsmyndigheten arbetar med att:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Förbättra upphandlingsstatistiken genom lagen om upphandlingsstatistik</li>
                <li>Samla in data från alla registrerade databaser till en nationell statistikdatabas</li>
                <li>Göra upphandlingsdata tillgänglig som öppna data</li>
              </ul>
              <p>
                Dock fokuserar dessa initiativ främst på statistik och transparens snarare än att skapa en samlad annonsdatabas för leverantörer.
              </p>

              <p className="font-semibold">
                Slutsats: För att inte missa upphandlingar måste leverantörer idag söka i flera databaser eller använda kommersiella tjänster som aggregerar information från olika källor.
              </p>

              <p>
                Vill du se aktuella annonser? {" "}
                <Link href="/sv-se/sok-upphandling" className="underline">Sök upphandlingar</Link>.
              </p>

              <h2>Källor</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li><a href="https://www.konkurrensverket.se/upphandling/registrerade-annonsdatabaser/" className="underline" target="_blank" rel="noopener noreferrer">Konkurrensverket – Registrerade annonsdatabaser</a></li>
                <li><a href="https://www.konkurrensverket.se/upphandling/registrerade-annonsdatabaser/annonsdatabasregistret/" className="underline" target="_blank" rel="noopener noreferrer">Annonsdatabasregistret</a></li>
                <li><a href="https://www.upphandlingsmyndigheten.se/statistik/upphandlingsstatistik/statistik-om-annonserade-upphandlingar-2023/drygt-17-000-upphandlingar-annonserades-2023/" className="underline" target="_blank" rel="noopener noreferrer">Upphandlingsmyndigheten – Statistik</a></li>
                <li><a href="https://www.regeringen.se/contentassets/18541d647dcc468998187940eb08f276/statistik-pa-upphandlingsomradet.pdf" className="underline" target="_blank" rel="noopener noreferrer">Regeringen – Statistik på upphandlingsområdet</a></li>
                <li><a href="https://inkopsradet.se/unik-svensk-losning-for-databaser/" className="underline" target="_blank" rel="noopener noreferrer">Inköpsrådet – Unik svensk lösning</a></li>
                <li><a href="https://lagen.nu/ds/2017:48" className="underline" target="_blank" rel="noopener noreferrer">Lagen.nu – Ds 2017:48</a></li>
                <li><a href="https://upphandling24.se/breddad-bas-ger-eu-perspektiv/" className="underline" target="_blank" rel="noopener noreferrer">Upphandling24 – EU‑perspektiv</a></li>
                <li><a href="https://www.upphandlingsmyndigheten.se/globalassets/dokument/statistik/dokument-2023/kvalitetsdeklaration-2022-annonserade-upphandlingar-2022.pdf" className="underline" target="_blank" rel="noopener noreferrer">Kvalitetsdeklaration</a></li>
                <li><a href="https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-20161145-om-offentlig-upphandling_sfs-2016-1145/" className="underline" target="_blank" rel="noopener noreferrer">Lag (2016:1145) om offentlig upphandling</a></li>
                <li><a href="https://www.konkurrensverket.se/upphandling/lagar-och-regler/troskelvarden/" className="underline" target="_blank" rel="noopener noreferrer">Konkurrensverket – Tröskelvärden</a></li>
                <li><a href="https://www.upphandlingsmyndigheten.se/regler-och-lagstiftning/troskelvarden-och-direktupphandlingsgranser/" className="underline" target="_blank" rel="noopener noreferrer">UHM – Tröskelvärden och direktupphandling</a></li>
                <li><a href="https://www.upphandlingsmyndigheten.se/inkopsprocessen/genomfor-upphandlingen/annonsera/" className="underline" target="_blank" rel="noopener noreferrer">UHM – Annonsera</a></li>
                <li><a href="https://www.upphandlingsmyndigheten.se/om-oss/var-oppna-data/om-oppna-data-pa-upphandlingsmyndigheten/" className="underline" target="_blank" rel="noopener noreferrer">UHM – Öppna data</a></li>
              </ul>
            </article>
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl border p-4 bg-card">
              <h3 className="font-semibold">Snabbt svar</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Nej, det finns ingen enskild svensk databas med alla offentliga upphandlingar. Sverige har flera privata annonsdatabaser där upphandlingar under EU:s tröskelvärden annonseras.
              </p>
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
                  <Link href="/sv-se/faq/lagen-om-offentlig-upphandling" className="underline">
                    Lagen om offentlig upphandling (LOU)
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
