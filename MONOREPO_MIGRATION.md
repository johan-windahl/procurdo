# Monorepo Migration - Completed

## Overview

Successfully restructured the Procurdo project from a single Next.js application into a flexible monorepo that supports:

- Next.js web application (Vercel deployment)
- Shared TypeScript package for database and utilities
- Future polyglot backend services (Python, Go, etc.)

## Final Structure

```
procurdo/
├── apps/
│   └── web/                          # Next.js web application
│       ├── app/                      # Next.js App Router
│       ├── components/               # React components
│       ├── lib/                      # Web-specific utilities
│       ├── public/                   # Static assets
│       ├── data/                     # Static data (CPV, countries)
│       ├── package.json              # @procurdo/web
│       ├── tsconfig.json
│       ├── next.config.ts
│       └── vercel.json               # Vercel deployment config
├── packages/
│   └── shared/                       # Shared TypeScript package
│       ├── db/
│       │   ├── schema.ts             # Drizzle schema
│       │   └── migrations/           # SQL migrations
│       ├── lib/
│       │   ├── db.ts                 # Database client
│       │   └── utils.ts              # Shared utilities
│       ├── seed.ts                   # Database seeding script
│       ├── package.json              # @procurdo/shared
│       ├── tsconfig.json
│       └── drizzle.config.ts
├── services/                         # Future non-TS services
├── misc/                             # Miscellaneous files
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml               # pnpm workspace definition
├── vercel.json                       # Root Vercel config
└── README.md                         # Updated documentation

```

## Changes Made

### 1. Created Monorepo Structure

- ✅ Created `apps/`, `packages/`, and `services/` directories
- ✅ Set up `pnpm-workspace.yaml` for workspace management
- ✅ Created root `package.json` with workspace scripts

### 2. Created Shared Package (`@procurdo/shared`)

- ✅ Moved database schema to `packages/shared/db/schema.ts`
- ✅ Moved migrations to `packages/shared/db/migrations/`
- ✅ Moved database client to `packages/shared/lib/db.ts`
- ✅ Moved shared utilities to `packages/shared/lib/utils.ts`
- ✅ Created `packages/shared/package.json` with proper exports
- ✅ Created `packages/shared/tsconfig.json` for compilation
- ✅ Moved seed script to `packages/shared/seed.ts`

### 3. Moved Web App to `apps/web/`

- ✅ Moved entire Next.js application to `apps/web/`
- ✅ Updated `package.json` to `@procurdo/web`
- ✅ Added `@procurdo/shared` as workspace dependency
- ✅ Updated `tsconfig.json` with path mappings for shared package
- ✅ Kept web-specific files in `apps/web/lib/`:
  - `auth.ts` (Clerk authentication)
  - `seo.ts` (Next.js SEO utilities)
  - `analytics.ts` (Google Analytics)
  - `posts.ts` (Content management)
  - `ted.ts` (TED API integration)
  - `utils.ts` (UI utilities + re-exports from shared)

### 4. Updated Imports and Dependencies

- ✅ Removed duplicate `db.ts` and `utils.ts` from web app
- ✅ Created new `apps/web/lib/utils.ts` that re-exports shared utilities
- ✅ Removed database dependencies from web app (now in shared package)
- ✅ No import changes needed (app doesn't directly use DB yet)

### 5. Fixed Build Issues

- ✅ Fixed ClerkProvider configuration for marketing pages
- ✅ Fixed Google Analytics Script component implementation
- ✅ Updated `next.config.ts` to handle environment variables
- ✅ Separated UI-specific utilities from shared utilities

### 6. Vercel Configuration

- ✅ Created `apps/web/vercel.json` with monorepo build commands
- ✅ Created root `vercel.json` for workspace awareness
- ✅ Build command: `cd ../.. && pnpm install && pnpm --filter @procurdo/web build`

### 7. Documentation

- ✅ Updated root `README.md` with comprehensive monorepo documentation
- ✅ Documented development workflow
- ✅ Added guidelines for adding new services

## Verification

### Build Test

```bash
# Shared package builds successfully
pnpm --filter @procurdo/shared build

# Web app builds successfully
pnpm --filter @procurdo/web build
```

### Build Output

- ✅ 18 pages generated successfully
- ✅ All static pages prerendered correctly
- ✅ No TypeScript errors
- ✅ All routes functional

## Development Workflow

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
# Run web app in dev mode
pnpm dev

# Or from root
cd apps/web && pnpm dev
```

### Database Operations

```bash
# Generate migration
pnpm db:gen

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

### Building

```bash
# Build everything
pnpm build

# Build specific package
pnpm --filter @procurdo/shared build
pnpm --filter @procurdo/web build
```

## Vercel Deployment

### Configuration

1. In Vercel dashboard, set root directory to `apps/web`
2. Vercel will automatically detect the monorepo structure
3. Build command is configured in `apps/web/vercel.json`

### Environment Variables

Set these in Vercel dashboard:

- `DATABASE_URL` - Neon PostgreSQL connection
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)

## Adding New Services

### TypeScript Service (in `apps/` or `packages/`)

1. Create new directory
2. Add `package.json` with name `@procurdo/service-name`
3. Add dependency: `"@procurdo/shared": "workspace:*"`
4. Import shared code: `import { db } from "@procurdo/shared/lib/db"`

### Non-TypeScript Service (in `services/`)

1. Create new directory with appropriate structure
2. Add Dockerfile and deployment configuration
3. Access shared types via API contracts or code generation
4. Can connect to same database using `DATABASE_URL`

## Benefits Achieved

✅ **Separation of Concerns**: Database logic separated from web app
✅ **Code Reusability**: Shared package can be used by multiple services
✅ **Flexibility**: Can add services in any language
✅ **Type Safety**: TypeScript types shared across TS services
✅ **Centralized Migrations**: Single source of truth for database schema
✅ **Independent Deployment**: Each service can be deployed separately
✅ **Scalability**: Easy to add new services as needed

## Next Steps

1. **Deploy to Vercel**: Update Vercel project settings to point to `apps/web`
2. **Add Backend Service**: Create first service in `services/` or `apps/`
3. **Environment Setup**: Ensure all environment variables are set
4. **CI/CD**: Update CI pipeline to handle monorepo structure
5. **Documentation**: Add service-specific READMEs as services are added

## Notes

- Git history preserved for all moved files
- No breaking changes to existing functionality
- All routes and features work as before
- Build process verified and working
- Ready for production deployment
