"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { CPVSelector } from "@/components/ui/search/CPVSelector";
import countries from "@/data/countries.json";
import { Button } from "@/components/ui/button";
import { cn, formatThousandsSpaces, normalizeNumericInput } from "@/lib/utils";
import type { Filters } from "@/lib/search/types";

type Props = {
  initial?: Partial<Filters>;
  onSearch: (filters: Filters) => void;
  actions?: ReactNode;
};

type DateMode = "absolute" | "relative";
type RelativePreset = "7" | "30" | "90" | "180" | "custom";

const empty: Filters = {
  cpvs: [],
  text: "",
  dateFrom: "",
  deadlineTo: "",
  country: "",
  city: "",
  status: "ongoing",
  noticeType: "",
  valueMin: "",
  valueMax: "",
};

export function SearchForm({ onSearch, initial, actions }: Props) {
  const [filters, setFilters] = useState<Filters>({ ...empty, ...(initial || {}) });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("absolute");
  const [relativePreset, setRelativePreset] = useState<RelativePreset>("30");
  const [customRelativeDays, setCustomRelativeDays] = useState(30);

  const update = (f: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...f }));

  useEffect(() => {
    if (initial?.dateFrom) {
      setDateMode("absolute");
    }
  }, [initial?.dateFrom]);

  const applyRelativeDays = useCallback((days: number) => {
    if (!Number.isFinite(days) || days <= 0) return;
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() - days);
    const iso = base.toISOString().slice(0, 10);
    setFilters((prev) => ({ ...prev, dateFrom: iso }));
  }, []);

  useEffect(() => {
    if (dateMode !== "relative") return;
    const days = relativePreset === "custom" ? customRelativeDays : Number(relativePreset);
    if (!Number.isFinite(days) || days <= 0) return;
    applyRelativeDays(days);
  }, [dateMode, relativePreset, customRelativeDays, applyRelativeDays]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
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
            {countries.map((c) => (
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
        <Button type="submit" size="lg">
          Sök
        </Button>
      </div>

      {actions ? <div className="mt-2 flex flex-wrap gap-3">{actions}</div> : null}

      <div
        className={cn("space-y-5", showAdvanced ? "block" : "hidden")}
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
              <option value="Contract Notice">Upphandlingsannons</option>
              <option value="Prior Information Notice">Förhandsannons</option>
              <option value="Award Notice">Tilldelningsannons</option>
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
    </form>
  );
}
