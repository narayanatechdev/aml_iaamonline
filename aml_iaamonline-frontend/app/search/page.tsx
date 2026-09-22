import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { HubArticleList } from '@/components/hub/HubArticleList';
import { searchHubArticles, getAllJournalStats, hubJournals } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search every article across Advanced Materials Letters and Advanced Materials Proceedings in one place.',
};

export const revalidate = 300;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; journal?: string; year?: string; type?: string; subject?: string }>;
}) {
  assertHub();

  const sp = await searchParams;
  const query = (sp.q ?? '').trim();
  const filters = { journal: sp.journal, year: sp.year, type: sp.type, subject: sp.subject };
  const hasCriteria = Boolean(query || sp.journal || sp.year || sp.type || sp.subject);

  const [results, allStats] = await Promise.all([
    hasCriteria ? searchHubArticles(query, filters, 36) : Promise.resolve(null),
    getAllJournalStats(),
  ]);

  // Filter options come from what the journals actually hold, so the dropdowns
  // can never offer a year or type with nothing behind it.
  const years = [
    ...new Set(allStats.flatMap(({ stats }) => Object.keys(stats?.byYear ?? {}))),
  ].sort((a, b) => Number(b) - Number(a));
  const types = [...new Set(allStats.flatMap(({ stats }) => Object.keys(stats?.byType ?? {})))].sort();
  const corpus = allStats.reduce((sum, { stats }) => sum + (stats?.total ?? 0), 0);

  const field =
    'w-full rounded-md border border-[#DCE3F0] bg-white px-3 py-2.5 text-[13.5px] text-[#14213D] focus:outline-none focus:border-[#1546E0]';

  return (
    <HubPageLayout
      kicker="Search"
      title="Search all publications"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Search', href: '/search' }]}
      intro={`One search across ${corpus.toLocaleString()} articles in Advanced Materials Letters and Advanced Materials Proceedings.`}
    >
      <HubSection>
        <form method="get" action="/search" className="rounded-xl border border-[#DCE3F0] bg-[#F6F8FC] p-5 mb-8">
          <label htmlFor="q" className="block text-[12px] font-semibold tracking-wide uppercase text-[#5a6a8a] mb-1.5">
            Keywords
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Title, abstract, keywords, author or DOI"
              className={`${field} flex-1`}
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-md bg-[#1546E0] text-white text-[14px] font-semibold hover:bg-[#1139b8] transition-colors"
            >
              Search
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div>
              <label htmlFor="journal" className="block text-[12px] font-semibold tracking-wide uppercase text-[#5a6a8a] mb-1.5">
                Publication
              </label>
              <select id="journal" name="journal" defaultValue={sp.journal ?? ''} className={field}>
                <option value="">All publications</option>
                {hubJournals().map((j) => (
                  <option key={j.key} value={j.key}>
                    {j.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-[12px] font-semibold tracking-wide uppercase text-[#5a6a8a] mb-1.5">
                Year
              </label>
              <select id="year" name="year" defaultValue={sp.year ?? ''} className={field}>
                <option value="">Any year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-[12px] font-semibold tracking-wide uppercase text-[#5a6a8a] mb-1.5">
                Article type
              </label>
              <select id="type" name="type" defaultValue={sp.type ?? ''} className={field}>
                <option value="">Any type</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {!results ? (
          <div className="rounded-[10px] border border-dashed border-[#C7D2E8] bg-[#F6F8FC] px-6 py-10 text-center">
            <p className="text-[14px] text-[#3D4A66] max-w-[56ch] mx-auto">
              Enter a keyword above, or{' '}
              <a href="/topics" className="text-[#1546E0] font-semibold hover:underline">
                browse by topic
              </a>{' '}
              and{' '}
              <a href="/archive" className="text-[#1546E0] font-semibold hover:underline">
                by volume
              </a>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5">
              <p className="text-[14px] font-semibold text-[#14213D]">
                {results.total.toLocaleString()} {results.total === 1 ? 'result' : 'results'}
                {query && <> for &ldquo;{query}&rdquo;</>}
              </p>
              {results.totalsByJournal.map(({ journal, total }) => (
                <span key={journal.key} className="text-[12.5px] text-[#5a6a8a]">
                  {journal.short}: {total.toLocaleString()}
                </span>
              ))}
              {results.articles.length < results.total && (
                <span className="text-[12.5px] text-[#8B98B8]">
                  showing the {results.articles.length} most recent
                </span>
              )}
            </div>

            <HubArticleList
              articles={results.articles}
              empty={
                <>
                  <p className="font-semibold text-[#14213D] mb-1.5">No matching articles.</p>
                  <p>Try fewer keywords, or clear the filters and search the full archive.</p>
                </>
              }
            />
          </>
        )}
      </HubSection>
    </HubPageLayout>
  );
}
