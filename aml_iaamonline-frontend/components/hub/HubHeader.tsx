'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';

const PORTAL_LOGIN_URL = process.env.NEXT_PUBLIC_PORTAL_LOGIN_URL || 'https://dev-portal.iaamonline.org/portal/login';
const PORTAL_REGISTER_URL = process.env.NEXT_PUBLIC_PORTAL_REGISTER_URL || 'https://dev-portal.iaamonline.org/register';

const GLOBAL_LINKS = [
  { label: 'About IAAM', href: 'https://iaamonline.org/about' },
  { label: 'News', href: 'https://iaamonline.org/news' },
  { label: 'Events', href: 'https://iaamonline.org/events' },
  { label: 'Awards', href: 'https://iaamonline.org/awards' },
  { label: 'Education', href: 'https://iaamonline.org/education' },
  { label: 'Publications', href: '/' },
  { label: 'Membership', href: 'https://iaamonline.org/membership' },
];

const DROPDOWNS: Record<string, { label: string; href: string }[]> = {
  Publications: [
    { label: 'Advanced Materials Letters', href: '/advanced-materials-letters' },
    { label: 'Advanced Materials Proceedings', href: '/advanced-materials-proceedings' },
    { label: 'Advanced Materials Lecture Series', href: '/advanced-materials-lecture-series' },
    { label: 'Advanced Materials Video Proceedings', href: '/advanced-materials-video-proceedings' },
    { label: 'Advanced Materials WebTalks', href: '/advanced-materials-webtalks' },
    { label: 'Books & Reports', href: '/books-reports' },
    { label: 'All publications', href: '/publications' },
  ],
  'For Authors': [
    { label: 'Author guidelines', href: '/for-authors/guidelines' },
    { label: 'Publication ethics', href: '/for-authors/ethics' },
    { label: 'Peer-review process', href: '/for-authors/peer-review' },
    { label: 'Open access policy & APCs', href: '/for-authors/open-access' },
    { label: 'Invited article programme', href: '/for-authors/invited-articles' },
    { label: 'Fellow contribution programme', href: '/for-authors/fellow-contributions' },
  ],
  Topics: [
    { label: 'Advanced materials', href: '/topics/advanced-materials' },
    { label: 'Energy materials', href: '/topics/energy-materials' },
    { label: 'Biomaterials', href: '/topics/biomaterials' },
    { label: 'Nanomaterials', href: '/topics/nanomaterials' },
    { label: 'Sustainable & circular materials', href: '/topics/sustainable-circular-materials' },
    { label: 'Electronic materials', href: '/topics/electronic-materials' },
    { label: 'Metallurgy & rare-earth materials', href: '/topics/metallurgy-rare-earth-materials' },
    { label: 'Structural & engineering materials', href: '/topics/structural-engineering-materials' },
    { label: 'AI & materials discovery', href: '/topics/ai-materials-discovery' },
    { label: 'Quantum materials', href: '/topics/quantum-materials' },
    { label: 'All topics', href: '/topics' },
  ],
  Archive: [
    { label: 'By publication', href: '/archive' },
    { label: 'By year', href: '/archive?view=year' },
    { label: 'By volume / issue', href: '/archive?view=volume' },
    { label: 'Featured collections', href: '/archive/collections' },
    { label: 'Special issues', href: '/archive/special-issues' },
    { label: 'Search results', href: '/search' },
  ],
  About: [
    { label: 'Mission & vision', href: '/about#mission' },
    { label: 'Not-for-profit commitment', href: '/about#not-for-profit' },
    { label: 'IAAM Article Impact (AII)', href: '/about/article-impact' },
    { label: 'Editorial leadership', href: '/about/editorial-leadership' },
    { label: 'News & announcements', href: '/about/news' },
    { label: 'Contact', href: '/#contact' },
  ],
};

const MENU_ITEMS = ['Publications', 'For Authors', 'Topics', 'Archive', 'Impact', 'Collaboration', 'About'] as const;

export function HubHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="font-hub-body sticky top-0 z-50">
      {/* IAAM global header */}
      <div className="bg-[#0A1330] text-[#C5CEE3] text-[13px]">
        <div className="max-w-[1200px] mx-auto px-6 h-10 flex items-center justify-between gap-6">
          <nav className="hidden lg:flex items-center gap-5">
            {GLOBAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={l.label === 'Publications' ? 'text-white font-semibold' : 'hover:text-white transition-colors'}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4 ml-auto">
            <a href="/search" aria-label="Search" className="hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </a>
            <a href={PORTAL_LOGIN_URL} className="hover:text-white transition-colors">
              Sign in
            </a>
            <a
              href={PORTAL_REGISTER_URL}
              className="px-3 py-1.5 rounded-md bg-[#1546E0] text-white font-semibold hover:bg-[#1139b8] transition-colors"
            >
              Join IAAM
            </a>
            <a
              href="/#contact"
              className="hidden sm:inline px-3 py-1.5 rounded-md border border-[#3A466F] hover:border-white hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Publications menu bar */}
      <div className="bg-white border-b border-[#DCE3F0]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="IAAM Publications, home">
            <div className="w-9 h-9 rounded-lg bg-[#0A1A45] flex items-center justify-center text-white font-hub-display font-bold text-sm">
              IA
            </div>
            <span className="font-hub-display font-semibold text-[15px] text-[#0B1F4D] hidden sm:inline">
              IAAM Publications
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {MENU_ITEMS.map((item) => {
              const hasDropdown = item in DROPDOWNS;
              const jumpHref = item === 'Impact' ? '/#article-impact' : item === 'Collaboration' ? '/#collaboration' : undefined;
              return (
                <div
                  key={item}
                  className="relative"
                  onMouseEnter={() => hasDropdown && setOpenMenu(item)}
                  onMouseLeave={() => hasDropdown && setOpenMenu(null)}
                >
                  {jumpHref ? (
                    <a
                      href={jumpHref}
                      className="flex items-center gap-1 px-3 py-2 text-[14px] font-semibold text-[#14213D] hover:text-[#1546E0] transition-colors"
                    >
                      {item}
                    </a>
                  ) : (
                    <button
                      className="flex items-center gap-1 px-3 py-2 text-[14px] font-semibold text-[#14213D] hover:text-[#1546E0] transition-colors"
                      aria-expanded={openMenu === item}
                    >
                      {item}
                      {hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  {hasDropdown && openMenu === item && (
                    <div className="absolute top-full left-0 w-72 bg-white rounded-lg shadow-xl border border-[#DCE3F0] py-2 z-50">
                      {DROPDOWNS[item].map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 text-[13.5px] text-[#2B3853] hover:bg-[#F6F8FC] hover:text-[#1546E0] transition-colors"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <a
              href="/for-authors/submit"
              className="px-4 py-2.5 rounded-md bg-[#1546E0] text-white text-[14px] font-semibold hover:bg-[#1139b8] transition-colors"
            >
              Submit &amp; Publish
            </a>
            <a
              href="/alerts"
              title="New issues, articles and lectures in your inbox. Choose your topics."
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-[#1546E0] text-[#1546E0] text-[14px] font-semibold hover:bg-[#EAF1FD] transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              Get Alerts
            </a>
          </div>

          <button
            className="lg:hidden ml-auto p-2 text-[#0B1F4D]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[#DCE3F0] px-6 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {MENU_ITEMS.map((item) => (
              <div key={item} className="py-1">
                <div className="text-[14px] font-semibold text-[#0B1F4D] py-1.5">{item}</div>
                {(DROPDOWNS[item] ?? []).map((sub) => (
                  <a key={sub.label} href={sub.href} className="block pl-3 py-1.5 text-[13.5px] text-[#2B3853]">
                    {sub.label}
                  </a>
                ))}
              </div>
            ))}
            <a href="/for-authors/submit" className="block mt-3 px-4 py-2.5 rounded-md bg-[#1546E0] text-white text-center text-[14px] font-semibold">
              Submit &amp; Publish
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
