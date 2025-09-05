## Analytics

Google Analytics 4 is integrated via `next/script` and a lightweight client component for SPA route changes.

- Env var: set `NEXT_PUBLIC_GA_ID` (default fallback: `G-2KT03XRWKB`).
- Production-only: scripts run when `NODE_ENV=production`.
- Files: `app/layout.tsx`, `components/app/Analytics.tsx`, `lib/analytics.ts`.
