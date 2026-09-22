import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';

export const metadata: Metadata = {
  title: 'Publication Ethics',
  description:
    'COPE compliance, double-blind review, data availability and AI disclosure across IAAM Publications.',
};

const STANDARDS = [
  {
    title: 'COPE compliance',
    text: 'We are a member of the Committee on Publication Ethics (COPE) and follow COPE guidelines for handling authorship disputes, data fabrication and duplicate publication.',
  },
  {
    title: 'Double-blind review',
    text: 'Research articles go through double-blind peer review. Authors and reviewers stay anonymous to each other throughout, and two to three reviewers are assigned per manuscript.',
  },
  {
    title: 'Data availability',
    text: 'Authors are encouraged to deposit research data in public repositories. A data availability statement is required for every research article, and raw data should be available on reasonable request.',
  },
  {
    title: 'Plagiarism screening',
    text: 'Every submission is checked with iThenticate before it reaches an editor. Text overlapping with published work is raised with the authors before any review begins.',
  },
  {
    title: 'AI disclosure',
    text: 'Any use of AI-assisted writing must be disclosed in the Methods section. AI tools cannot be listed as authors, and the named authors remain responsible for the whole manuscript.',
  },
  {
    title: 'Conflicts of interest',
    text: 'Authors declare funding sources and any competing financial or personal interests at submission. Editors and reviewers recuse themselves where a conflict exists.',
  },
];

export default function EthicsPage() {
  assertHub();

  return (
    <HubPageLayout
      kicker="For Authors"
      title="Publication Ethics"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'For Authors', href: '/for-authors' },
        { label: 'Ethics', href: '/for-authors/ethics' },
      ]}
      intro="The standards every author, reviewer and editor works to across our journals."
    >
      <HubSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STANDARDS.map((s) => (
            <div key={s.title} className="rounded-[10px] border border-[#DCE3F0] bg-white p-5">
              <h2 className="font-hub-display font-bold text-[15px] text-[#0B1F4D] mb-2">{s.title}</h2>
              <p className="text-[13px] text-[#3D4A66] leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#F6F8FC] border border-[#DCE3F0] p-6 mt-6">
          <h2 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">Raising a concern</h2>
          <p className="text-[13.5px] text-[#3D4A66] leading-relaxed max-w-[74ch]">
            If you believe a published article breaches these standards, write to us with the article DOI and a
            description of the problem. Concerns are handled under COPE guidance, and we contact the authors and
            their institution where an investigation is warranted.
          </p>
          <a href="/#contact" className="inline-block mt-4 text-[13.5px] font-semibold text-[#1546E0] hover:underline">
            Contact the editorial office →
          </a>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
