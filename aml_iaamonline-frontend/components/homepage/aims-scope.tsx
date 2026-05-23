'use client';

import { Zap, Globe, Users, TrendingUp } from 'lucide-react';

export function AimsScope() {
  const subjects = [
    { icon: Zap, label: 'Energy Materials' },
    { icon: Globe, label: 'Nanotechnology' },
    { icon: Users, label: 'Biomaterials' },
    { icon: TrendingUp, label: 'Composites' },
  ];

  return (
    <section className="bg-[#f0f4fb] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="text-black mb-3 font-semibold" style={{ fontSize: "1.4rem" }}>
              Aims & Scope
            </h2>
            <p className="text-[#3a4a6a] text-sm leading-relaxed mb-4">
              <em>Advanced Materials Letters</em> is a fully open-access, internationally peer-reviewed journal dedicated to publishing high-quality original research across the entire spectrum of materials science. The journal bridges the gap between fundamental science and applied technology.
            </p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              AML publishes Research Articles, Review Articles, Letters, and Communications addressing synthesis, processing, characterization, properties, and applications of advanced materials.
            </p>
            <a href="#aims" className="inline-flex items-center gap-1 mt-4 text-[#0f2d6b] text-sm hover:underline font-semibold">
              Read full Aims & Scope →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-4 text-center shadow-sm border border-border hover:border-[#0f2d6b]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0f2d6b]/8 flex items-center justify-center mx-auto mb-2 text-[#0f2d6b]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-[#0f2d6b] text-xs font-semibold">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
