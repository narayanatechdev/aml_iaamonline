"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Clock, Milestone, TrendingUp, Globe } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

type TimelineItem = { year: string; title: string; description: string };
type AchievementItem = { value: string; label: string };
type ForwardItem = { title: string; description: string };

const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    year: '2010',
    title: 'Journal Launch',
    description: 'Advanced Materials Letters was founded by IAAM with a vision to provide a leading international platform for materials science research.',
  },
  {
    year: '2015',
    title: 'Global Recognition',
    description: 'Achieved international recognition with submissions from over 50 countries and established partnerships with leading research institutions.',
  },
  {
    year: '2018',
    title: 'Platform Expansion',
    description: 'Expanded the journal\'s online platform and author services, improving manuscript submission and international discoverability.',
  },
  {
    year: '2023',
    title: 'Digital Innovation',
    description: 'Launched enhanced digital platform with improved user experience and advanced manuscript management system.',
  },
];

const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [
  { value: '5,000+', label: 'Articles Published' },
  { value: '85+', label: 'Countries Served' },
  { value: '10M+', label: 'Article Downloads' },
  { value: '15+', label: 'Years of Excellence' },
];

const ACHIEVEMENT_COLORS = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-purple-50'];

const DEFAULT_FORWARD_ITEMS: ForwardItem[] = [
  { title: 'Global Expansion', description: 'Reaching more researchers worldwide' },
  { title: 'Technology Innovation', description: 'Enhanced digital publishing tools' },
  { title: 'Impact Growth', description: 'Increasing scientific influence' },
];

const FORWARD_ICONS = [Globe, Milestone, TrendingUp];

export default function HistoryStatic({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'History & Milestones');
  const subtitle = pickText(content, 'subtitle', 'A journey through the evolution of Advanced Materials Letters');

  const timelineTitle = pickText(content, 'timeline_title', 'Our Journey');
  const timelineItems = pickList<TimelineItem>(content, 'timeline_items', DEFAULT_TIMELINE)
    .filter((item) => (item.year ?? '').trim() !== '');

  const achievementsTitle = pickText(content, 'achievements_title', 'Key Achievements');
  const achievementItems = pickList<AchievementItem>(content, 'achievements_items', DEFAULT_ACHIEVEMENTS, 4);

  const forwardTitle = pickText(content, 'forward_title', 'Looking Forward');
  const forwardBody = pickText(content, 'forward_body', 'As we continue our journey, Advanced Materials Letters remains committed to advancing materials science through high-quality publishing, fostering global collaboration, and supporting breakthrough research that shapes the future.');
  const forwardItems = pickList<ForwardItem>(content, 'forward_items', DEFAULT_FORWARD_ITEMS, 3);

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'History of Nature' }
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <CmsRichText value={subtitle} className="text-lg text-gray-700" />
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{timelineTitle}</h2>
            </div>

            <div className="space-y-8">
              {timelineItems.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-20 text-right">
                    <div className="text-2xl font-bold text-[#0f2d6b]">{item.year}</div>
                  </div>
                  <div className={`flex-grow pl-6 border-l-2 ${i === 0 ? 'border-[#0f2d6b]' : 'border-gray-300'}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Achievements */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Milestone className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{achievementsTitle}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievementItems.map((item, i) => (
                <div key={i} className={`text-center p-6 ${ACHIEVEMENT_COLORS[i] ?? 'bg-gray-50'} rounded-lg`}>
                  <div className="text-3xl font-bold text-[#0f2d6b] mb-2">{item.value}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Forward */}
          <div className="bg-[#0f2d6b] text-white rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">{forwardTitle}</h2>
            </div>

            <CmsRichText value={forwardBody} className="text-white/90 leading-relaxed mb-6" />

            <div className="grid md:grid-cols-3 gap-6">
              {forwardItems.map((item, i) => {
                const Icon = FORWARD_ICONS[i] ?? Globe;
                return (
                  <div key={i} className="text-center">
                    <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
