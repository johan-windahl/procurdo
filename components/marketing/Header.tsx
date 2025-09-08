"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

type NavItem = { label: string; href: string };

const nav: NavItem[] = [
  { label: "Funktioner", href: "/sv-se#funktioner" },
  { label: "FAQ", href: "/sv-se/faq" },
  { label: "Kontakt", href: "/sv-se#kontakt" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/sv-se" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">Procurdo</span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/sv-se/sok-upphandling">
            <Button size="md">Sök upphandlingar</Button>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border hover:bg-accent"
          aria-label="Öppna meny"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div id="mobile-menu" className={`md:hidden ${open ? "block" : "hidden"}`}>
        <div className="px-5 pb-6 pt-2 border-t bg-background">
          <div className="flex flex-col gap-3 py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-base text-foreground/90"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/sv-se/sok-upphandling" onClick={() => setOpen(false)}>
              <Button size="lg" className="w-full">
                Sök upphandlingar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
