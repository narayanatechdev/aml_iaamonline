'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Heart, Shield, Globe, CheckCircle, Users, Target } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

const DEFAULT_VALUES = [
  {
    title: 'Integrity',
    description: 'Unwavering commitment to ethical standards and honest reporting',
  },
  {
    title: 'Excellence',
    description: 'Pursuing the highest quality in research and publication standards',
  },
  {
    title: 'Accessibility',
    description:
      'Serving the global research community through IAAM membership and subscription access',
  },
];

const DEFAULT_INTEGRITY_ITEMS = [
  { text: 'Zero tolerance for research misconduct including plagiarism and data fabrication' },
  { text: 'Transparent disclosure of conflicts of interest and funding sources' },
  { text: 'Adherence to international standards for research ethics' },
  { text: 'Support for reproducible research practices' },
];

const DEFAULT_EXCELLENCE_ITEMS = [
  { text: 'Expert peer review by leading researchers in relevant fields' },
  { text: 'Fair and unbiased evaluation of all submissions' },
  { text: 'Constructive feedback to help authors improve their work' },
  { text: 'Timely decision-making to serve the research community' },
];

const DEFAULT_DIVERSITY_ITEMS = [
  { text: 'Global representation on editorial board and reviewer pool' },
  { text: 'Support for researchers from developing countries' },
  { text: 'Equal consideration regardless of institutional affiliation' },
  { text: 'Language assistance for non-native English speakers' },
];

const DEFAULT_OPENSCIENCE_ITEMS = [
  { text: 'Timely worldwide availability of all published articles' },
  { text: 'Support for open data and reproducible research' },
  { text: 'Encouragement of preprint sharing and collaboration' },
  { text: 'Commitment to long-term preservation of scientific record' },
];

const DEFAULT_PROMISE_AUTHORS = [
  { text: 'Fair, timely, and constructive peer review' },
  { text: 'Transparent editorial processes' },
  { text: 'Maximum visibility for your research' },
  { text: 'No article processing charges for authors' },
  { text: 'Support throughout the publication journey' },
];

const DEFAULT_PROMISE_READERS = [
  { text: 'High-quality, rigorously reviewed content' },
  { text: 'Access via IAAM membership or subscription' },
  { text: 'Reliable and trustworthy scientific information' },
  { text: 'Commitment to editorial independence' },
  { text: 'Continuous improvement and innovation' },
];

export default function EditorialValuesStatic({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'Editorial Values Statement');
  const subtitle = pickText(
    content,
    'subtitle',
    'Our commitment to integrity, excellence, and open science',
  );
  const coreValuesTitle = pickText(content, 'core_values_title', 'Our Core Values');
  const detailTitle = pickText(content, 'detail_title', 'Our Editorial Values in Detail');
  const integrityTitle = pickText(content, 'integrity_title', 'Scientific Integrity');
  const integrityBody = pickText(
    content,
    'integrity_body',
    'We are committed to maintaining the highest standards of scientific integrity throughout the publication process. This includes rigorous peer review, transparent reporting of methodology and results, and strict adherence to ethical guidelines.',
  );
  const excellenceTitle = pickText(content, 'excellence_title', 'Editorial Excellence');
  const excellenceBody = pickText(
    content,
    'excellence_body',
    'Our editorial team is dedicated to publishing only the highest quality research that advances the field of materials science. We maintain rigorous standards while providing constructive feedback to authors.',
  );
  const diversityTitle = pickText(content, 'diversity_title', 'Diversity & Inclusion');
  const diversityBody = pickText(
    content,
    'diversity_body',
    'We actively promote diversity and inclusion in all aspects of our publication. This includes diverse representation on our editorial board, fair treatment of authors from all backgrounds, and commitment to global accessibility.',
  );
  const openScienceTitle = pickText(content, 'openscience_title', 'Open Science Commitment');
  const openScienceBody = pickText(
    content,
    'openscience_body',
    'We are committed to the principles of open science, supporting the dissemination of research to advance human knowledge and address global challenges. The journal does not charge authors article processing charges.',
  );
  const promiseTitle = pickText(
    content,
    'promise_title',
    'Our Promise to the Scientific Community',
  );
  const promiseAuthorsTitle = pickText(content, 'promise_authors_title', 'To Authors');
  const promiseReadersTitle = pickText(content, 'promise_readers_title', 'To Readers');
  const quote = pickText(
    content,
    'quote',
    'We believe that scientific publishing should serve the global research community, advancing knowledge and fostering collaboration across all boundaries.',
  );
  const quoteAuthor = pickText(
    content,
    'quote_author',
    '— Advanced Materials Letters Editorial Team',
  );

  const values = pickList<{ title: string; description: string }>(
    content,
    'values',
    DEFAULT_VALUES,
    3,
  );
  const integrityItems = pickList<{ text: string }>(
    content,
    'integrity_items',
    DEFAULT_INTEGRITY_ITEMS,
  );
  const excellenceItems = pickList<{ text: string }>(
    content,
    'excellence_items',
    DEFAULT_EXCELLENCE_ITEMS,
  );
  const diversityItems = pickList<{ text: string }>(
    content,
    'diversity_items',
    DEFAULT_DIVERSITY_ITEMS,
  );
  const openScienceItems = pickList<{ text: string }>(
    content,
    'openscience_items',
    DEFAULT_OPENSCIENCE_ITEMS,
  );
  const promiseAuthors = pickList<{ text: string }>(
    content,
    'promise_authors',
    DEFAULT_PROMISE_AUTHORS,
  );
  const promiseReaders = pickList<{ text: string }>(
    content,
    'promise_readers',
    DEFAULT_PROMISE_READERS,
  );

  // Icons fixed per card: Shield → Integrity, Target → Excellence, Globe → Accessibility
  const valueIcons = [
    <Shield key="shield" className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />,
    <Target key="target" className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />,
    <Globe key="globe" className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />,
  ];
  const valueBgs = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50'];

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Editorial Values Statement' },
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-700">{subtitle}</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Core Values */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{coreValuesTitle}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div key={i} className={`text-center p-6 ${valueBgs[i] ?? 'bg-gray-50'} rounded-lg`}>
                  {valueIcons[i]}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600">{v.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Values */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">{detailTitle}</h2>

            <div className="space-y-8">
              {/* Scientific Integrity */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-[#0f2d6b]" />
                  {integrityTitle}
                </h3>
                <div className="pl-9 space-y-3">
                  <CmsRichText value={integrityBody} className="text-gray-700 leading-relaxed" />
                  <ul className="space-y-2">
                    {integrityItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Editorial Excellence */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#0f2d6b]" />
                  {excellenceTitle}
                </h3>
                <div className="pl-9 space-y-3">
                  <CmsRichText value={excellenceBody} className="text-gray-700 leading-relaxed" />
                  <ul className="space-y-2">
                    {excellenceItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Diversity & Inclusion */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#0f2d6b]" />
                  {diversityTitle}
                </h3>
                <div className="pl-9 space-y-3">
                  <CmsRichText value={diversityBody} className="text-gray-700 leading-relaxed" />
                  <ul className="space-y-2">
                    {diversityItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Open Science Commitment */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#0f2d6b]" />
                  {openScienceTitle}
                </h3>
                <div className="pl-9 space-y-3">
                  <CmsRichText value={openScienceBody} className="text-gray-700 leading-relaxed" />
                  <ul className="space-y-2">
                    {openScienceItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Our Promise */}
          <div className="bg-[#0f2d6b] text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">{promiseTitle}</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">{promiseAuthorsTitle}</h3>
                <ul className="space-y-2 text-white/90">
                  {promiseAuthors.map((item, i) => (
                    <li key={i}>• {item.text}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{promiseReadersTitle}</h3>
                <ul className="space-y-2 text-white/90">
                  {promiseReaders.map((item, i) => (
                    <li key={i}>• {item.text}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-lg">
              <blockquote className="text-white/90 italic text-lg leading-relaxed">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <div className="text-white font-medium mt-4">{quoteAuthor}</div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
