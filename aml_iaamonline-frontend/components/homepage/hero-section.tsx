'use client';

import { Search, BookOpen, FileText, Award } from 'lucide-react';

const HERO_IMAGE = "https://images.unsplash.com/photo-1770320742319-6aa889b3130b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRlcmlhbHMlMjBzY2llbmNlJTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3MjcxMDI3OHww&ixlib=rb-4.0.3&q=80&w=1080";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0f2d6b]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d6b]/95 via-[#0f2d6b]/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-28">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a227]/20 border border-[#c9a227]/40 text-[#c9a227] text-xs mb-6 font-semibold">
            <Award className="w-3.5 h-3.5" />
            Diamond Open Access · No Article Processing Charges
          </div>

          {/* Main heading */}
          <h1 className="text-white mb-3 font-serif" style={{ fontSize: "2.4rem", fontWeight: 700, lineHeight: 1.2 }}>
            Advanced Materials Letters
          </h1>

          {/* Subtitle and metadata */}
          <p className="text-white/80 text-lg mb-2">
            International Diamond Open Access Journal in Materials Science
          </p>
          <p className="text-white/60 text-sm mb-8">
            ISSN: 0976-3961 | eISSN: 1998-0140 | Impact Factor: 3.82
          </p>

          {/* Search box */}
          <div className="relative mb-8 max-w-lg">
            <input
              type="text"
              placeholder="Search by article title, author, keyword, or DOI..."
              className="w-full pl-5 pr-14 py-3.5 rounded-xl bg-white text-[#0f1a2e] text-sm placeholder:text-[#9aabcc] focus:outline-none shadow-xl"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-[#0f2d6b] flex items-center justify-center hover:bg-[#0d2560] transition-colors">
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="/browse"
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
    </section>
  );
}
