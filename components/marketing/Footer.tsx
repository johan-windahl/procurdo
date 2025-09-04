import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Procurdo. Alla rättigheter förbehållna.
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/sv-se#kontakt" className="hover:text-foreground">Kontakt</Link>
          <Link href="/sv-se/integritet" className="hover:text-foreground">Integritet</Link>
        </nav>
      </div>
    </footer>
  );
}
