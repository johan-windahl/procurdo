Project Setup
• Framework: Next.js App Router
• Hosting: Vercel
• Database: Postgres installed on VPS (locally for dev) + Drizzle ORM
• Auth: Clerk
• Styling: TailwindCSS + shadcn/ui
• Structure: Monorepo with pnpm workspaces

⸻

Monorepo Structure
• apps/web/ → Next.js application
• packages/shared/ → Shared TypeScript code (DB, types, utilities)
• services/ → Future polyglot backend services (Python, Go, etc.)
• docs/ → All project documentation (\*.md files)
• Root → Only essential files (README.md, package.json, workspace config)

⸻

Routing & Structure (apps/web/)
• /(marketing) → Public routes
• SEO-first, static/ISR, indexable
• No DB calls, only content from MD/MDX or CMS
• /(app) → Protected routes
• Auth required, dynamic
• Add robots: { index: false }
• Shared UI → components/ui
• App-only UI → components/app
• Marketing-only UI → components/marketing
• Data schemas & migrations → packages/shared/db/
• Helpers → apps/web/lib/ (web-specific) or packages/shared/lib/ (shared)
• Content → apps/web/content/ (MD/MDX with strict frontmatter)

⸻

Database & Migrations
• Schema lives in packages/shared/db/schema/ (separate files per database)
• Use drizzle-kit generate to create SQL migration files
• Store migrations in packages/shared/db/migrations/\*.sql, commit them to repo
• Never edit committed migrations; create new ones to fix mistakes
• Local workflow: pnpm db:gen → pnpm db:migrate → run app
• Seed with packages/shared/seed.ts
• Prod workflow: Run migrations manually before deploy (never in build step)

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
• Server-side auth helpers (requireUser() in apps/web/lib/auth.ts)
• Never put auth checks in client components
• Clerk v6.31.9+ required for Edge Runtime compatibility

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
• Migrations are runned manually
• Vercel Preview uses branch DATABASE_URL
• Main
• Migrations are runned manually on prod DB
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

Documentation Guidelines
• All documentation goes in docs/ folder
• Migration guides → docs/migration/
• Deployment guides → docs/deployment/
• Architecture docs → docs/architecture/
• Keep root README.md concise (overview + quick start only)
• Use clear, descriptive filenames (lowercase-with-dashes.md)
• Include code examples with proper syntax highlighting

⸻

TL;DR
• Monorepo structure: apps/web + packages/shared + services/
• Schema in packages/shared, migrations committed to repo
• Typed code, reusable components, consistent styling
• Static marketing, dynamic app
• Run migrations manually before deploy (never in build step)
• Documentation in docs/ folder
• Keep it modular, typed, and easy to reset when vibing
