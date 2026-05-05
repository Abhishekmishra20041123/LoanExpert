import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const customerToken = request.cookies.get('customer_token')?.value
  const adminToken = request.cookies.get('admin_token')?.value

  // 1. Define Public Routes (Anyone can access)
  const publicPaths = [
    '/login',
    '/register',
    '/',
    '/about',
    '/contact',
    '/faq',
    '/blog',
  ]

  const isPublicPage = 
    publicPaths.includes(pathname) ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/api/auth')

  // 2. Define Protected Routes (Must be logged in)
  // We protect everything else by default, except static assets
  const isStaticAsset = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/logo.png') ||
    pathname.startsWith('/icon.png') ||
    pathname.includes('.')

  if (isPublicPage || isStaticAsset) {
    return NextResponse.next()
  }

  // 3. Redirect to login if not authenticated
  if (!customerToken && !adminToken) {
    // Save the original URL to redirect back after login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Ensure the middleware runs on all routes except specific ones
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/public (public APIs)
     * - api/auth (auth APIs)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/public|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}

