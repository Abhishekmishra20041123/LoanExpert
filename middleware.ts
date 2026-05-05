import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl


  // 1. Define Public Routes
  const isPublicPage = 
    pathname === '/login' || 
    pathname === '/register' ||
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/faq' ||
    pathname === '/blog' ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/api/auth')

  // 2. Define Protected Routes Logic
  const isStaticAsset = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/logo.png') ||
    pathname.startsWith('/icon.png') ||
    pathname.includes('.')

  if (isPublicPage || isStaticAsset) {
    return NextResponse.next()
  }

  // 3. Robust Session Check
  // Check multiple ways to ensure we catch the cookie
  const customerToken = request.cookies.get('customer_token')
  const adminToken = request.cookies.get('admin_token')
  const hasSession = !!customerToken || !!adminToken

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    // Avoid appending 'from=/' to the URL if they are already on the way to login
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname)
    }
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

