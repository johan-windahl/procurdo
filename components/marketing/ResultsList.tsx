export type Notice = {
  publicationNumber: string;
  publicationDate: string;
  deadlineDate?: string;
  title: string;
  buyerName: string;
  buyerCity?: string;
  country?: string;
  documentUrl?: string;
  value?: string;
  description?: string;
};

type Props = {
  results: Notice[];
  page: number;
  limit: number;
  total: number;
  onPage: (p: number) => void;
};

export default function ResultsList({ results, page, limit, total, onPage }: Props) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="mt-8 space-y-6">
      <ul className="space-y-4">
        {results.map((r) => (
          <li key={r.publicationNumber} className="rounded-lg border p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold leading-snug">
                {r.documentUrl ? (
                  <a href={r.documentUrl} target="_blank" rel="noreferrer" className="hover:underline">
                    {r.title}
                  </a>
                ) : (
                  <span>{r.title}</span>
                )}
              </h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap" title="Publikationsnummer">
                {r.publicationNumber}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              <div>
                <span className="font-medium text-foreground">Köpare:</span> {r.buyerName}
              </div>
              <div>
                <span className="font-medium text-foreground">Plats:</span> {r.buyerCity} {r.country}
              </div>
              <div>
                <span className="font-medium text-foreground">Publicerad:</span> {r.publicationDate}
              </div>
              {r.deadlineDate ? (
                <div>
                  <span className="font-medium text-foreground">Sista ansökan:</span> {r.deadlineDate}
                </div>
              ) : null}
              {r.value ? (
                <div>
                  <span className="font-medium text-foreground">Värde:</span> {r.value}
                </div>
              ) : null}
            </div>
            {r.description ? (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{r.description}</p>
            ) : null}
          </li>
        ))}
      </ul>

      {pages > 1 ? (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            className="px-3 py-1 rounded border bg-background disabled:opacity-50"
          >
            Föregående
          </button>
          <span className="text-sm text-muted-foreground">
            Sida {page} av {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
            className="px-3 py-1 rounded border bg-background disabled:opacity-50"
          >
            Nästa
          </button>
        </div>
      ) : null}
    </div>
  );
}
