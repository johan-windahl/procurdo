"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ResultsList } from "@/components/ui/search/ResultsList";
import { SearchForm } from "@/components/ui/search/SearchForm";
import { Select } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSearchPreferences } from "@/components/app/providers/SearchPreferencesProvider";
import type { Filters, Notice } from "@/lib/search/types";
import {
  summarizeFilters,
  filtersToSearchParams,
  defaultFilters,
  filtersFromSearchParams,
  normalizeFilters,
} from "@/lib/search/utils";
import { useToast } from "@/components/ui/toast";

type SaveFormState = {
  name: string;
  description: string;
};

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { push } = useToast();
  const { savedSearches, addSavedSearch, addMonitor } = useSearchPreferences();

  const [filters, setFilters] = useState<Filters>(() => ({ ...defaultFilters }));
  const [results, setResults] = useState<Notice[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const [saveForm, setSaveForm] = useState<SaveFormState>({ name: "", description: "" });

  const initialFromParams = useMemo<Filters | null>(() => {
    if (!searchParams) return null;
    return filtersFromSearchParams(searchParams);
  }, [searchParams]);

  useEffect(() => {
    const p = Number(searchParams?.get("page") || "1") || 1;
    setPage(p);
    if (initialFromParams) {
      setFilters(initialFromParams);
    }
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
      const normalized = normalizeFilters(f);
      setHasSearched(true);
      setLoading(true);
      setError(null);
      setPage(p);
      setFilters(normalized);
      updateUrl(normalized, p);
      const res = await fetch(`/api/search?page=${p}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      try {
        const data = await res.json();
        if (!res.ok || data?.error) {
          const detail =
            data?.unsupportedValue && data?.parameterName
              ? ` (${data.parameterName}: ${data.unsupportedValue})`
              : "";
          setError(`${data?.message || data?.error || "Ett fel inträffade vid sökning"}${detail}`);
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
    [updateUrl],
  );

  useEffect(() => {
    if (!searchParams || !initialFromParams) return;
    const hasQueryParams = searchParams.toString().length > 0;
    if (hasQueryParams) {
      const p = Number(searchParams.get("page") || "1") || 1;
      runSearch(initialFromParams, p);
    }
  }, [searchParams, initialFromParams, runSearch]);

  const onSubmit = (f: Filters) => {
    runSearch(f, 1);
  };

  const filterSummary = useMemo(() => summarizeFilters(filters), [filters]);

  const handleSaveSearch = () => {
    if (!saveForm.name.trim()) {
      push({ title: "Ange ett namn", description: "Skriv ett namn för sökningen", variant: "warning" });
      return;
    }
    const saved = addSavedSearch({
      name: saveForm.name.trim(),
      description: saveForm.description.trim() ? saveForm.description.trim() : undefined,
      filters,
    });
    setSaveModalOpen(false);
    setSaveForm({ name: "", description: "" });
    push({ title: "Sökning sparad" });
  };


  return (
    <div className="px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Hitta upphandlingar och ramavtal</h1>
          <p className="mt-2 text-muted-foreground">
            Sök och filtrera upphandlingar precis som i den öppna vyn – och spara dina favoritfilter eller skapa bevakningar.
          </p>
        </header>

        <SearchForm
          onSearch={onSubmit}
          initial={initialFromParams ?? undefined}
          actions={
            <>
              <Button variant="outline" type="button" onClick={() => setSaveModalOpen(true)}>
                💾 Spara sökning
              </Button>
            </>
          }
        />

        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">{error}</div>
        ) : loading ? (
          <div className="flex justify-center">
            <Spinner size={22} label="Söker upphandlingar..." />
          </div>
        ) : results.length > 0 ? (
          <ResultsList results={results} page={page} limit={limit} total={total} onPage={(p) => runSearch(filters, p)} />
        ) : hasSearched ? (
          <p className="text-center text-sm text-muted-foreground">Inga resultat hittades</p>
        ) : null}
      </div>

      <Modal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Spara sökning"
        description="Ge sökningen ett namn och en valfri beskrivning."
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setSaveModalOpen(false)}>
              Avbryt
            </Button>
            <Button type="button" onClick={handleSaveSearch} disabled={!saveForm.name.trim()}>
              Spara
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="save-name">
              Namn
            </label>
            <Input
              id="save-name"
              value={saveForm.name}
              onChange={(e) => setSaveForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ex. IT-bevakning Stockholm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="save-description">
              Beskrivning (valfritt)
            </label>
            <Textarea
              id="save-description"
              value={saveForm.description}
              onChange={(e) => setSaveForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Kort notering om vad sökningen används till"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Valda filter</p>
            {filterSummary.length ? (
              <ul className="flex flex-wrap gap-2 text-sm">
                {filterSummary.map((item) => (
                  <li key={`${item.label}-${item.value}`} className="rounded-full bg-accent/40 px-3 py-1 text-muted-foreground">
                    <span className="font-medium text-foreground">{item.label}:</span> {item.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Inga filter valda – standardinställningar sparas.</p>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
