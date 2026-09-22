const AUTHOR_SERVICES = [
  { title: 'Author Guidelines', text: 'Article types, templates, reference style and a pre-submission checklist.', href: '/for-authors/guidelines' },
  { title: 'Publication Ethics', text: 'Our standards on authorship, plagiarism, data integrity and conflicts of interest.', href: '/for-authors/ethics' },
  { title: 'Peer-Review Process', text: 'Who reviews your paper, what they look for and how long each stage takes.', href: '/for-authors/peer-review' },
  { title: 'Open Access Policy & APCs', text: 'How readers get access from 2027, and the optional open-access route with its charges and waivers.', href: '/for-authors/open-access' },
  { title: 'Invited Article Programme', text: 'How editors commission reviews and perspectives, and how to suggest a topic.', href: '/for-authors/invited-articles' },
  { title: 'Fellow Contribution Programme', text: 'A dedicated route for IAAM Fellows and Distinguished Fellows to share landmark work.', href: '/for-authors/fellow-contributions' },
];

export function PublishingWithIAAM() {
  return (
    <section className="font-hub-body bg-white">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="flex items-end justify-between gap-4 mb-2">
          <div>
            <h2 className="font-hub-display font-bold text-[28px] text-[#0B1F4D]">Publishing with IAAM</h2>
            <div className="w-14 h-1 rounded-full bg-[var(--brand)] mt-2 mb-3" />
            <p className="text-[15px] text-[#5a6a8a]">From first draft to published paper, here is everything an author needs.</p>
          </div>
          <a href="/for-authors" className="hidden sm:inline text-[14px] font-semibold text-[var(--brand)] hover:underline">
            For authors
          </a>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5 mt-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {AUTHOR_SERVICES.map((s) => (
              <a key={s.title} href={s.href} className="rounded-[10px] border border-[#DCE3F0] p-5 hover:shadow-md transition-shadow">
                <h3 className="font-hub-display font-bold text-[15px] text-[#0B1F4D] mb-2">{s.title}</h3>
                <p className="text-[12.5px] text-[#3D4A66] leading-relaxed">{s.text}</p>
              </a>
            ))}
          </div>

          <div className="rounded-xl bg-[#0B1F4D] text-white p-6 flex flex-col">
            <h3 className="font-hub-display font-bold text-[19px] mb-2">Submit &amp; Publish</h3>
            <p className="text-[13.5px] text-[#C5CEE3] leading-relaxed flex-1">
              From 2027 we publish invited work only. Invited? Submit your manuscript. Not invited yet? Send a
              short proposal and ask for an invitation.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <a href="/for-authors/submit" className="text-center px-4 py-2.5 rounded-md bg-[var(--brand-tint)] text-[#0A1A45] text-[13.5px] font-bold hover:bg-[var(--brand-tint)] transition-colors">
                Submit manuscript
              </a>
              <a href="/for-authors/submit-proposal" className="text-center px-4 py-2.5 rounded-md border border-white/40 text-white text-[13.5px] font-semibold hover:bg-white/10 transition-colors">
                Submit manuscript proposal
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
