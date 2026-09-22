import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { getSubmissionGate, getAccessModel } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'Invited Article Programme',
  description:
    'How IAAM editors commission articles from Volume 18, and how to ask for an invitation with a manuscript proposal.',
};

export const revalidate = 600;

export default async function InvitedArticlesPage() {
  assertHub();

  const [gate, model] = await Promise.all([getSubmissionGate(), getAccessModel()]);
  const firstInvitedVolume = model ? model.freeUntilVolume + 1 : 18;

  return (
    <HubPageLayout
      kicker="For Authors"
      title="Invited Article Programme"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'For Authors', href: '/for-authors' },
        { label: 'Invited articles', href: '/for-authors/invited-articles' },
      ]}
      intro={`From Volume ${firstInvitedVolume} our journals publish invited contributions. This page explains what that means for you and how to ask for an invitation.`}
    >
      <HubSection>
        {gate?.message && (
          <div className="rounded-xl border border-[#F5D9A8] bg-[#FDF6EA] p-5 mb-6">
            <p className="text-[12px] font-bold tracking-wide uppercase text-[#8A5A12] mb-1.5">
              Current policy
              {gate.invitedOnlyFrom && <> · from {gate.invitedOnlyFrom.slice(0, 4)}</>}
            </p>
            <p className="text-[14px] text-[#5A3E12] leading-relaxed max-w-[74ch]">{gate.message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-[#DCE3F0] bg-white p-6">
            <h2 className="font-hub-display font-bold text-[17px] text-[#0B1F4D] mb-3">If you have an invitation</h2>
            <p className="text-[13.5px] text-[#3D4A66] leading-relaxed mb-4">
              Your handling editor issues an invitation code. Enter it on the submission form and your manuscript
              goes into the normal editorial workflow — the same guidelines, the same double-blind review and the
              same ethical standards as any other article.
            </p>
            <a
              href="/for-authors/submit"
              className="inline-block px-5 py-2.5 rounded-md bg-[var(--brand)] text-white text-[13.5px] font-semibold hover:bg-[var(--brand-deep)] transition-colors"
            >
              Submit with your code
            </a>
          </div>

          <div className="rounded-xl border border-[#DCE3F0] bg-white p-6">
            <h2 className="font-hub-display font-bold text-[17px] text-[#0B1F4D] mb-3">If you do not</h2>
            <p className="text-[13.5px] text-[#3D4A66] leading-relaxed mb-4">
              Send a manuscript proposal instead: the working title, the scope of the work and why it matters now.
              An editor reads every proposal and issues an invitation where the topic fits the journal.
            </p>
            <a
              href="/for-authors/submit-proposal"
              className="inline-block px-5 py-2.5 rounded-md border border-[var(--brand)] text-[var(--brand)] text-[13.5px] font-semibold hover:bg-[#EAF1FD] transition-colors"
            >
              Send a proposal
            </a>
          </div>
        </div>

        <div className="rounded-xl bg-[#F6F8FC] border border-[#DCE3F0] p-6 mt-6">
          <h2 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">Why we commission</h2>
          <p className="text-[13.5px] text-[#3D4A66] leading-relaxed max-w-[74ch]">
            Commissioning lets editors build each volume around the questions the field is actually facing, rather
            than around whatever happens to arrive. It also means we can approach the people best placed to write
            a given review or perspective — including researchers who would not have submitted unprompted.
          </p>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
