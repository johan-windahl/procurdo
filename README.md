# Procurdo Monorepo

A monorepo for the Procurdo platform - a Swedish public procurement search and notification service.

## Structure

```
procurdo/
├── apps/
│   └── web/                    # Next.js web application (deployed on Vercel)
├── packages/
│   └── shared/                 # Shared TypeScript code
│       ├── db/                 # Database schema & migrations (Drizzle ORM)
│       ├── lib/                # Shared utilities (DB client, helpers)
│       └── types/              # Shared TypeScript types
├── services/                   # Future backend services (Python, Go, etc.)
├── docs/                       # Project documentation
└── misc/                       # Miscellaneous files
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL

### Installation

```bash
# Install dependencies for all packages
pnpm install
```

### Development

```bash
# Run the web app in development mode
pnpm dev

# Build all packages
pnpm build

# Run database migrations
pnpm db:migrate

# Generate new migration
pnpm db:gen

# Open Drizzle Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

## Packages

### `@procurdo/web` (apps/web)

Next.js web application with:

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS + shadcn/ui
- **Auth**: Clerk
- **Hosting**: Vercel
- **Analytics**: Google Analytics 4

Environment variables required:

- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (default: `G-2KT03XRWKB`)
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

### `@procurdo/shared` (packages/shared)

Shared TypeScript package containing:

- Database schema and migrations (Drizzle ORM)
- Database client (supports Neon HTTP and local PostgreSQL)
- Shared utilities and types

## Database

- **ORM**: Drizzle ORM
- **Schema**: `packages/shared/db/schema.ts`
- **Migrations**: `packages/shared/db/migrations/`

### Migration Workflow

1. Modify schema in `packages/shared/db/schema.ts`
2. Generate migration: `pnpm db:gen`
3. Review generated SQL in `packages/shared/db/migrations/`
4. Run migration: `pnpm db:migrate`
5. Commit both schema and migration files

## Deployment

See the [deployment documentation](./docs/deployment/) for detailed guides:

- [Vercel Deployment Guide](./docs/deployment/vercel-deployment-guide.md) - Complete setup instructions
- [Edge Runtime Fix](./docs/deployment/vercel-edge-runtime-fix.md) - Troubleshooting Clerk issues

**Quick start:**

1. Set root directory to `apps/web` in Vercel
2. Configure environment variables
3. Deploy

## Adding New Services

### TypeScript Service

1. Create new directory in `apps/` or `packages/`
2. Add package.json with name `@procurdo/service-name`
3. Update `pnpm-workspace.yaml` if needed (already includes `apps/*` and `packages/*`)
4. Reference shared package: `"@procurdo/shared": "workspace:*"`

### Non-TypeScript Service

1. Create new directory in `services/`
2. Add appropriate build/deploy configuration (Dockerfile, etc.)
3. Services can access shared types by generating them from the shared package or using API contracts

## Architecture

- **Frontend**: Next.js on Vercel (static marketing pages + dynamic app pages)
- **Auth**: Clerk
- **Future Services**: Polyglot microservices on VPS with Docker

## Documentation

All project documentation is in the [`docs/`](./docs/) directory:

- **[Migration Guides](./docs/migration/)** - Monorepo migration, structural changes
- **[Deployment Guides](./docs/deployment/)** - Vercel setup, troubleshooting
- **[Architecture](./docs/architecture/)** - System design, decisions

See [AGENTS.md](./AGENTS.md) for development rules and guidelines.

## Contributing

1. Create feature branch
2. Make changes
3. Test locally: `pnpm build && pnpm dev`
4. Commit changes (include migrations if schema changed)
5. Push and create PR

## License

Private - All rights reserved
