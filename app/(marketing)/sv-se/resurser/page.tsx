import type { Metadata } from "next";
import Link from "next/link";
import { getPostsByLocale } from "@/lib/posts";

export const metadata: Metadata = {
  title: {
    absolute: "Resurser – Guide och kunskap om offentlig upphandling | Procurdo",
  },
  description:
    "Artiklar och guider om offentlig upphandling, anbudsskrivning och ramavtal. Praktiska checklistor och exempel som hjälper dig vinna fler affärer.",
  alternates: { canonical: "/sv-se/resurser" },
  openGraph: {
    title: "Resurser – Offentlig upphandling & anbud | Procurdo",
    description:
      "Guider och resurser om upphandling, anbudsskrivning och ramavtal.",
    url: "https://www.procurdo.com/sv-se/resurser",
    siteName: "Procurdo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resurser – Offentlig upphandling & anbud | Procurdo",
    description:
      "Guider och resurser om upphandling, anbudsskrivning och ramavtal.",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  const posts = getPostsByLocale("sv-se");
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Resurser
        </h1>
        <p className="new-page-paragraph mt-3 max-w-3xl mx-auto">
          Fördjupade guider och praktiska tips om offentlig upphandling, anbudsskrivning och ramavtal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/sv-se/resurser/${post.slug}`}
            className="group rounded-xl border bg-card hover:bg-accent/20 transition-colors"
          >
            <div className="p-6">
              <p className="text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {post.readingTimeMinutes ? ` • ${post.readingTimeMinutes} min läsning` : null}
              </p>
              <h2 className="mt-2 text-xl font-semibold group-hover:underline">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
              {post.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[11px] rounded-full border px-2 py-0.5 text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

