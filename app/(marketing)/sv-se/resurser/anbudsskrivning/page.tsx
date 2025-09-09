import type { Metadata } from "next";
import Link from "next/link";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getPostBySlug } from "@/lib/posts";

const slug = "anbudsskrivning" as const;
const post = getPostBySlug(slug, "sv-se");

export const metadata: Metadata = {
  title: {
    absolute: "Anbudsskrivning: Komplett guide (2025) – vinn fler upphandlingar",
  },
  description:
    "Anbudsskrivning från start till mål: administrativa villkor, leverantörskrav & uteslutning, utvärderingsgrund, kontraktsvillkor och kontraktsuppföljning – plus steg‑för‑steg, checklista och mall.",
  keywords: [
    "anbudsskrivning",
    "anbud",
    "offentlig upphandling",
    "LOU",
    "kvalitetskriterier",
    "ramavtal",
  ],
  alternates: { canonical: "/sv-se/resurser/anbudsskrivning" },
  openGraph: {
    type: "article",
    title: "Anbudsskrivning: Komplett guide (2025) – vinn fler upphandlingar",
    description:
      "Anbudsskrivning enligt LOU: förstå krav, utvärderingsgrund och kontrakt – skriv vinnande svar.",
    url: "https://www.procurdo.com/sv-se/resurser/anbudsskrivning",
    siteName: "Procurdo",
    images: post?.coverImage
      ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: "Procurdo – Anbudsskrivning guide",
        },
      ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Anbudsskrivning: Komplett guide (2025) – vinn fler upphandlingar",
    description:
      "Anbudsskrivning enligt LOU: administrativa villkor, leverantörskrav, utvärdering, kontrakt & uppföljning.",
    images: post?.coverImage ? [post.coverImage] : undefined,
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  const jsonLd = buildArticleJsonLd({
    baseUrl: "https://www.procurdo.com",
    urlPath: `/sv-se/resurser/${slug}`,
    headline: "Anbudsskrivning: Komplett guide (2025) – vinn fler upphandlingar",
    description: metadata.description as string,
    image: post?.coverImage,
    datePublished: post?.publishedAt ?? new Date().toISOString(),
    dateModified: post?.updatedAt ?? post?.publishedAt,
    authorName: "Procurdo",
    siteName: "Procurdo",
  });
  const breadcrumbLd = buildBreadcrumbJsonLd({
    baseUrl: "https://www.procurdo.com",
    items: [
      { name: "Start", url: "/sv-se" },
      { name: "Resurser", url: "/sv-se/resurser" },
      { name: "Anbudsskrivning", url: `/sv-se/resurser/${slug}` },
    ],
  });

  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <header className="mb-8">
        <p className="text-xs text-muted-foreground">
          Publicerad {new Date(post?.publishedAt ?? Date.now()).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
          {post?.readingTimeMinutes ? ` • ${post.readingTimeMinutes} min läsning` : null}
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Anbudsskrivning: komplett guide för att vinna upphandlingar
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          En praktisk genomgång av anbudsskrivning enligt LOU – från administrativa villkor och leverantörskrav till utvärderingsgrund, kontraktsvillkor och uppföljning.
        </p>
      </header>

      <nav aria-label="Innehåll" className="mb-8 rounded-lg border p-4 bg-white/70 dark:bg-transparent">
        <p className="text-sm font-semibold">Innehåll</p>
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
          <li><a href="#vad-ar-anbudsskrivning" className="underline underline-offset-4">Vad är anbudsskrivning?</a></li>
          <li><a href="#forsta-upphandlingsdokumenten" className="underline underline-offset-4">Förstå upphandlingsdokumenten</a></li>
          <li><a href="#leverantorskrav-uteslutning" className="underline underline-offset-4">Leverantörskrav & uteslutning</a></li>
          <li><a href="#utvarderingsgrund" className="underline underline-offset-4">Utvärderingsgrund</a></li>
          <li><a href="#kontraktsvillkor" className="underline underline-offset-4">Kontraktsvillkor</a></li>
          <li><a href="#kontraktsuppfoljning" className="underline underline-offset-4">Kontraktsuppföljning</a></li>
          <li><a href="#steg-for-steg" className="underline underline-offset-4">Anbudsskrivning steg för steg</a></li>
          <li><a href="#vanliga-fallgropar" className="underline underline-offset-4">Vanliga fallgropar</a></li>
          <li><a href="#checklista" className="underline underline-offset-4">Checklista</a></li>
          <li><a href="#mall" className="underline underline-offset-4">Mallstruktur</a></li>
          <li><a href="#faq" className="underline underline-offset-4">FAQ</a></li>
          <li><a href="#vidare-lasning" className="underline underline-offset-4">Vidare läsning</a></li>
        </ul>
      </nav>

      <section id="vad-ar-anbudsskrivning" className="space-y-4">
        <h2 className="text-2xl font-semibold">Vad är anbudsskrivning?</h2>
        <p>
          Anbudsskrivning är processen att utforma ett formellt svar på en upphandling enligt LOU/LUF. Ett vinnande anbud är inte bara korrekt och komplett – det visar tydligt hur ni uppfyller alla skall‑krav, adresserar utvärderingskriterierna och levererar mervärde med låg risk för den upphandlande myndigheten.
        </p>
        <p>
          Nyckeln är att läsa förfrågningsunderlaget metodiskt, strukturera svaren smart och bevisa påståenden med relevanta bevis: referenser, processer, nyckeltal och bilagor.
        </p>
      </section>

      <section id="forsta-upphandlingsdokumenten" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Förstå upphandlingsdokumenten och administrativa villkor</h2>
        <p>
          Börja anbudsskrivningen med att kartlägga administrativa villkor: sista anbudsdag, inlämningssätt och format, språk, frågeperiod, sekretess samt hur kompletteringar hanteras. Skilj på kvalificeringskrav (på er som leverantör), tekniska krav (på lösningen) och utvärderingskriterier (hur anbud poängsätts). Sätt deadlines och ansvar i en kravmatris.
        </p>
        <p>
          Kontrollera bilagekrav, teckenbegränsningar och mallar. Följ alltid rubrikstrukturen i underlaget – det gör det lätt att bedöma och minskar risken för formaliafel.
        </p>
      </section>

      <section id="leverantorskrav-uteslutning" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Leverantörskrav och grunder för uteslutning</h2>
        <p>
          Upphandlande myndighet kan ställa krav på ekonomisk och teknisk kapacitet, referenser, kvalitets‑ och miljöledningssystem samt intyg. Det finns också obligatoriska och fakultativa uteslutningsgrunder (exempelvis vissa brott eller allvarliga fel i yrkesutövningen). Beskriv tydligt hur ni uppfyller kraven och bifoga bevis.
        </p>
        <p>
          Om något tidigare förhållande kan påverka prövningen – beskriv eventuella "self‑cleaning"‑åtgärder (åtgärdsprogram, internkontroller, ersättning) för att visa att risken är undanröjd.
        </p>
      </section>

      <section id="utvarderingsgrund" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Utvärderingsgrund: pris, kostnad eller pris‑kvalitet</h2>
        <p>
          Vanliga utvärderingsgrunder är <em>lägsta pris</em>, <em>kostnad</em> (t.ex. livscykelkostnad) eller <em>bästa förhållande mellan pris och kvalitet</em>. Läs poängmatris och viktning noggrant. Svara med styrkt metodik, mätbar effekt och konkreta nyttor där kvalitet poängsätts – och var tydlig med antaganden när pris eller kostnad jämförs.
        </p>
        <p>
          Visa hur ni minskar risk och total ägandekostnad (TCO), och gör det snabbt för en granskare att hitta bevisen.
        </p>
      </section>

      <section id="kontraktsvillkor" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Kontraktsvillkor: leverans, SLA och viten</h2>
        <p>
          Kontraktsvillkoren styr leveransen: SLA, viten, säkerhet, sekretess, hållbarhets‑ och sociala krav, underleverantörer, förändringshantering, IP‑rätt och uppsägning. Säkerställ att ni kan acceptera villkoren och beskriv hur ni efterlever dem i praktiken (processer, roller, mätetal, rapportering).
        </p>
        <p>
          Föreslå endast alternativa lösningar eller villkor om det uttryckligen tillåts. Annars riskerar anbudet att förkastas som orent.
        </p>
      </section>

      <section id="kontraktsuppfoljning" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Kontraktsuppföljning: mätning och styrning</h2>
        <p>
          Beskriv hur leveransen följs upp: KPI:er, rapportfrekvens, mötesstruktur, revisioner, incident‑ och förändringshantering. Ange ansvar, mätpunkter och hur avvikelser hanteras. En tydlig plan för uppföljning och styrning sänker upphandlarens risk och kan höja kvalitetspoängen.
        </p>
      </section>

      <section id="steg-for-steg" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Anbudsskrivning – steg för steg</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li><strong>Kartlägg villkor.</strong> Samla administrativa villkor, frågedeadlines och rubriker i en kravmatris.</li>
          <li><strong>Kvalificering.</strong> Säkerställ att ni uppfyller leverantörskraven och adressera ev. uteslutningsrisker.</li>
          <li><strong>Vinnarstrategi.</strong> Rikta svaren mot vald utvärderingsgrund och viktning.</li>
          <li><strong>Strukturera svaren.</strong> Spegla rubrikerna, använd tydliga underrubriker, tabeller och bevis.</li>
          <li><strong>Pris & TCO.</strong> Redovisa antaganden, undvik dolda kostnader och visa kostnadseffektivitet.</li>
          <li><strong>Kontrakt.</strong> Visa hur ni möter kontraktsvillkoren i praktiken (SLA, rapportering, risk).</li>
          <li><strong>Granska.</strong> Oberoende slutkontroll för uppfyllnad, läsbarhet och konsekvens.</li>
          <li><strong>Lämna in rätt.</strong> Följ format, signering och tid – undvik sista‑minuten‑fel.</li>
        </ol>
      </section>

      <section id="vanliga-fallgropar" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Vanliga fallgropar</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Generiska svar utan koppling till verksamhetens behov och risker.</li>
          <li>Otillräckliga bevis: påståenden utan data, referenser eller processer.</li>
          <li>Missad struktur: följer inte rubrikerna – gör poängsättning svår.</li>
          <li>Pris som inte matchar leveransmodell eller volymantaganden.</li>
          <li>Sen inlämning som ökar felrisk och filproblem.</li>
        </ul>
      </section>

      <section id="checklista" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Checklista för anbudsskrivning</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Spårbar kravmatris med ansvarig och evidens för varje krav.</li>
          <li>Röd tråd: 3–5 nyckelbudienden som återkommer i hela anbudet.</li>
          <li>Bevisbank: referenser, CV, certifikat, processer, KPI:er, case.</li>
          <li>Skärmdumpsäkra tabeller och konsekvent filnamnsstandard.</li>
          <li>Slutgranskning av oberoende reviewer (uppfyllnad + läsbarhet).</li>
        </ul>
      </section>

      <section id="mall" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Mall – strukturera svaren för maximal poäng</h2>
        <p>Spegelvänd underlagets rubriker och använd tydliga block:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Sammanfattning:</strong> 5–7 meningar som knyter an till myndighetens mål.</li>
          <li><strong>Leveransmodell:</strong> roller, flöde, SLA, kvalitetskontroller, uppföljning.</li>
          <li><strong>Metod & genomförande:</strong> milstolpar, riskhantering, eskalering.</li>
          <li><strong>Kompetens & kapacitet:</strong> team, CV, nyckelpersoners ansvar.</li>
          <li><strong>Referenser:</strong> relevans, utfall, överförbarhet, kontaktperson.</li>
          <li><strong>Hållbarhet & sociala krav:</strong> faktiska rutiner, mätbara mål.</li>
          <li><strong>Pris & TCO:</strong> antaganden, alternativa upplägg om tillåtet.</li>
          <li><strong>Bilagor:</strong> indexerade och refererade i texten.</li>
        </ol>
      </section>

      <section id="faq" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">FAQ om anbudsskrivning</h2>
        <div className="rounded-lg border p-4 bg-white/70 dark:bg-transparent space-y-3">
          <details>
            <summary className="font-semibold">Hur många sidor bör ett anbud vara?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Så kort som möjligt men så långt som nödvändigt. Följ tecken- och sidbegränsningar och använd bilagor för detaljer.</p>
          </details>
          <details>
            <summary className="font-semibold">Vad ger hög poäng på kvalitetskriterier?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Tydlig metodik, mätbar effekt, verifierbara referenser och låg risk. Visa hur ni gör – inte bara vad.</p>
          </details>
          <details>
            <summary className="font-semibold">Hur sätter jag rätt pris?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Utgå från volymantaganden, TCO och risk, känn dina konkurrenter och vad de lägger för pris. Säkerställ att leveransmodellen och SLA:er är ekonomiskt hållbara.</p>
          </details>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Hur många sidor bör ett anbud vara?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Så kort som möjligt men så långt som nödvändigt. Följ tecken- och sidbegränsningar och använd bilagor för detaljer.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Vad ger hög poäng på kvalitetskriterier?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Tydlig metodik, mätbar effekt, verifierbara referenser och låg risk. Visa hur ni gör – inte bara vad.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Hur sätter jag rätt pris?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Utgå från volymantaganden, TCO och risk, känn dina konkurrenter och vad de lägger för pris. Säkerställ att leveransmodellen och SLA:er är ekonomiskt hållbara.'
                  }
                }
              ]
            })
          }}
        />
      </section>

      <section id="vidare-lasning" className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">Resurser och vidare läsning</h2>
        <p>
          Vill du hitta aktuella uppdrag att öva på? Prova vår kostnadsfria sökfunktion för upphandlingar och ramavtal.
        </p>
        <p>
          <Link href="/sv-se/sok-upphandling" className="underline underline-offset-4">Sök upphandlingar gratis</Link>
        </p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>
            <a href="https://www.upphandlingsmyndigheten.se/gora-affarer-med-offentlig-sektor/lamna-anbud/" target="_blank" rel="noopener noreferrer" className="underline">Upphandlingsmyndigheten – Lämna anbud</a>
          </li>
          <li>
            <a href="https://www.upphandlingsmyndigheten.se/inkopsprocessen/genomfor-upphandlingen/information-om-upphandlingen-och-administrativa-villkor/" target="_blank" rel="noopener noreferrer" className="underline">Administrativa villkor</a>
          </li>
          <li>
            <a href="https://www.upphandlingsmyndigheten.se/inkopsprocessen/genomfor-upphandlingen/krav-pa-leverantoren-och-grund-for-uteslutning/" target="_blank" rel="noopener noreferrer" className="underline">Leverantörskrav & uteslutning</a>
          </li>
          <li>
            <a href="https://www.upphandlingsmyndigheten.se/inkopsprocessen/genomfor-upphandlingen/grund-for-utvardering/" target="_blank" rel="noopener noreferrer" className="underline">Grund för utvärdering</a>
          </li>
          <li>
            <a href="https://www.upphandlingsmyndigheten.se/inkopsprocessen/genomfor-upphandlingen/kontraktsvillkor/" target="_blank" rel="noopener noreferrer" className="underline">Kontraktsvillkor</a>
          </li>
          <li>
            <a href="https://www.upphandlingsmyndigheten.se/inkopsprocessen/genomfor-upphandlingen/information-om-kontraktsuppfoljning/" target="_blank" rel="noopener noreferrer" className="underline">Kontraktsuppföljning</a>
          </li>
        </ul>
      </section>
    </article>
  );
}
