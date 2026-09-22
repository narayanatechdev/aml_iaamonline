import { Search } from 'lucide-react';

const PILLARS = [
  { label: 'Net Zero', text: 'Research that cuts carbon from how materials are made and used' },
  { label: 'Sustainable Materials', text: 'Materials designed to last, to be recovered and to be reused' },
  { label: 'Global Collaboration', text: 'Authors, reviewers and readers in more than 150 countries' },
  { label: 'Knowledge Sharing', text: 'Findings that reach laboratories, classrooms, industry and policy makers' },
];

export function HubHero() {
  return (
    <section className="font-hub-body bg-[#0A1A45] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-14 md:py-16">
        <p className="text-[12px] font-semibold tracking-[0.14em] uppercase text-[#A7F3D0] mb-4">
          Not-for-profit publisher · Science for a sustainable tomorrow
        </p>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          <div>
            <h1 className="font-hub-display font-bold text-[42px] sm:text-[56px] leading-[1.1] text-white mb-2">
              IAAM <span className="text-[#34D399]">Publications</span>
            </h1>
            <p className="font-hub-display text-[22px] sm:text-[26px] font-semibold text-[#E4EEFC] mb-5">
              Knowledge. Discovery. Impact.
            </p>
            <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#C5CEE3] max-w-[58ch] mb-8">
              Peer-reviewed advanced materials research in every format: a journal, conference proceedings,
              distinguished lectures, congress videos, live web talks, books and reports. Read it, watch it,
              cite it, or publish your own.
            </p>

            <form action="/search" className="max-w-xl">
              <label htmlFor="hub-search" className="block text-[13px] font-semibold text-[#A7F3D0] mb-2">
                Search across all IAAM publications
              </label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 h-14">
                  <Search className="w-4 h-4 text-[#5a6a8a] flex-shrink-0" />
                  <input
                    id="hub-search"
                    name="q"
                    type="search"
                    placeholder="Title, author, keyword, topic or DOI"
                    className="w-full h-full text-[15px] text-[#14213D] placeholder:text-[#8B98B8] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-14 px-6 rounded-lg bg-[#34D399] text-[#0A1A45] text-[15px] font-bold hover:bg-[#A7F3D0] transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </div>
              <a href="/search/advanced" className="inline-block mt-3 text-[13.5px] text-[#A7F3D0] hover:text-white underline underline-offset-4">
                Advanced search
              </a>
            </form>
          </div>

          <div className="relative rounded-2xl bg-[#0B1F4D]/60 border border-[#26325A] p-6">
            <div
              role="img"
              aria-label="Globe wrapped in a molecular lattice with a green leaf"
              className="w-full aspect-square rounded-full bg-gradient-to-br from-[#1546E0] via-[#0B1F4D] to-[#0A1A45] flex flex-col items-center justify-center text-center px-6 mb-5"
            >
              <p className="font-hub-display font-semibold text-[17px] text-white leading-snug">
                Advanced Materials for a Better Tomorrow
              </p>
              <p className="text-[12px] text-[#A7F3D0] mt-2 tracking-wide">
                Materials · Innovation · People · Global Impact
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {PILLARS.map((p) => (
                <li key={p.label} title={p.text} className="rounded-lg bg-[#0A1330]/50 px-3 py-2.5">
                  <p className="text-[12.5px] font-semibold text-[#A7F3D0]">{p.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
