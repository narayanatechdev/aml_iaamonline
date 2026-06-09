'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Menu, X, Search, BookOpen, Moon, Sun, Bell as BellIcon, Rss } from 'lucide-react';
import Link from 'next/link';
import { searchArticles } from '@/lib/realData';

const dropdownStyles = `
  @keyframes slideDownFade {
    from {
      opacity: 0;
      transform: translateY(-12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .mega-dropdown {
    animation: slideDownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  }

  .mega-dropdown a {
    transition: background-color 0.15s ease;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  }

  .mega-dropdown a:hover {
    background-color: #f9fafb;
  }

  nav {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  }

  nav button {
    transition: all 0.2s ease;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  }

  nav button:hover {
    transition: all 0.2s ease;
  }
`;

interface MegaNavItem {
  label: string;
  description?: string;
  path: string;
}

interface NavCategory {
  label: string;
  items: MegaNavItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    label: 'Explore content',
    items: [
      { label: 'Research Articles', description: 'Original peer-reviewed studies', path: '/articles' },
      { label: 'Reviews & Perspectives', description: 'Expert syntheses & commentary', path: '/browse/current' },
      { label: 'Invited & Fellow Articles', description: 'Curated by the IAAM community', path: '/about' },
      { label: 'Thematic Collections', description: 'Fellow-led special issues', path: '/browse/current' },
      { label: 'Challenge Divisions', description: 'Five grand-challenge streams', path: '/browse/current' },
      { label: 'Articles in Press', description: 'Accepted, awaiting issue', path: '/browse/archive' },
      { label: 'News & Commentary', description: 'From the editorial desk', path: '/news' },
      { label: 'Browse by Subject / Volume', description: '16 years of archives', path: '/browse/subject' },
    ],
  },
  {
    label: 'About the journal',
    items: [
      { label: 'Aims & Scope', description: 'A Translational Materials Impact Platform', path: '/about-journal' },
      { label: 'Editorial & Advisory Board', description: 'Led by IAAM Fellows', path: '/about' },
      { label: 'TRL Publishing Framework', description: 'Classifying translational maturity', path: '/about-journal' },
      { label: 'Publication Ethics & Policy', description: 'Integrity, regulation, ethics', path: '/about-journal/editorial-policies' },
      { label: 'Access & Membership', description: 'Consortium & cooperation models', path: '/about-journal' },
      { label: 'Indexing & Metrics', description: 'Reach, citations, Altmetrics', path: '/about-journal/journal-metrics' },
      { label: '15+ Years & History', description: 'Published by International Association of Advanced Materials since June 2010', path: '/about-journal' },
      { label: 'FAQ & Contact', description: 'Reach the editorial office', path: '/contact' },
    ],
  },
  {
    label: 'Publish with us',
    items: [
      { label: 'For IAAM Fellows & Invited Authors', description: 'How invitations work', path: '/author-resources' },
      { label: 'Submission Guidelines', description: 'Formats & requirements', path: '/author-resources/guidelines' },
      { label: 'TRL Classification Guide', description: 'Declare translational stage', path: '/author-resources' },
      { label: 'Article Categories', description: 'Beyond research & reviews', path: '/author-resources' },
      { label: 'Peer Review & Editorial Process', description: 'Curated, transparent review', path: '/author-resources/process' },
      { label: 'For Reviewers', description: 'Open reviewer recognition', path: '/author-resources/ethics' },
    ],
  },
];

function getAuthorName(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  }
  return '';
}

export function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('All subjects');
  const [isDarkMode, setIsDarkMode] = useState(false);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      const found = searchArticles(value).slice(0, 5);
      setSearchResults(found);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/browse/current?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  // Handle Escape key to close search modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };

    if (showSearchModal) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showSearchModal]);

  return (
    <>
      <style>{dropdownStyles}</style>
      <header className="sticky top-0 z-50 bg-white">
      {/* ===== MASTHEAD ===== */}
      <div className="border-b border-gray-200 px-4 py-4" style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-4 flex-shrink-0">
            <div className="w-11 h-11 rounded-lg bg-black">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
                <path d="M16 3 4 9v14l12 6 12-6V9L16 3Z" stroke="#fff" strokeWidth="1.4" opacity=".9"/>
                <path d="M16 3v26M4 9l24 14M28 9 4 23" stroke="#ccc" strokeWidth="1" opacity=".7"/>
                <circle cx="16" cy="16" r="3.4" fill="#fff"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-black">Advanced Materials Letters</div>
              <div className="text-xs text-gray-600">Published by International Association of Advanced Materials</div>
            </div>
          </a>
          <div className="flex items-center gap-4">
            <a href="/feed" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition text-gray-700 text-sm font-semibold" title="RSS Feed">
              <Rss className="w-4 h-4" />
              RSS feed
            </a>
            <div className="border-l border-gray-300 h-6"></div>
            <a href="https://aml.iaamonline.org/contacts" className="text-sm font-semibold text-black hover:text-gray-700 transition">
              Log in
            </a>
            <a href="https://aml.iaamonline.org/contacts?_action=signup" className="text-sm font-semibold px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition">
              Register
            </a>
          </div>
        </div>
      </div>

      {/* ===== PRIMARY NAV ===== */}
      <nav className="hidden md:block bg-white border-b border-gray-200 shadow-sm">
        <div
          style={{ height: '3px', background: '#000' }}
        />
        <div className="max-w-7xl mx-auto px-4 flex items-stretch">
          {NAV_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.label}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(cat.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all"
                style={{
                  color: activeDropdown === cat.label ? '#000' : '#333',
                  background: activeDropdown === cat.label ? '#f5f5f5' : 'transparent',
                  borderBottom: activeDropdown === cat.label ? '3px solid #000' : '3px solid transparent',
                  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
                }}
              >
                {cat.label}
                <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${activeDropdown === cat.label ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown */}
              {activeDropdown === cat.label && (
                <div
                  className="mega-dropdown absolute top-full left-0 w-[560px] bg-white rounded-b-lg shadow-2xl border border-gray-200 z-[100] p-6 grid grid-cols-2 gap-6"
                  style={{ borderTop: '3px solid #000' }}
                >
                  {cat.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.path}
                      className="block p-2.5 rounded-lg transition-all hover:bg-gray-50"
                    >
                      <div className="text-sm font-semibold" style={{ color: '#171a1f' }}>
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="text-xs mt-1" style={{ color: '#6a7382' }}>
                          {item.description}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Search, Alerts, and CTA on right */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2.5 rounded hover:bg-gray-100 transition text-gray-700"
            >
              <Search className="w-5 h-5" />
            </button>
            <a
              href="#alerts"
              className="px-4 py-2.5 text-sm font-semibold rounded transition-all flex items-center gap-2 text-gray-700 hover:bg-gray-100"
              style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
            >
              <BellIcon className="w-4 h-4" />
              Sign up for alerts
            </a>
            <Link
              href="/author-resources/submit"
              className="px-5 py-2.5 text-sm font-bold rounded transition-all bg-black text-white hover:bg-gray-800"
              style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
            >
              Submit / Get invited →
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu button and search */}
      <div className="md:hidden px-4 py-3 border-t border-gray-200 flex items-center gap-3" style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-3 py-2 rounded border border-gray-200 text-sm"
          />
          <button type="submit" className="p-2">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg" style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}>
          <nav className="px-4 py-4">
            {NAV_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <div className="text-xs font-bold uppercase tracking-widest py-3" style={{ color: '#9a4e1c' }}>
                  {cat.label}
                </div>
                <div className="space-y-2 ml-2">
                  {cat.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.path}
                      className="block text-sm font-medium hover:text-[#c2682a] transition"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div
          className="w-full bg-white border-b border-gray-200 shadow-sm py-8 relative"
          style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
        >
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded transition"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Search and filters */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-black mb-6">Search Advanced Materials Letters</h2>

                  {/* Search input and button */}
                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      placeholder="Search 2,000+ articles, authors, keywords..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black bg-white"
                    >
                      <option>All subjects</option>
                      <option>Materials Science</option>
                      <option>Chemistry</option>
                      <option>Physics</option>
                      <option>Biology</option>
                      <option>Engineering</option>
                    </select>
                    <button
                      onClick={() => {
                        if (searchQuery.trim()) {
                          setShowSearchModal(false);
                          router.push(`/browse/current?q=${encodeURIComponent(searchQuery.trim())}`);
                        }
                      }}
                      className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
                    >
                      Search
                    </button>
                  </div>

                  {/* Quick links */}
                  <div className="flex gap-4 text-sm">
                    <a href="/search/advanced" className="font-semibold text-amber-700 hover:text-amber-800">
                      Advanced search
                    </a>
                    <a href="/search/authors" className="font-semibold text-amber-700 hover:text-amber-800">
                      By author
                    </a>
                    <a href="/search/issues" className="font-semibold text-amber-700 hover:text-amber-800">
                      By issue
                    </a>
                    <a href="/search/keywords" className="font-semibold text-amber-700 hover:text-amber-800">
                      Keyword index
                    </a>
                  </div>
                </div>

                {/* Right: Featured cards */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="/browse/divisions"
                    className="block px-4 py-3 bg-blue-900 text-white rounded hover:opacity-90 transition-opacity"
                  >
                    <h3 className="font-bold text-sm leading-tight">Browse Divisions</h3>
                    <p className="text-xs text-blue-200 leading-tight">Five challenge streams</p>
                  </a>

                  <a
                    href="/browse/collections"
                    className="block px-4 py-3 bg-slate-700 text-white rounded hover:opacity-90 transition-opacity"
                  >
                    <h3 className="font-bold text-sm leading-tight">Collections</h3>
                    <p className="text-xs text-slate-300 leading-tight">Fellow-led special issues</p>
                  </a>
                </div>
              </div>
            </div>
        </div>
      )}
    </header>
    </>
  );
}
