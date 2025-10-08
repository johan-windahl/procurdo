import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Canonicalize locales for marketing routes: force sv-se
  // Avoid affecting protected /app routes and API
  const isApp = pathname.startsWith("/app") || pathname.startsWith("/api") || pathname.startsWith("/trpc");
  if (!isApp) {
    // Root -> /sv-se
    if (pathname === "/") {
      url.pathname = "/sv-se";
      return NextResponse.redirect(url, 308);
    }

    // Normalize common English locale prefixes to /sv-se
    const lowerPath = pathname.toLowerCase();
    if (lowerPath === "/en-us" || lowerPath.startsWith("/en-us/") || lowerPath === "/en" || lowerPath.startsWith("/en/")) {
      url.pathname = pathname.replace(/^\/en(-US)?/i, "/sv-se");
      return NextResponse.redirect(url, 308);
    }
  }

  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
  runtime: "nodejs",
};
