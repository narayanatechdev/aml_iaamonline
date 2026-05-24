'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { BarChart, TrendingUp, Globe, Users, Award, Target } from 'lucide-react';

export default function JournalMetricsPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', path: '/about-journal' },
              { label: 'Journal Metrics' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Journal Metrics</h1>
          <p className="text-lg text-gray-700">
            Performance indicators and impact metrics for Advanced Materials Letters
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Key Metrics Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <TrendingUp className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
              <div className="text-2xl font-bold text-[#0f2d6b] mb-1">2.847</div>
              <div className="text-sm text-gray-600">Impact Factor (2023)</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <BarChart className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
              <div className="text-2xl font-bold text-[#0f2d6b] mb-1">1.2</div>
              <div className="text-sm text-gray-600">CiteScore (2023)</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Globe className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
              <div className="text-2xl font-bold text-[#0f2d6b] mb-1">85+</div>
              <div className="text-sm text-gray-600">Countries Represented</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Users className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
              <div className="text-2xl font-bold text-[#0f2d6b] mb-1">15K+</div>
              <div className="text-sm text-gray-600">Annual Downloads</div>
            </div>
          </div>

          {/* Citation Metrics */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Citation Metrics</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Indicators</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">2023 Impact Factor:</span>
                    <span className="text-gray-900 font-bold text-lg">2.847</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">5-Year Impact Factor:</span>
                    <span className="text-gray-900 font-bold">2.523</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">CiteScore 2023:</span>
                    <span className="text-gray-900 font-bold">1.2</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">h-index:</span>
                    <span className="text-gray-900 font-bold">42</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Articles Published (2023):</span>
                    <span className="text-gray-900 font-bold">485</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Citations (2023):</span>
                    <span className="text-gray-900 font-bold">8,247</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Acceptance Rate:</span>
                    <span className="text-gray-900 font-bold">35%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Average Review Time:</span>
                    <span className="text-gray-900 font-bold">28 days</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Reach</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Countries Represented:</span>
                    <span className="text-gray-900 font-bold">85+</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">International Authors:</span>
                    <span className="text-gray-900 font-bold">92%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Annual Downloads:</span>
                    <span className="text-gray-900 font-bold">15,200+</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Page Views (Monthly):</span>
                    <span className="text-gray-900 font-bold">45K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Performance Trends</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Factor Growth</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">2023</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-blue-200 rounded-full h-2">
                        <div className="w-full bg-blue-600 h-2 rounded-full"></div>
                      </div>
                      <span className="text-gray-900 font-semibold">2.847</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">2022</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-blue-200 rounded-full h-2">
                        <div className="w-4/5 bg-blue-500 h-2 rounded-full"></div>
                      </div>
                      <span className="text-gray-900 font-semibold">2.234</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">2021</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-blue-200 rounded-full h-2">
                        <div className="w-3/4 bg-blue-400 h-2 rounded-full"></div>
                      </div>
                      <span className="text-gray-900 font-semibold">1.986</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Indicators</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Rigorous Peer Review</h4>
                      <p className="text-sm text-gray-600">Average 2.8 reviewers per manuscript with expert evaluation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">High Editorial Standards</h4>
                      <p className="text-sm text-gray-600">Maintained by distinguished international editorial board</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Growing Recognition</h4>
                      <p className="text-sm text-gray-600">Increasing citations and international visibility</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Author & Reader Demographics */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Author & Reader Demographics</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributing Countries</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">United States</span>
                    <span className="text-gray-900 font-medium">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">China</span>
                    <span className="text-gray-900 font-medium">16%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Germany</span>
                    <span className="text-gray-900 font-medium">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Japan</span>
                    <span className="text-gray-900 font-medium">10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">India</span>
                    <span className="text-gray-900 font-medium">8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Others</span>
                    <span className="text-gray-900 font-medium">36%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Areas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Nanomaterials</span>
                    <span className="text-gray-900 font-medium">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Energy Materials</span>
                    <span className="text-gray-900 font-medium">22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Biomaterials</span>
                    <span className="text-gray-900 font-medium">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Smart Materials</span>
                    <span className="text-gray-900 font-medium">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Composites</span>
                    <span className="text-gray-900 font-medium">10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Others</span>
                    <span className="text-gray-900 font-medium">7%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Statistics</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-[#0f2d6b] mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Global Access</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-[#0f2d6b] mb-1">100%</div>
                    <div className="text-sm text-gray-600">Open Access</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-[#0f2d6b] mb-1">$0</div>
                    <div className="text-sm text-gray-600">Access Fee</div>
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