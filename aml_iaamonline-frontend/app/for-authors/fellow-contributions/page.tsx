import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';

export const metadata: Metadata = {
  title: 'Fellow Contribution Programme',
  description:
    'The route for IAAM Fellows and Distinguished Fellows to publish landmark work in IAAM journals.',
};

export default function FellowContributionsPage() {
  assertHub();

  return (
    <HubPageLayout
      kicker="For Authors"
      title="Fellow Contribution Programme"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'For Authors', href: '/for-authors' },
        { label: 'Fellow contributions', href: '/for-authors/fellow-contributions' },
      ]}
      intro="A dedicated route for IAAM Fellows and Distinguished Fellows to share landmark work with the materials community."
    >
      <HubSection>
        <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
          <div>
            <h2 className="font-hub-display font-bold text-[18px] text-[#0B1F4D] mb-3">How it works</h2>
            <p className="text-[14px] text-[#3D4A66] leading-relaxed max-w-[70ch] mb-4">
              IAAM Fellows and Distinguished Fellows are elected for sustained contribution to advanced materials.
              The programme gives them a standing route into the journals: a Fellow can propose a review,
              perspective or landmark research paper directly to the editorial office without waiting to be
              approached.
            </p>
            <p className="text-[14px] text-[#3D4A66] leading-relaxed max-w-[70ch] mb-4">
              Contributions carry an <strong className="font-semibold text-[#14213D]">IAAM Fellow Contribution</strong>{' '}
              label on the published article. They are reviewed to exactly the same standard as every other
              submission — the label records who wrote the work, not a lighter path through review.
            </p>
            <p className="text-[14px] text-[#3D4A66] leading-relaxed max-w-[70ch]">
              If you are a Fellow and want to propose a contribution, send the working title and scope to the
              editorial office and mention your fellowship. If you are not yet a Fellow, fellowship is awarded by
              IAAM rather than by the journals.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="/for-authors/submit-proposal"
                className="px-5 py-2.5 rounded-md bg-[var(--brand)] text-white text-[13.5px] font-semibold hover:bg-[var(--brand-deep)] transition-colors"
              >
                Propose a contribution
              </a>
              <a
                href="https://iaamonline.org/awards"
                className="px-5 py-2.5 rounded-md border border-[#DCE3F0] text-[#2B3853] text-[13.5px] font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
              >
                About IAAM fellowships
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-[#F1E8FB] p-6">
            <p className="text-[13px] font-bold text-[#4A1D7A] mb-2">IAAM Fellow Contribution</p>
            <p className="text-[12.5px] text-[#4A1D7A] leading-relaxed opacity-90">
              Written by IAAM Fellows to shape the future of the discipline. One of the recognition labels shown
              on published articles, alongside Distinguished Invited Article.
            </p>
            <a
              href="/for-authors/invited-articles"
              className="inline-block mt-4 text-[12.5px] font-semibold text-[#4A1D7A] hover:underline"
            >
              See the invited article programme →
            </a>
          </div>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
