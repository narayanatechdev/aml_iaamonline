"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Search, Globe, CheckCircle, Star, TrendingUp, Link, Award } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

type IndexEntry = { name: string; provider: string; description: string; coverage: string; status: string; since: string };
type MetricEntry = { metric: string; value: string; provider: string; description: string };
type StatEntry = { value: string; label: string };
type TextEntry = { text: string };

const DEFAULT_MAJOR_INDEXES: IndexEntry[] = [
  { name: 'Scopus (Historical)', provider: 'Elsevier', description: 'Indexed in Scopus 2010–2016', coverage: 'Global', status: 'Historical', since: '2010' },
  { name: 'CrossRef', provider: 'CrossRef', description: 'All articles assigned a CrossRef Digital Object Identifier (DOI)', coverage: 'International', status: 'Active', since: '2010' },
  { name: 'Google Scholar', provider: 'Google', description: 'Freely discoverable via Google Scholar academic search', coverage: 'Global', status: 'Active', since: '2010' },
];

// Icons per major index slot — hard-coded
const MAJOR_INDEX_ICONS = [
  <Database key={0} className="w-5 h-5 text-blue-600" />,
  <Globe key={1} className="w-5 h-5 text-green-600" />,
  <Search key={2} className="w-5 h-5 text-orange-600" />,
];

const DEFAULT_METRICS: MetricEntry[] = [
  { metric: 'Publishing Since', value: '2010', provider: 'IAAM', description: 'Volumes 1–17 published across all years' },
  { metric: 'Countries', value: '75+', provider: 'Author affiliations', description: 'Authors from more than 75 countries worldwide' },
  { metric: 'h-index', value: '42', provider: 'Google Scholar', description: 'Largest number h such that h articles have at least h citations' },
  { metric: 'Articles', value: '2,000+', provider: 'All volumes', description: 'Peer-reviewed articles published since 2010' },
];

const DEFAULT_AUTHOR_BENEFITS: TextEntry[] = [
  { text: 'Global research visibility' },
  { text: 'Enhanced citation potential' },
  { text: 'Academic career advancement' },
  { text: 'International collaboration opportunities' },
  { text: 'Research impact measurement' },
];

const DEFAULT_READER_BENEFITS: TextEntry[] = [
  { text: 'Easy access to quality research' },
  { text: 'Comprehensive search capabilities' },
  { text: 'Citation tracking and analysis' },
  { text: 'Related article discovery' },
  { text: 'Research trend identification' },
];

const DEFAULT_STATS: StatEntry[] = [
  { value: '2010', label: 'Publishing Since' },
  { value: '75+', label: 'Countries (Authors)' },
  { value: '2,000+', label: 'Articles Published' },
];

const DEFAULT_ADDITIONAL_DBS: TextEntry[] = [
  { text: 'Chemical Abstracts Service (CAS)' },
  { text: 'Semantic Scholar' },
  { text: 'Dimensions' },
  { text: 'BASE (Bielefeld Academic Search Engine)' },
  { text: "Ulrich's Periodicals Directory" },
  { text: 'JournalGuide' },
  { text: 'Academia.edu' },
  { text: 'ResearchGate' },
];

const DEFAULT_FOR_AUTHORS_TIPS: TextEntry[] = [
  { text: 'Use relevant keywords in title and abstract' },
  { text: 'Include complete author affiliations' },
  { text: 'Provide comprehensive references' },
  { text: 'Follow journal formatting guidelines' },
];

export default function IndexingStatic({
  content = {},
  flat = false,
}: {
  content?: PageContentData;
  /** true = flat card styling used on /about-journal/indexing */
  flat?: boolean;
}) {
  const title = pickText(content, 'title', 'Indexing & Abstracting');
  const subtitle = pickText(content, 'subtitle', 'Advanced Materials Letters is indexed and abstracted by leading scientific databases worldwide, ensuring global visibility and accessibility of published research.');

  const majorDbsTitle = pickText(content, 'major_dbs_title', 'Major Scientific Databases');
  const majorIndexes = pickList<IndexEntry>(content, 'major_indexes', DEFAULT_MAJOR_INDEXES, 3);

  const metricsTitle = pickText(content, 'metrics_title', 'Citation Metrics & Impact');
  const metrics = pickList<MetricEntry>(content, 'metrics', DEFAULT_METRICS, 4);

  const benefitsTitle = pickText(content, 'benefits_title', 'Benefits for Authors & Readers');
  const authorBenefitsTitle = pickText(content, 'author_benefits_title', 'For Authors');
  const authorBenefits = pickList<TextEntry>(content, 'author_benefits', DEFAULT_AUTHOR_BENEFITS);
  const readerBenefitsTitle = pickText(content, 'reader_benefits_title', 'For Readers');
  const readerBenefits = pickList<TextEntry>(content, 'reader_benefits', DEFAULT_READER_BENEFITS);

  const statsTitle = pickText(content, 'stats_title', 'Indexing Statistics');
  const stats = pickList<StatEntry>(content, 'stats', DEFAULT_STATS, 3);

  const additionalDbsTitle = pickText(content, 'additional_dbs_title', 'Additional Databases');
  const additionalDbs = pickList<TextEntry>(content, 'additional_dbs', DEFAULT_ADDITIONAL_DBS);

  const forAuthorsTitle = pickText(content, 'for_authors_title', 'For Authors');
  const forAuthorsIntro = pickText(content, 'for_authors_intro', "To maximize your article's visibility and impact:");
  const forAuthorsTips = pickList<TextEntry>(content, 'for_authors_tips', DEFAULT_FOR_AUTHORS_TIPS);

  const inquiriesTitle = pickText(content, 'inquiries_title', 'Indexing Inquiries');
  const inquiriesEmailLabel = pickText(content, 'inquiries_email_label', 'Editorial Office');
  const inquiriesEmail = pickText(content, 'inquiries_email', 'aml@iaamonline.org');
  const inquiriesBody = pickText(content, 'inquiries_body', 'For questions about indexing status or citation metrics, please contact our editorial office.');

  const cardCls = flat
    ? 'mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent'
    : 'mb-8';
  const lastCardCls = flat
    ? 'border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent'
    : '';

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: '2rem', fontWeight: 700 }}>{title}</h1>
          <CmsRichText value={subtitle} className="text-[#5a6a8a] text-lg leading-relaxed" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Major Scientific Databases */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#c9a227]" />
                  {majorDbsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {majorIndexes.map((idx, i) => (
                    <div
                      key={i}
                      className={
                        flat
                          ? `py-5 border-b border-[#c9a227] bg-[#c9a227]/5`
                          : `p-6 border rounded-lg border-[#c9a227] bg-[#c9a227]/5 hover:shadow-md transition-shadow`
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={
                            flat
                              ? 'w-12 h-12 bg-white border border-gray-200 flex items-center justify-center'
                              : 'w-12 h-12 bg-white rounded-lg border border-border flex items-center justify-center shadow-sm'
                          }
                        >
                          {MAJOR_INDEX_ICONS[i]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-[#0f2d6b] text-sm mb-1" style={{ fontWeight: 600 }}>
                                {idx.name}
                                <Badge variant="secondary" className="ml-2 text-xs">Premium</Badge>
                              </h4>
                              <p className="text-[#5a6a8a] text-xs">{idx.provider}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs mb-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {idx.status}
                              </Badge>
                              <p className="text-[#5a6a8a] text-xs">Since {idx.since}</p>
                            </div>
                          </div>
                          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">{idx.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-[#5a6a8a]" />
                              <span className="text-[#5a6a8a] text-xs">{idx.coverage}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Citation Metrics & Impact */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {metricsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {metrics.map((m, i) => (
                    <div
                      key={i}
                      className={
                        flat
                          ? 'p-4 border-b border-gray-200 text-center'
                          : 'p-4 border border-border rounded-lg text-center hover:bg-[#f0f4fb] transition-colors'
                      }
                    >
                      <div className="text-[#0f2d6b] text-2xl font-bold mb-1">{m.value}</div>
                      <div className="text-[#0f2d6b] text-sm mb-1" style={{ fontWeight: 600 }}>{m.metric}</div>
                      <div className="text-[#5a6a8a] text-xs mb-2">{m.provider}</div>
                      <div className="text-[#3a4a6a] text-xs leading-relaxed">{m.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits for Authors & Readers */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {benefitsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>{authorBenefitsTitle}</h4>
                    <div className="space-y-2">
                      {authorBenefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[#5a6a8a] text-xs">{b.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>{readerBenefitsTitle}</h4>
                    <div className="space-y-2">
                      {readerBenefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[#5a6a8a] text-xs">{b.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Indexing Statistics */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">{statsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.map((s, i) => (
                    <div
                      key={i}
                      className={
                        flat
                          ? 'text-center p-3 border-b border-gray-200'
                          : 'text-center p-3 bg-[#0f2d6b]/5 rounded-lg'
                      }
                    >
                      <div className="text-[#0f2d6b] text-lg font-bold">{s.value}</div>
                      <div className="text-[#5a6a8a] text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Databases */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  {additionalDbsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {additionalDbs.map((db, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#5a6a8a] text-xs">{db.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* For Authors */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">{forAuthorsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CmsRichText value={forAuthorsIntro} className="text-[#3a4a6a] text-xs leading-relaxed" />
                <div className="space-y-2">
                  {forAuthorsTips.map((tip, i) => (
                    <div key={i} className="text-[#5a6a8a] text-xs">• {tip.text}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Indexing Inquiries */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">{inquiriesTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>{inquiriesEmailLabel}</p>
                  <p className="text-[#5a6a8a] text-xs">{inquiriesEmail}</p>
                </div>
                <CmsRichText value={inquiriesBody} className="text-[#3a4a6a] text-xs leading-relaxed" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
