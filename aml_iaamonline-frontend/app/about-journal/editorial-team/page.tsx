'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Users, Network, Globe, Lightbulb } from 'lucide-react';

export default function EditorialTeamPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Research Cross-Journal Editorial Team' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Research Cross-Journal Editorial Team</h1>
          <p className="text-lg text-gray-700">
            Collaborative editorial excellence across the IAAM journal portfolio
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Network className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Cross-Journal Collaboration</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The Research Cross-Journal Editorial Team represents a pioneering approach to scholarly publishing, 
                fostering collaboration and knowledge sharing across multiple journals within the IAAM portfolio. 
                This innovative structure ensures consistent editorial standards while promoting interdisciplinary 
                research and cross-pollination of ideas.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Our cross-journal editorial framework enables experts from different fields to collaborate on 
                manuscripts that span multiple disciplines, ensuring that groundbreaking research receives 
                the most appropriate and comprehensive review process.
              </p>
            </div>
          </div>

          {/* Team Structure */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Team Structure</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Senior Editorial Committee */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">Senior Editorial Committee</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Chief Editorial Coordinator</h4>
                      <p className="text-sm text-gray-600">Oversees cross-journal editorial policies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Review Coordination Team</h4>
                      <p className="text-sm text-gray-600">Manages interdisciplinary reviews</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Standards Committee</h4>
                      <p className="text-sm text-gray-600">Maintains editorial consistency</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disciplinary Panels */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">Disciplinary Panels</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Materials Science Panel</h4>
                      <p className="text-sm text-gray-600">Advanced materials expertise</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Nanotechnology Panel</h4>
                      <p className="text-sm text-gray-600">Nanoscale research specialization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Energy Materials Panel</h4>
                      <p className="text-sm text-gray-600">Energy and sustainability focus</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cross-Disciplinary Experts */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">Cross-Disciplinary Experts</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Bridge Editors</h4>
                      <p className="text-sm text-gray-600">Connect different research domains</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Innovation Advisors</h4>
                      <p className="text-sm text-gray-600">Identify emerging research trends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Special Issue Coordinators</h4>
                      <p className="text-sm text-gray-600">Manage thematic publications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits & Impact */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Benefits & Impact</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">For Authors</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Enhanced Expertise</h4>
                      <p className="text-sm text-gray-600">Access to specialists across multiple disciplines for comprehensive review</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Broader Reach</h4>
                      <p className="text-sm text-gray-600">Interdisciplinary research gains visibility across journal networks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Consistent Standards</h4>
                      <p className="text-sm text-gray-600">Uniform high-quality editorial standards across all journals</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">For Research Community</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Knowledge Integration</h4>
                      <p className="text-sm text-gray-600">Facilitates cross-pollination of ideas between research areas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Innovation Acceleration</h4>
                      <p className="text-sm text-gray-600">Promotes breakthrough discoveries at discipline intersections</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Global Collaboration</h4>
                      <p className="text-sm text-gray-600">Connects researchers worldwide through shared editorial excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collaboration Process */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Collaboration Process</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#0f2d6b] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">1</div>
                <h4 className="font-semibold text-gray-900 mb-2">Manuscript Assessment</h4>
                <p className="text-sm text-gray-600">Initial evaluation determines cross-journal relevance and required expertise</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#1a3f8f] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">2</div>
                <h4 className="font-semibold text-gray-900 mb-2">Expert Assembly</h4>
                <p className="text-sm text-gray-600">Relevant specialists from multiple journals are assembled for comprehensive review</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#254b9d] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">3</div>
                <h4 className="font-semibold text-gray-900 mb-2">Collaborative Review</h4>
                <p className="text-sm text-gray-600">Multi-disciplinary review process with coordinated feedback integration</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#3260b5] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">4</div>
                <h4 className="font-semibold text-gray-900 mb-2">Publication Decision</h4>
                <p className="text-sm text-gray-600">Final decision made with input from all relevant editorial teams</p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This collaborative approach ensures that interdisciplinary research receives the most 
                comprehensive and expert evaluation possible, maintaining the highest standards across all IAAM journals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}