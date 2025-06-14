import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For now, let's disable middleware protection and handle auth client-side
  // This is because Firebase auth state isn't easily accessible in middleware
  
  // Only redirect authenticated users away from auth pages
  // We'll handle dashboard protection in the layout component
  const authRoutes = ['/signin', '/signup'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Check for any Firebase auth indicators (this is basic and may not be reliable)
  const hasFirebaseSession = request.cookies.get('__session')?.value ||
                             request.cookies.get('firebase-auth-token')?.value ||
                             request.headers.get('authorization');
  
  // Only redirect away from auth pages if we detect authentication
  if (isAuthRoute && hasFirebaseSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 