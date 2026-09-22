import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { HubArticleList } from '@/components/hub/HubArticleList';
import { getArchive, getVolumeArticles } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'Archive',
  description:
    'Every volume of Advanced Materials Letters and Advanced Materials Proceedings, by publication, year and volume.',
};

export const revalidate = 3600;

type View = 'publication' | 'year' | 'volume';

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; journal?: string; volume?: string }>;
}) {
  assertHub();

  const sp = await searchParams;
  const view: View = sp.view === 'year' ? 'year' : sp.view === 'volume' ? 'volume' : 'publication';
  const archive = await getArchive();

  // Volume view drills into one journal's volume; defaults to the newest
  // volume of the first journal that has one.
  const selectedJournalKey = sp.journal ?? archive.find((a) => a.volumes.length > 0)?.journal.key ?? 'aml';
  const selectedEntry = archive.find((a) => a.journal.key === selectedJournalKey);
  const selectedVolume = sp.volume ?? selectedEntry?.volumes[0];
  const volumeResult =
    view === 'volume' && selectedVolume ? await getVolumeArticles(selectedJournalKey, selectedVolume) : null;

  const tabs: { key: View; label: string }[] = [
    { key: 'publication', label: 'By publication' },
    { key: 'year', label: 'By year' },
    { key: 'volume', label: 'By volume' },
  ];

  return (
    <HubPageLayout
      kicker="Browse"
      title="Archive"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Archive', href: '/archive' }]}
      intro="The complete published record of our journals. Every volume listed here is live from the journal's own API."
    >
      <HubSection>
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={tab.key === 'publication' ? '/archive' : `/archive?view=${tab.key}`}
              className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition-colors ${
                view === tab.key ? 'bg-[#1546E0] text-white' : 'bg-[#F6F8FC] text-[#2B3853] hover:bg-[#EAF1FD]'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {view === 'publication' && (
          <div className="grid md:grid-cols-2 gap-5">
            {archive.map(({ journal, volumes, stats }) => {
              const years = Object.keys(stats?.byYear ?? {}).map(Number).filter(Boolean);
              return (
                <div key={journal.key} className="rounded-xl border border-[#DCE3F0] bg-white p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-11 h-11 rounded-lg bg-[#EAF1FD] text-[#1546E0] font-hub-display font-bold text-[13px] flex items-center justify-center">
                      {journal.short}
                    </span>
                    <h2 className="font-hub-display font-bold text-[17px] text-[#0B1F4D]">{journal.name}</h2>
                  </div>

                  {stats ? (
                    <dl className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        ['Articles', stats.total.toLocaleString()],
                        ['Volumes', String(volumes.length)],
                        [
                          'Years',
                          years.length > 0 ? `${Math.min(...years)}–${Math.max(...years)}` : '—',
                        ],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-[#F6F8FC] px-3 py-2.5">
                          <dt className="text-[11px] font-semibold tracking-wide uppercase text-[#8B98B8]">{label}</dt>
                          <dd className="font-hub-display font-bold text-[17px] text-[#0B1F4D] [font-variant-numeric:tabular-nums]">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-[13px] text-[#8B98B8] mb-5">Volume data is temporarily unavailable.</p>
                  )}

                  {volumes.length > 0 && (
                    <>
                      <p className="text-[12px] font-semibold tracking-wide uppercase text-[#8B98B8] mb-2">
                        Volumes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {volumes.map((v) => (
                          <a
                            key={v}
                            href={`/archive?view=volume&journal=${journal.key}&volume=${v}`}
                            className="px-2.5 py-1 rounded-md border border-[#DCE3F0] text-[12.5px] font-semibold text-[#2B3853] hover:border-[#1546E0] hover:text-[#1546E0] transition-colors"
                          >
                            {v}
                          </a>
                        ))}
                      </div>
                    </>
                  )}

                  <a
                    href={`/${journal.path}`}
                    className="inline-block mt-5 text-[13.5px] font-semibold text-[#1546E0] hover:underline"
                  >
                    Go to {journal.short} →
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {view === 'year' && (
          <div className="space-y-8">
            {archive.map(({ journal, stats }) => {
              const years = Object.entries(stats?.byYear ?? {}).sort((a, b) => Number(b[0]) - Number(a[0]));
              const peak = Math.max(1, ...years.map(([, n]) => n));
              return (
                <div key={journal.key}>
                  <h2 className="font-hub-display font-bold text-[17px] text-[#0B1F4D] mb-4">{journal.name}</h2>
                  {years.length === 0 ? (
                    <p className="text-[13.5px] text-[#8B98B8]">No yearly breakdown available.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {years.map(([year, count]) => (
                        <a
                          key={year}
                          href={`/search?year=${year}&journal=${journal.key}`}
                          className="flex items-center gap-4 group"
                        >
                          <span className="w-12 text-[13px] font-semibold text-[#2B3853] [font-variant-numeric:tabular-nums]">
                            {year}
                          </span>
                          <span className="flex-1 h-5 rounded bg-[#F6F8FC] overflow-hidden">
                            <span
                              className="block h-full bg-[#1546E0] group-hover:bg-[#1139b8] transition-colors"
                              style={{ width: `${Math.max((count / peak) * 100, 2)}%` }}
                            />
                          </span>
                          <span className="w-14 text-right text-[12.5px] text-[#5a6a8a] [font-variant-numeric:tabular-nums]">
                            {count.toLocaleString()}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === 'volume' && (
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              {archive.map(({ journal }) => (
                <a
                  key={journal.key}
                  href={`/archive?view=volume&journal=${journal.key}`}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-semibold transition-colors ${
                    journal.key === selectedJournalKey
                      ? 'bg-[#0B1F4D] text-white'
                      : 'border border-[#DCE3F0] text-[#2B3853] hover:border-[#1546E0]'
                  }`}
                >
                  {journal.name}
                </a>
              ))}
            </div>

            {selectedEntry && selectedEntry.volumes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-8">
                {selectedEntry.volumes.map((v) => (
                  <a
                    key={v}
                    href={`/archive?view=volume&journal=${selectedJournalKey}&volume=${v}`}
                    className={`px-2.5 py-1 rounded-md text-[12.5px] font-semibold transition-colors ${
                      v === selectedVolume
                        ? 'bg-[#1546E0] text-white'
                        : 'border border-[#DCE3F0] text-[#2B3853] hover:border-[#1546E0] hover:text-[#1546E0]'
                    }`}
                  >
                    Vol {v}
                  </a>
                ))}
              </div>
            )}

            {volumeResult && (
              <>
                <h2 className="font-hub-display font-bold text-[18px] text-[#0B1F4D] mb-1">
                  {volumeResult.journal.name} · Volume {selectedVolume}
                </h2>
                <p className="text-[13.5px] text-[#5a6a8a] mb-6">
                  {volumeResult.total.toLocaleString()} {volumeResult.total === 1 ? 'article' : 'articles'}
                </p>
                <HubArticleList
                  articles={volumeResult.articles}
                  empty={<>No articles are published in volume {selectedVolume} yet.</>}
                />
              </>
            )}
          </div>
        )}
      </HubSection>
    </HubPageLayout>
  );
}
