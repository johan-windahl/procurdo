# Vercel Deployment Guide

## Configuration

### 1. Project Settings

In your Vercel project dashboard:

1. **Framework Preset**: Next.js
2. **Root Directory**: `apps/web`
3. **Build Command**: Leave as default (Vercel will use the command from `vercel.json`)
4. **Output Directory**: Leave as default
5. **Install Command**: Leave as default

### 2. Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

#### Required Variables

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Important Notes

- Use **Production** values for production deployment
- Use **Preview** values for preview deployments (optional)
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Clerk keys are different for development vs production

### 3. Clerk Configuration

The middleware uses Clerk for authentication. Make sure:

1. Your Clerk application is configured at https://dashboard.clerk.com
2. Add your Vercel domain to Clerk's allowed domains
3. Configure sign-in/sign-up URLs if needed

### 4. Build Configuration

The build is configured via `apps/web/vercel.json`:

```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm --filter @procurdo/web build",
  "installCommand": "cd ../.. && pnpm install",
  "framework": null
}
```

This ensures:

- pnpm workspace is properly initialized
- Shared package is built before web app
- All dependencies are resolved correctly

## Troubleshooting

### Edge Runtime Issues with Clerk

If you see errors like:

```
The Edge Function "middleware" is referencing unsupported modules: @clerk
```

**Solution**: Make sure you're using Clerk v6.31.9 or later, which has better Edge Runtime support.

Update in `apps/web/package.json`:

```json
"@clerk/nextjs": "^6.31.9"
```

Then run:

```bash
pnpm install
```

### Build Fails with "Missing publishableKey"

**Solution**: Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in Vercel environment variables.

For local builds without real Clerk keys, use:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuZHVtbXkuZHVtbXkkdGVzdA \
CLERK_SECRET_KEY=sk_test_dummykey \
pnpm build
```

### Monorepo Not Detected

**Solution**: Ensure `pnpm-workspace.yaml` exists in the root and contains:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Database Connection Issues

**Solution**:

1. Verify `DATABASE_URL` is set correctly
2. Ensure Neon database allows connections from Vercel IPs
3. Check that the connection string includes `?sslmode=require`

## Deployment Workflow

### First Deployment

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Set root directory to `apps/web`
4. Add environment variables
5. Deploy

### Subsequent Deployments

Vercel automatically deploys:

- **Production**: When you push to `main` branch
- **Preview**: When you push to other branches or open PRs

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
cd /path/to/procurdo
vercel --cwd apps/web
```

## Database Migrations

### Before Deploying Schema Changes

1. Generate migration locally:

   ```bash
   pnpm db:gen
   ```

2. Review the generated SQL in `packages/shared/db/migrations/`

3. Commit the migration files

4. Run migration on production database:

   ```bash
   # Set production DATABASE_URL
   export DATABASE_URL=postgresql://...
   pnpm db:migrate
   ```

5. Deploy the application

### Important

- **Never** run migrations as part of the Vercel build
- Always run migrations manually before deploying
- Test migrations on a staging database first
- Keep migrations in version control

## Performance

### Caching

Vercel automatically caches:

- Static pages (marketing pages)
- Static assets (images, CSS, JS)
- API responses (if configured)

### ISR (Incremental Static Regeneration)

Marketing pages can use ISR for better performance:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Analytics to track:

- Page views
- Performance metrics
- Web Vitals

### Error Tracking

Consider adding:

- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM

## Security

### Environment Variables

- Never commit `.env` files
- Use Vercel's environment variable encryption
- Rotate secrets regularly
- Use different keys for preview vs production

### Headers

Configure security headers in `next.config.ts` if needed:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ];
}
```

## Support

- Vercel Docs: https://vercel.com/docs
- Clerk Docs: https://clerk.com/docs
- Next.js Docs: https://nextjs.org/docs
