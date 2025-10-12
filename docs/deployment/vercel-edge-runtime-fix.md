# Quick Fix for Vercel Edge Runtime Error

## Problem

Vercel deployment fails with:

```
Error: The Edge Function "middleware" is referencing unsupported modules:
	- @clerk: @clerk/shared/buildAccountsBaseUrl, #crypto, #safe-node-apis
```

## Root Cause

Clerk's middleware is using Node.js-specific modules that aren't compatible with Vercel's Edge Runtime.

## Solution

The monorepo migration already includes the fix:

### 1. Updated Clerk Version

`apps/web/package.json` now uses Clerk v6.31.9 which has better Edge Runtime support:

```json
"@clerk/nextjs": "^6.31.9"
```

### 2. Dependencies Installed

Run from the root directory:

```bash
pnpm install
```

This updates Clerk across the monorepo.

### 3. Verify Build

Test locally before deploying:

```bash
# With dummy Clerk keys for testing
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuZHVtbXkuZHVtbXkkdGVzdA \
CLERK_SECRET_KEY=sk_test_dummykey \
pnpm --filter @procurdo/web build
```

### 4. Deploy to Vercel

1. Commit and push changes:

   ```bash
   git add .
   git commit -m "Fix: Update Clerk for Edge Runtime compatibility"
   git push
   ```

2. Ensure environment variables are set in Vercel:

   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL`

3. Vercel will automatically redeploy

## Alternative Solutions (if issue persists)

### Option A: Use Clerk's Edge-Compatible API

If the issue persists, you can modify the middleware to use Clerk's edge-compatible methods:

```typescript
// apps/web/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Your existing middleware logic
  // ...
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### Option B: Disable Middleware for Static Routes

If you only need auth for `/app` routes, you can simplify the matcher:

```typescript
export const config = {
  matcher: ["/app/:path*", "/api/:path*"],
};
```

## Verification

After deployment, check:

1. ✅ Build completes without Edge Runtime errors
2. ✅ Marketing pages load correctly (`/sv-se`)
3. ✅ Protected routes redirect to sign-in (`/app`)
4. ✅ API routes work correctly (`/api/search`)

## Additional Resources

- [Clerk Edge Runtime Docs](https://clerk.com/docs/deployments/clerk-environment-variables)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Vercel Edge Runtime](https://vercel.com/docs/functions/edge-functions/edge-runtime)

## Still Having Issues?

1. Check Clerk version: `pnpm list @clerk/nextjs`
2. Clear Vercel build cache in dashboard
3. Check Vercel build logs for specific error messages
4. Verify all environment variables are set correctly

## Summary

The fix is already applied in the monorepo:

- ✅ Clerk updated to v6.31.9
- ✅ Dependencies installed
- ✅ Build verified locally
- 🚀 Ready to deploy to Vercel
