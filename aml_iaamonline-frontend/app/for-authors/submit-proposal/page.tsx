import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { getSubmissionGate, hubJournals } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'Submit a Manuscript Proposal',
  description:
    'Send a short proposal to an IAAM editor and ask for an invitation to submit your manuscript.',
};

export const revalidate = 600;

export default async function SubmitProposalPage() {
  assertHub();
  const gate = await getSubmissionGate();

  return (
    <HubPageLayout
      kicker="For Authors"
      title="Submit a Manuscript Proposal"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'For Authors', href: '/for-authors' },
        { label: 'Proposal', href: '/for-authors/submit-proposal' },
      ]}
      intro="Not invited yet? Send a short proposal. An editor reads every one and issues an invitation where the topic fits the journal."
    >
      <HubSection>
        {gate?.message && (
          <div className="rounded-xl border border-[#F5D9A8] bg-[#FDF6EA] p-5 mb-6">
            <p className="text-[12px] font-bold tracking-wide uppercase text-[#8A5A12] mb-1.5">Why a proposal</p>
            <p className="text-[14px] text-[#5A3E12] leading-relaxed max-w-[74ch]">{gate.message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
          <div>
            <h2 className="font-hub-display font-bold text-[17px] text-[#0B1F4D] mb-3">What to include</h2>
            <ul className="space-y-2.5 mb-6">
              {[
                'A working title',
                'The article type you have in mind — research paper, review, letter or perspective',
                'Two or three paragraphs on the scope of the work and why it matters now',
                'The authors, their affiliations and the corresponding author',
                'Whether any part of the work is already published or under review elsewhere',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-[#3D4A66] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-[7px] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="font-hub-display font-bold text-[17px] text-[#0B1F4D] mb-3">Where to send it</h2>
            <p className="text-[13.5px] text-[#3D4A66] leading-relaxed max-w-[70ch] mb-4">
              Proposals go through each journal&apos;s own author dashboard, where you can track the editor&apos;s
              response and, once invited, carry straight on to submission.
            </p>
            <div className="flex flex-wrap gap-3">
              {hubJournals().map((journal) => (
                <a
                  key={journal.key}
                  href={`/${journal.path}/dashboard/proposals`}
                  className="px-5 py-2.5 rounded-md bg-[var(--brand)] text-white text-[13.5px] font-semibold hover:bg-[var(--brand-deep)] transition-colors"
                >
                  Propose to {journal.short}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#F6F8FC] border border-[#DCE3F0] p-6">
            <h2 className="font-hub-display font-bold text-[15.5px] text-[#0B1F4D] mb-2">What happens next</h2>
            <p className="text-[13px] text-[#3D4A66] leading-relaxed mb-4">
              An editor reads the proposal and either issues an invitation code, suggests a different journal, or
              explains why the topic is not a fit. You keep the proposal and can revise and resend it.
            </p>
            <a href="/#contact" className="text-[13px] font-semibold text-[var(--brand)] hover:underline">
              Questions? Contact the editorial office →
            </a>
          </div>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
