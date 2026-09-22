import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';

export const metadata: Metadata = {
  title: 'IAAM Article Impact (AII)',
  description:
    'How IAAM scores the reach of an individual article: citation impact, research engagement, research translation and academic attention.',
};

/** Mirrors the definition published on the home page (components/hub/ArticleImpact.tsx). */
const COMPONENTS = [
  {
    key: 'C',
    label: 'Citation Impact',
    weight: '60%',
    text: 'How often the work is cited, adjusted for field and age',
    detail:
      'Citations remain the strongest signal that other researchers have built on a piece of work. Adjusting for field and age keeps a two-year-old paper in a small speciality comparable with an older one in a crowded field.',
    color: '#15803D',
  },
  {
    key: 'E',
    label: 'Research Engagement',
    weight: '15%',
    text: 'Views, downloads and saves by researchers',
    detail:
      'Reading precedes citing, and much of it never turns into a citation. Engagement captures the readers who used the work without publishing a paper of their own about it.',
    color: 'var(--brand)',
  },
  {
    key: 'T',
    label: 'Research Translation',
    weight: '15%',
    text: 'Use in patents, standards, policy documents and industry',
    detail:
      'Materials research earns much of its value outside the literature. Translation counts the moments a paper shows up in a patent, a standard, a regulatory submission or an industrial specification.',
    color: '#C2570C',
  },
  {
    key: 'A',
    label: 'Academic Attention',
    weight: '10%',
    text: 'Mentions in teaching, news, scholarly blogs and social media',
    detail:
      'The smallest weight, deliberately. Attention shows a paper reaching students, journalists and the wider public, but it is the noisiest signal of the four.',
    color: '#6D28D9',
  },
];

export default function ArticleImpactPage() {
  assertHub();

  return (
    <HubPageLayout
      kicker="Impact"
      title="IAAM Article Impact (AII)"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Article Impact', href: '/about/article-impact' },
      ]}
      intro="A citation count tells only part of the story. AII also reflects who reads a paper, who puts it to use and who talks about it."
    >
      <HubSection>
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
          <div>
            <h2 className="font-hub-display font-bold text-[22px] text-[#0B1F4D] mb-3">How the score is built</h2>
            <p className="inline-block font-mono text-[14px] font-semibold text-[var(--brand)] bg-[#EAF1FD] rounded-md px-3.5 py-2 mb-5">
              AII = 0.60C + 0.15E + 0.15T + 0.10A
            </p>
            <p className="text-[15px] text-[#2B3853] leading-relaxed max-w-[64ch] mb-8">
              The score runs from 0 to 100 and describes one article. We measure articles, not journals: a single
              number attached to a title tells you nothing about the paper in front of you, and it hands credit to
              the venue rather than to the people who did the work.
            </p>

            <div className="space-y-4">
              {COMPONENTS.map((c) => (
                <div key={c.key} className="flex items-start gap-4 rounded-[10px] border border-[#DCE3F0] bg-white p-5">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center font-hub-display font-bold text-[14px] text-white flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.key}
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-[#14213D]">
                      {c.label} <span className="text-[#8B98B8] font-semibold">· {c.weight}</span>
                    </p>
                    <p className="text-[13px] text-[#5a6a8a] mt-0.5">{c.text}</p>
                    <p className="text-[13px] text-[#3D4A66] leading-relaxed mt-2">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#DCE3F0] bg-[#F6F8FC] p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-hub-display font-bold text-[16px] text-[#0B1F4D]">Current status</p>
              <span className="text-[10.5px] font-bold tracking-wide uppercase text-[#8B98B8] bg-white rounded-full px-2 py-1">
                In development
              </span>
            </div>
            <p className="text-[13px] text-[#3D4A66] leading-relaxed mb-4">
              AII scoring is not live yet. No article in Advanced Materials Letters or Advanced Materials
              Proceedings currently carries a score, and we would rather show nothing than show a number we cannot
              stand behind.
            </p>
            <p className="text-[13px] text-[#3D4A66] leading-relaxed">
              When scoring launches, every article page will display its own AII alongside the four components
              that produced it, so readers can see how the score was reached.
            </p>
            <a
              href="/#contact"
              className="inline-block mt-5 text-[13.5px] font-semibold text-[var(--brand)] hover:underline"
            >
              Ask us about AII →
            </a>
          </div>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
