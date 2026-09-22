import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';

export const metadata: Metadata = {
  title: 'Author Guidelines',
  description:
    'Article types, manuscript preparation, figure requirements and language standards for IAAM Publications.',
};

/** The requirements AML publishes to its own authors (components/pages/author-resources-page.tsx). */
const GUIDELINES = [
  {
    title: 'Article types',
    items: [
      'Research Articles: original research with full experimental detail',
      'Review Articles: comprehensive reviews of established topics',
      'Letters: short communications of urgent scientific importance',
      'Perspectives: forward-looking opinion pieces by invited experts',
    ],
  },
  {
    title: 'Manuscript preparation',
    items: [
      'Title, abstract of 150–250 words, and 5–8 keywords',
      'Structured sections: Introduction, Methods, Results, Discussion',
      'References in Vancouver style, numbered sequentially',
      'Every figure and table cited in the text',
    ],
  },
  {
    title: 'Figures & tables',
    items: [
      'Minimum resolution 300 dpi for raster images',
      'Accepted formats: TIFF, PNG, EPS, and SVG for vector art',
      'Colour figures are published at no extra cost',
      'Supplementary data uploaded as separate files',
    ],
  },
  {
    title: 'Language & integrity',
    items: [
      'Manuscripts must be written in clear English',
      'Language editing services are available for non-native speakers',
      'Every submission is checked with iThenticate for plagiarism',
      'AI-assisted writing must be disclosed in the Methods section',
    ],
  },
];

export default function GuidelinesPage() {
  assertHub();

  return (
    <HubPageLayout
      kicker="For Authors"
      title="Author Guidelines"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'For Authors', href: '/for-authors' },
        { label: 'Guidelines', href: '/for-authors/guidelines' },
      ]}
      intro="What we need from a manuscript before it can go to review. These requirements apply to Advanced Materials Letters and Advanced Materials Proceedings."
    >
      <HubSection>
        <div className="grid md:grid-cols-2 gap-5">
          {GUIDELINES.map((section) => (
            <div key={section.title} className="rounded-xl border border-[#DCE3F0] bg-white p-6">
              <h2 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-4">{section.title}</h2>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] text-[#3D4A66] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-[7px] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#F6F8FC] border border-[#DCE3F0] p-6 mt-6">
          <h2 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-3">Before you submit</h2>
          <p className="text-[13.5px] text-[#3D4A66] leading-relaxed max-w-[74ch] mb-4">
            Check your manuscript against the four sections above, confirm that every co-author has approved the
            submission, and read our{' '}
            <a href="/for-authors/ethics" className="text-[var(--brand)] font-semibold hover:underline">
              publication ethics
            </a>{' '}
            and{' '}
            <a href="/for-authors/peer-review" className="text-[var(--brand)] font-semibold hover:underline">
              peer-review process
            </a>
            .
          </p>
          <a
            href="/for-authors/submit"
            className="inline-block px-5 py-2.5 rounded-md bg-[var(--brand)] text-white text-[13.5px] font-semibold hover:bg-[var(--brand-deep)] transition-colors"
          >
            Submit your manuscript
          </a>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
