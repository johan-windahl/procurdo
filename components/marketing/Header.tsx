import Link from "next/link";
import { Button } from "@/components/ui/button";

type NavItem = { label: string; href: string };

const nav: NavItem[] = [
  { label: "Funktioner", href: "/sv-se#funktioner" },
  { label: "FAQ", href: "/sv-se/faq" },
  { label: "Kontakt", href: "/sv-se#kontakt" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/sv-se" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">Procurdo</span>
        </Link>
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
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/sv-se/sok-upphandling">
            <Button size="md">Sök upphandlingar</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
