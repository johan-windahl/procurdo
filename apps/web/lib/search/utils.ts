import countries from "@/data/countries.json";
import type { Filters, MonitorRange } from "@/lib/search/types";

const countryLookup = new Map<string, string>(countries.map((c) => [c.code, c.name]));

const statusLabel: Record<Filters["status"], string> = {
  ongoing: "Pågående",
  completed: "Avslutade",
};

const noticeTypeLabel: Record<string, string> = {
  "Contract Notice": "Upphandlingsannons",
  "Prior Information Notice": "Förhandsannons",
  "Award Notice": "Tilldelningsannons",
};

export const monitorRangeLabel: Record<MonitorRange, string> = {
  "24h": "Senaste 24 timmarna",
  "7d": "Senaste 7 dagarna",
  "30d": "Senaste 30 dagarna",
  custom: "Anpassat intervall",
};

export const monitorFrequencyLabel = {
  daily: "Dagligen",
  weekly: "Veckovis",
} as const;

export function filtersToSearchParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.cpvs.length) params.set("cpv", filters.cpvs.join(","));
  if (filters.text) params.set("q", filters.text);
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.deadlineTo) params.set("to", filters.deadlineTo);
  if (filters.country) params.set("country", filters.country);
  if (filters.city) params.set("city", filters.city);
  if (filters.noticeType) params.set("type", filters.noticeType);
  if (filters.valueMin) params.set("min", String(filters.valueMin));
  if (filters.valueMax) params.set("max", String(filters.valueMax));
  if (filters.status && filters.status !== "ongoing") params.set("status", filters.status);
  return params;
}

export function filtersToQueryString(filters: Filters): string {
  const params = filtersToSearchParams(filters);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function summarizeFilters(filters: Filters): Array<{ label: string; value: string }> {
  const summary: Array<{ label: string; value: string }> = [];
  if (filters.text) summary.push({ label: "Sökning", value: filters.text });
  if (filters.cpvs.length) summary.push({ label: "CPV", value: filters.cpvs.join(", ") });
  if (filters.country) {
    const countryName = countryLookup.get(filters.country) ?? filters.country;
    summary.push({ label: "Land", value: countryName });
  }
  if (filters.city) summary.push({ label: "Ort", value: filters.city });
  if (filters.dateFrom) summary.push({ label: "Publicerad efter", value: filters.dateFrom });
  if (filters.deadlineTo) summary.push({ label: "Sista anbudsdag", value: filters.deadlineTo });
  if (filters.noticeType) {
    const label = noticeTypeLabel[filters.noticeType] ?? filters.noticeType;
    summary.push({ label: "Annonstyp", value: label });
  }
  if (filters.valueMin) summary.push({ label: "Minvärde", value: `${filters.valueMin} SEK` });
  if (filters.valueMax) summary.push({ label: "Maxvärde", value: `${filters.valueMax} SEK` });
  summary.push({ label: "Status", value: statusLabel[filters.status] });
  return summary;
}
