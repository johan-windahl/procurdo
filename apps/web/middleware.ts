import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const pathname = url.pathname;

  const legacyAppRedirects: Record<string, string> = {
    "/sv-se/dashboard": "/app/dashboard",
    "/sv-se/sok": "/app/sok",
    "/sv-se/sparade-sokningar": "/app/sparade-sokningar",
    "/sv-se/bevakningar": "/app/bevakningar",
    "/sv-se/bevakade-upphandlingar": "/app/bevakade-upphandlingar",
  };

  const destination = legacyAppRedirects[pathname];
  if (destination) {
    url.pathname = destination;
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/app/sv-se" || pathname === "/app/sv-se/") {
    url.pathname = "/app";
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/app/sv-se/")) {
    url.pathname = pathname.replace("/app/sv-se", "/app");
    return NextResponse.redirect(url, 308);
  }

  // Avoid affecting protected /app routes and API
  const isApp = pathname.startsWith("/app") || pathname.startsWith("/api") || pathname.startsWith("/trpc");
  if (!isApp) {
    if (pathname === "/sv-se" || pathname.startsWith("/sv-se/")) {
      const stripped = pathname.replace(/^\/sv-se/, "") || "/";
      url.pathname = stripped.startsWith("/") ? stripped : `/${stripped}`;
      return NextResponse.redirect(url, 308);
    }
  }

  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: url.toString() });
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
