// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token');
  const isAuthenticated = !!token;

  // Protected routes that require authentication
  if (pathname.includes('/generate') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent authenticated users from accessing auth pages
  if ((pathname.includes('/login') || pathname.includes('/signup')) && isAuthenticated) {
    return NextResponse.redirect(new URL('/generate', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};