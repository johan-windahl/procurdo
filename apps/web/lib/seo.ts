export function buildWebsiteJsonLd(params: {
  baseUrl: string;
  localePath?: string;
  searchPath?: string;
  siteName?: string;
}) {
  const { baseUrl, localePath = "/sv-se", searchPath = "/sv-se/sok-upphandling", siteName = "Procurdo" } = params;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: `${baseUrl}${localePath}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}${searchPath}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  } as const;
}

export function buildArticleJsonLd(params: {
  baseUrl: string;
  urlPath: string; // e.g. /sv-se/resurser/anbudsskrivning
  headline: string;
  description: string;
  image?: string;
  datePublished: string; // ISO
  dateModified?: string; // ISO
  authorName?: string;
  siteName?: string;
}) {
  const {
    baseUrl,
    urlPath,
    headline,
    description,
    image,
    datePublished,
    dateModified,
    authorName = "Procurdo",
    siteName = "Procurdo",
  } = params;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${urlPath}`,
    },
    headline,
    description,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/PROCURDO_twoline.png`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
  };

  if (image) {
    data.image = [image.startsWith("http") ? image : `${baseUrl}${image}`];
  }

  return data;
}

export function buildBreadcrumbJsonLd(params: {
  baseUrl: string;
  items: Array<{ name: string; url: string }>;
}) {
  const { baseUrl, items } = params;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  } as const;
}
