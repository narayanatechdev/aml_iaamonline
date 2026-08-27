"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Award, Globe, Users, Calendar, Target, BookOpen, Zap, CheckCircle } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { SectionBody } from '@/components/shared/section-body';
import type { PageContentData } from '@/lib/page-layouts';

type OverviewParagraph = { text: string };
type PublicationType = { title: string; description: string };
type AccessPoint = { text: string };
type KeyInfoItem = { label: string; value: string };
type FocusArea = { text: string };
type RecognitionItem = { title: string; description: string };

const DEFAULT_OVERVIEW_PARAGRAPHS: OverviewParagraph[] = [
  { text: 'Advanced Materials Letters (AML) is an international scientific journal published by the International Association of Advanced Materials (IAAM). The journal serves as a platform for researchers, scientists, and engineers to share their latest discoveries and innovations in the rapidly evolving field of materials science.' },
  { text: 'Since its inception, AML has been committed to maintaining the highest standards of scientific excellence while ensuring rapid dissemination of research findings. Advanced Materials Letters is available through IAAM membership and subscription; the journal does not charge authors article processing charges.' },
  { text: 'Our mission is to bridge the gap between fundamental research and practical applications, fostering collaboration across disciplines and geographical boundaries. We welcome submissions from researchers at all career stages, from emerging scientists to established leaders in the field.' },
];

const DEFAULT_PUBLICATION_TYPES: PublicationType[] = [
  { title: 'Research Articles', description: 'Original research with comprehensive experimental details and analysis' },
  { title: 'Review Articles', description: 'Comprehensive reviews of established topics and emerging trends' },
  { title: 'Letters', description: 'Short communications reporting urgent or significant findings' },
  { title: 'Perspectives', description: 'Forward-looking opinion pieces by invited experts in the field' },
];

const DEFAULT_ACCESS_POINTS: AccessPoint[] = [
  { text: 'No Article Processing Charges (APCs) for authors' },
  { text: 'No submission or publication fees for authors' },
  { text: 'IAAM member access by membership tier' },
  { text: 'Individual article purchase available' },
  { text: 'CC BY 4.0 licensing for maximum reuse' },
  { text: 'Institutional subscription options available' },
];

const DEFAULT_KEY_INFO: KeyInfoItem[] = [
  { label: 'ISSN (Print)', value: '0976-3961' },
  { label: 'eISSN', value: '0976-397X' },
  { label: 'Publisher', value: 'IAAM' },
  { label: 'Frequency', value: 'Monthly' },
  { label: 'Language', value: 'English' },
];

const DEFAULT_FOCUS_AREAS: FocusArea[] = [
  { text: 'Nanomaterials' },
  { text: 'Biomaterials' },
  { text: 'Smart Materials' },
  { text: 'Energy Materials' },
  { text: '2D Materials' },
  { text: 'Composites' },
  { text: 'Ceramics' },
  { text: 'Polymers' },
  { text: 'Metals & Alloys' },
  { text: 'Electronic Materials' },
];

const DEFAULT_RECOGNITION: RecognitionItem[] = [
  { title: 'Scopus (2010–2016)', description: 'Previously indexed in Scopus during its coverage period' },
  { title: 'Google Scholar', description: 'Freely discoverable via Google Scholar academic search' },
  { title: 'CrossRef DOI', description: 'Digital Object Identifiers for all published articles' },
  { title: 'Publishing Since 2010', description: 'Over 15 years of peer-reviewed materials science research' },
];

export default function About({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'About Advanced Materials Letters');
  const subtitle = pickText(content, 'subtitle', 'A premier international, peer-reviewed journal dedicated to advancing the field of materials science and engineering through high-quality research publications.');
  const overviewParagraphs = pickList<OverviewParagraph>(content, 'overview_paragraphs', DEFAULT_OVERVIEW_PARAGRAPHS);
  const publicationTypes = pickList<PublicationType>(content, 'publication_types', DEFAULT_PUBLICATION_TYPES);
  const accessIntro = pickText(content, 'access_intro', 'Advanced Materials Letters is available through IAAM membership and subscription. IAAM members receive article access allowances based on membership category; non-members can subscribe or purchase access to individual articles.');
  const accessPoints = pickList<AccessPoint>(content, 'access_points', DEFAULT_ACCESS_POINTS);
  const keyInfo = pickList<KeyInfoItem>(content, 'key_info', DEFAULT_KEY_INFO, 5);
  const focusAreas = pickList<FocusArea>(content, 'focus_areas', DEFAULT_FOCUS_AREAS);
  const officeName = pickText(content, 'office_name', 'International Association of Advanced Materials');
  const officeAddress = pickText(content, 'office_address', 'Gammalkilsvägen 18A\n16974 Vaxholm, Sweden');
  const officeEmail = pickText(content, 'office_email', 'aml@iaamonline.org');
  const officeWebsite = pickText(content, 'office_website', 'www.iaamonline.org');
  const recognition = pickList<RecognitionItem>(content, 'recognition', DEFAULT_RECOGNITION, 4);
  const extraSections = pickList<{ title: string; body: string }>(content, 'extra_sections', []).filter(
    (s) => (s.title ?? '').trim() !== '' || (s.body ?? '').trim() !== ''
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumb
          items={[{ label: 'About' }]}
          className="mb-6"
        />
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-black mb-6" style={{ fontSize: "2.5rem", fontWeight: 700 }}>{title}</h1>
          <p className="text-[#5a6a8a] text-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Journal Overview */}
          <div className="lg:col-span-2">
            <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-black text-2xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Journal Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#3a4a6a] text-base leading-relaxed">
                  {overviewParagraphs[0]?.text}
                </p>
                <p className="text-[#3a4a6a] text-base leading-relaxed">
                  {overviewParagraphs[1]?.text}
                </p>
                <p className="text-[#3a4a6a] text-base leading-relaxed">
                  {overviewParagraphs[2]?.text}
                </p>
              </CardContent>
            </Card>

            {/* Publication Types */}
            <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-black text-2xl flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Publication Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {publicationTypes.map((item) => (
                    <div key={item.title} className="py-3 border-b border-gray-200">
                      <h4 className="text-black text-base mb-3" style={{ fontWeight: 600 }}>{item.title}</h4>
                      <p className="text-[#5a6a8a] text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Access & Membership */}
            <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-black text-2xl flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Access &amp; Membership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#3a4a6a] text-base leading-relaxed">
                  {accessIntro}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {accessPoints.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#3a4a6a] text-base">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-black text-xl">Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-base">{keyInfo[0]?.label}</span>
                    <Badge variant="secondary">{keyInfo[0]?.value}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">{keyInfo[1]?.label}</span>
                    <Badge variant="secondary">{keyInfo[1]?.value}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">{keyInfo[2]?.label}</span>
                    <span className="text-black text-base" style={{ fontWeight: 600 }}>{keyInfo[2]?.value}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">{keyInfo[3]?.label}</span>
                    <span className="text-black text-base" style={{ fontWeight: 600 }}>{keyInfo[3]?.value}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">{keyInfo[4]?.label}</span>
                    <span className="text-black text-base" style={{ fontWeight: 600 }}>{keyInfo[4]?.value}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Focus Areas */}
            <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-black text-xl flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((area) => (
                    <Badge key={area.text} variant="outline" className="text-xs">
                      {area.text}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-black text-xl flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Editorial Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-black text-base mb-2" style={{ fontWeight: 600 }}>{officeName}</p>
                  <p className="text-[#5a6a8a] text-sm leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                    {officeAddress}
                  </p>
                </div>
                <div>
                  <p className="text-black text-base mb-2" style={{ fontWeight: 600 }}>Email</p>
                  <p className="text-[#5a6a8a] text-sm">{officeEmail}</p>
                </div>
                <div>
                  <p className="text-black text-base mb-2" style={{ fontWeight: 600 }}>Website</p>
                  <p className="text-[#5a6a8a] text-sm">{officeWebsite}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Awards & Recognition */}
        <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-black text-2xl flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recognition & Indexing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recognition.map((item, index) => (
                <div key={index} className="text-center p-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-[#0f2d6b]" />
                  </div>
                  <h4 className="text-black text-base mb-3" style={{ fontWeight: 600 }}>{item.title}</h4>
                  <p className="text-[#5a6a8a] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin-created sections (Additional sections in the page editor) */}
        {extraSections.map((section, i) => (
          <div key={i} className="mb-8 border-b border-gray-200 pb-8">
            {section.title && (
              <h2 className="text-black text-2xl mb-4" style={{ fontWeight: 700 }}>
                {section.title}
              </h2>
            )}
            <SectionBody body={section.body ?? ''} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
