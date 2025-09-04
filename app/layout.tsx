import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import Analytics from "@/components/app/Analytics";
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
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
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
        {children}
      </body>
    </html>
  );
}
