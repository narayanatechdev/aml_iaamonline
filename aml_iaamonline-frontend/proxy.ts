import { NextRequest, NextResponse } from 'next/server';

// Pre-launch gate: everyone sees /coming-soon except admins.
// Admins get the preview cookie when they sign in at /admin/login.
// Disable the gate by setting COMING_SOON=false in the environment.
const COMING_SOON_ENABLED = process.env.COMING_SOON !== 'false';
const PREVIEW_COOKIE = 'aml_admin_preview';

export function proxy(request: NextRequest) {
  if (!COMING_SOON_ENABLED) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Admin area stays reachable so admins can log in; the gate page itself too.
  if (pathname.startsWith('/admin') || pathname === '/coming-soon') {
    return NextResponse.next();
  }

  if (request.cookies.has(PREVIEW_COOKIE)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, and any file with an extension (public assets)
  matcher: ['/((?!_next/static|_next/image|api|.*\\..*).*)'],
};
