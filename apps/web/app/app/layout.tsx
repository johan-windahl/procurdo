import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AppHeader } from "@/components/app/AppHeader";
import { AppSidebar } from "@/components/app/AppSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/sv-se">
      <div className="flex min-h-dvh flex-col bg-background">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ClerkProvider>
  );
}
