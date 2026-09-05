'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Users, Network, Globe, Lightbulb } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

const DEFAULT_SENIOR_ITEMS = [
  { title: 'Chief Editorial Coordinator', description: 'Oversees cross-journal editorial policies' },
  { title: 'Review Coordination Team', description: 'Manages interdisciplinary reviews' },
  { title: 'Standards Committee', description: 'Maintains editorial consistency' },
];

const DEFAULT_DISCIPLINARY_ITEMS = [
  { title: 'Materials Science Panel', description: 'Advanced materials expertise' },
  { title: 'Nanotechnology Panel', description: 'Nanoscale research specialization' },
  { title: 'Energy Materials Panel', description: 'Energy and sustainability focus' },
];

const DEFAULT_CROSS_ITEMS = [
  { title: 'Bridge Editors', description: 'Connect different research domains' },
  { title: 'Innovation Advisors', description: 'Identify emerging research trends' },
  { title: 'Special Issue Coordinators', description: 'Manage thematic publications' },
];

const DEFAULT_AUTHOR_BENEFITS = [
  {
    title: 'Enhanced Expertise',
    description: 'Access to specialists across multiple disciplines for comprehensive review',
  },
  {
    title: 'Broader Reach',
    description: 'Interdisciplinary research gains visibility across journal networks',
  },
  {
    title: 'Consistent Standards',
    description: 'Uniform high-quality editorial standards across all journals',
  },
];

const DEFAULT_COMMUNITY_BENEFITS = [
  {
    title: 'Knowledge Integration',
    description: 'Facilitates cross-pollination of ideas between research areas',
  },
  {
    title: 'Innovation Acceleration',
    description: 'Promotes breakthrough discoveries at discipline intersections',
  },
  {
    title: 'Global Collaboration',
    description: 'Connects researchers worldwide through shared editorial excellence',
  },
];

const DEFAULT_PROCESS_STEPS = [
  {
    title: 'Manuscript Assessment',
    description: 'Initial evaluation determines cross-journal relevance and required expertise',
  },
  {
    title: 'Expert Assembly',
    description:
      'Relevant specialists from multiple journals are assembled for comprehensive review',
  },
  {
    title: 'Collaborative Review',
    description: 'Multi-disciplinary review process with coordinated feedback integration',
  },
  {
    title: 'Publication Decision',
    description: 'Final decision made with input from all relevant editorial teams',
  },
];

// Colours for the process step circles (index-mapped, fixed design)
const STEP_COLORS = ['#0f2d6b', '#1a3f8f', '#254b9d', '#3260b5'];

export default function EditorialTeamStatic({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'Research Cross-Journal Editorial Team');
  const subtitle = pickText(
    content,
    'subtitle',
    'Collaborative editorial excellence across the IAAM journal portfolio',
  );
  const collabTitle = pickText(content, 'collab_title', 'Cross-Journal Collaboration');
  const collabBody = pickText(
    content,
    'collab_body',
    '<p>The Research Cross-Journal Editorial Team represents a pioneering approach to scholarly publishing, fostering collaboration and knowledge sharing across multiple journals within the IAAM portfolio. This innovative structure ensures consistent editorial standards while promoting interdisciplinary research and cross-pollination of ideas.</p><p>Our cross-journal editorial framework enables experts from different fields to collaborate on manuscripts that span multiple disciplines, ensuring that groundbreaking research receives the most appropriate and comprehensive review process.</p>',
  );
  const structureTitle = pickText(content, 'structure_title', 'Team Structure');
  const seniorTitle = pickText(content, 'senior_title', 'Senior Editorial Committee');
  const disciplinaryTitle = pickText(content, 'disciplinary_title', 'Disciplinary Panels');
  const crossTitle = pickText(content, 'cross_title', 'Cross-Disciplinary Experts');
  const benefitsTitle = pickText(content, 'benefits_title', 'Benefits & Impact');
  const authorsbenefitsTitle = pickText(content, 'authors_benefits_title', 'For Authors');
  const communityBenefitsTitle = pickText(
    content,
    'community_benefits_title',
    'For Research Community',
  );
  const processTitle = pickText(content, 'process_title', 'Collaboration Process');
  const processNote = pickText(
    content,
    'process_note',
    'This collaborative approach ensures that interdisciplinary research receives the most comprehensive and expert evaluation possible, maintaining the highest standards across all IAAM journals.',
  );

  const seniorItems = pickList<{ title: string; description: string }>(
    content,
    'senior_items',
    DEFAULT_SENIOR_ITEMS,
    3,
  );
  const disciplinaryItems = pickList<{ title: string; description: string }>(
    content,
    'disciplinary_items',
    DEFAULT_DISCIPLINARY_ITEMS,
    3,
  );
  const crossItems = pickList<{ title: string; description: string }>(
    content,
    'cross_items',
    DEFAULT_CROSS_ITEMS,
    3,
  );
  const authorBenefits = pickList<{ title: string; description: string }>(
    content,
    'author_benefits',
    DEFAULT_AUTHOR_BENEFITS,
    3,
  );
  const communityBenefits = pickList<{ title: string; description: string }>(
    content,
    'community_benefits',
    DEFAULT_COMMUNITY_BENEFITS,
    3,
  );
  const processSteps = pickList<{ title: string; description: string }>(
    content,
    'process_steps',
    DEFAULT_PROCESS_STEPS,
    4,
  );

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Research Cross-Journal Editorial Team' },
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-700">{subtitle}</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Network className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{collabTitle}</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <CmsRichText value={collabBody} className="text-gray-700 leading-relaxed" />
            </div>
          </div>

          {/* Team Structure */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{structureTitle}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Senior Editorial Committee */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">{seniorTitle}</h3>
                <div className="space-y-3">
                  {seniorItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disciplinary Panels */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">{disciplinaryTitle}</h3>
                <div className="space-y-3">
                  {disciplinaryItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Disciplinary Experts */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">{crossTitle}</h3>
                <div className="space-y-3">
                  {crossItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Benefits & Impact */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{benefitsTitle}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{authorsbenefitsTitle}</h3>
                <div className="space-y-3">
                  {authorBenefits.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {communityBenefitsTitle}
                </h3>
                <div className="space-y-3">
                  {communityBenefits.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Collaboration Process */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{processTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-12 h-12 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold"
                    style={{ backgroundColor: STEP_COLORS[i] ?? '#0f2d6b' }}
                  >
                    {i + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> {processNote}
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
