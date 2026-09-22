import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';

export const metadata: Metadata = {
  title: 'Publish Jointly with IAAM',
  description:
    'How universities, research institutes, learned societies and not-for-profit organisations co-publish with IAAM Publications.',
};

const ROUTES = [
  {
    title: 'Joint journals & special issues',
    text: 'Launch a co-branded journal, or guest-edit a themed issue with your faculty or members.',
    detail:
      'You appoint the guest editors and set the scope; we run the submission system, the review workflow and production. A joint title carries both names on every article.',
  },
  {
    title: 'Conference proceedings',
    text: 'Turn your congress or symposium into a citable volume, in print-ready papers and on video.',
    detail:
      'Papers are peer reviewed, typeset, given DOIs and organised by event and session, so delegates can find their own contribution and cite it properly.',
  },
  {
    title: 'Books, series & reports',
    text: 'Develop a book series, a handbook or a policy report under both our names.',
    detail:
      'Suited to monographs, edited volumes and technology outlooks where a journal article is the wrong shape for the work.',
  },
  {
    title: 'Lectures & WebTalks',
    text: 'Co-host a lecture season or an online talk series featuring your experts.',
    detail:
      'Talks are recorded, published as citable records with video, slides and a transcript, and stay available to members afterwards.',
  },
];

const AUDIENCES = [
  {
    title: 'For universities & research institutes',
    text: 'Give your departments, centres and doctoral schools a recognised outlet, with your institution named as joint publisher.',
  },
  {
    title: 'For not-for-profit organisations & societies',
    text: 'Share your members’ research and your organisation’s reports through a publisher that answers to the scientific community, not to shareholders.',
  },
];

export default function CollaborationPage() {
  assertHub();

  return (
    <HubPageLayout
      kicker="Open invitation"
      title="Publish jointly with IAAM"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Collaboration', href: '/collaboration' }]}
      intro="Universities, research institutes, learned societies and charitable organisations are invited to co-publish with us. You bring the scholarship and the community; we provide the platform, the editorial workflow, DOIs, article-level impact scores and an international readership."
    >
      <HubSection>
        <h2 className="font-hub-display font-bold text-[20px] text-[#0B1F4D] mb-5">Four ways to work together</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {ROUTES.map((r) => (
            <div key={r.title} className="rounded-xl border border-[#DCE3F0] bg-white p-6">
              <h3 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">{r.title}</h3>
              <p className="text-[13.5px] text-[#3D4A66] leading-relaxed mb-2.5">{r.text}</p>
              <p className="text-[13px] text-[#5a6a8a] leading-relaxed">{r.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-xl bg-[#F6F8FC] border border-[#DCE3F0] p-6">
              <h3 className="font-hub-display font-bold text-[15.5px] text-[#0B1F4D] mb-2">{a.title}</h3>
              <p className="text-[13.5px] text-[#3D4A66] leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#0A1A45] text-white p-8 mt-8">
          <h2 className="font-hub-display font-bold text-[22px] mb-3">Start a conversation</h2>
          <p className="text-[14.5px] text-[#C5CEE3] leading-relaxed max-w-[64ch] mb-6">
            Tell us what you would like to publish and who it is for. We will come back with what a joint title,
            proceedings volume or series would involve on both sides — editorial roles, timelines and costs.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/#contact"
              className="px-5 py-2.5 rounded-md bg-[var(--brand-tint)] text-[#0A1A45] text-[13.5px] font-bold hover:bg-[var(--brand-tint)] transition-colors"
            >
              Propose a collaboration
            </a>
            <a
              href="mailto:publications@iaamonline.org"
              className="px-5 py-2.5 rounded-md border border-white/40 text-white text-[13.5px] font-semibold hover:bg-white/10 transition-colors"
            >
              publications@iaamonline.org
            </a>
          </div>
        </div>
      </HubSection>
    </HubPageLayout>
  );
}
