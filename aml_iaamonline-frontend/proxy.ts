import { NextRequest, NextResponse } from 'next/server';

// Pre-launch gate: anonymous visitors see /coming-soon; anyone signed in
// (admin via /admin/login, or user via /account/login) sees the real site.
// The preview cookies are set by saveAuth() in lib/adminAuth.ts / lib/userAuth.ts.
// Disable the gate by setting COMING_SOON=false in the environment.
const COMING_SOON_ENABLED = process.env.COMING_SOON !== 'false';
const PREVIEW_COOKIES = ['aml_admin_preview', 'aml_user_preview'];

const IS_HUB = process.env.NEXT_PUBLIC_SITE_KIND === 'hub';

/**
 * pubs.iaamonline.org builds from the same app/ directory as the AML and AMP
 * journal sites, so every journal route — /submit, /subscribe, /faq, /news,
 * /editorial-board and the rest — also compiled into the hub's build and
 * answered 200 there wrapped in the journal's own header and footer. Readers
 * following the hub's own nav landed on AML-branded pages.
 *
 * These are the routes the hub owns. On the hub everything else 404s; on a
 * journal deployment NEXT_PUBLIC_SITE_KIND is unset and none of this runs.
 */
const HUB_ROUTES = new Set([
  '/',
  '/about',
  '/about/article-impact',
  '/archive',
  '/collaboration',
  '/coming-soon',
  '/cookie-policy',
  '/for-authors',
  '/privacy-policy',
  '/publications',
  '/terms-of-use',
  '/search',
  '/search/advanced',
  '/topics',
]);

const HUB_PREFIXES = ['/topics/', '/for-authors/'];

function isHubRoute(pathname: string): boolean {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (HUB_ROUTES.has(path)) return true;
  return HUB_PREFIXES.some((prefix) => path.startsWith(prefix) && path.length > prefix.length);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (COMING_SOON_ENABLED) {
    // Login/register areas stay reachable so people can sign in; the gate page itself too.
    const gateExempt =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/account') ||
      pathname === '/editor/login' ||
      pathname === '/coming-soon';

    if (!gateExempt && !PREVIEW_COOKIES.some((c) => request.cookies.has(c))) {
      const url = request.nextUrl.clone();
      url.pathname = '/coming-soon';
      return NextResponse.rewrite(url);
    }
  }

  if (IS_HUB && !isHubRoute(pathname)) {
    // Rewriting rather than redirecting keeps the URL the reader typed.
    // /_not-found is Next's own not-found route, which renders
    // app/not-found.tsx with a 404 status.
    const url = request.nextUrl.clone();
    url.pathname = '/_not-found';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes, and any file with an extension (public assets)
  matcher: ['/((?!_next/static|_next/image|api|.*\\..*).*)'],
};
