import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public routes - always accessible
    const publicRoutes = ['/', '/about', '/pricing', '/contact', '/features'];
    if (publicRoutes.includes(path)) {
      return NextResponse.next();
    }

    // Allow browsing jobs and freelancers lists without authentication
    if (path.startsWith('/jobs') || path.startsWith('/freelancers')) {
      // Only require auth for specific job/freelancer details or actions
      if (path.match(/\/(jobs|freelancers)\/[^\/]+$/)) {
        if (!token) {
          return NextResponse.redirect(new URL('/auth/signin', req.url));
        }
      }
      return NextResponse.next();
    }

    // Protected routes that always require authentication
    if (path.startsWith('/dashboard') || 
        path.startsWith('/profile') || 
        path.startsWith('/messages') ||
        path.startsWith('/settings')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    // Role-based route protection
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (path.startsWith('/freelancer') && token?.role !== 'freelancer') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (path.startsWith('/client') && token?.role !== 'client') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // We handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/freelancer/:path*',
    '/client/:path*',
    '/jobs/:path*',
    '/freelancers/:path*',
    '/api/protected/:path*',
  ],
}; 