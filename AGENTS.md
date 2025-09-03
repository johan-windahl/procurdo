Project Setup
• Framework: Next.js App Router
• Hosting: Vercel
• Database: Neon (EU) + Drizzle ORM
• Auth: Clerk
• Styling: TailwindCSS + shadcn/ui

⸻

Routing & Structure
• /(marketing) → Public routes
• SEO-first, static/ISR, indexable
• No DB calls, only content from MD/MDX or CMS
• /(app) → Protected routes
• Auth required, dynamic
• Add robots: { index: false }
• Shared UI → components/ui
• App-only UI → components/app
• Marketing-only UI → components/marketing
• Data schemas & migrations → db/schema.ts + db/migrations/
• Helpers → lib/
• db.ts → database client
• auth.ts → Clerk helpers
• seo.ts → SEO metadata utils
• Content → content/ (MD/MDX with strict frontmatter)

⸻

Database & Migrations
• Schema lives in db/schema.ts
• Use drizzle-kit generate to create SQL migration files
• Store migrations in db/migrations/\*.sql, commit them to repo
• Never edit committed migrations; create new ones to fix mistakes
• Local workflow: generate + run migrations, seed with scripts/seed.ts
• Prod workflow: CI runs migrations before Vercel deploy
• Preview workflow: create Neon branch per PR, run migrations there

⸻

Coding Rules
• TypeScript everywhere (no implicit any)
• Typed Drizzle queries, no raw SQL in components
• Reusable components
• Break down UI into small, composable pieces
• Keep components typed with clear props
• Styling consistency
• Tailwind utility-first, no inline styles
• Use shadcn/ui primitives for buttons, forms, dialogs, etc.
• Centralize theme tokens in Tailwind config
• File conventions
• Components → PascalCase
• Helpers/hooks → camelCase
• Keep "use client" minimal (only where needed)

⸻

Auth
• Use Clerk middleware to protect /(app)
• Server-side auth helpers (requireUser() in lib/auth.ts)
• Never put auth checks in client components

⸻

SEO
• Only public routes (/(marketing)) appear in sitemap & robots
• Add metadata via Metadata API (title, description, OG/Twitter)
• Use structured data (JSON-LD) where relevant

⸻

Dev Workflow
• Local
• Change schema → pnpm db:gen → pnpm db:migrate → run app
• Reset DB if messy (drop + re-run migrations + seed)
• PR
• CI creates Neon branch
• CI runs migrations
• Vercel Preview uses branch DATABASE_URL
• Main
• CI runs migrations on prod DB
• Then triggers Vercel deploy

⸻

Safety
• Never run migrations in Vercel build step
• Use least-privilege DB role in runtime
• Always review SQL diffs in PRs
• Use two-step deploys for destructive schema changes: 1. Add column / backfill 2. Switch app 3. Remove old column later

⸻

Component Guidelines
• UI components should:
• Be framework-agnostic (no auth, router, or DB imports)
• Accept data via props, don’t fetch inside
• Have typed props (type Props = { ... })
• App-only components can use Clerk, router, or DB
• Marketing-only components can fetch CMS/MDX content but no auth logic

⸻

TL;DR
• Schema in code, migrations in repo
• Typed code, reusable components, consistent styling
• Static marketing, dynamic app
• CI controls DB migrations, not Vercel build
• Keep it modular, typed, and easy to reset when vibing
