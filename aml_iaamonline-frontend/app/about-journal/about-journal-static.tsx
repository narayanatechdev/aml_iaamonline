'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { BookOpen, Users, Award, Globe, FileText, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { SectionBody } from '@/components/shared/section-body';
import type { PageContentData } from '@/lib/page-layouts';

type CardItem = { title: string; description: string };
type FeatureItem = { title: string; description: string };

const CARD_LINKS: { href: string; Icon: LucideIcon }[] = [
  { href: '/about-journal/aims-scope', Icon: FileText },
  { href: '/about-journal/editorial-board', Icon: Users },
  { href: '/about-journal/indexing', Icon: Globe },
  { href: '/about-journal/ethics-process', Icon: CheckCircle },
  { href: '/about-journal/review-process', Icon: Award },
  { href: '/contact', Icon: Users },
];

const DEFAULT_CARDS: CardItem[] = [
  { title: 'Aims & Scope', description: "Learn about our journal's objectives, research areas, and publication standards." },
  { title: 'Editorial Board', description: 'Meet our distinguished editorial board members and their expertise areas.' },
  { title: 'Indexing', description: 'View the databases and indexing services that include our journal.' },
  { title: 'Ethics & Process', description: 'Information about our publication ethics and editorial processes.' },
  { title: 'Review Process', description: 'Understand our rigorous peer review and quality assurance processes.' },
  { title: 'Contact Us', description: 'Get in touch with our editorial team for inquiries and support.' },
];

const DEFAULT_FEATURES: FeatureItem[] = [
  { title: 'Access & Membership', description: 'Available through IAAM membership and subscription; no author processing charges' },
  { title: 'Rigorous Peer Review', description: 'Expert review process ensuring high-quality publications' },
  { title: 'International Scope', description: 'Global reach with international editorial board' },
  { title: 'Fast Publication', description: 'Efficient review and publication process' },
  { title: 'Wide Indexing', description: 'Indexed in major scientific databases' },
  { title: 'High Impact', description: 'Publishing influential research in materials science' },
];

export default function AboutJournalPage({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'About Journal');
  const subtitle = pickText(content, 'subtitle', 'Learn more about Advanced Materials Letters and our commitment to materials science research');
  const overviewP1 = pickText(content, 'overview_p1', 'Advanced Materials Letters (AML) is an international, peer-reviewed journal that covers all aspects of materials science and engineering. Established to promote cutting-edge research in advanced materials, AML serves as a premier platform for researchers, scientists, and engineers worldwide.');
  const overviewP2 = pickText(content, 'overview_p2', 'The journal is committed to publishing high-quality research articles, reviews, and communications that advance our understanding of materials properties, synthesis, characterization, and applications. Advanced Materials Letters is available through IAAM membership and subscription.');
  const cards = pickList<CardItem>(content, 'cards', DEFAULT_CARDS, 6);
  const features = pickList<FeatureItem>(content, 'features', DEFAULT_FEATURES, 6);
  const extraSections = pickList<{ title: string; body: string }>(content, 'extra_sections', []).filter(
    (s) => (s.title ?? '').trim() !== '' || (s.body ?? '').trim() !== ''
  );

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[{ label: title }]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-700">
            {subtitle}
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Journal Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Journal Overview</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {overviewP1}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {overviewP2}
              </p>
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cards.map((card, i) => {
              const { href, Icon } = CARD_LINKS[i];
              return (
                <Link key={href} href={href} className="group">
                  <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group-hover:border-[#0f2d6b]/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#0f2d6b]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#0f2d6b] group-hover:text-[#0d2560]">{card.title}</h3>
                    </div>
                    <p className="text-gray-600">
                      {card.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {features.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {features.slice(3, 6).map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin-created sections (Additional sections in the page editor) */}
          {extraSections.map((section, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-8 mt-8">
              {section.title && (
                <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">{section.title}</h2>
              )}
              <SectionBody body={section.body ?? ''} />
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
