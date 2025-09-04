"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchForm, { type Filters } from "@/components/marketing/SearchForm";
import ResultsList, { type Notice } from "@/components/marketing/ResultsList";

const defaultFilters: Filters = {
  cpvs: [],
  text: "",
  dateFrom: "",
  country: "",
  city: "",
  status: "ongoing",
};

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [results, setResults] = useState<Notice[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const initialFromParams = useMemo<Partial<Filters>>(() => {
    if (!searchParams) return {};
    const cpvParam = searchParams.get("cpv");
    const cpvs = cpvParam ? cpvParam.split(",").filter(Boolean) : [];
    return {
      cpvs,
      text: searchParams.get("q") || "",
      dateFrom: searchParams.get("from") || "",
      country: searchParams.get("country") || "",
      city: searchParams.get("city") || "",
      status: (searchParams.get("status") as Filters["status"]) || "ongoing",
    };
  }, [searchParams]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...initialFromParams }));
    const p = Number(searchParams?.get("page") || "1") || 1;
    setPage(p);
  }, [initialFromParams, searchParams]);

  const updateUrl = useCallback(
    (f: Filters, p: number) => {
      const params = new URLSearchParams();
      if (f.cpvs.length) params.set("cpv", f.cpvs.join(","));
      if (f.text) params.set("q", f.text);
      if (f.dateFrom) params.set("from", f.dateFrom);
      if (f.country) params.set("country", f.country);
      if (f.city) params.set("city", f.city);
      if (f.status) params.set("status", f.status);
      if (p > 1) params.set("page", String(p));
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "");
    },
    [router]
  );

  const runSearch = useCallback(
    async (f: Filters, p = 1) => {
      setPage(p);
      updateUrl(f, p);
      const res = await fetch(`/api/search?page=${p}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      setResults(data.items || []);
      setTotal(Number(data.total || 0));
      if (p > 1) window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateUrl]
  );

  // Auto-search if query params prefilled
  useEffect(() => {
    const hasAny =
      filters.cpvs.length ||
      filters.text ||
      filters.dateFrom ||
      filters.country ||
      filters.city;
    if (hasAny) runSearch(filters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (f: Filters) => {
    setFilters(f);
    runSearch(f, 1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Sök upphandlingar och ramavtal</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Sök och filtrera offentliga upphandlingar och ramavtal. Hitta aktuella upphandlingar med CPV-koder, fritext, datum och plats.
      </p>
      <div className="mt-8">
        <SearchForm onSearch={onSubmit} initial={initialFromParams} />
      </div>
      {results.length > 0 ? (
        <ResultsList
          results={results}
          page={page}
          limit={limit}
          total={total}
          onPage={(p) => runSearch(filters, p)}
        />
      ) : null}
    </div>
  );
}
