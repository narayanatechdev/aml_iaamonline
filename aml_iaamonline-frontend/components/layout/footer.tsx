'use client';

import { BookOpen, X, MailIcon, Rss } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-100 text-black mt-16">
      {/* Newsletter bar */}
      <div className="bg-gray-200 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Rss className="w-5 h-5 text-black" />
            <span className="text-sm font-semibold text-black">Subscribe to Journal Newsletter & Receive New Issue Alerts</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 sm:w-64 px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20"
            />
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors whitespace-nowrap font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#c9a227] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm leading-tight font-bold text-black">Advanced Materials Letters</div>
                <div className="text-xs text-gray-700 leading-tight">IAAM Open Access Journal</div>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-4">
              An international, peer-reviewed, diamond open access journal covering all aspects of
              materials science and engineering.
            </p>
            <div className="flex gap-3">
              <a
                href="#twitter"
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
              >
                <X className="w-3.5 h-3.5" />
              </a>
              <a
                href="#rss"
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
              >
                <Rss className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:info@iaamonline.org"
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
              >
                <MailIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm mb-4 text-black font-bold">About</h4>
            <ul className="space-y-2">
              {[
                { label: 'Aims & Scope', href: '/about#aims' },
                { label: 'Editorial Board', href: '/about#board' },
                { label: 'Indexing & Abstracting', href: '/about#indexing' },
                { label: 'Publication History', href: '/about#history' },
                { label: 'Contact Us', href: '/about#contact' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-xs text-gray-700 hover:text-black transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-sm mb-4 text-black font-bold">Browse Content</h4>
            <ul className="space-y-2">
              {[
                { label: 'Current Issue', href: '/browse' },
                { label: 'Archive / By Issue', href: '/browse' },
                { label: 'By Subject', href: '/browse' },
                { label: 'By Author', href: '/browse' },
                { label: 'News & Announcements', href: '/news' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-xs text-gray-700 hover:text-black transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Author Resources */}
          <div>
            <h4 className="text-sm mb-4 text-black font-bold">Author Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Submission Guidelines', href: '/author-resources' },
                { label: 'Peer Review Process', href: '/author-resources' },
                { label: 'Publication Ethics', href: '/author-resources' },
                { label: 'Submit Manuscript', href: '/submit' },
                { label: 'Track Submission', href: '/track' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-xs text-gray-700 hover:text-black transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700">
            © 2026 IAAM – International Association of Advanced Materials. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-700">
            <a href="/privacy-policy" className="hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-use" className="hover:text-black transition-colors">
              Terms of Use
            </a>
            <a href="/cookie-policy" className="hover:text-black transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
