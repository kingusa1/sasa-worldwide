import { auth } from '@/lib/auth/config';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Protected routes - require authentication
  const protectedRoutes = ['/admin', '/staff', '/dashboard', '/profile'];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Allow API routes and public routes
  if (pathname.startsWith('/api/auth') || !isProtectedRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/?error=Unauthorized', req.url));
  }

  // Staff portal routes (staff and admin only)
  if (pathname.startsWith('/staff') && userRole !== 'staff' && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/?error=Unauthorized', req.url));
  }

  return NextResponse.next();
});

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
