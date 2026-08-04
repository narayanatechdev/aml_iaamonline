'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Globe, CheckCircle, Users, BookOpen } from 'lucide-react';

export default function PublishingModelsPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Access & Publishing Model' }
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Access &amp; Publishing Model</h1>
          <p className="text-lg text-gray-700">
            How readers access Advanced Materials Letters and how the journal is sustained
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Access Model Hero */}
          <div className="bg-gray-200 text-black rounded-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Membership &amp; Subscription Access</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Advanced Materials Letters is available through IAAM membership and subscription.
                  IAAM members receive article access allowances based on membership category;
                  non-members can subscribe or purchase access to individual articles. The journal
                  does not charge authors article processing charges.
                </p>
                <ul className="space-y-2">
                  {[
                    "No Article Processing Charges (APCs) for authors",
                    "IAAM member access based on membership tier",
                    "Individual article purchase available for non-members",
                    "Institutional subscription options available"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-gray-700 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-300 p-8 text-center rounded-lg">
                <div className="text-black mb-2 text-4xl font-bold">$0</div>
                <div className="text-black text-lg mb-2 font-semibold">Author Publication Cost</div>
                <div className="text-gray-600 text-sm">No charges to submit or publish</div>
              </div>
            </div>
          </div>

          {/* How Access Works */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">How Access Works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">IAAM Members</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Tier-Based Allowances</h4>
                      <p className="text-sm text-gray-600">Article access allowances based on IAAM membership category</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Daily Access</h4>
                      <p className="text-sm text-gray-600">Receive daily article access as part of IAAM membership benefits</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">Subscribers</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Individual Subscription</h4>
                      <p className="text-sm text-gray-600">Full access for non-members via personal subscription</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Per-Article Purchase</h4>
                      <p className="text-sm text-gray-600">Purchase access to individual articles as needed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">Institutions</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Institutional Access</h4>
                      <p className="text-sm text-gray-600">Institutional subscription options for libraries and research organisations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Contact IAAM</h4>
                      <p className="text-sm text-gray-600">Contact aml@iaamonline.org for institutional pricing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits for Authors */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Benefits for Authors</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">No Publication Fees</h4>
                    <p className="text-sm text-gray-600">No Article Processing Charges or submission fees for authors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Global Reach</h4>
                    <p className="text-sm text-gray-600">Research accessible to subscribers and IAAM members worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Retain Copyright</h4>
                    <p className="text-sm text-gray-600">Authors maintain rights under CC BY 4.0</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Fast Publication</h4>
                    <p className="text-sm text-gray-600">Efficient review and publication process</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">DOI Assignment</h4>
                    <p className="text-sm text-gray-600">All articles receive a CrossRef DOI for permanent identification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">High Quality Standards</h4>
                    <p className="text-sm text-gray-600">Rigorous peer review by international experts in materials science</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability & Funding */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Sustainability &amp; Funding</h2>
            </div>

            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                Advanced Materials Letters is supported through IAAM membership revenue and subscriptions.
                This model allows the journal to sustain rigorous peer review and high publication standards
                without placing article processing charges on authors.
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>For enquiries</strong> about institutional subscriptions or membership-based access,
                please contact our editorial office at aml@iaamonline.org.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
