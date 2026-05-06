'use client';

import { BookOpen, Globe, Award, Users, CheckCircle } from 'lucide-react';

const EDITORIAL_BOARD = [
  {
    id: 1,
    name: 'Prof. Dr. Maria Garcia',
    role: 'Editor-in-Chief',
    affiliation: 'University of Barcelona, Spain',
    expertise: ['Materials Science', 'Nanotechnology'],
    photo: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=0f2d6b&color=fff&size=56',
  },
  {
    id: 2,
    name: 'Prof. Dr. Wei Chen',
    role: 'Managing Editor',
    affiliation: 'Tsinghua University, China',
    expertise: ['Energy Materials', 'Composites'],
    photo: 'https://ui-avatars.com/api/?name=Wei+Chen&background=0f2d6b&color=fff&size=56',
  },
  {
    id: 3,
    name: 'Prof. Dr. James Peterson',
    role: 'Associate Editor',
    affiliation: 'MIT, USA',
    expertise: ['Biomaterials', 'Polymer Science'],
    photo: 'https://ui-avatars.com/api/?name=James+Peterson&background=0f2d6b&color=fff&size=56',
  },
  {
    id: 4,
    name: 'Prof. Dr. Yuki Tanaka',
    role: 'Associate Editor',
    affiliation: 'Tokyo Institute of Technology, Japan',
    expertise: ['2D Materials', 'Electronic Materials'],
    photo: 'https://ui-avatars.com/api/?name=Yuki+Tanaka&background=0f2d6b&color=fff&size=56',
  },
  {
    id: 5,
    name: 'Prof. Dr. Anna Mueller',
    role: 'Associate Editor',
    affiliation: 'ETH Zurich, Switzerland',
    expertise: ['Composites', 'Sustainable Materials'],
    photo: 'https://ui-avatars.com/api/?name=Anna+Mueller&background=0f2d6b&color=fff&size=56',
  },
  {
    id: 6,
    name: 'Prof. Dr. Rajesh Kumar',
    role: 'Associate Editor',
    affiliation: 'IIT Delhi, India',
    expertise: ['Nanotechnology', 'Materials Characterization'],
    photo: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0f2d6b&color=fff&size=56',
  },
];

const INDEXING_DATABASES = [
  'Web of Science',
  'Scopus',
  'DOAJ',
  'Google Scholar',
  'PubMed Central',
];

const JOURNAL_INFO = {
  issn: '0976-3961',
  eISSN: '1998-0140',
  currentVolume: '25',
  currentYear: '2025',
  impactFactor: '3.82',
  hIndex: '42',
};

const METRICS = {
  totalArticles: 1250,
  countries: 50,
  annualReadership: '150K+',
};

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-10 border-b border-border pb-8">
        <h1 className="text-[#0f2d6b] mb-2 font-bold" style={{ fontSize: '1.8rem' }}>
          About the Journal
        </h1>
        <p className="text-[#5a6a8a] text-sm">
          Advanced Materials Letters — IAAM's flagship open-access publication
        </p>
      </div>

      {/* Aims & Scope */}
      <section id="aims" className="mb-14 scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6 font-bold" style={{ fontSize: '1.3rem' }}>
          Aims & Scope
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4 text-[#3a4a6a] text-sm leading-relaxed">
            <p>
              <strong>Advanced Materials Letters (AML)</strong> is an international, peer-reviewed,
              Diamond Open Access scientific journal published by the International Association of
              Advanced Materials (IAAM). Since its founding in 2010, AML has established itself as a
              leading platform for disseminating high-impact research across all domains of materials
              science and engineering.
            </p>
            <p>
              The journal covers a broad interdisciplinary scope including, but not limited to:
              materials chemistry, solid-state physics, biomaterials and biomedical engineering,
              energy harvesting and storage materials, nanotechnology, advanced composites, 2D
              materials and heterostructures, computational materials science, surface science and
              coatings, electronic and photonic materials, smart and functional materials.
            </p>
            <p>
              AML publishes original research papers, comprehensive review articles, rapid
              communications (Letters), and perspectives. All published content is freely available
              online without subscription barriers, supporting the global open science movement and
              maximizing research impact.
            </p>
            <p>
              The journal operates under a <strong>Diamond Open Access</strong> model — there are no
              Article Processing Charges (APCs) for authors, and no subscription fees for readers.
              Access is open to all.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-[#f0f4fb] rounded-xl p-5 border border-border">
              <h4 className="text-[#0f2d6b] mb-3 font-bold">Journal Details</h4>
              <dl className="space-y-2 text-sm">
                {[
                  { label: 'ISSN (Print)', value: JOURNAL_INFO.issn },
                  { label: 'eISSN (Online)', value: JOURNAL_INFO.eISSN },
                  { label: 'Current Volume', value: `Vol. ${JOURNAL_INFO.currentVolume} (${JOURNAL_INFO.currentYear})` },
                  { label: 'Issues/Year', value: '6' },
                  { label: 'Impact Factor', value: JOURNAL_INFO.impactFactor },
                  { label: 'h-Index', value: '42' },
                  { label: 'Access Model', value: 'Diamond Open Access' },
                  { label: 'Publisher', value: 'IAAM, Sweden' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between gap-2">
                    <dt className="text-[#5a6a8a]">{item.label}</dt>
                    <dd className="text-[#0f1a2e] font-semibold">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Board */}
      <section id="board" className="mb-14 scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6 font-bold" style={{ fontSize: '1.3rem' }}>
          Editorial Board
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EDITORIAL_BOARD.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#0f2d6b]/20 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-[#0f1a2e] text-sm leading-tight mb-0.5 font-bold">
                    {member.name}
                  </h3>
                  <p className="text-[#c9a227] text-xs mb-1 font-semibold">{member.role}</p>
                  <p className="text-[#5a6a8a] text-xs leading-snug mb-2">{member.affiliation}</p>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((e) => (
                      <span
                        key={e}
                        className="px-2 py-0.5 bg-[#f0f4fb] text-[#0f2d6b] text-[10px] rounded-full border border-[#0f2d6b]/10"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Indexing */}
      <section id="indexing" className="mb-14 scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6 font-bold" style={{ fontSize: '1.3rem' }}>
          Indexing & Abstracting
        </h2>
        <p className="text-[#3a4a6a] text-sm leading-relaxed mb-6">
          Advanced Materials Letters is indexed and abstracted in major international databases,
          ensuring maximum visibility and discoverability of published research.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {INDEXING_DATABASES.map((db) => (
            <div
              key={db}
              className="bg-white rounded-xl border border-border p-4 text-center hover:border-[#0f2d6b]/30 hover:shadow-sm transition-all"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
              <span className="text-[#0f1a2e] text-xs font-semibold">{db}</span>
            </div>
          ))}
        </div>
      </section>

      {/* History & Mission */}
      <section id="history" className="mb-14 scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6 font-bold" style={{ fontSize: '1.3rem' }}>
          Publication History & Mission
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-[#3a4a6a] text-sm leading-relaxed">
            <p>
              Advanced Materials Letters was launched in 2010 by the International Association of
              Advanced Materials (IAAM), headquartered in Stockholm, Sweden. IAAM was founded with
              the mission to accelerate the development of advanced materials technologies globally
              and foster international scientific collaboration.
            </p>
            <p>
              Since its inaugural issue, AML has published over {METRICS.totalArticles.toLocaleString()}{' '}
              articles from authors in {METRICS.countries}+ countries. The journal has grown to
              become a trusted venue for materials scientists and engineers across academia,
              industry, and government research institutes.
            </p>
            <p>
              Committed to open science, AML adopted the Diamond Open Access model in 2015,
              eliminating all financial barriers for both authors and readers. This decision has
              dramatically increased the global reach and impact of the journal.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, value: '2010', label: 'Year Founded' },
              { icon: Globe, value: `${METRICS.countries}+`, label: 'Countries Represented' },
              { icon: Users, value: METRICS.annualReadership, label: 'Annual Readership' },
              { icon: Award, value: JOURNAL_INFO.impactFactor, label: 'Impact Factor' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-[#0f2d6b] to-[#1a3f8f] rounded-xl p-5 text-white text-center"
                >
                  <div className="flex justify-center mb-2 text-[#c9a227]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.2 }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6 font-bold" style={{ fontSize: '1.3rem' }}>
          Contact Us
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              label: 'Editorial Office',
              value: 'editor@iaamonline.org',
              type: 'email',
              desc: 'For manuscript inquiries and editorial matters',
            },
            {
              label: 'Submissions',
              value: 'submit@advmattlett.com',
              type: 'email',
              desc: 'For manuscript submission support',
            },
            {
              label: 'Publisher',
              value: 'IAAM, Linnaeus University, Sweden',
              type: 'text',
              desc: 'International Association of Advanced Materials',
            },
          ].map((c) => (
            <div key={c.label} className="bg-[#f0f4fb] rounded-xl p-5 border border-border">
              <h4 className="text-[#0f2d6b] mb-1 text-sm font-bold">{c.label}</h4>
              <p className="text-xs text-[#5a6a8a] mb-2">{c.desc}</p>
              {c.type === 'email' ? (
                <a
                  href={`mailto:${c.value}`}
                  className="text-[#0f2d6b] text-sm hover:underline font-semibold"
                >
                  {c.value}
                </a>
              ) : (
                <span className="text-[#0f1a2e] text-sm font-semibold">{c.value}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
