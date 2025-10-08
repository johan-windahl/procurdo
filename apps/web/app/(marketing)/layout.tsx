import type { ReactNode } from "react";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { ClerkProvider } from "@clerk/nextjs";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider dynamic>
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ClerkProvider>
  );
}

