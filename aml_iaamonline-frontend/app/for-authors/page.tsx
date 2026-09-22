import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { getSubmissionGate } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'For Authors',
  description:
    'Author guidelines, publication ethics, peer review and access policy for IAAM Publications.',
};

export const revalidate = 600;

const SECTIONS = [
  {
    href: '/for-authors/guidelines',
    title: 'Author Guidelines',
    text: 'Article types, manuscript preparation, figures and tables, language and a pre-submission checklist.',
  },
  {
    href: '/for-authors/ethics',
    title: 'Publication Ethics',
    text: 'Our standards on authorship, plagiarism, data integrity, AI disclosure and conflicts of interest.',
  },
  {
    href: '/for-authors/peer-review',
    title: 'Peer-Review Process',
    text: 'Who reviews your paper, what they look for and how long each stage takes.',
  },
  {
    href: '/for-authors/open-access',
    title: 'Access Policy & Charges',
    text: 'How readers reach your article from 2027, and what publishing costs — including waivers.',
  },
  {
    href: '/for-authors/invited-articles',
    title: 'Invited Article Programme',
    text: 'How editors commission work from Volume 18, and how to ask for an invitation.',
  },
  {
    href: '/for-authors/fellow-contributions',
    title: 'Fellow Contribution Programme',
    text: 'The route for IAAM Fellows and Distinguished Fellows to share landmark work.',
  },
];

export default async function ForAuthorsPage() {
  assertHub();
  const gate = await getSubmissionGate();

  return (
    <HubPageLayout
      kicker="Publishing with IAAM"
      title="For Authors"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'For Authors', href: '/for-authors' }]}
      intro="From first draft to published paper, everything an author needs. These policies apply to Advanced Materials Letters and Advanced Materials Proceedings."
    >
      <HubSection>
        {gate?.message && (
          <div className="rounded-xl border border-[#F5D9A8] bg-[#FDF6EA] p-5 mb-8">
            <p className="text-[12px] font-bold tracking-wide uppercase text-[#8A5A12] mb-1.5">
              Submissions{gate.invitedOnlyFrom && <> · from {gate.invitedOnlyFrom.slice(0, 4)}</>}
            </p>
            <p className="text-[14px] text-[#5A3E12] leading-relaxed max-w-[74ch]">{gate.message}</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="rounded-[10px] border border-[#DCE3F0] bg-white p-5 hover:shadow-md transition-shadow"
            >
              <h2 className="font-hub-display font-bold text-[15.5px] text-[#0B1F4D] mb-2">{s.title}</h2>
              <p className="text-[12.5px] text-[#3D4A66] leading-relaxed">{s.text}</p>
            </a>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div className="rounded-xl bg-[#0B1F4D] text-white p-6">
            <h2 className="font-hub-display font-bold text-[18px] mb-2">Submit a manuscript</h2>
            <p className="text-[13.5px] text-[#C5CEE3] leading-relaxed mb-5">
              Already invited? Go straight to the submission form with the invitation code from your handling
              editor.
            </p>
            <a
              href="/for-authors/submit"
              className="inline-block px-5 py-2.5 rounded-md bg-[#34D399] text-[#0A1A45] text-[13.5px] font-bold hover:bg-[#A7F3D0] transition-colors"
            >
              Submit manuscript
            </a>
          </div>
          <div className="rounded-xl border border-[#DCE3F0] bg-[#F6F8FC] p-6">
            <h2 className="font-hub-display font-bold text-[18px] text-[#0B1F4D] mb-2">Propose an article</h2>
            <p className="text-[13.5px] text-[#3D4A66] leading-relaxed mb-5">
              Not invited yet? Send a short proposal — title, scope and why it matters — and ask an editor for an
              invitation.
            </p>
            <a
              href="/for-authors/submit-proposal"
              className="inline-block px-5 py-2.5 rounded-md bg-[#1546E0] text-white text-[13.5px] font-semibold hover:bg-[#1139b8] transition-colors"
            >
              Submit a proposal
            </a>
          </div>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
