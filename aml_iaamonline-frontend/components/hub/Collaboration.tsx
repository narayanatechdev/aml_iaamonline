const ROUTES = [
  { title: 'Joint journals & special issues', text: 'Launch a co-branded journal, or guest-edit a themed issue with your faculty or members.', link: 'Propose a joint title' },
  { title: 'Conference proceedings', text: 'Turn your congress or symposium into a citable volume, in print-ready papers and on video.', link: 'Publish your proceedings' },
  { title: 'Books, series & reports', text: 'Develop a book series, a handbook or a policy report under both our names.', link: 'Propose a book or report' },
  { title: 'Lectures & WebTalks', text: 'Co-host a lecture season or an online talk series featuring your experts.', link: 'Co-host a series' },
];

export function Collaboration() {
  return (
    <section id="collaboration" className="font-hub-body bg-[#F6F8FC]">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="rounded-2xl bg-[#0A1A45] text-white p-8 md:p-10">
          <p className="text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#A7F3D0] mb-3">
            Open invitation · Collaboration
          </p>
          <h2 className="font-hub-display font-bold text-[26px] mb-4">Publish jointly with IAAM</h2>
          <p className="text-[15px] text-[#C5CEE3] leading-relaxed max-w-[64ch] mb-6">
            Universities, research institutes, learned societies and charitable organisations are invited to
            co-publish with us. You bring the scholarship and the community; we provide the platform, the
            editorial workflow, DOIs, article-level impact scores and an international readership.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/#contact" className="px-5 py-2.5 rounded-md bg-[#34D399] text-[#0A1A45] text-[13.5px] font-bold hover:bg-[#A7F3D0] transition-colors">
              Propose a collaboration
            </a>
            <a href="/collaboration" className="px-5 py-2.5 rounded-md border border-white/40 text-white text-[13.5px] font-semibold hover:bg-white/10 transition-colors">
              How joint publication works
            </a>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {ROUTES.map((r) => (
            <div key={r.title} className="rounded-[10px] border border-[#DCE3F0] bg-white p-5">
              <h3 className="font-hub-display font-bold text-[14.5px] text-[#0B1F4D] mb-2">{r.title}</h3>
              <p className="text-[12.5px] text-[#3D4A66] leading-relaxed mb-3">{r.text}</p>
              <a href="/#contact" className="text-[12.5px] font-semibold text-[var(--brand)] hover:underline">
                {r.link} →
              </a>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="rounded-[10px] bg-white border border-[#DCE3F0] p-5">
            <h3 className="font-hub-display font-bold text-[14.5px] text-[#0B1F4D] mb-2">
              For universities &amp; research institutes
            </h3>
            <p className="text-[12.5px] text-[#3D4A66] leading-relaxed mb-3">
              Give your departments, centres and doctoral schools a recognised outlet, with your institution named
              as joint publisher.
            </p>
            <a href="/#contact" className="text-[12.5px] font-semibold text-[var(--brand)] hover:underline">Invite your university →</a>
          </div>
          <div className="rounded-[10px] bg-white border border-[#DCE3F0] p-5">
            <h3 className="font-hub-display font-bold text-[14.5px] text-[#0B1F4D] mb-2">
              For not-for-profit organisations &amp; societies
            </h3>
            <p className="text-[12.5px] text-[#3D4A66] leading-relaxed mb-3">
              Share your members&apos; research and your organisation&apos;s reports through a publisher that answers to
              the scientific community, not to shareholders.
            </p>
            <a href="/#contact" className="text-[12.5px] font-semibold text-[var(--brand)] hover:underline">Start a partnership →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
