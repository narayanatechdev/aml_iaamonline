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
  },
};

module.exports = nextConfig;
