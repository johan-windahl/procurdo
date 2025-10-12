// Format a number (or numeric string) with thin spaces as thousands separators
// Example: 1000000 -> "1 000 000"
export function formatThousandsSpaces(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return "";
  const str = String(input).replace(/\s/g, "");
  if (str === "") return "";
  // Detect decimals (either . or ,); keep the same separator if present
  const match = str.match(/^(\d+)([\.,](\d+))?$/);
  if (match) {
    const [, intPart, sepWithDec = "", decPart = ""] = match;
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decPart ? `${grouped}${sepWithDec}${decPart}` : grouped;
  }
  // If not strictly numeric, try Number conversion
  const n = Number(str.replace(/,/g, "."));
  if (Number.isFinite(n)) {
    const int = Math.trunc(n);
    const grouped = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const frac = Math.abs(n - int);
    if (frac > 0) {
      // Preserve  up to 2 decimals
      const fracStr = (Math.round(frac * 100) / 100).toString().split(".")[1] || "";
      return fracStr ? `${grouped},${fracStr}` : grouped;
    }
    return grouped;
  }
  return str;
}

// Normalize a user-entered numeric string by stripping non-digits
// Returns digits-only (no leading zeros trimming here)
export function normalizeNumericInput(value: string): string {
  return value.replace(/\D/g, "");
}
