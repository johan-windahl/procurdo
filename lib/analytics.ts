export const GA_TRACKING_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-2KT03XRWKB";

export const isGaEnabled =
  process.env.NODE_ENV === "production" && Boolean(GA_TRACKING_ID);

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function pageview(url: string) {
  if (!isGaEnabled) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
}

// Consent Mode v2 helpers
export type ConsentValue = "granted" | "denied";
export type ConsentState = {
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  analytics_storage: ConsentValue;
  functionality_storage: ConsentValue;
  personalization_storage: ConsentValue;
  security_storage: ConsentValue; // should remain granted for essentials
};

export const CONSENT_STORAGE_KEY = "cookie-consent-v2";

export function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function storeConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function consentAllGranted(): ConsentState {
  return {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
    functionality_storage: "granted",
    personalization_storage: "granted",
    security_storage: "granted",
  };
}

export function consentAllDenied(): ConsentState {
  return {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted", // keep essentials
  };
}

export function updateConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  // Use stubbed gtag if not yet loaded; pushes to dataLayer
  if (typeof window.gtag !== "function") {
    // create minimal stub to queue if not present
    if (!window.dataLayer) window.dataLayer = [];
    window.gtag = ((...args: unknown[]) => {
      // push the arguments tuple as one entry like the native snippet does
      (window.dataLayer as unknown[]).push(args as unknown);
    }) as Window["gtag"];
  }
  window.gtag("consent", "update", state as unknown as Record<string, string>);
  storeConsent(state);
}
