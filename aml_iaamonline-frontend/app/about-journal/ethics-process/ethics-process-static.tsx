"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, FileText, Users, Clock, Eye, Scale } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

type EthicsSection = { title: string; point1: string; point2: string; point3: string; point4: string; point5: string };
type ReviewStep = { step: string; title: string; duration: string; description: string };
type MisconductType = { type: string; description: string; action: string };
type EthicsStandard = { title: string; description: string; badge: string };
type TimelineEntry = { label: string; value: string };
type TextEntry = { text: string };

const DEFAULT_PUB_ETHICS_SECTIONS: EthicsSection[] = [
  {
    title: 'Author Responsibilities',
    point1: 'Submit only original, unpublished work',
    point2: 'Provide accurate and complete citations',
    point3: 'Disclose any conflicts of interest',
    point4: 'Ensure proper authorship attribution',
    point5: 'Report research methods and results honestly',
  },
  {
    title: 'Editor Responsibilities',
    point1: 'Maintain confidentiality during review',
    point2: 'Make fair and unbiased decisions',
    point3: 'Handle misconduct allegations properly',
    point4: 'Protect reviewer and author identities',
    point5: 'Ensure timely review processes',
  },
];

const DEFAULT_REVIEW_STEPS: ReviewStep[] = [
  { step: '1', title: 'Initial Editorial Assessment', duration: '3-5 days', description: 'Manuscripts are checked for scope, quality, and technical merit by the editorial team.' },
  { step: '2', title: 'Reviewer Assignment', duration: '5-7 days', description: 'Qualified reviewers are identified and invited based on expertise and availability.' },
  { step: '3', title: 'Peer Review', duration: '4-6 weeks', description: 'Expert reviewers conduct thorough evaluation and provide detailed feedback.' },
  { step: '4', title: 'Editorial Decision', duration: '1-2 weeks', description: 'Editors review feedback and make final publication decisions.' },
  { step: '5', title: 'Author Revision', duration: '2-4 weeks', description: 'Authors address reviewer comments and revise their manuscript as needed.' },
  { step: '6', title: 'Final Acceptance', duration: '1-2 weeks', description: 'Final review of revisions and preparation for publication.' },
];

const DEFAULT_MISCONDUCT_TYPES: MisconductType[] = [
  { type: 'Plagiarism', description: 'Unauthorized use of others’ work without proper attribution', action: 'Immediate investigation and potential retraction' },
  { type: 'Data Fabrication', description: 'Making up data or results that were never obtained', action: 'Full investigation with institutional collaboration' },
  { type: 'Duplicate Publication', description: 'Publishing the same research in multiple venues', action: 'Editorial notice and correction procedures' },
];

const DEFAULT_ETHICS_STANDARDS: EthicsStandard[] = [
  { title: 'COPE Member', description: "We are committed to COPE's best practices and guidelines for ethical publishing.", badge: 'Verified' },
  { title: 'CrossRef Member', description: 'All articles receive CrossRef DOIs for permanent identification and citation tracking.', badge: 'Active' },
  { title: 'International Standards', description: 'Adherence to international ethics guidelines and best practices.', badge: 'Compliant' },
];

const DEFAULT_TIMELINE: TimelineEntry[] = [
  { label: 'Initial Review', value: '3-5 days' },
  { label: 'Peer Review', value: '4-6 weeks' },
  { label: 'First Decision', value: '6-8 weeks' },
  { label: 'Final Decision', value: '8-12 weeks' },
];

const DEFAULT_REVIEWER_BENEFITS: TextEntry[] = [
  { text: 'Annual recognition certificates' },
  { text: 'Reviewer database profiles' },
  { text: 'Outstanding reviewer awards' },
];

export default function EthicsProcessStatic({
  content = {},
  flat = false,
}: {
  content?: PageContentData;
  /** true = flat card styling used on /about-journal/ethics-process */
  flat?: boolean;
}) {
  const title = pickText(content, 'title', 'Ethics & Process');
  const subtitle = pickText(content, 'subtitle', 'Our commitment to ethical publishing practices and transparent peer review processes ensures the integrity and quality of all published research.');

  const pubEthicsTitle = pickText(content, 'pub_ethics_title', 'Publication Ethics');
  const pubEthicsIntro = pickText(content, 'pub_ethics_intro', 'Advanced Materials Letters is committed to maintaining the highest standards of publication ethics. We follow the guidelines established by the Committee on Publication Ethics (COPE) and ensure that all stakeholders understand their ethical responsibilities.');
  const pubEthicsSections = pickList<EthicsSection>(content, 'pub_ethics_sections', DEFAULT_PUB_ETHICS_SECTIONS, 2);

  const peerReviewTitle = pickText(content, 'peer_review_title', 'Peer Review Process');
  const peerReviewIntro = pickText(content, 'peer_review_intro', 'Our rigorous double-blind peer review process ensures the quality and integrity of published research. All manuscripts undergo comprehensive evaluation by international experts in the relevant field.');
  const peerReviewSteps = pickList<ReviewStep>(content, 'peer_review_steps', DEFAULT_REVIEW_STEPS, 6);

  const misconductTitle = pickText(content, 'misconduct_title', 'Handling Research Misconduct');
  const misconductIntro = pickText(content, 'misconduct_intro', 'We take allegations of research misconduct seriously and follow established procedures to investigate and address any concerns about published content.');
  const misconductTypes = pickList<MisconductType>(content, 'misconduct_types', DEFAULT_MISCONDUCT_TYPES, 3);

  const ethicsStandardsTitle = pickText(content, 'ethics_standards_title', 'Ethics Standards');
  const ethicsStandards = pickList<EthicsStandard>(content, 'ethics_standards', DEFAULT_ETHICS_STANDARDS, 3);

  const reportConcernsTitle = pickText(content, 'report_concerns_title', 'Report Concerns');
  const reportConcernsIntro = pickText(content, 'report_concerns_intro', 'If you have concerns about published content or the review process, please contact us:');
  const ethicsEmailLabel = pickText(content, 'ethics_email_label', 'Ethics Inquiries');
  const ethicsEmail = pickText(content, 'ethics_email', 'ethics@iaamonline.org');
  const editorialEmailLabel = pickText(content, 'editorial_email_label', 'Editorial Office');
  const editorialEmail = pickText(content, 'editorial_email', 'aml@iaamonline.org');

  const timelineTitle = pickText(content, 'timeline_title', 'Typical Timeline');
  const timeline = pickList<TimelineEntry>(content, 'timeline', DEFAULT_TIMELINE, 4);

  const reviewerProgramTitle = pickText(content, 'reviewer_program_title', 'Reviewer Program');
  const reviewerProgramIntro = pickText(content, 'reviewer_program_intro', "We recognize and appreciate our reviewers' contributions through:");
  const reviewerBenefits = pickList<TextEntry>(content, 'reviewer_benefits', DEFAULT_REVIEWER_BENEFITS);

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
            {/* Publication Ethics */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {pubEthicsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CmsRichText value={pubEthicsIntro} className="text-[#3a4a6a] leading-relaxed" />
                <div className="grid sm:grid-cols-2 gap-4">
                  {pubEthicsSections.map((section, index) => (
                    <div
                      key={index}
                      className={
                        flat
                          ? 'p-4 border-b border-gray-200'
                          : 'p-4 border border-border rounded-lg'
                      }
                    >
                      <h4 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>{section.title}</h4>
                      <div className="space-y-2">
                        {[section.point1, section.point2, section.point3, section.point4, section.point5]
                          .filter((p) => (p ?? '').trim() !== '')
                          .map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-[#5a6a8a] text-xs">{point}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Peer Review Process */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {peerReviewTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <CmsRichText value={peerReviewIntro} className="text-[#3a4a6a] leading-relaxed" />
                  <div className="grid gap-4">
                    {peerReviewSteps.map((step, index) => (
                      <div
                        key={index}
                        className={
                          flat
                            ? 'flex gap-4 p-4 border-b border-gray-200'
                            : 'flex gap-4 p-4 border border-border rounded-lg hover:bg-[#f0f4fb] transition-colors'
                        }
                      >
                        <div className="w-10 h-10 bg-[#0f2d6b] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>{step.title}</h5>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-[#5a6a8a] text-xs leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Handling Research Misconduct */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {misconductTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CmsRichText value={misconductIntro} className="text-[#3a4a6a] leading-relaxed" />
                <div className="grid sm:grid-cols-3 gap-4">
                  {misconductTypes.map((m, index) => (
                    <div
                      key={index}
                      className={
                        flat
                          ? 'p-4 border-b border-gray-200'
                          : 'p-4 border border-red-200 bg-red-50 rounded-lg'
                      }
                    >
                      <h5 className="text-red-700 text-sm mb-2" style={{ fontWeight: 600 }}>{m.type}</h5>
                      <p className="text-red-600 text-xs mb-3 leading-relaxed">{m.description}</p>
                      <div className="text-red-700 text-xs" style={{ fontWeight: 500 }}>{m.action}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ethics Standards */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  {ethicsStandardsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ethicsStandards.map((standard, index) => (
                    <div
                      key={index}
                      className={
                        flat
                          ? 'p-3 border-b border-gray-200'
                          : 'p-3 border border-border rounded-lg'
                      }
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>{standard.title}</h5>
                        <Badge variant="secondary" className="text-xs">{standard.badge}</Badge>
                      </div>
                      <p className="text-[#5a6a8a] text-xs leading-relaxed">{standard.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Concerns */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {reportConcernsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CmsRichText value={reportConcernsIntro} className="text-[#3a4a6a] text-xs leading-relaxed" />
                <div className="space-y-2">
                  <div>
                    <p className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>{ethicsEmailLabel}</p>
                    <p className="text-[#5a6a8a] text-xs">{ethicsEmail}</p>
                  </div>
                  <div>
                    <p className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>{editorialEmailLabel}</p>
                    <p className="text-[#5a6a8a] text-xs">{editorialEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typical Timeline */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {timelineTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeline.map((entry, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[#5a6a8a] text-xs">{entry.label}</span>
                      <span className="text-[#0f2d6b] text-xs font-bold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviewer Program */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {reviewerProgramTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <CmsRichText value={reviewerProgramIntro} className="text-[#3a4a6a] text-xs leading-relaxed" />
                  <div className="space-y-2">
                    {reviewerBenefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="text-[#5a6a8a] text-xs">{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
