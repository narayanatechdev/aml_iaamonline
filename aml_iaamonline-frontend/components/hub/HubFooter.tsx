const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'News',
    links: [
      { label: 'IAAM news', href: 'https://iaamonline.org/news' },
      { label: 'Announcements', href: 'https://iaamonline.org/news' },
      { label: 'Subscribe to alerts', href: '/#footer-newsletter' },
    ],
  },
  {
    heading: 'Events',
    links: [
      { label: 'Congresses', href: 'https://iaamonline.org/events' },
      { label: 'Symposia', href: 'https://iaamonline.org/events' },
      { label: 'WebTalks', href: '/publications' },
      { label: 'Lecture series', href: '/publications' },
    ],
  },
  {
    heading: 'Fellows',
    links: [
      { label: 'Fellow nomination', href: 'https://iaamonline.org/fellows' },
      { label: 'Fellow benefits', href: 'https://iaamonline.org/fellows' },
      { label: 'Fellow contribution programme', href: '/for-authors/fellow-contributions' },
    ],
  },
  {
    heading: 'Journals',
    links: [
      { label: 'Advanced Materials Letters', href: '/advanced-materials-letters' },
      { label: 'Advanced Materials Proceedings', href: '/advanced-materials-proceedings' },
      { label: 'Advanced Materials Lecture Series', href: '/publications' },
      { label: 'Advanced Materials Video Proceedings', href: '/publications' },
      { label: 'Advanced Materials WebTalks', href: '/publications' },
      { label: 'All publications', href: '/publications' },
    ],
  },
  {
    heading: 'Books & Reports',
    links: [
      { label: 'Books & reports status', href: '/publications' },
      { label: 'Propose a book', href: '/#contact' },
      { label: 'Publish jointly with IAAM', href: '/collaboration' },
    ],
  },
  {
    heading: 'Authors & Reviewers',
    links: [
      { label: 'Information for authors', href: '/for-authors/guidelines' },
      { label: 'Information for reviewers', href: '/for-authors/peer-review' },
      { label: 'Publication ethics', href: '/for-authors/ethics' },
      { label: 'Peer-review process', href: '/for-authors/peer-review' },
      { label: 'Invited article programme', href: '/for-authors/invited-articles' },
      { label: 'Open access options & APCs', href: '/for-authors/open-access' },
      { label: 'Submit & publish', href: '/for-authors/submit' },
    ],
  },
  {
    heading: 'Librarians',
    links: [
      { label: 'Institutional subscriptions', href: '/for-authors/open-access' },
      { label: 'Access & charges', href: '/for-authors/open-access' },
      { label: 'Request a quote', href: '/#contact' },
    ],
  },
  {
    heading: 'Membership',
    links: [
      { label: 'Members read free', href: 'https://iaamonline.org/membership' },
      { label: 'Become a member', href: 'https://iaamonline.org/membership' },
      { label: 'Renew membership', href: 'https://iaamonline.org/membership' },
      { label: 'Corporate membership', href: 'https://iaamonline.org/membership' },
      { label: 'Institutional & organisation membership', href: 'https://iaamonline.org/membership' },
    ],
  },
  {
    heading: 'Related Sites',
    links: [
      { label: 'IAAM (iaamonline.org)', href: 'https://iaamonline.org' },
      { label: 'Advanced Materials Congress', href: 'https://iaamonline.org/events' },
      { label: 'Institute of Advanced Materials', href: 'https://iaamonline.org' },
    ],
  },
  {
    heading: 'About Us',
    links: [
      { label: 'Mission & vision', href: '/about#mission' },
      { label: 'Not-for-profit commitment', href: '/about#not-for-profit' },
      { label: 'IAAM Article Impact (AII)', href: '/about/article-impact' },
      { label: 'Publishing with IAAM', href: '/for-authors' },
      { label: 'Collaboration & joint publication', href: '/collaboration' },
      { label: 'Contact us', href: '/#contact' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Browse by topic', href: '/topics' },
      { label: 'Archive by volume', href: '/archive' },
      { label: 'Search all publications', href: '/search' },
      { label: 'Access & charges', href: '/for-authors/open-access' },
      { label: 'Email alerts', href: '/#footer-newsletter' },
      { label: 'Reprints and permissions', href: '/#contact' },
    ],
  },
  {
    heading: 'Follow Us',
    links: [
      { label: 'X', href: 'https://x.com/iaamonline' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/iaamonline' },
      { label: 'YouTube', href: 'https://www.youtube.com/@iaamonline' },
      { label: 'Instagram', href: 'https://www.instagram.com/iaamonline' },
      { label: 'Facebook', href: 'https://www.facebook.com/iaamonline' },
    ],
  },
];

export function HubFooter() {
  return (
    <footer className="font-hub-body bg-[#0A1330] text-[#C5CEE3]">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
            <img src="/iaam-logo.svg" alt="" width={36} height={37} className="w-9 h-[37px]" />
          </span>
          <span className="font-hub-display font-semibold text-[16px] text-white">IAAM Publications</span>
        </div>
        <p className="text-[12.5px] leading-relaxed max-w-[80ch] mb-10 pb-8 border-b border-[#26325A]">
          IAAM Publications is the publishing arm of the International Association of Advanced Materials, a
          non-profit international scientific organization and an Observer Organization accredited to the United
          Nations Environment Programme (UNEP). Org. Nr. 802503-6784 · Headquarters &amp; Secretariat Office:
          Gammalkilsvägen 18, Ulrika 590 53, Sweden · Tel. (+46) 1313-2424 ·{' '}
          <a href="mailto:contact@iaamonline.org" className="underline hover:text-white">contact@iaamonline.org</a> ·{' '}
          <a href="https://iaamonline.org" className="underline hover:text-white">www.iaamonline.org</a>
        </p>

        <div id="footer-newsletter" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-[#26325A]">
          <p className="text-[13px] text-[#8B98B8] max-w-md">
            One email a month: new issues, calls for papers and upcoming talks. Unsubscribe at any time.
          </p>
          <a
            href="/#footer-newsletter"
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#1546E0] text-white text-[12.5px] font-bold tracking-wide hover:bg-[#1139b8] transition-colors whitespace-nowrap"
          >
            GET OUR NEWSLETTER
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-white mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[12.5px] hover:text-white transition-colors leading-snug">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#26325A] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
          {/*
            IAAM Publications has no policies of its own published yet. These
            point at the journal's real, live GDPR policies rather than at hub
            pages that do not exist — see the note in the deployment brief
            about giving the publisher its own publisher-level policies.
          */}
          <div className="flex gap-4">
            <a href="/advanced-materials-letters/terms-of-use" className="hover:text-white">Terms</a>
            <a href="/advanced-materials-letters/privacy-policy" className="hover:text-white">Privacy</a>
            <a href="/advanced-materials-letters/cookie-policy" className="hover:text-white">Cookies</a>
          </div>
          <p>© 2026 International Association of Advanced Materials · www.pubs.iaamonline.org</p>
        </div>
      </div>
    </footer>
  );
}
