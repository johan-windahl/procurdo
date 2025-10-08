import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/sv-se">
      <div className="min-h-dvh">
        {children}
      </div>
    </ClerkProvider>
  );
}
