import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildWebsiteJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vad är den offentliga sektorn? — Förklaring och exempel",
  description:
    "En begriplig förklaring av vad offentlig sektor är i Sverige: vad som ingår (stat, regioner, kommuner), hur den finansieras och varför den är viktig.",
  keywords: [
    "vad är den offentliga sektorn",
    "vad menas med den offentliga sektorn",
    "offentlig sektor",
    "offentlig sektor sverige",
    "stat region kommun",
    "myndigheter",
    "offentligt ägda bolag",
  ],
  alternates: { canonical: "/sv-se/faq/vad-ar-den-offentliga-sektorn" },
  openGraph: {
    title: "Vad är den offentliga sektorn?",
    description:
      "Definition, avgränsningar och exempel på vad som ingår i offentlig sektor i Sverige.",
    url: "https://www.procurdo.com/sv-se/faq/vad-ar-den-offentliga-sektorn",
    siteName: "Procurdo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vad är den offentliga sektorn?",
    description:
      "Vad menas med offentlig sektor – stat, regioner, kommuner och offentligt styrda bolag.",
  },
};

const websiteJsonLd = buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" });

const breadcrumbJsonLd = buildBreadcrumbJsonLd({
  baseUrl: "https://www.procurdo.com",
  items: [
    { name: "Startsida", url: "/sv-se" },
    { name: "FAQ", url: "/sv-se/faq" },
    { name: "Vad är den offentliga sektorn?", url: "/sv-se/faq/vad-ar-den-offentliga-sektorn" },
  ],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Vad är den offentliga sektorn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Offentlig sektor omfattar verksamheter som staten, regionerna och kommunerna ansvarar för eller kontrollerar – till exempel vård, skola, omsorg, rättsväsende, försvar och infrastruktur. Syftet är att tillhandahålla samhällsnyttiga tjänster finansierade främst via skatter.',
      },
    },
    {
      '@type': 'Question',
      name: 'Vad menas med den offentliga sektorn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Begreppet avser det samlade offentliga åtagandet: myndigheter och offentligt styrda organ som finansieras och styrs av det allmänna. I statistik kan även offentligt ägda bolag ingå om de står under offentlig kontroll.',
      },
    },
    {
      '@type': 'Question',
      name: 'Vilka ingår i offentlig sektor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Staten (regering och förvaltningsmyndigheter), 21 regioner (bl.a. hälso- och sjukvård, kollektivtrafik), 290 kommuner (skola, omsorg, vatten/avfall, samhällsservice) samt i vissa fall offentligt ägda eller kontrollerade bolag.',
      },
    },
    {
      '@type': 'Question',
      name: 'Är statliga och kommunala bolag offentlig sektor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I många sammanhang ja – om bolagen är offentligt ägda och kontrollerade. Exempel är vissa kommunala bostadsbolag eller statliga bolag. Exakta avgränsningar varierar i lagstiftning och statistik.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hur finansieras offentlig sektor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Främst via skatter (statlig inkomstskatt, kommunal skatt, moms, arbetsgivaravgifter), kompletterat av avgifter och statliga bidrag mellan nivåerna. Budget beslutas demokratiskt av riksdag, region- och kommunfullmäktige.',
      },
    },
  ],
} as const;

export default function PublicSectorFAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#e1f0fb] blur-3xl opacity-60 dark:opacity-20" />
          <div className="absolute top-32 right-[-120px] h-[380px] w-[380px] rounded-full bg-[#ffe6a7] blur-3xl opacity-50 dark:opacity-20" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-muted-foreground">
                FAQ • Offentlig sektor
              </p>
              <h1 className="text-3xl font-semibold tracking-tight mt-3 text-balance">
                Vad är den offentliga sektorn?
              </h1>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                Här förklarar vi vad som menas med offentlig sektor i Sverige – vad som ingår, vad som inte gör det, hur den finansieras och varför den spelar roll för företag som vill sälja till det offentliga.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/sv-se/sok-upphandling">
                  <Button size="lg">Sök upphandlingar</Button>
                </Link>
                <Link href="/sv-se/faq/lagen-om-offentlig-upphandling" className="inline-flex">
                  <Button variant="outline" size="lg">Läs om LOU</Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[200px] md:h-[240px]">
              <Image
                src="/globe.svg"
                alt="Illustration: Offentlig sektor och samhällsservice"
                fill
                className="object-contain opacity-90"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8 text-sm md:text-base leading-relaxed">
            <article className="space-y-4">
              <h2>En kort förklaring</h2>
              <p>
                Offentlig sektor är samlingsnamnet för verksamheter som det allmänna
                ansvarar för eller kontrollerar: staten (regering och myndigheter),
                regioner och kommuner. Uppdraget är att leverera samhällsnytta – som
                vård, skola, omsorg, rättsväsende, försvar, infrastruktur och kultur –
                oftast finansierat via skatter.
              </p>
            </article>

            <article className="space-y-4">
              <h2>Vad menas med den offentliga sektorn?</h2>
              <p>
                I praktiken handlar det om tre nivåer som tillsammans utgör det offentliga
                åtagandet:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Staten</strong> – riksdag, regering och förvaltningsmyndigheter (t.ex. Skatteverket,
                  Trafikverket, Polismyndigheten).
                </li>
                <li>
                  <strong>Regioner</strong> – ansvarar bl.a. för hälso- och sjukvård samt regional
                  kollektivtrafik.
                </li>
                <li>
                  <strong>Kommuner</strong> – ansvarar bl.a. för förskola och skola, äldreomsorg,
                  socialtjänst, vatten/avfall och lokal infrastruktur.
                </li>
              </ul>
              <p>
                I vissa sammanhang räknas även <strong>offentligt ägda eller kontrollerade bolag</strong>
                in, exempelvis kommunala bostadsbolag. Exakt avgränsning varierar beroende på
                statistik och regelverk.
              </p>
            </article>

            <article className="space-y-4">
              <h2>Vad ingår – och vad ingår inte?</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border p-4 bg-card/50">
                  <h3 className="font-semibold">Ingår i offentlig sektor</h3>
                  <ul className="mt-2 text-muted-foreground space-y-1">
                    <li>• Myndigheter och förvaltningar</li>
                    <li>• Regioner och kommuner</li>
                    <li>• Vård, skola, omsorg och rättsväsende</li>
                    <li>• Viss verksamhet i offentligt styrda bolag</li>
                  </ul>
                </div>
                <div className="rounded-xl border p-4">
                  <h3 className="font-semibold">Ingår inte</h3>
                  <ul className="mt-2 text-muted-foreground space-y-1">
                    <li>• <strong>Privat sektor</strong> – företag som ägs privat</li>
                    <li>• <strong>Civilsamhället</strong> – ideella föreningar och stiftelser</li>
                    <li>• Privata utförare på uppdrag (de ingår inte, även om finansieringen är offentlig)</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="space-y-4">
              <h2>Finansiering och styrning</h2>
              <p>
                Offentlig verksamhet finansieras främst via skatter, kompletterat av avgifter
                och riktade statsbidrag. Riksdag, region- och kommunfullmäktige beslutar om
                budget och inriktning. Viktiga principer är bl.a. likabehandling, insyn och
                god ekonomisk hushållning.
              </p>
            </article>

            <article className="space-y-4">
              <h2>Offentlig upphandling (LOU)</h2>
              <p>
                När offentlig sektor köper varor och tjänster gäller särskilda regler –
                <Link href="/sv-se/faq/lagen-om-offentlig-upphandling" className="underline">
                  Lagen om offentlig upphandling (LOU)
                </Link>
                . Upphandlingar annonseras och utvärderas för att säkerställa konkurrens och
                transparens.
              </p>
              <p>
                Vill du förstå processen? Läs {" "}
                <Link href="/sv-se/faq/vad-ar-en-offentlig-upphandling" className="underline">
                  Vad är en offentlig upphandling?
                </Link>
                . Eller gå direkt till att {" "}
                <Link href="/sv-se/sok-upphandling" className="underline">
                  söka upphandlingar
                </Link>
                .
              </p>
            </article>

            <article className="space-y-3">
              <h2>Vanliga frågor</h2>
              <div className="space-y-3">
                <details className="rounded-lg border p-4">
                  <summary className="font-medium cursor-pointer">Är statliga och kommunala bolag offentlig sektor?</summary>
                  <p className="mt-2 text-muted-foreground">
                    Ofta ja – framför allt när de är offentligt kontrollerade. Men avgränsningen kan
                    skilja mellan statistik, redovisning och juridik. Kontrollera hur begreppet definieras i
                    just ditt sammanhang.
                  </p>
                </details>
                <details className="rounded-lg border p-4">
                  <summary className="font-medium cursor-pointer">Skillnad på stat, offentlig sektor och förvaltning?</summary>
                  <p className="mt-2 text-muted-foreground">
                    Staten är en del av offentlig sektor. Förvaltning syftar ofta på de myndigheter som
                    bereder och verkställer politiska beslut. Offentlig sektor är det bredare paraplyet som
                    även inkluderar regioner och kommuner.
                  </p>
                </details>
                <details className="rounded-lg border p-4">
                  <summary className="font-medium cursor-pointer">Hur stor är offentlig sektor i Sverige?</summary>
                  <p className="mt-2 text-muted-foreground">
                    Den är betydande och varierar över tid. Andelen av BNP och sysselsättning påverkas av
                    konjunktur, demografi och politiska prioriteringar. För aktuell statistik – se t.ex.
                    officiella källor som Ekonomifakta eller SCB.
                  </p>
                </details>
              </div>
            </article>
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl border p-4 bg-card">
              <h3 className="font-semibold">Snabbfakta</h3>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• Tre nivåer: stat, region, kommun</li>
                <li>• Finansiering: främst skatter</li>
                <li>• Syfte: samhällsnytta och service</li>
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
                  <Link href="/sv-se/faq/lagen-om-offentlig-upphandling" className="underline">
                    Lagen om offentlig upphandling (LOU)
                  </Link>
                </li>
                <li>
                  <Link href="/sv-se/sok-upphandling" className="underline">
                    Sök upphandlingar
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

