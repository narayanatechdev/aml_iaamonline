'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Menu, X, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { searchArticles } from '@/lib/realData';

interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'About Journal',
    path: '/about-journal',
    children: [
      { label: 'Aims & Scope', path: '/about-journal/aims-scope' },
      { label: 'Editorial Board', path: '/about-journal/editorial-board' },
      { label: 'Indexing & Abstracting', path: '/about-journal/indexing' },
      { label: 'Ethics & Process', path: '/about-journal/ethics-process' },
      { label: 'Review Process', path: '/about-journal/review-process' },
    ],
  },
  {
    label: 'Authors',
    path: '/browse/author',
  },
  {
    label: 'Browse',
    path: '/browse/current',
    children: [
      { label: 'Current Issue', path: '/browse/current' },
      { label: 'By Issue / Archive', path: '/browse/archive' },
      { label: 'By Subject', path: '/browse/subject' },
      { label: 'By Author', path: '/browse/author' },
    ],
  },
  {
    label: 'Articles',
    path: '/articles',
  },
  {
    label: 'Announcements',
    path: '/news',
  },
  {
    label: 'Author Resources',
    path: '/author-resources',
    children: [
      { label: 'Submission Guidelines', path: '/author-resources/guidelines' },
      { label: 'Peer Review & Ethics', path: '/author-resources/ethics' },
      { label: 'Publishing Process', path: '/author-resources/process' },
      { label: 'Submit Manuscript', path: '/author-resources/submit' },
    ],
  },
  {
    label: 'Contact',
    path: '/contact',
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

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#0f2d6b] text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xs opacity-80">ISSN: 0976-3961 | eISSN: 1998-0140 | Diamond Open Access</span>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white px-4 py-3 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo + Title */}
          <a href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-primary text-sm font-bold leading-tight">Advanced Materials Letters</div>
              <div className="text-muted-foreground text-xs leading-tight">IAAM Journal Management System</div>
            </div>
          </a>

          {/* Spacer to push content right */}
          <div className="flex-1"></div>

          {/* Right section with quick links and search */}
          <div className="hidden md:flex items-center gap-6">
            {/* Quick Action Links */}
            <div className="flex items-center gap-4">
              <Link 
                href="/browse/current" 
                className="text-sm text-[#0f2d6b] hover:text-[#0d2560] font-medium border-b border-transparent hover:border-[#0f2d6b] transition-all duration-200"
              >
                Current Issue
              </Link>
              <Link 
                href="/author-resources/submit" 
                className="text-sm text-[#0f2d6b] hover:text-[#0d2560] font-medium border-b border-transparent hover:border-[#0f2d6b] transition-all duration-200"
              >
                Submit Manuscript
              </Link>
              <Link 
                href="/author-resources/guidelines" 
                className="text-sm text-[#0f2d6b] hover:text-[#0d2560] font-medium border-b border-transparent hover:border-[#0f2d6b] transition-all duration-200"
              >
                Author Guidelines
              </Link>
            </div>

            {/* Search bar */}
            <div className="max-w-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="Search articles, authors, keywords..."
                className="w-full pl-4 pr-10 py-2 border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>

              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl border border-gray-200 overflow-hidden z-[100] max-h-[350px] overflow-y-auto">
                  {searchResults.map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.id}`}
                      className="block px-4 py-2.5 hover:bg-[#f0f4fb] border-b border-gray-50 last:border-b-0 transition-colors"
                      onClick={() => setShowSearchDropdown(false)}
                    >
                      <div className="text-[#0f1a2e] text-xs font-semibold line-clamp-1">{article.title}</div>
                      <div className="text-[#5a6a8a] text-[10px] mt-0.5">
                        {(article.authors || []).slice(0, 2).map(getAuthorName).filter(Boolean).join(', ')}
                        {(article.authors || []).length > 2 ? ' et al.' : ''}
                        <span className="mx-1">·</span>
                        {article.year}
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/browse/current?q=${encodeURIComponent(searchQuery)}`}
                    className="block px-4 py-2.5 text-center text-[#0f2d6b] text-xs font-semibold hover:bg-[#f0f4fb] bg-gray-50"
                    onClick={() => setShowSearchDropdown(false)}
                  >
                    View all results
                  </Link>
                </div>
              )}
            </form>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="hidden md:block bg-white border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.path}
                  className={`flex items-center gap-1 px-4 py-3 text-base text-primary border-b-2 border-transparent hover:border-primary hover:text-primary hover:bg-gray-50 hover:shadow-sm transition-all duration-200 font-medium ${
                    activeDropdown === item.label ? 'border-primary text-primary bg-gray-50' : ''
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                </a>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-b-lg shadow-xl border border-border z-50 transform origin-top animate-in slide-in-from-top-4 fade-in duration-300 ease-out">
                    {item.children.map((child, idx) => (
                      <a
                        key={child.label}
                        href={child.path}
                        className={`block px-4 py-2.5 text-base text-foreground hover:bg-secondary hover:text-primary hover:border-l-2 hover:border-primary transition-all ${
                          idx === 0 ? 'pt-3' : ''
                        } ${idx === item.children!.length - 1 ? 'pb-3' : ''}`}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border shadow-lg">
          <div className="px-4 py-3">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search articles, DOI, authors..."
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-border bg-secondary text-sm focus:outline-none"
              />
            </form>
          </div>
          
          {/* Quick Links for Mobile */}
          <div className="px-4 py-2 border-b border-border/50">
            <div className="text-xs text-[#5a6a8a] font-semibold mb-2">Quick Links</div>
            <div className="grid grid-cols-1 gap-1">
              <Link 
                href="/browse/current" 
                className="text-sm text-[#0f2d6b] font-medium py-1.5"
                onClick={() => setMobileOpen(false)}
              >
                Current Issue
              </Link>
              <Link 
                href="/author-resources/submit" 
                className="text-sm text-[#0f2d6b] font-medium py-1.5"
                onClick={() => setMobileOpen(false)}
              >
                Submit Manuscript
              </Link>
              <Link 
                href="/author-resources/guidelines" 
                className="text-sm text-[#0f2d6b] font-medium py-1.5"
                onClick={() => setMobileOpen(false)}
              >
                Author Guidelines
              </Link>
            </div>
          </div>
          
          <nav className="px-4 pb-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <a
                  href={item.path}
                  className="block py-2.5 text-base text-foreground border-b border-border/50 font-medium"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.path}
                        className="block py-2 text-base text-muted-foreground border-b border-border/30"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
