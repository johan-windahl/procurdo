# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Procurdo is a Swedish public procurement search and notification service built as a pnpm monorepo with:
- Next.js 15 web application (App Router)
- Shared TypeScript package for database schemas and utilities
- PostgreSQL database with Drizzle ORM
- Clerk authentication
- Vercel deployment

## Common Commands

### Development
```bash
pnpm dev                    # Run web app in development mode (Turbopack)
pnpm build                  # Build shared package and web app
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
```

### Database Operations

**Schema Changes:**
```bash
pnpm db:gen                 # Generate migrations for all databases
pnpm db:gen:procudo_dev     # Generate for main app DB (dev)
pnpm db:gen:procudo_data_dev # Generate for data DB (dev)
```

**Migrations:**
```bash
pnpm db:migrate             # Run all migrations
pnpm db:migrate:procudo_dev # Migrate main app DB (dev)
pnpm db:migrate:procudo_data_dev # Migrate data DB (dev)
pnpm db:migrate:procudo_prod # Migrate main app DB (prod)
pnpm db:migrate:all         # Migrate all configured databases
```

**Database Tools:**
```bash
pnpm db:studio              # Open Drizzle Studio
pnpm db:seed                # Seed database with initial data
```

## Architecture

### Monorepo Structure

```
apps/web/               # Next.js application
  app/
    (marketing)/        # Public routes (SEO-first, static/ISR)
    app/                # Protected routes (auth required, robots noindex)
  components/
    ui/                 # Shared UI components (shadcn/ui)
    app/                # App-specific components
    marketing/          # Marketing-specific components
  lib/                  # Web-specific utilities

packages/shared/        # Shared TypeScript code
  db/
    schema/             # Drizzle schemas (procudo.ts, procudo-data.ts)
    migrations/         # SQL migration files
      procudo_dev/      # Main app migrations
      procudo_data_dev/ # Data warehouse migrations
  lib/
    db.ts               # Database client with connection pooling
    db-config.ts        # Multi-database configuration
  scripts/
    generate.ts         # Migration generation script
    migrate.ts          # Migration execution script
```

### Multi-Database Setup

The project uses **two separate PostgreSQL databases**:

1. **procudo** - Main application database (users, auth, app data)
   - Schema: `packages/shared/db/schema/procudo.ts`
   - Migrations: `packages/shared/db/migrations/procudo_dev/`

2. **procudo_data** - Data warehouse/analytics database (procurement data)
   - Schema: `packages/shared/db/schema/procudo-data.ts`
   - Migrations: `packages/shared/db/migrations/procudo_data_dev/`

Environment variables control which databases to use:
- Runtime: `DATABASE_URL_PROCUDO_DEV`, `DATABASE_URL_PROCUDO_DATA_DEV`
- Migrations: `MIGRATION_DATABASE_URL_PROCUDO_DEV`, `MIGRATION_DATABASE_URL_PROCUDO_DATA_DEV`, etc.

Use `getDatabase()` or `getDb(dbName)` from `@procurdo/shared/lib/db` to access specific databases.

### Database Migration Workflow

**Critical: Migrations are NEVER run in Vercel build step.**

1. Modify schema in `packages/shared/db/schema/[procudo|procudo-data].ts`
2. Generate migration: `pnpm db:gen` or specific DB variant
3. Review generated SQL in `packages/shared/db/migrations/`
4. Run migration locally: `pnpm db:migrate`
5. Commit both schema and migration files
6. For production: Run migrations manually on prod DB before deploying

Each database has separate migration folders that share schemas (procudo_dev and procudo_prod share the same schema but have separate migration histories).

### Routing Architecture

**Public Routes** (`app/(marketing)/`):
- SEO-optimized, static or ISR
- No authentication required
- Indexable by search engines
- No database calls in components (data from content files or static generation)

**Protected Routes** (`app/app/`):
- Authentication required via Clerk middleware
- Dynamic rendering
- `robots: { index: false }` in metadata
- Can use database and Clerk APIs

**Middleware** (`middleware.ts`):
- Handles legacy `/sv-se/*` redirects (308 permanent)
- Protects `/app/*` routes with Clerk
- Uses `createRouteMatcher(["/app(.*)"])` pattern

### Authentication

Uses **Clerk v6.31.9+** (required for Edge Runtime compatibility):
- Server-side auth via `requireUser()` helper in `apps/web/lib/auth.ts`
- Returns `{ id: string, email: string | null }`
- Never put auth checks in client components
- Middleware protects routes, components use helpers

### Component Guidelines

**UI Components** (`components/ui/`):
- Framework-agnostic, reusable
- No auth, router, or DB imports
- Accept data via typed props
- Based on shadcn/ui primitives

**App Components** (`components/app/`):
- Can use Clerk, Next.js router, and database
- Specific to authenticated app features

**Marketing Components** (`components/marketing/`):
- Can fetch CMS/MDX content
- No auth logic

### TypeScript and Code Style

- TypeScript everywhere, no implicit `any`
- Typed Drizzle queries (no raw SQL in components)
- Components use PascalCase, helpers/hooks use camelCase
- Minimize `"use client"` - only where strictly needed
- Tailwind utility-first styling (no inline styles)
- Centralize theme tokens in Tailwind config

### Shared Package Structure

`@procurdo/shared` exports:
- `"."` - Main exports (index.ts)
- `"./db/schema"` - Database schemas
- `"./db/schema/procudo"` - Main app schema
- `"./db/schema/procudo-data"` - Data warehouse schema
- `"./lib/db"` - Database client
- `"./lib/utils"` - Shared utilities

The package must be built (`pnpm --filter @procurdo/shared build`) before web app can use it.

### Deployment

**Vercel Configuration:**
- Root directory: `apps/web`
- Framework: Next.js
- Build command: `pnpm build` (builds shared package first)
- Required env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL_PROCUDO_DEV`, `NEXT_PUBLIC_GA_ID`

**Two-Step Deploy for Schema Changes:**
1. Run production migrations manually
2. Deploy to Vercel (triggers after migrations complete)

For destructive changes:
1. Add new column + backfill
2. Deploy app to use new column
3. Remove old column in later migration

### Development Workflow

**Local Development:**
```bash
# First time setup
pnpm install
pnpm db:migrate  # Run migrations
pnpm db:seed     # Seed data (optional)

# Daily workflow
pnpm dev         # Start dev server with Turbopack
```

**Schema Changes:**
```bash
# 1. Edit schema file
# 2. Generate migration
pnpm db:gen

# 3. Review SQL
cat packages/shared/db/migrations/procudo_dev/XXXX_*.sql

# 4. Run migration
pnpm db:migrate

# 5. Test app
pnpm dev
```

**Pull Request Flow:**
- Migrations reviewed in PR
- Manual migration on preview/prod databases
- Vercel Preview uses branch `DATABASE_URL`

### Key Files

- `apps/web/middleware.ts` - Route protection and redirects
- `apps/web/lib/auth.ts` - Server-side auth helper
- `packages/shared/lib/db.ts` - Database client with pooling
- `packages/shared/lib/db-config.ts` - Multi-DB configuration
- `packages/shared/scripts/migrate.ts` - Migration runner (supports multi-DB)
- `packages/shared/scripts/generate.ts` - Migration generator

### Important Patterns

**Database Access:**
```typescript
import { getDb } from "@procurdo/shared/lib/db";
const db = getDb('procudo_dev');
const users = await db.select().from(schema.users);
```

**Server-Side Auth:**
```typescript
import { requireUser } from "@/lib/auth";
const user = await requireUser(); // Returns user or redirects to sign in
```

**Route Metadata:**
```typescript
// For protected routes
export const metadata = {
  title: "Dashboard",
  robots: { index: false }
};
```

### Testing and Quality

- ESLint configured for Next.js
- TypeScript strict mode
- Drizzle ORM prevents SQL injection
- Review all SQL diffs in PRs
- Use least-privilege DB role in production

### Documentation Location

All project documentation lives in `docs/`:
- `docs/migration/` - Monorepo migration guides
- `docs/deployment/` - Vercel setup, troubleshooting
- `docs/architecture/` - System design docs

Keep root README.md concise (overview + quick start only).
