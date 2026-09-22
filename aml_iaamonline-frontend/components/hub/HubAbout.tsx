import { HubPageLayout, HubSection } from './HubPageLayout';
import { getAllJournalStats } from '@/lib/hub-data';

/**
 * The hub's own About page. Every claim here is one IAAM Publications already
 * makes on the home page — the not-for-profit commitment, the four pillars and
 * the office details — and the figures are live totals from the two journals'
 * APIs rather than round marketing numbers.
 */

const PILLARS = [
  { label: 'Net Zero', text: 'Research that cuts carbon from how materials are made and used' },
  { label: 'Sustainable Materials', text: 'Materials designed to last, to be recovered and to be reused' },
  { label: 'Global Collaboration', text: 'Authors, reviewers and readers in more than 150 countries' },
  { label: 'Knowledge Sharing', text: 'Findings that reach laboratories, classrooms, industry and policy makers' },
];

export async function HubAbout() {
  const allStats = await getAllJournalStats();

  const totals = allStats.reduce(
    (acc, { stats }) => ({
      articles: acc.articles + (stats?.total ?? 0),
      authors: acc.authors + (stats?.totalAuthors ?? 0),
      views: acc.views + (stats?.totalViews ?? 0),
      downloads: acc.downloads + (stats?.totalDownloads ?? 0),
    }),
    { articles: 0, authors: 0, views: 0, downloads: 0 },
  );

  return (
    <HubPageLayout
      kicker="Not-for-profit publisher"
      title="About IAAM Publications"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }]}
      intro="Peer-reviewed advanced materials research in every format: a journal, conference proceedings, distinguished lectures, congress videos, live web talks, books and reports."
    >
      <HubSection>
        <div id="mission" className="scroll-mt-24 grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div>
            <h2 className="font-hub-display font-bold text-[25px] text-[#0B1F4D]">Mission &amp; vision</h2>
            <div className="w-14 h-1 rounded-full bg-[var(--brand)] mt-2 mb-4" />
            <p className="text-[15px] text-[#2B3853] leading-relaxed max-w-[64ch] mb-4">
              IAAM Publications is the publishing arm of the International Association of Advanced Materials. We
              publish the research of the materials community and put it where it can be used — by other
              laboratories, by industry, in classrooms and in policy.
            </p>
            <p className="text-[15px] text-[#2B3853] leading-relaxed max-w-[64ch] mb-6">
              We measure articles, not journals. Credit belongs to the people who did the work, so our impact
              reporting describes individual papers rather than a single number attached to a title.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {PILLARS.map((p) => (
                <div key={p.label} className="rounded-[10px] border border-[#DCE3F0] bg-white p-4">
                  <p className="text-[13px] font-bold text-[var(--brand-deep)]">{p.label}</p>
                  <p className="text-[12.5px] text-[#3D4A66] leading-snug mt-1">{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#DCE3F0] bg-[#F6F8FC] p-6">
            <p className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-1">Published to date</p>
            <p className="text-[12px] text-[#8B98B8] mb-4">Live totals across both journals</p>
            <dl className="space-y-3">
              {[
                ['Articles published', totals.articles],
                ['Contributing authors', totals.authors],
                ['Article views', totals.views],
                ['PDF downloads', totals.downloads],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-baseline justify-between gap-3">
                  <dt className="text-[13px] text-[#3D4A66]">{label as string}</dt>
                  <dd className="font-hub-display font-bold text-[18px] text-[#0B1F4D] [font-variant-numeric:tabular-nums]">
                    {(value as number).toLocaleString()}
                  </dd>
                </div>
              ))}
            </dl>
            <a href="/publications" className="inline-block mt-5 text-[13.5px] font-semibold text-[var(--brand)] hover:underline">
              See the full portfolio →
            </a>
          </div>
        </div>
      </HubSection>

      <section id="not-for-profit" className="scroll-mt-24 bg-[#0B1F4D] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-14">
          <h2 className="font-hub-display font-bold text-[26px] mb-3">Our not-for-profit commitment</h2>
          <p className="text-[15px] text-[#C5CEE3] leading-relaxed max-w-[64ch] mb-5">
            IAAM Publications has no shareholders. Every surplus krona goes back into science: fee waivers for
            authors who lack funding, travel grants for early-career researchers, free live talks, and initiatives
            that move materials science, engineering and technology towards net zero.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl">
            {[
              ['Fee waivers', 'Authors without funding are not turned away for lack of money.'],
              ['Early-career support', 'Travel grants and free live talks for researchers starting out.'],
              ['Towards net zero', 'Surplus funds initiatives that cut carbon from materials.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[10px] bg-white/10 p-4">
                <p className="text-[13.5px] font-bold text-white">{title}</p>
                <p className="text-[12.5px] text-[#C5CEE3] leading-snug mt-1.5">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[11.5px] font-bold tracking-[0.16em] uppercase text-[var(--brand-tint)]">
            A cleaner · greener · brighter · tomorrow
          </p>
        </div>
      </section>

      <HubSection tone="tint">
        <div className="grid md:grid-cols-3 gap-5">
          <a href="/about/article-impact" className="rounded-[10px] border border-[#DCE3F0] bg-white p-6 hover:shadow-md transition-shadow">
            <h3 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">IAAM Article Impact (AII)</h3>
            <p className="text-[13px] text-[#3D4A66] leading-relaxed">
              How we score the reach of an individual article, across citations, engagement, translation and
              attention.
            </p>
            <span className="inline-block mt-3 text-[13px] font-semibold text-[var(--brand)]">How AII works →</span>
          </a>
          <a href="/for-authors" className="rounded-[10px] border border-[#DCE3F0] bg-white p-6 hover:shadow-md transition-shadow">
            <h3 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">Publishing with us</h3>
            <p className="text-[13px] text-[#3D4A66] leading-relaxed">
              Author guidelines, publication ethics, the peer-review process and how access works from 2027.
            </p>
            <span className="inline-block mt-3 text-[13px] font-semibold text-[var(--brand)]">For authors →</span>
          </a>
          <div className="rounded-[10px] border border-[#DCE3F0] bg-white p-6">
            <h3 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">Our office</h3>
            <p className="text-[13px] text-[#3D4A66] leading-relaxed">
              International Association of Advanced Materials
              <br />
              IAAM Publications
              <br />
              Gammalkilsvägen 18, Ulrika 590 53, Sweden
            </p>
            <a href="/#contact" className="inline-block mt-3 text-[13px] font-semibold text-[var(--brand)] hover:underline">
              Contact us →
            </a>
          </div>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
