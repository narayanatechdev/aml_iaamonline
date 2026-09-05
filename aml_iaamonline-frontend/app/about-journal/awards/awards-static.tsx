"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Award, Trophy, Star, Medal } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

type RecognitionItem = { title: string; period: string; description: string };
type AwardItem = { title: string; subtitle: string; note: string };
type CriteriaItem = { title: string; description: string };

const DEFAULT_RECOGNITION: RecognitionItem[] = [
  {
    title: 'Scopus Coverage',
    period: '2010 – 2016',
    description: 'Recognised for high editorial standards during Scopus indexing period',
  },
  {
    title: 'Citation Growth',
    period: '2010 – Present',
    description: 'Growing h-index and citation profile across all published volumes',
  },
  {
    title: 'Publishing Since 2010',
    period: '2010 – Present',
    description: 'Serving the global materials science community for over 15 years',
  },
];

const RECOGNITION_STYLES: Array<{ bg: string; iconCls: string; Icon: typeof Medal }> = [
  { bg: 'bg-yellow-50', iconCls: 'text-yellow-600', Icon: Medal },
  { bg: 'bg-blue-50', iconCls: 'text-blue-600', Icon: Star },
  { bg: 'bg-green-50', iconCls: 'text-green-600', Icon: Award },
];

const DEFAULT_BEST_PAPERS: AwardItem[] = [
  {
    title: 'Outstanding Research Article (2023)',
    subtitle: '"Novel Graphene-Based Nanocomposites for Energy Storage"',
    note: 'Recognized for groundbreaking methodology and impact',
  },
  {
    title: 'Innovation in Materials (2023)',
    subtitle: '"Smart Materials for Biomedical Applications"',
    note: 'Awarded for innovative approach and clinical potential',
  },
  {
    title: 'Sustainability Excellence (2023)',
    subtitle: '"Eco-Friendly Material Processing Techniques"',
    note: 'Recognized for environmental impact and sustainability',
  },
];

const BEST_PAPER_COLORS = ['border-yellow-500', 'border-blue-500', 'border-green-500'];

const DEFAULT_YOUNG_RESEARCHERS: AwardItem[] = [
  {
    title: 'Early Career Excellence (2023)',
    subtitle: 'Dr. Research Scientist',
    note: 'Outstanding contribution by researcher under 35',
  },
  {
    title: 'Emerging Scientist Award (2023)',
    subtitle: 'Dr. Materials Innovator',
    note: 'Recognizing promising early-career achievements',
  },
  {
    title: 'Student Research Excellence (2023)',
    subtitle: 'Graduate Student Researcher',
    note: 'Outstanding PhD research publication',
  },
];

const YOUNG_RESEARCHER_COLORS = ['border-purple-500', 'border-red-500', 'border-indigo-500'];

const DEFAULT_CRITERIA: CriteriaItem[] = [
  {
    title: 'Scientific Excellence',
    description: 'Outstanding quality, rigor, and innovation in research methodology and findings',
  },
  {
    title: 'Impact & Significance',
    description: 'Demonstrated potential for advancing materials science and real-world applications',
  },
  {
    title: 'Community Recognition',
    description: 'High citation rates, media attention, and recognition by scientific community',
  },
];

const CRITERIA_STYLES: Array<{ bg: string; Icon: typeof Star }> = [
  { bg: 'bg-blue-50', Icon: Star },
  { bg: 'bg-green-50', Icon: Trophy },
  { bg: 'bg-yellow-50', Icon: Award },
];

export default function AwardsStatic({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'Awards & Recognition');
  const subtitle = pickText(content, 'subtitle', 'Celebrating excellence in materials science research and publication');

  const recognitionTitle = pickText(content, 'recognition_title', 'Journal Recognition');
  const recognitionItems = pickList<RecognitionItem>(content, 'recognition_items', DEFAULT_RECOGNITION, 3);

  const awardsTitle = pickText(content, 'awards_title', 'Annual Excellence Awards');
  const awardsIntro = pickText(content, 'awards_intro', 'Advanced Materials Letters recognizes outstanding contributions to materials science through our annual awards program, celebrating exceptional research, innovative discoveries, and significant contributions to the field.');

  const bestPapersTitle = pickText(content, 'best_papers_title', 'Best Paper Awards');
  const bestPapers = pickList<AwardItem>(content, 'best_papers', DEFAULT_BEST_PAPERS);

  const youngResearchersTitle = pickText(content, 'young_researchers_title', 'Young Researcher Awards');
  const youngResearchers = pickList<AwardItem>(content, 'young_researchers', DEFAULT_YOUNG_RESEARCHERS);

  const criteriaTitle = pickText(content, 'criteria_title', 'Recognition Criteria');
  const criteriaItems = pickList<CriteriaItem>(content, 'criteria_items', DEFAULT_CRITERIA, 3);

  const nominationTitle = pickText(content, 'nomination_title', 'Nomination Process');
  const nominationIntro = pickText(content, 'nomination_intro', 'Nominations for annual awards are accepted from editorial board members, reviewers, and the broader scientific community. Self-nominations are also welcome.');
  const nominationDeadline = pickText(content, 'nomination_deadline', 'December 31st annually');
  const nominationAnnouncement = pickText(content, 'nomination_announcement', 'February of following year');

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Awards' }
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <CmsRichText value={subtitle} className="text-lg text-gray-700" />
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Journal Recognition */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{recognitionTitle}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recognitionItems.map((item, i) => {
                const style = RECOGNITION_STYLES[i] ?? RECOGNITION_STYLES[0];
                const Icon = style.Icon;
                return (
                  <div key={i} className={`${style.bg} rounded-lg p-6 text-center`}>
                    <Icon className={`w-12 h-12 ${style.iconCls} mx-auto mb-3`} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.period}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Annual Excellence Awards */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{awardsTitle}</h2>
            </div>

            <CmsRichText value={awardsIntro} className="text-gray-700 leading-relaxed mb-8" />

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{bestPapersTitle}</h3>
                <div className="space-y-4">
                  {bestPapers.map((item, i) => (
                    <div key={i} className={`border-l-4 ${BEST_PAPER_COLORS[i % BEST_PAPER_COLORS.length]} pl-4`}>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{youngResearchersTitle}</h3>
                <div className="space-y-4">
                  {youngResearchers.map((item, i) => (
                    <div key={i} className={`border-l-4 ${YOUNG_RESEARCHER_COLORS[i % YOUNG_RESEARCHER_COLORS.length]} pl-4`}>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recognition Criteria */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">{criteriaTitle}</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {criteriaItems.map((item, i) => {
                const style = CRITERIA_STYLES[i] ?? CRITERIA_STYLES[0];
                const Icon = style.Icon;
                return (
                  <div key={i} className={`text-center p-6 ${style.bg} rounded-lg`}>
                    <Icon className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-[#0f2d6b] text-white rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{nominationTitle}</h3>
              <CmsRichText value={nominationIntro} className="text-white/90 mb-4" />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Submission Deadline:</h4>
                  <p className="text-white/80 text-sm">{nominationDeadline}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Announcement:</h4>
                  <p className="text-white/80 text-sm">{nominationAnnouncement}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
