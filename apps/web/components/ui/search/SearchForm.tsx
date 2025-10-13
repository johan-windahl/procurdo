"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { CPVSelector } from "@/components/ui/search/CPVSelector";
import countries from "@/data/countries.json";
import { Button } from "@/components/ui/button";
import { cn, formatThousandsSpaces, normalizeNumericInput } from "@/lib/utils";
import type { Filters } from "@/lib/search/types";
import { normalizeFilters, noticeTypeOptions } from "@/lib/search/utils";

type Props = {
  initial?: Partial<Filters>;
  onSearch: (filters: Filters) => void;
  actions?: ReactNode;
};

type DateMode = "absolute" | "relative";
type RelativePreset = "7" | "30" | "90" | "180" | "custom";

export function SearchForm({ onSearch, initial, actions }: Props) {
  type CountryOption = { code: string; name: string };
  const countryOptions = countries as CountryOption[];

  const normalizedInitial = useMemo(() => normalizeFilters(initial), [initial]);

  const [filters, setFilters] = useState<Filters>(normalizedInitial);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("absolute");
  const [relativePreset, setRelativePreset] = useState<RelativePreset>("30");
  const [customRelativeDays, setCustomRelativeDays] = useState(30);

  const update = (f: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...f }));

  useEffect(() => {
    setFilters(normalizedInitial);
  }, [normalizedInitial]);

  useEffect(() => {
    if (normalizedInitial.dateFrom) {
      // Check if the date looks like a relative date by trying to match common relative patterns
      const daysAgo = calculateDaysFromNow(normalizedInitial.dateFrom);
      if (daysAgo && daysAgo > 0) {
        setDateMode("relative");
        // Set appropriate preset based on the number of days
        if (daysAgo === 7) setRelativePreset("7");
        else if (daysAgo === 30) setRelativePreset("30");
        else if (daysAgo === 90) setRelativePreset("90");
        else if (daysAgo === 180) setRelativePreset("180");
        else {
          setRelativePreset("custom");
          setCustomRelativeDays(daysAgo);
        }
      } else {
        setDateMode("absolute");
      }
    }

    // Don't auto-expand advanced search when loading saved searches
    // Users can manually toggle it if they want to see/edit advanced filters
  }, [normalizedInitial]);

  const calculateDaysFromNow = (dateString: string): number | null => {
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return null;

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Only consider it a relative date if it's within the last year and makes sense as a relative date
      return diffDays > 0 && diffDays <= 365 ? diffDays : null;
    } catch {
      return null;
    }
  };

  const applyRelativeDays = useCallback((days: number) => {
    if (!Number.isFinite(days) || days <= 0) return;
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() - days);
    const iso = base.toISOString().slice(0, 10);
    setFilters((prev) => ({ ...prev, dateFrom: iso }));
  }, []);

  const prefilledDateFrom = normalizedInitial.dateFrom;

  useEffect(() => {
    if (dateMode !== "relative") return;
    const days = relativePreset === "custom" ? customRelativeDays : Number(relativePreset);
    if (!Number.isFinite(days) || days <= 0) return;

    // Only apply relative days if we don't have an initial dateFrom value
    // This prevents overriding the original dateFrom when editing saved searches
    if (!prefilledDateFrom) {
      applyRelativeDays(days);
    }
  }, [dateMode, relativePreset, customRelativeDays, applyRelativeDays, prefilledDateFrom]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAdvanced(false);
    onSearch(filters);
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1 md:col-span-2">
          <label className="block text-sm font-medium">Sökning</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Ex. it, bygg, konsult..."
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Land</label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.country}
            onChange={(e) => update({ country: e.target.value })}
          >
            <option value="">Alla</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {showAdvanced ? "Dölj avancerade filter" : "Visa avancerade filter"}
        </button>
      </div>

      <div
        className={cn(
          "space-y-5",
          showAdvanced ? "block" : "hidden"
        )}
        style={{
          display: showAdvanced ? 'block' : 'none'
        }}
        aria-hidden={!showAdvanced}
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium">CPV-koder</label>
          <CPVSelector value={filters.cpvs} onChange={(cpvs) => update({ cpvs })} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Publicerad efter</label>
            <div className="space-y-3 rounded-md border bg-background/40 p-3">
              <div className="flex gap-2">
                {(["absolute", "relative"] satisfies DateMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDateMode(mode)}
                    className={cn(
                      "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition",
                      dateMode === mode
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {mode === "absolute" ? "Absolut datum" : "Relativt intervall"}
                  </button>
                ))}
              </div>

              {dateMode === "absolute" ? (
                <input
                  type="date"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={filters.dateFrom}
                  onChange={(e) => update({ dateFrom: e.target.value })}
                />
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <label className="col-span-1 flex flex-col gap-1 text-sm font-medium md:col-span-2">
                      Välj intervall
                      <select
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        value={relativePreset}
                        onChange={(e) => setRelativePreset(e.target.value as RelativePreset)}
                      >
                        <option value="7">Senaste 7 dagarna</option>
                        <option value="30">Senaste 30 dagarna</option>
                        <option value="90">Senaste 90 dagarna</option>
                        <option value="180">Senaste 180 dagarna</option>
                        <option value="custom">Anpassat antal dagar</option>
                      </select>
                    </label>
                    {relativePreset === "custom" ? (
                      <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">
                        Antal dagar
                        <input
                          type="number"
                          min={1}
                          max={365}
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                          value={customRelativeDays}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setCustomRelativeDays(Number.isFinite(value) ? Math.max(1, value) : 1);
                          }}
                        />
                      </label>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Använder från-datum {filters.dateFrom || "—"} (räknat bakåt {relativePreset === "custom" ? customRelativeDays : Number(relativePreset)} dagar).
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Sista anbudsdag senast</label>
            <input
              type="date"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={filters.deadlineTo || ""}
              onChange={(e) => update({ deadlineTo: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Ort</label>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={filters.city}
              onChange={(e) => update({ city: e.target.value })}
              placeholder="Ex. Stockholm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Annonstyp</label>
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={filters.noticeType || ""}
              onChange={(e) => update({ noticeType: e.target.value })}
            >
              <option value="">Alla</option>
              {noticeTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Värde (min)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9 ]*"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={formatThousandsSpaces(filters.valueMin || "")}
              onChange={(e) => update({ valueMin: normalizeNumericInput(e.target.value) })}
              placeholder="10 000"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Värde (max)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9 ]*"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={formatThousandsSpaces(filters.valueMax || "")}
              onChange={(e) => update({ valueMax: normalizeNumericInput(e.target.value) })}
              placeholder="1 000 000"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : <div></div>}
        <Button type="submit" size="lg" className="px-8">
          Sök
        </Button>
      </div>
    </form>
  );
}
