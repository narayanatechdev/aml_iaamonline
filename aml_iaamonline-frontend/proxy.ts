import { NextRequest, NextResponse } from 'next/server';

// Pre-launch gate: anonymous visitors see /coming-soon; anyone signed in
// (admin via /admin/login, or user via /account/login) sees the real site.
// The preview cookies are set by saveAuth() in lib/adminAuth.ts / lib/userAuth.ts.
// Disable the gate by setting COMING_SOON=false in the environment.
const COMING_SOON_ENABLED = process.env.COMING_SOON !== 'false';
const PREVIEW_COOKIES = ['aml_admin_preview', 'aml_user_preview'];

export function proxy(request: NextRequest) {
  if (!COMING_SOON_ENABLED) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Login/register areas stay reachable so people can sign in; the gate page itself too.
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname === '/coming-soon'
  ) {
    return NextResponse.next();
  }

  if (PREVIEW_COOKIES.some((c) => request.cookies.has(c))) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, and any file with an extension (public assets)
  matcher: ['/((?!_next/static|_next/image|api|.*\\..*).*)'],
};
