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

