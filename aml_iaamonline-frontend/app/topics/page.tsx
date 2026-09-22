import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { getTopicCounts, getAllJournalStats } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'Topics',
  description:
    'Browse advanced materials research by subject area across Advanced Materials Letters and Advanced Materials Proceedings.',
};

export const revalidate = 3600;

export default async function TopicsPage() {
  assertHub();

  const [counts, allStats] = await Promise.all([getTopicCounts(), getAllJournalStats()]);
  const withArticles = counts.filter((c) => c.count > 0);
  const empty = counts.filter((c) => c.count === 0);

  // The corpus total comes from the journals' own totals, not from summing the
  // areas: a handful of articles carry a subject that spans two areas, so the
  // per-area counts add up to slightly more than the number of articles.
  const corpus = allStats.reduce((sum, { stats }) => sum + (stats?.total ?? 0), 0);

  return (
    <HubPageLayout
      kicker="Browse"
      title="Topics"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Topics', href: '/topics' }]}
      intro={
        <>
          Every article, paper and review across our journals, grouped by materials area. Counts are live from
          Advanced Materials Letters and Advanced Materials Proceedings.
        </>
      }
    >
      <HubSection>
        <p className="text-[13.5px] text-[#5a6a8a] mb-6">
          {corpus.toLocaleString()} articles across {withArticles.length} active areas. An article that spans two
          areas is listed under both.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {withArticles.map(({ topic, count }) => (
            <a
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group rounded-[10px] border border-[#DCE3F0] bg-white p-5 hover:shadow-md transition-shadow flex gap-4"
            >
              <span className="w-11 h-11 rounded-lg bg-[#EAF1FD] text-[var(--brand)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--brand)] group-hover:text-white transition-colors">
                <topic.icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="font-hub-display font-bold text-[15.5px] text-[#0B1F4D] leading-snug group-hover:text-[var(--brand)] transition-colors">
                  {topic.label}
                </h2>
                <p className="text-[12.5px] text-[#3D4A66] leading-relaxed mt-1.5">{topic.text}</p>
                <p className="text-[12.5px] font-semibold text-[var(--brand)] mt-2.5">
                  {count.toLocaleString()} {count === 1 ? 'article' : 'articles'} →
                </p>
              </div>
            </a>
          ))}
        </div>

        {empty.length > 0 && (
          <div className="mt-10">
            <h2 className="font-hub-display font-bold text-[18px] text-[#0B1F4D]">Areas open for submission</h2>
            <p className="text-[13.5px] text-[#5a6a8a] mt-1.5 mb-4 max-w-[70ch]">
              These areas are within our scope but have no published articles yet. We welcome proposals in all of
              them.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {empty.map(({ topic }) => (
                <div key={topic.slug} className="rounded-[10px] border border-[#DCE3F0] bg-[#F6F8FC] p-5">
                  <h3 className="font-hub-display font-bold text-[14.5px] text-[#0B1F4D]">{topic.label}</h3>
                  <p className="text-[12.5px] text-[#3D4A66] leading-relaxed mt-1.5">{topic.text}</p>
                  <a
                    href="/for-authors/submit-proposal"
                    className="inline-block text-[12.5px] font-semibold text-[var(--brand)] hover:underline mt-2.5"
                  >
                    Propose an article →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </HubSection>
    </HubPageLayout>
  );
}
