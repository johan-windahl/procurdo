import countries from "@/data/countries.json";
import type { Filters, MonitorRange } from "@/lib/search/types";

const countryLookup = new Map<string, string>(countries.map((c) => [c.code, c.name]));
const countryNameLookup = new Map<string, string>(countries.map((c) => [c.name.toLowerCase(), c.code]));
const iso2ToIso3 = new Map<string, string>([
  ["SE", "SWE"],
  ["NO", "NOR"],
  ["DK", "DNK"],
  ["FI", "FIN"],
  ["DE", "DEU"],
]);

type NoticeTypeGroupKey = "Contract Notice" | "Prior Information Notice" | "Award Notice";

const noticeTypeGroups: Record<NoticeTypeGroupKey, { label: string; codes: readonly string[] }> = {
  "Contract Notice": {
    label: "Upphandlingsannons",
    codes: ["pin-cfc-standard", "pin-cfc-social", "qu-sy", "cn-standard", "cn-social", "subco", "cn-desg"],
  },
  "Prior Information Notice": {
    label: "Förhandsannons",
    codes: ["pin-only", "pin-buyer", "pin-rtl", "pin-tran"],
  },
  "Award Notice": {
    label: "Tilldelningsannons",
    codes: ["can-standard", "can-social", "can-desg", "can-tran"],
  },
};

const noticeTypeGroupLookup = new Map<string, NoticeTypeGroupKey>();
const noticeTypeCodesLookup = new Map<string, readonly string[]>();
const noticeTypeDisplayLookup = new Map<string, string>();

for (const [groupKey, config] of Object.entries(noticeTypeGroups) as Array<
  [NoticeTypeGroupKey, { label: string; codes: readonly string[] }]
>) {
  const lowerGroupKey = groupKey.toLowerCase();
  noticeTypeGroupLookup.set(lowerGroupKey, groupKey);
  noticeTypeCodesLookup.set(lowerGroupKey, config.codes);
  noticeTypeDisplayLookup.set(lowerGroupKey, config.label);

  const lowerDisplay = config.label.toLowerCase();
  noticeTypeGroupLookup.set(lowerDisplay, groupKey);
  noticeTypeCodesLookup.set(lowerDisplay, config.codes);
  noticeTypeDisplayLookup.set(lowerDisplay, config.label);

  for (const code of config.codes) {
    const lowerCode = code.toLowerCase();
    noticeTypeGroupLookup.set(lowerCode, groupKey);
    noticeTypeCodesLookup.set(lowerCode, [code]);
    noticeTypeDisplayLookup.set(lowerCode, config.label);
  }
}

export const noticeTypeOptions = Object.entries(noticeTypeGroups).map(([value, config]) => ({
  value,
  label: config.label,
})) as Array<{ value: NoticeTypeGroupKey; label: string }>;

export const resolveNoticeTypeCodes = (value: string | undefined | null): string[] | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const codes = noticeTypeCodesLookup.get(trimmed.toLowerCase());
  return codes ? [...codes] : null;
};

export const resolveNoticeTypeLabel = (value: string | undefined | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return noticeTypeDisplayLookup.get(trimmed.toLowerCase()) ?? trimmed;
};

export const defaultFilters: Filters = {
  cpvs: [],
  text: "",
  dateFrom: "",
  deadlineTo: "",
  country: "",
  city: "",
  noticeType: "",
  valueMin: "",
  valueMax: "",
};

export const normalizeCpv = (code: string | undefined | null): string | null => {
  if (!code) return null;
  const digits = code.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length >= 8) return digits.slice(0, 8);
  return digits.padEnd(8, "0");
};

export const normalizeCountry = (value: string | undefined | null): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const upper = trimmed.toUpperCase();
  if (iso2ToIso3.has(upper)) return iso2ToIso3.get(upper)!;
  if (countryLookup.has(upper)) return upper;
  const byName = countryNameLookup.get(trimmed.toLowerCase());
  if (byName) return byName;
  return upper;
};

export const normalizeFilters = (incoming?: Partial<Filters>): Filters => {
  const base: Filters = { ...defaultFilters, ...(incoming || {}) };
  const rawCpvs = Array.isArray(incoming?.cpvs) ? incoming.cpvs : base.cpvs;
  const normalizedCpvs = rawCpvs
    .map((code) => normalizeCpv(code))
    .filter((code): code is string => Boolean(code));
  const uniqueCpvs = Array.from(new Set(normalizedCpvs));
  const noticeTypeInput = base.noticeType ?? "";
  const noticeType =
    noticeTypeInput && noticeTypeInput.trim()
      ? noticeTypeGroupLookup.get(noticeTypeInput.trim().toLowerCase()) ?? noticeTypeInput.trim()
      : "";
  return {
    ...base,
    cpvs: uniqueCpvs,
    country: normalizeCountry(base.country),
    deadlineTo: base.deadlineTo ?? "",
    noticeType,
    valueMin: base.valueMin ?? "",
    valueMax: base.valueMax ?? "",
  };
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
  const normalized = normalizeFilters(filters);
  const params = new URLSearchParams();
  if (normalized.cpvs.length) params.set("cpv", normalized.cpvs.join(","));
  if (normalized.text) params.set("q", normalized.text);
  if (normalized.dateFrom) params.set("from", normalized.dateFrom);
  if (normalized.deadlineTo) params.set("to", normalized.deadlineTo);
  if (normalized.country) params.set("country", normalized.country);
  if (normalized.city) params.set("city", normalized.city);
  if (normalized.noticeType) params.set("type", normalized.noticeType);
  if (normalized.valueMin !== undefined && normalized.valueMin !== null && String(normalized.valueMin).trim() !== "") {
    params.set("min", String(normalized.valueMin));
  }
  if (normalized.valueMax !== undefined && normalized.valueMax !== null && String(normalized.valueMax).trim() !== "") {
    params.set("max", String(normalized.valueMax));
  }
  return params;
}

export function filtersToQueryString(filters: Filters): string {
  const params = filtersToSearchParams(filters);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function filtersFromSearchParams(params: URLSearchParams): Filters {
  const cpvParam = params.get("cpv");
  const cpvs = cpvParam ? cpvParam.split(",").filter(Boolean) : [];
  return normalizeFilters({
    cpvs,
    text: params.get("q") || "",
    dateFrom: params.get("from") || "",
    deadlineTo: params.get("to") || "",
    country: params.get("country") || "",
    city: params.get("city") || "",
    noticeType: params.get("type") || "",
    valueMin: params.get("min") || "",
    valueMax: params.get("max") || "",
  });
}

export function summarizeFilters(filters: Filters): Array<{ label: string; value: string }> {
  const normalized = normalizeFilters(filters);
  const summary: Array<{ label: string; value: string }> = [];
  if (normalized.text) summary.push({ label: "Sökning", value: normalized.text });
  if (normalized.cpvs.length) summary.push({ label: "CPV", value: normalized.cpvs.join(", ") });
  if (normalized.country) {
    const countryName = countryLookup.get(normalized.country) ?? normalized.country;
    summary.push({ label: "Land", value: countryName });
  }
  if (normalized.city) summary.push({ label: "Ort", value: normalized.city });
  if (normalized.dateFrom) summary.push({ label: "Publicerad efter", value: normalized.dateFrom });
  if (normalized.deadlineTo) summary.push({ label: "Sista anbudsdag", value: normalized.deadlineTo });
  if (normalized.noticeType) {
    const display = resolveNoticeTypeLabel(normalized.noticeType) ?? normalized.noticeType;
    summary.push({ label: "Annonstyp", value: display });
  }
  if (normalized.valueMin) summary.push({ label: "Minvärde", value: `${normalized.valueMin} SEK` });
  if (normalized.valueMax) summary.push({ label: "Maxvärde", value: `${normalized.valueMax} SEK` });
  return summary;
}
