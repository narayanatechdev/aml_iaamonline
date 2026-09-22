import { Search } from 'lucide-react';

const PILLARS = [
  { label: 'Net Zero', text: 'Research that cuts carbon from how materials are made and used' },
  { label: 'Sustainable Materials', text: 'Materials designed to last, to be recovered and to be reused' },
  { label: 'Global Collaboration', text: 'Authors, reviewers and readers in more than 150 countries' },
  { label: 'Knowledge Sharing', text: 'Findings that reach laboratories, classrooms, industry and policy makers' },
];

export function HubHero() {
  return (
    <section className="font-hub-body relative isolate bg-[#0A1A45] text-white overflow-hidden">
      {/*
        The artwork has the four pillars lettered into it, so it carries
        meaning and gets a real description rather than aria-hidden.
      */}
      <img
        src="/hub/hero-molecular-globe.webp"
        alt="A globe wrapped in a molecular lattice, labelled Net Zero, Sustainable Materials, Global Collaboration and Knowledge Sharing."
        className="absolute inset-0 -z-10 w-full h-full object-cover object-center lg:object-right"
      />
      {/*
        The artwork is dark on the left and bright on the right. This keeps the
        headline legible at every width, where the globe would otherwise sit
        behind the text once the image is cropped.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0A1A45] via-[#0A1A45]/90 to-[#0A1A45]/40 lg:bg-[linear-gradient(to_right,#0A1A45_0%,rgba(10,26,69,0.88)_36%,transparent_62%)]"
      />

      <div className="relative max-w-[1400px] mx-auto px-6 py-14 md:py-20">
        <p className="text-[12px] font-semibold tracking-[0.14em] uppercase text-[#A7F3D0] mb-4">
          Not-for-profit publisher · Science for a sustainable tomorrow
        </p>

        <div className="max-w-[660px]">
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
            <a
              href="/search/advanced"
              className="inline-block mt-3 text-[13.5px] text-[#A7F3D0] hover:text-white underline underline-offset-4"
            >
              Advanced search
            </a>
          </form>
        </div>

        {/*
          Only below lg. From lg up the artwork's own labels are on screen and
          these would say the same four things twice; narrower than that the
          image is cropped past them, so the words would otherwise be lost.
        */}
        <ul className="grid grid-cols-2 gap-3 mt-10 max-w-[920px] lg:hidden">
          {PILLARS.map((p) => (
            <li
              key={p.label}
              className="rounded-lg bg-[#0A1330]/55 backdrop-blur-sm border border-[#26325A] px-4 py-3"
            >
              <p className="text-[12.5px] font-semibold text-[#A7F3D0]">{p.label}</p>
              <p className="text-[12px] text-[#C5CEE3] leading-snug mt-1">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
