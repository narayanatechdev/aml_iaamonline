'use client';

import Link from 'next/link';
import { BookOpen, Check } from 'lucide-react';

const FEATURES = [
  { title: 'Quick, frictionless submission', desc: 'Submit your manuscript in minutes with a guided, conversational form.' },
  { title: 'Transparent peer review', desc: 'Track your work through every stage — from editor screening to decision.' },
  { title: 'Diamond open access', desc: 'Free to publish and free to read. Your research, openly available.' },
];

export function AuthSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0f2d6b] via-[#0d2456] to-[#0a1e4a] text-white">
        {/* decorative shapes */}
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-3xl bg-white/5 rotate-12" />
        <div className="absolute -bottom-24 left-20 w-72 h-72 rounded-3xl bg-[#c9a227]/15 rotate-12" />
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#c9a227] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Advanced Materials Letters</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-7 max-w-sm">
          <h2 className="text-3xl font-bold leading-snug">Publish your research with a modern editorial platform.</h2>
          <ul className="space-y-5">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#c9a227]" />
                </span>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-sm text-white/65 leading-relaxed">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} Advanced Materials Letters · IAAM
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
