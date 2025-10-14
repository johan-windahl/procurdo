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
import type { Filters, MonitorRange, Notice } from "@/lib/search/types";
import {
  summarizeFilters,
  filtersToSearchParams,
  monitorFrequencyLabel,
  defaultFilters,
  filtersFromSearchParams,
  normalizeFilters,
} from "@/lib/search/utils";
import { useToast } from "@/components/ui/toast";

type SaveFormState = {
  name: string;
  description: string;
};

type MonitorFormState = {
  savedSearchId: string;
  frequency: "daily" | "weekly";
  timeOfDay: string;
  relativeRange: MonitorRange;
  customRangeDays: number;
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
  const [monitorModalOpen, setMonitorModalOpen] = useState(false);

  const [saveForm, setSaveForm] = useState<SaveFormState>({ name: "", description: "" });
  const [monitorForm, setMonitorForm] = useState<MonitorFormState>(() => ({
    savedSearchId: savedSearches[0]?.id ?? "",
    frequency: "daily",
    timeOfDay: "08:00",
    relativeRange: "24h",
    customRangeDays: 7,
  }));

  useEffect(() => {
    if (!monitorForm.savedSearchId && savedSearches.length > 0) {
      setMonitorForm((prev) => ({ ...prev, savedSearchId: savedSearches[0]!.id }));
    }
  }, [savedSearches, monitorForm.savedSearchId]);

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
  const canCreateMonitor = savedSearches.length > 0;
  const selectedSavedSearch = savedSearches.find((s) => s.id === monitorForm.savedSearchId);

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
    setMonitorForm((prev) => ({ ...prev, savedSearchId: saved.id }));
    push({ title: "Sökning sparad" });
  };

  const handleCreateMonitor = () => {
    if (!monitorForm.savedSearchId) {
      push({ title: "Välj sparad sökning", description: "Du behöver välja en sparad sökning", variant: "warning" });
      return;
    }
    if (!monitorForm.timeOfDay) {
      push({ title: "Ange tid", description: "Välj tidpunkt för bevakningen", variant: "warning" });
      return;
    }
    const monitor = addMonitor({
      name: `${selectedSavedSearch?.name || "Bevakning"} (${monitorFrequencyLabel[monitorForm.frequency]})`,
      savedSearchId: monitorForm.savedSearchId,
      frequency: monitorForm.frequency,
      timeOfDay: monitorForm.timeOfDay,
      relativeRange: monitorForm.relativeRange,
      customRangeDays:
        monitorForm.relativeRange === "custom" ? Math.max(1, Number(monitorForm.customRangeDays) || 1) : undefined,
    });
    setMonitorModalOpen(false);
    setMonitorForm((prev) => ({ ...prev, savedSearchId: monitor.savedSearchId }));
    push({ title: "Bevakning skapad" });
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
              <Button
                variant="outline"
                type="button"
                onClick={() => setMonitorModalOpen(true)}
                disabled={!canCreateMonitor}
                title={canCreateMonitor ? undefined : "Skapa eller importera en sparad sökning först"}
              >
                🔔 Skapa bevakning
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

      <Modal
        open={monitorModalOpen}
        onClose={() => setMonitorModalOpen(false)}
        title="Skapa bevakning"
        description="Välj sparad sökning och hur ofta vi ska skicka nya träffar."
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setMonitorModalOpen(false)}>
              Avbryt
            </Button>
            <Button type="button" onClick={handleCreateMonitor} disabled={!canCreateMonitor}>
              Skapa bevakning
            </Button>
          </>
        }
      >
        {canCreateMonitor ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="monitor-search">
                Baserad på
              </label>
              <Select
                id="monitor-search"
                value={monitorForm.savedSearchId}
                onChange={(e) => setMonitorForm((prev) => ({ ...prev, savedSearchId: e.target.value }))}
              >
                {savedSearches.map((search) => (
                  <option key={search.id} value={search.id}>
                    {search.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="monitor-frequency">
                  Frekvens
                </label>
                <Select
                  id="monitor-frequency"
                  value={monitorForm.frequency}
                  onChange={(e) =>
                    setMonitorForm((prev) => ({ ...prev, frequency: e.target.value as MonitorFormState["frequency"] }))
                  }
                >
                  <option value="daily">Dagligen</option>
                  <option value="weekly">Veckovis</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="monitor-time">
                  Tidpunkt
                </label>
                <Input
                  id="monitor-time"
                  type="time"
                  value={monitorForm.timeOfDay}
                  onChange={(e) => setMonitorForm((prev) => ({ ...prev, timeOfDay: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="monitor-range">
                Resultatintervall
              </label>
              <Select
                id="monitor-range"
                value={monitorForm.relativeRange}
                onChange={(e) =>
                  setMonitorForm((prev) => ({ ...prev, relativeRange: e.target.value as MonitorRange }))
                }
              >
                <option value="24h">Senaste 24 timmarna</option>
                <option value="7d">Senaste 7 dagarna</option>
                <option value="30d">Senaste 30 dagarna</option>
                <option value="custom">Anpassat intervall</option>
              </Select>
              {monitorForm.relativeRange === "custom" ? (
                <div className="grid grid-cols-[auto_1fr] items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm font-medium text-foreground">Dagintervall</span>
                  <Input
                    type="number"
                    min={1}
                    max={90}
                    value={monitorForm.customRangeDays}
                    onChange={(e) =>
                      setMonitorForm((prev) => ({ ...prev, customRangeDays: Number(e.target.value) || 1 }))
                    }
                  />
                </div>
              ) : null}
            </div>
            {selectedSavedSearch ? (
              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                <p className="font-medium text-foreground">Filteröversikt</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {summarizeFilters(selectedSavedSearch.filters).map((item) => (
                    <li key={`${selectedSavedSearch.id}-${item.label}`} className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{item.label}:</span> {item.value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Du behöver spara en sökning innan du kan skapa bevakningar.
          </p>
        )}
      </Modal>
    </div>
  );
}
