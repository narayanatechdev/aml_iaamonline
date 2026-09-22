import { redirect } from 'next/navigation';
import { assertHub } from '@/lib/hub-guard';

/**
 * The header offers "Advanced search" separately, but every filter the
 * journals' API supports is already on /search, so this sends readers there
 * rather than standing up a second, emptier form.
 */
export default function AdvancedSearchPage() {
  assertHub();
  redirect('/search');
}
