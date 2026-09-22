import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';

export const metadata: Metadata = {
  title: 'Peer-Review Process',
  description: 'How manuscripts are reviewed at IAAM Publications, stage by stage, with typical timings.',
};

/** The timeline AML publishes to its own authors. */
const STAGES = [
  {
    step: '01',
    label: 'Submission',
    time: 'Day 1',
    text: 'You upload the manuscript, figures and supplementary files. An automated iThenticate check runs immediately.',
    color: '#0B1F4D',
  },
  {
    step: '02',
    label: 'Editorial check',
    time: '3–5 days',
    text: 'An editor confirms the work is in scope, complete and formatted to our guidelines. Manuscripts that fall short are returned at this point rather than sent to reviewers.',
    color: '#1a3f8f',
  },
  {
    step: '03',
    label: 'Peer review',
    time: '3–5 weeks',
    text: 'Two to three reviewers assess the work double-blind — its originality, the soundness of the methods, whether the data support the conclusions, and how clearly it is written.',
    color: '#254b9d',
  },
  {
    step: '04',
    label: 'Editorial decision',
    time: '5–8 weeks',
    text: 'The handling editor weighs the reports and decides: accept, minor revision, major revision or reject. You receive the full reviewer comments either way.',
    color: '#3260b5',
  },
];

export default function PeerReviewPage() {
  assertHub();

  return (
    <HubPageLayout
      kicker="For Authors"
      title="Peer-Review Process"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'For Authors', href: '/for-authors' },
        { label: 'Peer review', href: '/for-authors/peer-review' },
      ]}
      intro="Every research article is reviewed double-blind by two to three referees. Here is what happens at each stage and how long it usually takes."
    >
      <HubSection>
        <ol className="space-y-4">
          {STAGES.map((s) => (
            <li key={s.step} className="flex items-start gap-4 rounded-xl border border-[#DCE3F0] bg-white p-5">
              <span
                className="w-11 h-11 rounded-full text-white font-hub-display font-bold text-[14px] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: s.color }}
              >
                {s.step}
              </span>
              <div>
                <p className="font-hub-display font-bold text-[15.5px] text-[#0B1F4D]">
                  {s.label} <span className="text-[#8B98B8] font-semibold text-[13px]">· {s.time}</span>
                </p>
                <p className="text-[13px] text-[#3D4A66] leading-relaxed mt-1.5 max-w-[74ch]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div className="rounded-xl border border-[#DCE3F0] bg-[#F6F8FC] p-6">
            <h2 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">After a decision</h2>
            <p className="text-[13px] text-[#3D4A66] leading-relaxed">
              Revisions return to the same handling editor, and usually to the original reviewers. Accepted
              manuscripts move into production, where they are typeset, assigned a DOI and registered with
              Crossref before publication.
            </p>
          </div>
          <div className="rounded-xl border border-[#DCE3F0] bg-[#F6F8FC] p-6">
            <h2 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">Reviewing for us</h2>
            <p className="text-[13px] text-[#3D4A66] leading-relaxed">
              We are always looking for referees across materials science. If you would like to review, write to
              the editorial office with your area of expertise and a link to your publication record.
            </p>
            <a href="/#contact" className="inline-block mt-3 text-[13px] font-semibold text-[#1546E0] hover:underline">
              Offer to review →
            </a>
          </div>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
