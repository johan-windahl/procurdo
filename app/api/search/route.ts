import { NextRequest } from "next/server";

// Loosely typed helpers for the TED API payloads
type LangObject = Record<string, unknown>;
type MaybeLang = string | number | LangObject | Array<string | number | LangObject>;

type TEDNotice = {
  'publication-number'?: string;
  'publication-date'?: unknown;
  'deadline-receipt-request'?: unknown;
  'notice-title'?: MaybeLang;
  'buyer-name'?: MaybeLang;
  'buyer-city'?: MaybeLang;
  'buyer-country'?: MaybeLang;
  'place-of-performance-country-lot'?: MaybeLang;
  links?: unknown;
  'tender-value'?: unknown;
  'description-lot'?: MaybeLang;
  'document-url-lot'?: MaybeLang;
};

type TEDSearchResponse = {
  notices?: TEDNotice[];
  totalNoticeCount?: number | string;
  error?: { type?: string; message?: string };
};

type Filters = {
  cpvs: string[];
  text: string;
  dateFrom: string;
  country: string;
  city: string;
  status: "ongoing" | "completed";
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const toDateString = (input: unknown): string => {
  if (input == null) return "";
  if (Array.isArray(input)) return toDateString(input[0] as unknown);
  if (typeof input === "string") return input;
  if (isRecord(input)) {
    const candidate = input.date ?? input.value ?? input.text;
    if (typeof candidate === "string") return candidate;
    return "";
  }
  return String(input);
};

const formatDateToISO = (raw: unknown): string => {
  const dateString = toDateString(raw);
  if (!dateString) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const tzMatch = dateString.match(/^(\d{4}-\d{2}-\d{2})[A-Za-z+-].*$/);
  if (tzMatch) return tzMatch[1];
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatDateForTED = (dateString: string): string => {
  if (!dateString) return "";
  return dateString.replace(/-/g, "");
};

const extractText = (field: unknown): string => {
  const pickFromObject = (obj: unknown): string => {
    if (!isRecord(obj)) return "";
    // Some fields can be like { eng: "...", swe: "..." } or { mul: { ... } }
    const preferredKeys = ["eng", "en", "swe", "sv", "mul", "default"]; 
    for (const k of preferredKeys) {
      if (k in obj) {
        const v = obj[k as keyof typeof obj];
        const s = extractText(v);
        if (s) return s;
      }
    }
    // Fallback: scan values
    for (const v of Object.values(obj)) {
      const s = extractText(v);
      if (s) return s;
    }
    return "";
  };

  if (field == null) return "";
  if (typeof field === "string") return field;
  if (typeof field === "number") return String(field);
  if (Array.isArray(field)) {
    for (const v of field) {
      const s = extractText(v);
      if (s) return s;
    }
    return "";
  }
  if (isRecord(field)) {
    // Common wrappers: { text: "..." } or { value: "..." }
    if (typeof field.text === "string") return field.text as string;
    if (typeof field.value === "string") return field.value as string;
    return pickFromObject(field);
  }
  return "";
};

const quote = (s: string) => `'${s.replace(/'/g, "\"").trim()}'`;

const buildQuery = (f: Filters) => {
  const parts: string[] = [];
  if (Array.isArray(f.cpvs) && f.cpvs.length > 0) {
    const cpv = f.cpvs.map((c) => `classification-cpv = ${c}`).join(" OR ");
    parts.push(`(${cpv})`);
  }
  if (f.text) parts.push(`FT ~ (${quote(f.text)})`);
  if (f.dateFrom) parts.push(`publication-date >= ${formatDateForTED(f.dateFrom)}`);
  if (f.country) {
    const isISO3 = /^[A-Z]{3}$/.test(f.country);
    // Prefer buyer-country for filtering (aligns with requested fields)
    parts.push(`buyer-country = ${isISO3 ? f.country : quote(f.country)}`);
  }
  if (f.city) parts.push(`buyer-city ~ (${quote(f.city)})`);

  if (f.status === "ongoing") {
    parts.push(
      `(notice-type IN (pin-only pin-buyer pin-rtl pin-tran pin-cfc-standard pin-cfc-social qu-sy cn-standard cn-social subco cn-desg))`
    );
  } else if (f.status === "completed") {
    parts.push(`(notice-type IN (can-standard can-social can-desg can-tran))`);
  }
  // If only status is present and no other constraints, add a reasonable date window
  const hasOther = parts.some(
    (p) => !p.startsWith("(notice-type IN ")
  );
  if (!hasOther) {
    parts.push(`publication-date >= today(-60)`);
  }
  return parts.join(" AND ");
};

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = 20;

  let filters: Filters;
  try {
    filters = (await req.json()) as Filters;
  } catch {
    filters = { cpvs: [], text: "", dateFrom: "", country: "", city: "", status: "ongoing" };
  }

  const query = buildQuery(filters);
  const payload = {
    query,
    page,
    limit,
    fields: [
      'publication-number',
      'publication-date',
      'notice-title',
      'buyer-name',
      'buyer-city',
      'buyer-country',
      'place-of-performance-country-lot',
      'links',
      'tender-value',
      'deadline-receipt-request',
      'description-lot',
      'document-url-lot',
    ],
  } as const;

  try {
    const res = await fetch("https://api.ted.europa.eu/v3/notices/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const json: TEDSearchResponse = await res.json();

    if (json?.error) {
      return new Response(
        JSON.stringify({ items: [], total: 0, error: json.error?.type, message: json.error?.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const items = (json?.notices || []).map((n: TEDNotice) => {
      const publicationDate = formatDateToISO(n["publication-date"]);
      const deadlineRaw = n["deadline-receipt-request"] || "";
      const deadlineDate = deadlineRaw ? formatDateToISO(deadlineRaw) : undefined;
      let fromLinks: string | undefined;
      if (Array.isArray(n.links) && n.links.length > 0) {
        const first = n.links[0] as unknown;
        if (isRecord(first) && typeof first.href === "string") {
          fromLinks = first.href;
        } else {
          const s = extractText(first);
          fromLinks = s || undefined;
        }
      }
      const documentUrl = extractText(n['document-url-lot']) || fromLinks;
      const tVal = isRecord(n["tender-value"]) ? (n["tender-value"] as Record<string, unknown>) : undefined;
      const value = extractText((tVal?.amount ?? tVal?.value) as unknown);
      const buyerCountry = extractText(n['buyer-country']);
      const placeCountry = extractText(n['place-of-performance-country-lot']);
      return {
        publicationNumber: n["publication-number"] || "",
        publicationDate,
        deadlineDate,
        title: extractText(n["notice-title"]) || "Upphandling",
        buyerName: extractText(n["buyer-name"]) || "",
        buyerCity: extractText(n["buyer-city"]) || "",
        country: buyerCountry || placeCountry || "",
        documentUrl,
        value: value || undefined,
        description: extractText(n['description-lot']) || undefined,
      };
    });

    const total = Number(json?.totalNoticeCount || 0);
    return new Response(JSON.stringify({ items, total }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ items: [], total: 0 }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
