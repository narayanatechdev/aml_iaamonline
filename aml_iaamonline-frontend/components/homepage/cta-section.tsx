'use client';

import { BookOpen, FileText } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Readers */}
          <div
            className="rounded-2xl p-8 text-white"
            style={{
              background: 'linear-gradient(135deg, #0f2d6b 0%, #1a3f8f 100%)',
            }}
          >
            <BookOpen className="w-8 h-8 text-[#c9a227] mb-4" />
            <h3 className="text-xl mb-3 font-bold">For Readers</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Access 1,250+ peer-reviewed articles across all areas of materials science — completely free, no subscription required. Stay current with the latest research from 50 countries.
            </p>
            <div className="flex gap-3">
              <a
                href="#browse"
                className="px-4 py-2 bg-white text-[#0f2d6b] rounded-lg text-sm hover:bg-[#f0f4fb] transition-colors font-semibold"
              >
                Current Issue
              </a>
              <a
                href="#archive"
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                Browse Archive
              </a>
            </div>
          </div>

          {/* For Authors */}
          <div
            className="rounded-2xl p-8 text-white"
            style={{
              background: 'linear-gradient(135deg, #7a5c00 0%, #c9a227 100%)',
            }}
          >
            <FileText className="w-8 h-8 text-white/90 mb-4" />
            <h3 className="text-xl mb-3 font-bold">For Authors</h3>
            <p className="text-white/90 text-sm leading-relaxed mb-6">
              Publish your research in a Diamond Open Access journal — free to read, free to publish. Fast peer review, high visibility, and global reach.
            </p>
            <div className="flex gap-3">
              <a
                href="/submit"
                className="px-4 py-2 bg-white text-[#7a5c00] rounded-lg text-sm hover:bg-[#fff9ed] transition-colors font-semibold"
              >
                Submit Now
              </a>
              <a
                href="#guidelines"
                className="px-4 py-2 bg-white/15 border border-white/20 text-white rounded-lg text-sm hover:bg-white/25 transition-colors"
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
