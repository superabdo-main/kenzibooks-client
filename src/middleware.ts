// middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { routing } from './i18n/routing';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  // Get the pathname without locale prefix for route checking
  const pathname = nextUrl.pathname
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/'

  // Define protected routes (without locale prefix)
  const isProtectedRoute = pathnameWithoutLocale.startsWith("/dashboard") || 
                          pathnameWithoutLocale.startsWith("/profile") ||
                          pathnameWithoutLocale.startsWith("/manage-organizations")

  // Define auth routes (without locale prefix)
  const isAuthRoute = pathnameWithoutLocale.startsWith("/auth/signin") || 
                     pathnameWithoutLocale.startsWith("/auth/signup")

  // Define API routes that should skip internationalization
  const isApiRoute = pathname.startsWith("/api") || 
                    pathname.startsWith("/trpc")

  // Skip internationalization for API routes and handle auth logic
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Auth logic for protected routes
  if (isProtectedRoute && !isLoggedIn) {
    // Preserve locale when redirecting to signIn
    const locale = pathname.split('/')[1]
    const signInUrl = new URL(`/${locale}/auth/signin`, nextUrl.origin)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    // Preserve locale when redirecting to dashboard
    const locale = pathname.split('/')[1]
    const dashboardUrl = new URL(`/${locale}/manage-organizations`, nextUrl.origin)
    return NextResponse.redirect(dashboardUrl)
  }

  // Apply internationalization middleware for all other routes
  return intlMiddleware(req)
})

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}