import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { getArchive } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'The IAAM publication portfolio: Advanced Materials Letters, Advanced Materials Proceedings, lecture series, video proceedings, WebTalks, books and reports.',
};

export const revalidate = 3600;

/** The four titles that have no articles yet keep the home page's wording. */
const FORTHCOMING = [
  {
    short: 'AMLS',
    title: 'Advanced Materials Lecture Series',
    text: 'Distinguished lectures published as citable records: video, slides, transcript and DOI.',
  },
  {
    short: 'AMVP',
    title: 'Advanced Materials Video Proceedings',
    text: 'Recorded congress presentations, keynotes and panel discussions, linked to the written paper where one exists.',
  },
  {
    short: 'AMWT',
    title: 'Advanced Materials WebTalks',
    text: 'Free live online talks with audience questions. Recordings stay available to members afterwards.',
  },
  {
    short: 'B&R',
    title: 'Books & Reports',
    text: 'Monographs, edited volumes and handbooks, plus IAAM technology outlooks and policy papers.',
  },
];

const LIVE_BLURB: Record<string, string> = {
  aml: 'Our flagship journal. Short, rigorous research papers and reviews, led by invited articles from proven experts and IAAM Fellows.',
  amp: 'Peer-reviewed papers from IAAM congresses and symposia, organised by event and session so delegates can find their work quickly.',
};

export default async function PublicationsPage() {
  assertHub();

  const archive = await getArchive();

  return (
    <HubPageLayout
      kicker="Portfolio"
      title="Our Publications"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Publications', href: '/publications' }]}
      intro="Six titles, one search, one account. Two are publishing today; the rest are in preparation."
    >
      <HubSection>
        <h2 className="font-hub-display font-bold text-[20px] text-[#0B1F4D] mb-5">Publishing now</h2>

        <div className="grid md:grid-cols-2 gap-5">
          {archive.map(({ journal, volumes, stats }) => {
            const years = Object.keys(stats?.byYear ?? {}).map(Number).filter(Boolean);
            const topTypes = Object.entries(stats?.byType ?? {})
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4);

            return (
              <div key={journal.key} className="rounded-xl border border-[#DCE3F0] bg-white p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-12 h-12 rounded-lg bg-[#EAF1FD] text-[var(--brand)] font-hub-display font-bold text-[14px] flex items-center justify-center">
                    {journal.short}
                  </span>
                  <div>
                    <h3 className="font-hub-display font-bold text-[17px] text-[#0B1F4D] leading-snug">
                      {journal.name}
                    </h3>
                    {years.length > 0 && (
                      <p className="text-[12.5px] text-[#5a6a8a]">
                        Published {Math.min(...years)}–{Math.max(...years)}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-[13.5px] text-[#3D4A66] leading-relaxed mb-5">{LIVE_BLURB[journal.key]}</p>

                {stats && (
                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                    {[
                      ['Articles', stats.total],
                      ['Volumes', volumes.length],
                      ['Authors', stats.totalAuthors],
                      ['Views', stats.totalViews],
                    ].map(([label, value]) => (
                      <div key={label as string} className="rounded-lg bg-[#F6F8FC] px-3 py-2.5">
                        <dt className="text-[10.5px] font-semibold tracking-wide uppercase text-[#8B98B8]">
                          {label as string}
                        </dt>
                        <dd className="font-hub-display font-bold text-[16px] text-[#0B1F4D] [font-variant-numeric:tabular-nums]">
                          {(value as number).toLocaleString()}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {topTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {topTypes.map(([type, count]) => (
                      <span
                        key={type}
                        className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#EAF1FD] text-[var(--brand)]"
                      >
                        {type} · {count.toLocaleString()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap gap-4">
                  <a href={`/${journal.path}`} className="text-[13.5px] font-semibold text-[var(--brand)] hover:underline">
                    Explore the journal →
                  </a>
                  <a
                    href={`/archive?view=volume&journal=${journal.key}`}
                    className="text-[13.5px] font-semibold text-[var(--brand)] hover:underline"
                  >
                    Browse volumes →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="font-hub-display font-bold text-[20px] text-[#0B1F4D] mt-12 mb-2">In preparation</h2>
        <p className="text-[13.5px] text-[#5a6a8a] mb-5 max-w-[70ch]">
          These titles are announced but not yet publishing. They will appear in search and in the archive as soon
          as their first content is released.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FORTHCOMING.map((p) => (
            <div key={p.short} className="rounded-[10px] border border-[#DCE3F0] bg-[#F6F8FC] p-5 flex flex-col">
              <span className="w-11 h-11 rounded-lg bg-white text-[#8B98B8] font-hub-display font-bold text-[13px] flex items-center justify-center mb-3">
                {p.short}
              </span>
              <h3 className="font-hub-display font-bold text-[14.5px] text-[#0B1F4D] leading-snug mb-2">
                {p.title}
              </h3>
              <p className="text-[12.5px] text-[#3D4A66] leading-relaxed flex-1">{p.text}</p>
              <span className="mt-3 text-[11px] font-semibold tracking-wide uppercase text-[#8B98B8]">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
