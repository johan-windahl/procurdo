import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://www.procurdo.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/sv-se"],
        disallow: ["/app"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

