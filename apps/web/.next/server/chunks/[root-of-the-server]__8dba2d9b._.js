module.exports = [
"[project]/apps/web/.next-internal/server/app/api/search/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/apps/web/app/api/search/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
const isRecord = (v)=>typeof v === "object" && v !== null;
const toDateString = (input)=>{
    if (input == null) return "";
    if (Array.isArray(input)) return toDateString(input[0]);
    if (typeof input === "string") return input;
    if (isRecord(input)) {
        const candidate = input.date ?? input.value ?? input.text;
        if (typeof candidate === "string") return candidate;
        return "";
    }
    return String(input);
};
const formatDateToISO = (raw)=>{
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
const formatDateForTED = (dateString)=>{
    if (!dateString) return "";
    return dateString.replace(/-/g, "");
};
const extractText = (field)=>{
    const pickFromObject = (obj)=>{
        if (!isRecord(obj)) return "";
        // Some fields can be like { eng: "...", swe: "..." } or { mul: { ... } }
        const preferredKeys = [
            "eng",
            "en",
            "swe",
            "sv",
            "mul",
            "default"
        ];
        for (const k of preferredKeys){
            if (k in obj) {
                const v = obj[k];
                const s = extractText(v);
                if (s) return s;
            }
        }
        // Fallback: scan values
        for (const v of Object.values(obj)){
            const s = extractText(v);
            if (s) return s;
        }
        return "";
    };
    if (field == null) return "";
    if (typeof field === "string") return field;
    if (typeof field === "number") return String(field);
    if (Array.isArray(field)) {
        for (const v of field){
            const s = extractText(v);
            if (s) return s;
        }
        return "";
    }
    if (isRecord(field)) {
        // Common wrappers: { text: "..." } or { value: "..." }
        if (typeof field.text === "string") return field.text;
        if (typeof field.value === "string") return field.value;
        return pickFromObject(field);
    }
    return "";
};
const quote = (s)=>`'${s.replace(/'/g, "\"").trim()}'`;
// Prefer the last segment after an en dash/em dash, e.g.
// "Sweden – Personnel and payroll services – Title" => "Title"
const sanitizeTitle = (s)=>{
    const trimmed = s.trim().replace(/\s+/g, " ");
    const parts = trimmed.split(/\s*[–—]\s*/); // en/em dash only
    const last = parts[parts.length - 1]?.trim();
    return last || trimmed;
};
const buildQuery = (f)=>{
    const parts = [];
    if (Array.isArray(f.cpvs) && f.cpvs.length > 0) {
        const cpv = f.cpvs.map((c)=>`classification-cpv = ${c}`).join(" OR ");
        parts.push(`(${cpv})`);
    }
    if (f.text) parts.push(`FT ~ (${quote(f.text)})`);
    if (f.dateFrom) parts.push(`publication-date >= ${formatDateForTED(f.dateFrom)}`);
    else parts.push(`publication-date >= today(-365)`);
    if (f.deadlineTo) parts.push(`deadline-receipt-tender-date-lot <= ${formatDateForTED(f.deadlineTo)}`);
    if (f.country) {
        // Quote country value to avoid parser issues; supports 'SWE' or 'Sweden'
        parts.push(`buyer-country = ${quote(f.country)}`);
    }
    if (f.city) parts.push(`buyer-city ~ (${quote(f.city)})`);
    if (f.noticeType) parts.push(`notice-type = ${quote(f.noticeType)}`);
    const hasMin = f.valueMin !== undefined && f.valueMin !== null && String(f.valueMin).trim() !== "";
    const hasMax = f.valueMax !== undefined && f.valueMax !== null && String(f.valueMax).trim() !== "";
    const min = hasMin ? Number(f.valueMin) : undefined;
    const max = hasMax ? Number(f.valueMax) : undefined;
    if (hasMin && Number.isFinite(min)) {
        parts.push(`estimated-value-lot >= ${min}`);
    }
    if (hasMax && Number.isFinite(max)) {
        parts.push(`estimated-value-lot <= ${max}`);
    }
    if (f.status === "ongoing") {
        parts.push(`(notice-type IN (pin-only pin-buyer pin-rtl pin-tran pin-cfc-standard pin-cfc-social qu-sy cn-standard cn-social subco cn-desg))`);
    } else if (f.status === "completed") {
        parts.push(`(notice-type IN (can-standard can-social can-desg can-tran))`);
    }
    // We already add a default 1-year window above when no dateFrom is provided.
    return parts.join(" AND ");
};
async function POST(req) {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = 20;
    let filters;
    try {
        filters = await req.json();
    } catch  {
        filters = {
            cpvs: [],
            text: "",
            dateFrom: "",
            country: "",
            city: "",
            status: "ongoing"
        };
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
            'estimated-value-lot',
            'estimated-value-cur-lot',
            'deadline-receipt-tender-date-lot',
            'classification-cpv',
            'contract-nature',
            'notice-type',
            'procedure-type',
            'framework-agreement-lot',
            'description-lot',
            'document-url-lot',
            'document-url-part'
        ]
    };
    try {
        const res = await fetch("https://api.ted.europa.eu/v3/notices/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!res.ok || json?.error) {
            const err = json?.error || {};
            return new Response(JSON.stringify({
                items: [],
                total: 0,
                error: err.type || 'QUERY_ERROR',
                message: err.message || 'Fel vid sökning',
                parameterName: err.parameterName,
                unsupportedValue: err.unsupportedValue,
                location: err.location
            }), {
                status: res.status || 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const items = (json?.notices || []).map((n)=>{
            const publicationDate = formatDateToISO(n["publication-date"]);
            const deadlineRaw = n["deadline-receipt-tender-date-lot"] || "";
            const deadlineDate = deadlineRaw ? formatDateToISO(deadlineRaw) : undefined;
            let fromLinks;
            if (Array.isArray(n.links) && n.links.length > 0) {
                const first = n.links[0];
                if (isRecord(first) && typeof first.href === "string") {
                    fromLinks = first.href;
                } else {
                    const s = extractText(first);
                    fromLinks = s || undefined;
                }
            }
            const documentUrl = extractText(n['document-url-lot']) || extractText(n['document-url-part']) || fromLinks;
            const tVal = isRecord(n["tender-value"]) ? n["tender-value"] : undefined;
            const tenderValue = extractText(tVal?.amount ?? tVal?.value);
            const estValue = extractText(n['estimated-value-lot']);
            const estCur = extractText(n['estimated-value-cur-lot']);
            const value = estValue || tenderValue || undefined;
            const valueCurrency = estValue ? estCur || undefined : undefined;
            const buyerCountry = extractText(n['buyer-country']);
            const placeCountry = extractText(n['place-of-performance-country-lot']);
            const cpv = extractText(n['classification-cpv']);
            const contractNature = extractText(n['contract-nature']);
            const noticeType = extractText(n['notice-type']);
            const procedureType = extractText(n['procedure-type']);
            const framework = extractText(n['framework-agreement-lot']) || extractText(n['framework-agreement']);
            return {
                publicationNumber: n["publication-number"] || "",
                publicationDate,
                deadlineDate,
                title: sanitizeTitle(extractText(n["notice-title"]) || "Upphandling"),
                buyerName: extractText(n["buyer-name"]) || "",
                buyerCity: extractText(n["buyer-city"]) || "",
                country: buyerCountry || placeCountry || "",
                documentUrl,
                value: value || undefined,
                valueCurrency,
                description: extractText(n['description-lot']) || undefined,
                classification: cpv || undefined,
                contractNature: contractNature || undefined,
                noticeType: noticeType || undefined,
                procedureType: procedureType || undefined,
                frameworkAgreement: framework ? framework.toLowerCase() === 'true' || framework === 'yes' : undefined
            };
        });
        // Sort by most recent publication date first.
        // Note: This sorts within the current page of results returned by TED API.
        items.sort((a, b)=>{
            const da = a.publicationDate || "";
            const db = b.publicationDate || "";
            // ISO YYYY-MM-DD lexicographical comparison works for date ordering
            return db.localeCompare(da);
        });
        const total = Number(json?.totalNoticeCount || 0);
        return new Response(JSON.stringify({
            items,
            total
        }), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({
            items: [],
            total: 0
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8dba2d9b._.js.map