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
  valueCurrency?: string;
  description?: string;
  classification?: string;
  contractNature?: string;
  noticeType?: string;
  procedureType?: string;
  frameworkAgreement?: boolean;
};

type Props = {
  results: Notice[];
  page: number;
  limit: number;
  total: number;
  onPage: (p: number) => void;
};

import { translateProcedureType, translateNoticeType, translateContractNature } from "@/lib/ted";
import { formatThousandsSpaces } from "@/lib/utils";

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
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {r.noticeType ? (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5">
                  {translateNoticeType(r.noticeType)}
                </span>
              ) : null}
              {r.contractNature ? (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5">
                  {translateContractNature(r.contractNature)}
                </span>
              ) : null}
              {r.frameworkAgreement ? (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5">Ramavtal</span>
              ) : null}
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
                  <span className="font-medium text-foreground">Sista anbudsdag:</span> {r.deadlineDate}
                </div>
              ) : null}
              {r.value ? (
                <div>
                  <span className="font-medium text-foreground">Värde:</span> {(() => {
                    const n = Number(String(r.value).replace(/\s/g, "").replace(/,/g, "."));
                    return Number.isFinite(n) ? formatThousandsSpaces(n) : r.value;
                  })()} {r.valueCurrency || ''}
                </div>
              ) : null}
              {r.classification ? (
                <div>
                  <span className="font-medium text-foreground">CPV-kod:</span> {r.classification}
                </div>
              ) : null}
              {r.procedureType ? (
                <div>
                  <span className="font-medium text-foreground">Förfarande:</span> {translateProcedureType(r.procedureType)}
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
