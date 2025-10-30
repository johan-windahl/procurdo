"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchForm } from "@/components/ui/search/SearchForm";
import { ResultsList } from "@/components/ui/search/ResultsList";
import Spinner from "@/components/ui/spinner";
import type { Filters, Notice } from "@/lib/search/types";
import { filtersToSearchParams } from "@/lib/search/utils";

const defaultFilters: Filters = {
  cpvs: [],
  nuts: [],
  text: "",
  dateFrom: "",
  deadlineTo: "",
  country: "",
  city: "",
  noticeType: "",
  valueMin: "",
  valueMax: "",
};

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [results, setResults] = useState<Notice[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  const initialFromParams = useMemo<Partial<Filters>>(() => {
    if (!searchParams) return {};
    const cpvParam = searchParams.get("cpv");
    const cpvs = cpvParam ? cpvParam.split(",").filter(Boolean) : [];
    const nutsParam = searchParams.get("nuts");
    const nuts = nutsParam ? nutsParam.split(",").filter(Boolean) : [];
    return {
      cpvs,
      nuts,
      text: searchParams.get("q") || "",
      dateFrom: searchParams.get("from") || "",
      deadlineTo: searchParams.get("to") || "",
      country: searchParams.get("country") || "",
      city: searchParams.get("city") || "",
      noticeType: searchParams.get("type") || "",
      valueMin: searchParams.get("min") || "",
      valueMax: searchParams.get("max") || "",
    };
  }, [searchParams]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...initialFromParams }));
    const p = Number(searchParams?.get("page") || "1") || 1;
    setPage(p);
  }, [initialFromParams, searchParams]);

  const updateUrl = useCallback(
    (f: Filters, p: number) => {
      const params = filtersToSearchParams(f);
      if (p > 1) params.set("page", String(p));
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "");
    },
    [router],
  );

  const runSearch = useCallback(
    async (f: Filters, p = 1) => {
      setHasSearched(true);
      setLoading(true);
      setError(null);
      setPage(p);
      updateUrl(f, p);
      const res = await fetch(`/api/search?page=${p}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      try {
        const data = await res.json();
        if (!res.ok || data?.error) {
          const detail = data?.unsupportedValue && data?.parameterName
            ? ` (${data.parameterName}: ${data.unsupportedValue})`
            : "";
          setError(`${data?.message || data?.error || 'Ett fel inträffade vid sökning'}${detail}`);
          setResults([]);
          setTotal(0);
          return;
        }
        setResults(data.items || []);
        setTotal(Number(data.total || 0));
        if (p > 1) window.scrollTo({ top: 0, behavior: "smooth" });
      } finally {
        setLoading(false);
      }
    },
    [updateUrl]
  );

  // Only auto-search when explicit query params exist in the URL
  useEffect(() => {
    if (!searchParams) return;
    const hasQueryParams = searchParams.toString().length > 0;
    if (hasQueryParams) {
      const p = Number(searchParams.get("page") || "1") || 1;
      runSearch({ ...filters, ...initialFromParams }, p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onSubmit = (f: Filters) => {
    setFilters(f);
    runSearch(f, 1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Hitta upphandlingar och ramavtal gratis</h1>
      <p className="mt-2 text-muted-foreground">
        Sök och filtrera offentliga upphandlingar och ramavtal. Hitta aktuella upphandlingar med CPV-koder, fritext, datum och plats.
      </p>
      <div className="mt-8">
        <SearchForm onSearch={onSubmit} initial={initialFromParams} />
      </div>
      {error ? (
        <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="mt-8 flex justify-center">
          <Spinner size={22} label="Söker upphandlingar..." />
        </div>
      ) : results.length > 0 ? (
        <ResultsList
          results={results}
          page={page}
          limit={limit}
          total={total}
          onPage={(p) => runSearch(filters, p)}
        />
      ) : hasSearched ? (
        <p className="mt-8 text-sm text-center text-muted-foreground">Inga resultat hittades</p>
      ) : null}
    </div>
  );
}
