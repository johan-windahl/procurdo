"use client";

import { useState } from "react";
import CPVSelector from "./CPVSelector";
import countries from "@/data/countries.json";
import { Button } from "@/components/ui/button";
import { formatThousandsSpaces, normalizeNumericInput } from "@/lib/utils";

export type Filters = {
  cpvs: string[];
  text: string;
  dateFrom: string;
  deadlineTo?: string;
  country: string;
  city: string;
  status: "ongoing" | "completed";
  noticeType?: string;
  valueMin?: number | string;
  valueMax?: number | string;
};

type Props = {
  initial?: Partial<Filters>;
  onSearch: (filters: Filters) => void;
};

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

export default function SearchForm({ onSearch, initial }: Props) {
  const [filters, setFilters] = useState<Filters>({ ...empty, ...(initial || {}) });

  const update = (f: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...f }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={submit} className="rounded-xl border bg-card p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">CPV-koder</label>
        <CPVSelector value={filters.cpvs} onChange={(cpvs) => update({ cpvs })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Fritext</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Ex. it, bygg, konsult..."
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Publicerad efter</label>
          <input
            type="date"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.dateFrom}
            onChange={(e) => update({ dateFrom: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Sista ansökan senast</label>
          <input
            type="date"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.deadlineTo || ""}
            onChange={(e) => update({ deadlineTo: e.target.value })}
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
      <div className="space-y-2">
        <label className="block text-sm font-medium">Status</label>
        <div className="flex gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="ongoing"
              checked={filters.status === "ongoing"}
              onChange={(e) => update({ status: e.target.value as Filters["status"] })}
              className="h-4 w-4"
            />
            Pågående
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="completed"
              checked={filters.status === "completed"}
              onChange={(e) => update({ status: e.target.value as Filters["status"] })}
              className="h-4 w-4"
            />
            Avslutade
          </label>
        </div>
      </div>
      <Button type="submit" size="lg">Sök</Button>
    </form>
  );
}
