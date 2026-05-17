'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, FileText, Award } from 'lucide-react';
import { searchArticles, ARTICLE_STATS } from '@/lib/realData';
import Link from 'next/link';
import { NewsletterSubscription } from './newsletter-subscription';

const HERO_IMAGE = "https://images.unsplash.com/photo-1770320742319-6aa889b3130b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRlcmlhbHMlMjBzY2llbmNlJTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3MjcxMDI3OHww&ixlib=rb-4.0.3&q=80&w=1080";

function getAuthorName(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  }
  return '';
}

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length >= 2) {
      const found = searchArticles(value).slice(0, 6);
      setResults(found);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/browse/current?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#0f2d6b]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d6b]/95 via-[#0f2d6b]/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 max-w-2xl">
          <h3 className="text-white font-semibold text-lg mb-4">Dear Readers, Authors, and Supporters,</h3>
          <div className="text-white/80 text-sm leading-relaxed space-y-4 mb-8">
            <p>
              As the Editor-in-Chief of Advanced Materials Letters, I sincerely thank all researchers, reviewers, and readers who have contributed to the journal's success. Since its launch in June 2010, Advanced Materials Letters has remained dedicated to providing a high-quality, open-access platform for publishing cutting-edge research in materials science, engineering, and technology. Published by the International Association of Advanced Materials (IAAM), a non-profit organization, the journal upholds the principles of free and accessible scientific knowledge.
            </p>
            <p>
              The journal completed 15 impactful years in June 2024 and is publishing its 16th volume in 2025. Over the years, we have published 2,000 peer-reviewed articles contributed by more than 7,000 authors from 5,500+ universities and organizations across 75+ countries. With an annual readership exceeding half a million across 135+ countries, our open-access model ensures that scientific research remains freely available without article processing charges (APC) or subscription fees.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-white font-bold text-xl">
                {ARTICLE_STATS.total.toLocaleString()}+
              </div>
              <div className="text-white/70 text-xs mt-1">Published Articles</div>
            </div>
            <div>
              <div className="text-white font-bold text-xl">
                {ARTICLE_STATS.totalDownloads > 1000 ? Math.round(ARTICLE_STATS.totalDownloads / 1000).toLocaleString() + 'K+' : ARTICLE_STATS.totalDownloads.toLocaleString()}
              </div>
              <div className="text-white/70 text-xs mt-1">Total Downloads</div>
            </div>
            <div>
              <div className="text-white font-bold text-xl">
                {ARTICLE_STATS.totalVolumes}
              </div>
              <div className="text-white/70 text-xs mt-1">Journal Volumes</div>
            </div>
            <div>
              <div className="text-white font-bold text-xl">
                {ARTICLE_STATS.totalCountries}+
              </div>
              <div className="text-white/70 text-xs mt-1">Countries</div>
            </div>
          </div>

          </div>

          {/* Newsletter Subscription and Action Buttons */}
          <div className="lg:col-span-1">
            <NewsletterSubscription />
            
            <div className="flex flex-col gap-3 mt-6">
              <a
                href="/browse/current"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0f2d6b] rounded-lg text-sm hover:bg-[#f0f4fb] transition-colors shadow font-semibold"
              >
                <BookOpen className="w-4 h-4" />
                Current Issue
              </a>
              <a
                href="/submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a227] text-white rounded-lg text-sm hover:bg-[#b8911f] transition-colors shadow font-semibold"
              >
                <FileText className="w-4 h-4" />
                Submit Manuscript
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/20 transition-colors font-medium"
              >
                Author Guidelines
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
