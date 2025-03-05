import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Freelancer-specific routes
    if (path.startsWith('/freelancer') && token?.role !== 'freelancer') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Client-specific routes
    if (path.startsWith('/client') && token?.role !== 'client') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/freelancer/:path*',
    '/client/:path*',
    '/api/protected/:path*',
  ],
}; 