"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">Procurdo</span>
        </Link>
        <nav className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </nav>
      </div>
    </header>
  );
}
