import { notFound } from 'next/navigation';

/** Rewrite target for middleware.ts — renders app/not-found.tsx with a 404. */
export default function HubNotFoundRoute() {
  notFound();
}
