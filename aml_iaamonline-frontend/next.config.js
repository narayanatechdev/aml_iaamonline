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
  },
};

module.exports = nextConfig;
