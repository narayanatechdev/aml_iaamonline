/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Unset in the primary build (amljournal.iaamonline.org, served at "/").
  // Set to '/advanced-materials-letters' only in the parallel build served
  // from pubs.iaamonline.org, via Server 1's reverse proxy — see the portal
  // restructure plan for why this is a second build, not a single deploy.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
    // Unset (AML) leaves every existing deployment's output unchanged.
    NEXT_PUBLIC_JOURNAL_NAME: process.env.NEXT_PUBLIC_JOURNAL_NAME || 'Advanced Materials Letters',
    NEXT_PUBLIC_JOURNAL_DESCRIPTION: process.env.NEXT_PUBLIC_JOURNAL_DESCRIPTION || '',
    NEXT_PUBLIC_JOURNAL_SHORT_NAME: process.env.NEXT_PUBLIC_JOURNAL_SHORT_NAME || '',
    NEXT_PUBLIC_JOURNAL_TAGLINE: process.env.NEXT_PUBLIC_JOURNAL_TAGLINE || '',
    NEXT_PUBLIC_JOURNAL_ISSN: process.env.NEXT_PUBLIC_JOURNAL_ISSN || '',
    NEXT_PUBLIC_JOURNAL_EISSN: process.env.NEXT_PUBLIC_JOURNAL_EISSN || '',
    NEXT_PUBLIC_PORTAL_LOGIN_URL: process.env.NEXT_PUBLIC_PORTAL_LOGIN_URL || '',
    NEXT_PUBLIC_PORTAL_REGISTER_URL: process.env.NEXT_PUBLIC_PORTAL_REGISTER_URL || '',
  },
  // Set NEXT_PUBLIC_PORTAL_LOGIN_URL (e.g. the IAAM Member Portal's login)
  // to hand sign-in and sign-up to the Portal, where members submit and
  // track papers with one account. Unset keeps this app's own pages.
  // NEXT_PUBLIC_PORTAL_REGISTER_URL sends /account/register to the Portal's
  // own sign-up page specifically; falls back to the login URL (which links
  // to sign-up itself) if unset, so setting only the login URL still works.
  async redirects() {
    const portalLogin = process.env.NEXT_PUBLIC_PORTAL_LOGIN_URL;

    if (!portalLogin) {
      return [];
    }

    const portalRegister = process.env.NEXT_PUBLIC_PORTAL_REGISTER_URL || portalLogin;

    return [
      { source: '/account/login', destination: portalLogin, permanent: false },
      { source: '/account/register', destination: portalRegister, permanent: false },
    ];
  },
};

module.exports = nextConfig;
