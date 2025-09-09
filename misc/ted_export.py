import argparse
import csv
import time
import requests
from typing import Any, Dict, List, Sequence

API_URL = "https://api.ted.europa.eu/v3/notices/search"


def _join_list(val: Any, sep: str = ",") -> str:
    if val is None:
        return ""
    if isinstance(val, list):
        return sep.join(str(x) for x in val)
    return str(val)


def _pick_language(obj: Any, preferred_langs: Sequence[str]) -> str:
    """Flatten a possibly localized or list-valued field to a string.
    - If dict of languages -> pick first preferred lang with content; fallback to first non-empty.
    - If list -> join with comma.
    - Else -> string.
    """
    if obj is None:
        return ""
    if isinstance(obj, dict):
        for lang in preferred_langs:
            if lang in obj and obj[lang]:
                v = obj[lang]
                return _join_list(v, sep=" | ") if isinstance(v, list) else str(v)
        # Fallback: first non-empty entry
        for _, v in obj.items():
            if v:
                return _join_list(v, sep=" | ") if isinstance(v, list) else str(v)
        return ""
    if isinstance(obj, list):
        return _join_list(obj)
    return str(obj)


def _extract_names_tenderer(notice: Dict[str, Any], preferred_langs: Sequence[str]) -> List[str]:
    v = notice.get("organisation-name-tenderer")
    if v is None:
        return []
    if isinstance(v, dict):
        for lang in preferred_langs:
            if lang in v and v[lang]:
                return [str(x) for x in v[lang]]
        for _, vv in v.items():
            if vv:
                return [str(x) for x in vv]
        return []
    if isinstance(v, list):
        return [str(x) for x in v]
    return [str(v)]


def _extract_field(notice: Dict[str, Any], field: str, preferred_langs: Sequence[str]) -> str:
    val = notice.get(field)
    if field == "classification-cpv":
        # Always comma-separated in a single column
        return _join_list(val, sep=",")
    return _pick_language(val, preferred_langs)


def export_notices(
    query: str,
    fields: List[str],
    output_path: str,
    limit: int = 250,
    mode: str = "ITERATION",
    lang_order: Sequence[str] = ("swe", "eng"),
    base_url: str = API_URL,
    user_agent: str = "ted-exporter/1.0 (+https://example.local)"
) -> int:
    """Fetch notices and write a ;‑separated CSV. Returns number of rows written."""
    mode = mode.upper()
    assert mode in {"ITERATION", "PAGE_NUMBER"}, "mode must be ITERATION or PAGE_NUMBER"
    if not fields:
        raise ValueError("You must provide at least one field name.")

    headers = {
        "Content-Type": "application/json",
        "User-Agent": user_agent,
    }

    rows_written = 0

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields, delimiter=';')
        writer.writeheader()

        iteration_token = None
        page = 1

        while True:
            payload: Dict[str, Any] = {
                "query": query,
                "fields": fields,
                "limit": limit,
                "paginationMode": mode,
            }
            if mode == "ITERATION":
                if iteration_token:
                    payload["iterationNextToken"] = iteration_token
            else:
                payload["page"] = page

            resp = requests.post(base_url, json=payload, headers=headers, timeout=60)
            resp.raise_for_status()
            data = resp.json()

            notices = data.get("notices", []) or []
            if not notices:
                break

            for notice in notices:
                # Build a base row for all non-tenderer-pair fields
                base_row: Dict[str, str] = {}
                for fld in fields:
                    if fld in ("organisation-email-tenderer", "organisation-name-tenderer"):
                        continue
                    base_row[fld] = _extract_field(notice, fld, lang_order)

                need_pairing = (
                    ("organisation-email-tenderer" in fields) or
                    ("organisation-name-tenderer" in fields)
                )

                if need_pairing:
                    emails = notice.get("organisation-email-tenderer") or []
                    if not isinstance(emails, list):
                        emails = [emails]
                    names = _extract_names_tenderer(notice, lang_order)

                    n = max(len(emails), len(names)) or 1
                    for i in range(n):
                        row = dict(base_row)
                        if "organisation-email-tenderer" in fields:
                            row["organisation-email-tenderer"] = emails[i] if i < len(emails) else ""
                        if "organisation-name-tenderer" in fields:
                            row["organisation-name-tenderer"] = names[i] if i < len(names) else ""
                        writer.writerow(row)
                        rows_written += 1
                else:
                    writer.writerow(base_row)
                    rows_written += 1

            # Advance pagination
            if mode == "ITERATION":
                iteration_token = data.get("iterationNextToken")
                if not iteration_token:
                    break
            else:  # PAGE_NUMBER
                if len(notices) < limit:
                    break
                page += 1

            # Be a good API citizen
            time.sleep(0.1)

    return rows_written


def main():
    p = argparse.ArgumentParser(description="Export TED notices to ;‑separated CSV")
    p.add_argument("--query", required=True, help="Expert query string")

    # Allow either repeated --fields or space-separated after --fields
    p.add_argument(
        "--fields",
        nargs='+',
        required=True,
        help="List of field names to include (exactly as in TED API)"
    )

    p.add_argument("--output", default="ted_notices.csv", help="Output CSV path")
    p.add_argument("--limit", type=int, default=250, help="Items per page (max 250)")
    p.add_argument("--mode", choices=["ITERATION", "PAGE_NUMBER"], default="ITERATION")
    p.add_argument(
        "--lang-order",
        nargs='+',
        default=["swe", "eng"],
        help="Preferred language codes (e.g., swe eng) for localized fields"
    )
    p.add_argument(
        "--user-agent",
        default="ted-exporter/1.0 (+https://example.local)",
        help="Custom User-Agent header"
    )

    args = p.parse_args()

    written = export_notices(
        query=args.query,
        fields=args.fields,
        output_path=args.output,
        limit=args.limit,
        mode=args.mode,
        lang_order=args.lang_order,
        user_agent=args.user_agent,
    )
    print(f"Done. Wrote {written} row(s) to {args.output}")


if __name__ == "__main__":
    main()
