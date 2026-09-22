import { notFound } from 'next/navigation';

export const IS_HUB = process.env.NEXT_PUBLIC_SITE_KIND === 'hub';

/**
 * Hub-only routes live in the same app/ directory as the AML and AMP journal
 * sites, which build from this same code. Calling this at the top of a hub
 * page keeps those deployments exactly as they are today: the route compiles
 * into their build but answers 404, which is what those paths already do.
 */
export function assertHub(): void {
  if (!IS_HUB) notFound();
}
