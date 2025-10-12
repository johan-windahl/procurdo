export type PostMeta = {
  slug: string;
  locale: "sv-se";
  title: string;
  description: string;
  publishedAt: string; // ISO string
  updatedAt?: string; // ISO string
  readingTimeMinutes?: number;
  tags?: string[];
  coverImage?: string;
};

export const posts: PostMeta[] = [
  {
    slug: "anbudsskrivning",
    locale: "sv-se",
    title: "Anbudsskrivning: komplett guide för att vinna upphandlingar",
    description:
      "Lär dig anbudsskrivning steg för steg: kravanalys, metodik, prissättning, kvalitetskriterier och vanliga fallgropar. Praktiska checklistor och exempel.",
    publishedAt: "2025-09-09T08:00:00.000Z",
    readingTimeMinutes: 12,
    tags: ["anbudsskrivning", "offentlig upphandling", "LOU", "ramavtal"],
    coverImage: "/PROCURDO_twoline.png",
  },
];

export function getPostsByLocale(locale: PostMeta["locale"]) {
  return posts.filter((p) => p.locale === locale);
}

export function getPostBySlug(slug: string, locale: PostMeta["locale"]) {
  return posts.find((p) => p.slug === slug && p.locale === locale) || null;
}

