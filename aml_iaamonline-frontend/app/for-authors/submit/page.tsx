import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { getSubmissionGate, hubJournals } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'Submit a Manuscript',
  description: 'Choose a journal and submit your manuscript to IAAM Publications.',
};

export const revalidate = 600;

const BLURB: Record<string, string> = {
  aml: 'Original research papers, reviews, letters and perspectives across materials science.',
  amp: 'Peer-reviewed papers from IAAM congresses and symposia, organised by event and session.',
};

export default async function SubmitPage() {
  assertHub();
  const gate = await getSubmissionGate();

  return (
    <HubPageLayout
      kicker="For Authors"
      title="Submit a Manuscript"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'For Authors', href: '/for-authors' },
        { label: 'Submit', href: '/for-authors/submit' },
      ]}
      intro="Submissions are handled by each journal's own editorial system. Choose where your work belongs and you will go straight to its submission form."
    >
      <HubSection>
        {gate?.message && (
          <div className="rounded-xl border border-[#F5D9A8] bg-[#FDF6EA] p-5 mb-6">
            <p className="text-[12px] font-bold tracking-wide uppercase text-[#8A5A12] mb-1.5">
              Before you start
            </p>
            <p className="text-[14px] text-[#5A3E12] leading-relaxed max-w-[74ch]">{gate.message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {hubJournals().map((journal) => (
            <div key={journal.key} className="rounded-xl border border-[#DCE3F0] bg-white p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-11 h-11 rounded-lg bg-[#EAF1FD] text-[var(--brand)] font-hub-display font-bold text-[13px] flex items-center justify-center">
                  {journal.short}
                </span>
                <h2 className="font-hub-display font-bold text-[16.5px] text-[#0B1F4D] leading-snug">
                  {journal.name}
                </h2>
              </div>
              <p className="text-[13.5px] text-[#3D4A66] leading-relaxed flex-1 mb-5">{BLURB[journal.key]}</p>
              <a
                href={`/${journal.path}/submit`}
                className="inline-block text-center px-5 py-2.5 rounded-md bg-[var(--brand)] text-white text-[13.5px] font-semibold hover:bg-[var(--brand-deep)] transition-colors"
              >
                Submit to {journal.short}
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#F6F8FC] border border-[#DCE3F0] p-6 mt-6">
          <h2 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">Not sure yet?</h2>
          <p className="text-[13.5px] text-[#3D4A66] leading-relaxed max-w-[74ch] mb-4">
            Read the{' '}
            <a href="/for-authors/guidelines" className="text-[var(--brand)] font-semibold hover:underline">
              author guidelines
            </a>{' '}
            first, or send a{' '}
            <a href="/for-authors/submit-proposal" className="text-[var(--brand)] font-semibold hover:underline">
              manuscript proposal
            </a>{' '}
            and let an editor tell you where the work fits.
          </p>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
