const PUBLICATIONS = [
  {
    title: 'Advanced Materials Letters',
    short: 'AML',
    text: 'Our flagship journal. Short, rigorous research papers and reviews, led by invited articles from proven experts and IAAM Fellows.',
    link: 'Explore the journal',
    href: '/advanced-materials-letters',
    live: true,
  },
  {
    title: 'Advanced Materials Proceedings',
    short: 'AMP',
    text: 'Peer-reviewed papers from IAAM congresses and symposia, organised by event and session so delegates can find their work quickly.',
    link: 'Browse proceedings',
    href: '/advanced-materials-proceedings',
    live: true,
  },
  {
    title: 'Advanced Materials Lecture Series',
    short: 'AMLS',
    text: 'Distinguished lectures published as citable records: video, slides, transcript and DOI.',
    link: 'Watch lectures',
    href: '/advanced-materials-lecture-series',
    live: false,
  },
  {
    title: 'Advanced Materials Video Proceedings',
    short: 'AMVP',
    text: 'Recorded congress presentations, keynotes and panel discussions, linked to the written paper where one exists.',
    link: 'View recordings',
    href: '/advanced-materials-video-proceedings',
    live: false,
  },
  {
    title: 'Advanced Materials WebTalks',
    short: 'AMWT',
    text: 'Free live online talks with audience questions. Recordings stay available to members afterwards.',
    link: 'See upcoming talks',
    href: '/advanced-materials-webtalks',
    live: false,
  },
  {
    title: 'Books & Reports',
    short: 'B&R',
    text: 'Monographs, edited volumes and handbooks, plus IAAM technology outlooks and policy papers.',
    link: 'Find a book or report',
    href: '/books-reports',
    live: false,
  },
];

export function OurPublications() {
  return (
    <section className="font-hub-body bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        <div className="flex items-end justify-between gap-4 mb-2">
          <div>
            <h2 className="font-hub-display font-bold text-[28px] text-[#0B1F4D]">Our Publications</h2>
            <div className="w-14 h-1 rounded-full bg-[#10B981] mt-2 mb-3" />
            <p className="text-[15px] text-[#5a6a8a]">Six titles, one search, one account.</p>
          </div>
          <a href="/publications" className="hidden sm:inline text-[14px] font-semibold text-[#1546E0] hover:underline">
            All publications
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          {PUBLICATIONS.map((p) => (
            <a
              key={p.title}
              href={p.live ? p.href : undefined}
              aria-disabled={!p.live}
              className={`group flex flex-col rounded-[10px] border border-[#DCE3F0] p-4 transition-shadow ${
                p.live ? 'hover:shadow-lg' : 'opacity-70 cursor-default pointer-events-none'
              }`}
            >
              <div className="w-11 h-11 rounded-lg bg-[#EAF1FD] text-[#1546E0] font-hub-display font-bold text-[13px] flex items-center justify-center mb-3">
                {p.short}
              </div>
              <h3 className="font-hub-display font-bold text-[15px] text-[#0B1F4D] leading-snug mb-2">{p.title}</h3>
              <p className="text-[12.5px] text-[#3D4A66] leading-relaxed flex-1">{p.text}</p>
              {p.live ? (
                <span className="mt-3 text-[12.5px] font-semibold text-[#1546E0] group-hover:underline">{p.link} →</span>
              ) : (
                <span className="mt-3 text-[11px] font-semibold tracking-wide uppercase text-[#8B98B8]">Coming soon</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
