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

