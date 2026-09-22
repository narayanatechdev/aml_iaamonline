'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  FileText,
  Globe,
  Headphones,
  Library,
  PlayCircle,
  Search,
  type LucideIcon,
} from 'lucide-react';

interface Publication {
  tab: string;
  title: string;
  short: string;
  text: string;
  /** Only set where the title is actually published; the rest read "Coming soon". */
  link?: string;
  href?: string;
  icon: LucideIcon;
  /** Tailwind gradient for the card's art, standing in until photography exists. */
  art: string;
  /** Artwork for the featured card, where the title has its own. */
  image?: string;
}

const PUBLICATIONS: Publication[] = [
  {
    tab: 'Journals',
    title: 'Advanced Materials Letters',
    short: 'AML',
    text: 'Our flagship journal. Short, rigorous research papers and reviews, led by invited articles from proven experts and IAAM Fellows.',
    link: 'Explore the journal',
    href: '/advanced-materials-letters',
    icon: FileText,
    art: 'from-[#0B2C6B] via-[#0A1A45] to-[#06122F]',
    image: '/hub/aml-featured.webp',
  },
  {
    tab: 'Proceedings',
    title: 'Advanced Materials Proceedings',
    short: 'AMP',
    text: 'Peer-reviewed papers from IAAM congresses and symposia, organised by event and session so delegates can find their work quickly.',
    link: 'Browse proceedings',
    href: '/advanced-materials-proceedings',
    icon: FileText,
    art: 'from-[#27476F] via-[#16293F] to-[#0C1726]',
  },
  {
    tab: 'Lecture Series',
    title: 'Advanced Materials Lecture Series',
    short: 'AMLS',
    text: 'Distinguished lectures published as citable records: video, slides, transcript and DOI.',
    icon: Library,
    art: 'from-[#1E4E63] via-[#16323F] to-[#0B1A21]',
  },
  {
    tab: 'Video',
    title: 'Advanced Materials Video Proceedings',
    short: 'AMVP',
    text: 'Recorded congress presentations, keynotes and panel discussions, linked to the written paper where one exists.',
    icon: PlayCircle,
    art: 'from-[#2B3B63] via-[#1A2340] to-[#0D1224]',
  },
  {
    tab: 'WebTalks',
    title: 'Advanced Materials WebTalks',
    short: 'AMWT',
    text: 'Free live online talks with audience questions. Recordings stay available to members afterwards.',
    icon: Headphones,
    art: 'from-[#1F4C57] via-[#153238] to-[#0A1A1E]',
  },
  {
    tab: 'Books & Reports',
    title: 'Books & Reports',
    short: 'B&R',
    text: 'Monographs, edited volumes and handbooks, plus IAAM technology outlooks and policy papers.',
    icon: BookOpen,
    art: 'from-[#3A3F55] via-[#242838] to-[#12141F]',
  },
];

const TABS = ['All', ...PUBLICATIONS.map((p) => p.tab)];

/** Every term here returns articles from the live search — no empty result pages. */
const POPULAR_SEARCHES = ['Graphene', 'Batteries', 'Perovskite', 'Nanomaterials'];

const FLAGSHIP_POINTS = [
  { icon: BookOpen, label: 'High-impact', text: 'research' },
  { icon: Globe, label: 'Global', text: 'author community' },
  { icon: BarChart3, label: 'Real-world', text: 'impact' },
];

function FeaturedCard({ publication }: { publication: Publication }) {
  const isFlagship = publication.short === 'AML';

  return (
    <div className={`relative isolate overflow-hidden rounded-2xl bg-gradient-to-br ${publication.art} text-white p-8 md:p-10 h-full flex flex-col`}>
      {publication.image && (
        <>
          <img
            src={publication.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 w-full h-full object-cover object-right"
          />
          {/* Holds the copy legible over the brightest part of the artwork. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#06122F_0%,rgba(6,18,47,0.92)_38%,rgba(6,18,47,0.45)_70%,rgba(6,18,47,0.25)_100%)]"
          />
        </>
      )}
      <span className="inline-flex self-start items-center px-3 py-1.5 rounded-lg bg-white text-[#0A1A45] text-[12px] font-bold tracking-wide mb-5">
        {publication.short}
      </span>

      <h3 className="font-hub-display font-bold text-[30px] sm:text-[38px] leading-[1.1] max-w-[14ch] mb-3">
        {publication.title}
      </h3>
      <p className="text-[15px] text-[#C5CEE3] leading-relaxed max-w-[46ch] mb-7">{publication.text}</p>

      {isFlagship && (
        <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8">
          {FLAGSHIP_POINTS.map((point) => (
            <div key={point.label} className="flex items-center gap-2.5">
              <point.icon className="w-5 h-5 text-[#A7F3D0] flex-shrink-0" strokeWidth={1.75} />
              <p className="text-[13px] leading-tight">
                <span className="block font-semibold text-white">{point.label}</span>
                <span className="block text-[#A9B6D6]">{point.text}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto">
        {publication.href ? (
          <a
            href={publication.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#34D399] text-[#0A1A45] text-[14.5px] font-bold hover:bg-[#A7F3D0] transition-colors"
          >
            {publication.link} <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <span className="inline-flex items-center px-5 py-2.5 rounded-lg border border-white/30 text-[13px] font-semibold text-[#C5CEE3]">
            Coming soon
          </span>
        )}
      </div>

      <p
        aria-hidden="true"
        className="hidden xl:block absolute right-8 bottom-9 font-hub-display text-[19px] leading-[1.35] text-white/70 text-left border-l border-white/20 pl-5"
      >
        Ideas
        <br />
        Materials
        <br />
        A Better
        <br />
        Tomorrow
      </p>
    </div>
  );
}

function PublicationCard({ publication }: { publication: Publication }) {
  const Card = publication.href ? 'a' : 'div';

  return (
    <Card
      {...(publication.href ? { href: publication.href } : {})}
      className="group rounded-[10px] border border-[#DCE3F0] bg-white overflow-hidden flex flex-col hover:shadow-md transition-shadow"
    >
      <div className={`relative h-[120px] bg-gradient-to-br ${publication.art}`}>
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-[#1546E0] text-[11.5px] font-bold tracking-wide">
          {publication.short}
        </span>
        <span className="absolute -bottom-4 right-4 w-9 h-9 rounded-full bg-white border border-[#DCE3F0] flex items-center justify-center text-[#0B1F4D]">
          <publication.icon className="w-4 h-4" strokeWidth={1.75} />
        </span>
      </div>

      <div className="p-5 pt-6 flex flex-col flex-1">
        <h3 className="font-hub-display font-bold text-[15.5px] text-[#0B1F4D] leading-snug mb-2">
          {publication.title}
        </h3>
        <p className="text-[12.5px] text-[#3D4A66] leading-relaxed flex-1">{publication.text}</p>
        {publication.href ? (
          <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1546E0]">
            {publication.link} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="mt-3 text-[12.5px] font-semibold text-[#8B98B8]">Coming soon</span>
        )}
      </div>
    </Card>
  );
}

export function OurPublications() {
  const [activeTab, setActiveTab] = useState('All');

  const featured = activeTab === 'All' ? PUBLICATIONS[0] : PUBLICATIONS.find((p) => p.tab === activeTab)!;
  const rest = PUBLICATIONS.filter((p) => p !== featured);

  return (
    <section className="font-hub-body relative isolate bg-[#F6F8FC] overflow-hidden">
      <img
        src="/hub/publications-background.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 w-full h-full object-cover"
      />
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-[#DCE3F0] mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-current={activeTab === tab ? 'true' : undefined}
              className={`pb-3 text-[13.5px] font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? 'border-[#10B981] text-[#0B1F4D]'
                  : 'border-transparent text-[#5a6a8a] hover:text-[#1546E0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-10 items-stretch">
          <div>
            <h2 className="font-hub-display font-bold text-[40px] leading-[1.05] text-[#0B1F4D] mb-4">
              Our Publications
            </h2>
            <p className="font-hub-display font-semibold text-[19px] text-[#2B3853] mb-3">
              Six titles, one search, one account.
            </p>
            <p className="text-[14.5px] text-[#5a6a8a] leading-relaxed mb-7">
              Access peer-reviewed research, expert insights and global knowledge platforms — advancing
              materials science for a more sustainable tomorrow.
            </p>

            <form action="/search" className="relative">
              <label htmlFor="publications-search" className="sr-only">
                Search publications, authors and keywords
              </label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B98B8]" />
              <input
                id="publications-search"
                name="q"
                type="search"
                placeholder="Search publications, authors, keywords…"
                className="w-full h-14 pl-11 pr-14 rounded-xl border border-[#DCE3F0] bg-white text-[14px] text-[#14213D] placeholder:text-[#8B98B8] focus:outline-none focus:ring-2 focus:ring-[#1546E0]/20 focus:border-[#1546E0]"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0B1F4D] text-white flex items-center justify-center hover:bg-[#1546E0] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[12px] text-[#8B98B8]">Popular searches:</span>
              {POPULAR_SEARCHES.map((term) => (
                <a
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1.5 rounded-full bg-[#EAF1FD] text-[12px] font-medium text-[#2B3853] hover:bg-[#DCE7FA] transition-colors"
                >
                  {term}
                </a>
              ))}
            </div>
          </div>

          <FeaturedCard publication={featured} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
          {rest.map((publication) => (
            <PublicationCard key={publication.short} publication={publication} />
          ))}
        </div>
      </div>
    </section>
  );
}
