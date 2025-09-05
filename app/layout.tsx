import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import Analytics from "@/components/app/Analytics";
import CookieConsent from "@/components/app/CookieConsent";
import { Inter, Inconsolata } from "next/font/google";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Inconsolata({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.procurdo.com"),
  title: {
    default: "Procurdo – Sök offentliga upphandlingar i Sverige",
    template: "%s | Procurdo",
  },
  description:
    "Sök offentliga upphandlingar i Sverige. Bevakning av aktuella upphandlingar, ramavtal och anbud – snabbt och gratis att komma igång.",
  openGraph: {
    type: "website",
    url: "https://www.procurdo.com/sv-se",
    siteName: "Procurdo",
    title: "Procurdo – Sök offentliga upphandlingar i Sverige",
    description:
      "Sök offentliga upphandlingar, bevaka upphandlingar och hitta ramavtal.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@procurdo",
    title: "Procurdo – Sök offentliga upphandlingar i Sverige",
    description:
      "Sök offentliga upphandlingar, bevaka upphandlingar och hitta ramavtal.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProd = process.env.NODE_ENV === "production";
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-2KT03XRWKB";
  return (
    <html lang="sv-SE">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isProd && GA_ID ? (
          <>
            {/* Consent Mode default: deny until user choice */}
            <Script id="consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied',
                  'functionality_storage': 'denied',
                  'personalization_storage': 'denied',
                  'security_storage': 'granted',
                  'wait_for_update': 500
                });
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
            </Script>
            {/* Restore saved consent as soon as possible */}
            <Script id="consent-restore" strategy="afterInteractive">
              {`
                (function(){
                  try {
                    var raw = localStorage.getItem('cookie-consent-v2');
                    if (raw) {
                      var state = JSON.parse(raw);
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);} 
                      gtag('consent', 'update', state);
                    }
                  } catch (e) {}
                })();
              `}
            </Script>
          </>
        ) : null}
        {/* SPA route change tracking */}
        {isProd && GA_ID ? (
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        ) : null}
        {/* Cookie Banner */}
        {isProd ? <CookieConsent /> : null}
        {children}
      </body>
      </html>
  );
}
