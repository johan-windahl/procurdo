// Helpers to translate TED field values into Swedish for UI

const norm = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function translateProcedureType(input?: string): string | undefined {
  if (!input) return undefined;
  const n = norm(input);
  // Negotiated with/without call for competition (common short codes)
  if (n.includes("neg-w-call") || (n.includes("neg") && n.includes("w-call"))) {
    return "Förhandlat förfarande med föregående annonsering";
  }
  if (
    n.includes("neg-wo-call") ||
    n.includes("neg-w-o-call") ||
    n.includes("neg-without-call") ||
    n.includes("negotiated-without")
  ) {
    return "Förhandlat förfarande utan föregående annonsering";
  }
  if (n.includes("open")) return "Öppet förfarande";
  if (n.includes("restricted")) return "Selektivt förfarande";
  if (n.includes("competitive-procedure-with-negotiation")) return "Konkurrenspräglat förfarande med förhandling";
  if (n.includes("competitive-dialogue")) return "Konkurrenspräglad dialog";
  if (n.includes("innovation-partnership")) return "Innovationspartnerskap";
  if (n.includes("negotiated")) return "Förhandlat förfarande";
  if (n.includes("dynamic-purchasing-system")) return "Dynamiskt inköpssystem";
  if (n.includes("direct-award") || n.includes("directaward")) return "Direktupphandling";
  return input; // fallback as-is
}

export function translateNoticeType(input?: string): string | undefined {
  if (!input) return undefined;
  const n = norm(input);
  if (n.startsWith("cn") || n.includes("contract-notice")) return "Upphandlingsannons";
  if (n.startsWith("can") || n.includes("award-notice")) return "Tilldelningsannons";
  if (n.startsWith("pin") || n.includes("prior-information")) return "Förhandsannons";
  if (n.includes("subco")) return "Annons om underleverantörer";
  if (n.includes("contract-award")) return "Tilldelningsannons";
  return input; // fallback
}

export function translateContractNature(input?: string): string | undefined {
  if (!input) return undefined;
  const n = norm(input);
  if (n.includes("services")) return "Tjänster";
  if (n.includes("works")) return "Byggentreprenad";
  if (n.includes("supplies")) return "Varor";
  return input;
}
