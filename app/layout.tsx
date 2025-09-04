import type { Metadata } from "next";
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
  return (
    <html lang="sv-SE">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
