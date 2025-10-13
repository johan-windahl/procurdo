import type { Metadata } from "next";
import { buildWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Läs hur Procurdo hanterar personuppgifter och cookies. Vi samlar in minsta möjliga data och du kan när som helst ändra ditt samtycke.",
  alternates: { canonical: "/integritet" },
  openGraph: {
    title: "Integritetspolicy",
    description:
      "Information om personuppgifter, cookies, samtycke, lagring och dina rättigheter hos Procurdo.",
    url: "https://www.procurdo.com/integritet",
    siteName: "Procurdo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Integritetspolicy | Procurdo",
    description:
      "Hur vi behandlar personuppgifter och använder cookies på Procurdo.",
  },
};

const websiteJsonLd = buildWebsiteJsonLd({ baseUrl: "https://www.procurdo.com" });

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight">Integritetspolicy</h1>
          <p className="mt-2 text-muted-foreground">
            Din integritet är viktig för oss. På den här sidan förklarar vi vilka
            personuppgifter vi behandlar, varför vi gör det och vilka rättigheter
            du har enligt tillämplig dataskyddslagstiftning (GDPR).
          </p>

          <div className="mt-8 space-y-8">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Personuppgifter vi behandlar</h2>
              <p className="text-sm text-muted-foreground">
                Procurdo erbjuder kostnadsfri sökning av offentliga upphandlingar.
                Du kan använda tjänsten utan konto. Vi behandlar därför normalt
                inte några personuppgifter om dig, förutom när du frivilligt
                kontaktar oss (t.ex. via e‑post) eller lämnar uppgifter i samband
                med support eller feedback.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Cookies och analys</h2>
              <p className="text-sm text-muted-foreground">
                Vi använder cookies för att förbättra upplevelsen och analysera
                trafik. I läget standard är icke nödvändiga cookies avstängda
                tills du lämnar samtycke via vår cookie‑banner. Du kan när som
                helst ändra ditt val. Vi kan använda Google Analytics för
                aggregerad statistik om användning av webbplatsen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Rättslig grund</h2>
              <p className="text-sm text-muted-foreground">
                När vi behandlar personuppgifter gör vi det med stöd av berättigat
                intresse (t.ex. för att förbättra och säkra tjänsten) eller ditt
                samtycke (t.ex. icke nödvändiga cookies). Du kan när som helst
                återkalla ett lämnat samtycke.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Lagringstid</h2>
              <p className="text-sm text-muted-foreground">
                Vi sparar personuppgifter endast så länge som behövs för de syften
                de samlades in för, eller enligt lagens krav. Uppgifter från
                kontakt via e‑post raderas löpande när ärendet är avslutat.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Tredje parter</h2>
              <p className="text-sm text-muted-foreground">
                Vår sökfunktion hämtar upphandlingsdata från EU:s TED‑API. Dina
                förfrågningar mot vår sök‑endpoint kan loggas tekniskt för drift
                och felsökning. Vi säljer aldrig dina uppgifter och delar inte
                personuppgifter med tredje part för marknadsföringsändamål.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Dina rättigheter</h2>
              <p className="text-sm text-muted-foreground">
                Du har rätt att begära tillgång till, rättelse eller radering av
                dina personuppgifter, samt rätt att invända mot viss behandling
                och att lämna klagomål till Integritetsskyddsmyndigheten.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Kontakt</h2>
              <p className="text-sm text-muted-foreground">
                Personuppgiftsansvarig: Procurdo.
                Kontakta oss på
                {" "}
                <a className="underline" href="mailto:hello@procurdo.com">
                  hello@procurdo.com
                </a>{" "}
                om du har frågor om integritet eller vill utöva dina rättigheter.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
