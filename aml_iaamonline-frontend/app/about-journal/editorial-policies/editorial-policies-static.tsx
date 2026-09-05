'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { FileText, Shield, Users, CheckCircle } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

const DEFAULT_REVIEW_PROCESS = [
  { text: 'Double-blind peer review for all research articles' },
  { text: 'Minimum 2-3 expert reviewers per manuscript' },
  { text: 'Editorial board oversight and final decisions' },
  { text: 'Transparent and constructive feedback to authors' },
  { text: 'Appeals process for disputed decisions' },
];

const DEFAULT_REVIEW_CRITERIA = [
  { text: 'Scientific rigor and methodology' },
  { text: 'Novelty and significance of findings' },
  { text: 'Clarity of presentation and writing' },
  { text: 'Appropriate use of references and citations' },
  { text: 'Ethical compliance and data integrity' },
];

const DEFAULT_MISCONDUCT_ITEMS = [
  { text: 'Plagiarism and self-plagiarism' },
  { text: 'Data fabrication or falsification' },
  { text: 'Duplicate or redundant publication' },
  { text: 'Undisclosed conflicts of interest' },
];

const DEFAULT_AUTHOR_ITEMS = [
  { text: 'Ensure originality and accuracy' },
  { text: 'Disclose all funding sources' },
  { text: 'Declare conflicts of interest' },
  { text: 'Provide access to research data' },
  { text: 'Obtain necessary permissions' },
];

const DEFAULT_EDITORIAL_STANDARDS = [
  { text: 'Unbiased evaluation process' },
  { text: 'Confidentiality of submissions' },
  { text: 'Transparent decision making' },
  { text: 'Timely communication' },
  { text: 'Post-publication corrections' },
];

const DEFAULT_CC_FREE = [
  { text: 'Share — copy and redistribute in any medium' },
  { text: 'Adapt — remix, transform, and build upon' },
  { text: 'Commercial use — for any purpose' },
  { text: 'No additional restrictions' },
];

const DEFAULT_CC_TERMS = [
  { text: 'Attribution — must give appropriate credit' },
  { text: 'Indicate if changes were made' },
  { text: 'Link to license' },
  { text: 'No warranty or liability' },
];

export default function EditorialPoliciesStatic({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'Editorial Policies');
  const subtitle = pickText(
    content,
    'subtitle',
    'Comprehensive policies governing our editorial process and publication standards',
  );
  const peerReviewTitle = pickText(content, 'peer_review_title', 'Peer Review Policy');
  const peerReviewBody = pickText(
    content,
    'peer_review_body',
    'Advanced Materials Letters employs a rigorous double-blind peer review process to ensure the highest quality of published research. All manuscripts undergo thorough evaluation by expert reviewers in the relevant field.',
  );
  const reviewProcessTitle = pickText(content, 'review_process_title', 'Review Process');
  const reviewCriteriaTitle = pickText(content, 'review_criteria_title', 'Review Criteria');
  const ethicsTitle = pickText(content, 'ethics_title', 'Publication Ethics');
  const misconductTitle = pickText(content, 'misconduct_title', 'Research Misconduct');
  const misconductIntro = pickText(content, 'misconduct_intro', 'Zero tolerance policy for:');
  const authorTitle = pickText(content, 'author_title', 'Author Responsibilities');
  const editorialStandardsTitle = pickText(content, 'editorial_standards_title', 'Editorial Standards');
  const copyrightTitle = pickText(content, 'copyright_title', 'Copyright & Licensing');
  const copyrightBody = pickText(
    content,
    'copyright_body',
    'All articles published in Advanced Materials Letters are made available under the Creative Commons Attribution License (CC BY 4.0), ensuring maximum accessibility and reuse rights while maintaining proper attribution.',
  );
  const ccBenefitsTitle = pickText(content, 'cc_benefits_title', 'CC BY 4.0 License Benefits');
  const ccFreeTitle = pickText(content, 'cc_free_title', 'You are free to:');
  const ccTermsTitle = pickText(content, 'cc_terms_title', 'Under the terms:');

  const reviewProcessItems = pickList<{ text: string }>(
    content,
    'review_process_items',
    DEFAULT_REVIEW_PROCESS,
  );
  const reviewCriteriaItems = pickList<{ text: string }>(
    content,
    'review_criteria_items',
    DEFAULT_REVIEW_CRITERIA,
  );
  const misconductItems = pickList<{ text: string }>(
    content,
    'misconduct_items',
    DEFAULT_MISCONDUCT_ITEMS,
  );
  const authorItems = pickList<{ text: string }>(content, 'author_items', DEFAULT_AUTHOR_ITEMS);
  const editorialStandardsItems = pickList<{ text: string }>(
    content,
    'editorial_standards_items',
    DEFAULT_EDITORIAL_STANDARDS,
  );
  const ccFreeItems = pickList<{ text: string }>(content, 'cc_free_items', DEFAULT_CC_FREE);
  const ccTermsItems = pickList<{ text: string }>(content, 'cc_terms_items', DEFAULT_CC_TERMS);

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Editorial Policies' },
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-700">{subtitle}</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Peer Review Policy */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{peerReviewTitle}</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <CmsRichText value={peerReviewBody} className="text-gray-700 leading-relaxed mb-6" />

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{reviewProcessTitle}</h3>
                  <div className="space-y-3">
                    {reviewProcessItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{reviewCriteriaTitle}</h3>
                  <div className="space-y-3">
                    {reviewCriteriaItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Publication Ethics */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{ethicsTitle}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">{misconductTitle}</h3>
                <p className="text-sm text-red-700 mb-3">{misconductIntro}</p>
                <ul className="text-sm text-red-600 space-y-1">
                  {misconductItems.map((item, i) => (
                    <li key={i}>• {item.text}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">{authorTitle}</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  {authorItems.map((item, i) => (
                    <li key={i}>• {item.text}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">{editorialStandardsTitle}</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  {editorialStandardsItems.map((item, i) => (
                    <li key={i}>• {item.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright and Licensing */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{copyrightTitle}</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <CmsRichText value={copyrightBody} className="text-gray-700 leading-relaxed mb-6" />

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{ccBenefitsTitle}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{ccFreeTitle}</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {ccFreeItems.map((item, i) => (
                        <li key={i}>• {item.text}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{ccTermsTitle}</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {ccTermsItems.map((item, i) => (
                        <li key={i}>• {item.text}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
