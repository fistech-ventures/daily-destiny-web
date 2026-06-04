import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ['bn', 'en'],
  defaultLocale: 'bn',
  localeDetection: false,
});

export default function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled in env variables
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  const isMaintenancePath = request.nextUrl.pathname === '/maintenance' ||
    request.nextUrl.pathname.startsWith('/bn/maintenance') ||
    request.nextUrl.pathname.startsWith('/en/maintenance');

  if (isMaintenanceMode) {
    if (request.nextUrl.pathname !== '/maintenance') {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.redirect(url);
    }
    // Bypass intlMiddleware for /maintenance so it doesn't redirect to /bn/maintenance
    return NextResponse.next();
  }

  // If we are on the maintenance page but maintenance mode is off, redirect to home
  if (!isMaintenanceMode && isMaintenancePath) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};