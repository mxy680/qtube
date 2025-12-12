import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Better-auth middleware - check session cookie
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Public routes
  const publicRoutes = ["/", "/auth", "/api/auth"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Skip middleware for public routes and static files
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for better-auth session cookie
  const sessionToken = req.cookies.get("better-auth.session_token")
  
  // If no session and trying to access protected route, redirect to sign in
  if (!sessionToken && !isPublicRoute) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - but we need to allow /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
}
