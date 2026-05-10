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
    label: 'About Journal',
    path: '/about',
    children: [
      { label: 'Aims & Scope', path: '/aims-scope' },
      { label: 'Editorial Board', path: '/editorial-board' },
      { label: 'Indexing & Abstracting', path: '/indexing' },
      { label: 'Ethics & Process', path: '/ethics-process' },
      { label: 'Review Process', path: '/process' },
    ],
  },
  {
    label: 'Browse Content',
    path: '/browse/current',
    children: [
      { label: 'Current Issue', path: '/browse/current' },
      { label: 'By Issue / Archive', path: '/browse/archive' },
      { label: 'By Subject', path: '/browse/subject' },
      { label: 'By Author', path: '/browse/author' },
    ],
  },
  {
    label: 'Author Resources',
    path: '#author-resources',
    children: [
      { label: 'Submission Guidelines', path: '#guidelines' },
      { label: 'Peer Review & Ethics', path: '#ethics' },
    ],
  },
  {
    label: 'News & Events',
    path: '#news',
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

          {/* Functional search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="Search articles, authors, keywords..."
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>

              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[100] max-h-[350px] overflow-y-auto">
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
      <nav className="hidden md:block bg-[#0f2d6b] border-t border-[#0f2d6b]/20">
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
                  className={`flex items-center gap-1 px-4 py-3 text-sm text-white/90 hover:text-white hover:bg-primary/80 transition-colors font-medium ${
                    activeDropdown === item.label ? 'bg-primary/80 text-white' : ''
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                </a>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-b-lg shadow-xl border border-border z-50">
                    {item.children.map((child, idx) => (
                      <a
                        key={child.label}
                        href={child.path}
                        className={`block px-4 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors ${
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
          <nav className="px-4 pb-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <a
                  href={item.path}
                  className="block py-2.5 text-sm text-foreground border-b border-border/50 font-medium"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.path}
                        className="block py-2 text-sm text-muted-foreground border-b border-border/30"
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
