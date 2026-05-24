'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Clock, Milestone, TrendingUp, Globe } from 'lucide-react';

export default function HistoryPage() {
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
          <h1 className="text-3xl font-bold mb-4">History & Milestones</h1>
          <p className="text-lg text-gray-700">
            A journey through the evolution of Advanced Materials Letters
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Our Journey</h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <div className="text-2xl font-bold text-[#0f2d6b]">2010</div>
                </div>
                <div className="flex-grow pl-6 border-l-2 border-[#0f2d6b]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Journal Launch</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Advanced Materials Letters was founded by IAAM with a vision to provide 
                    a diamond open access platform for materials science research.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <div className="text-2xl font-bold text-[#0f2d6b]">2015</div>
                </div>
                <div className="flex-grow pl-6 border-l-2 border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Recognition</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Achieved international recognition with submissions from over 50 countries 
                    and established partnerships with leading research institutions.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <div className="text-2xl font-bold text-[#0f2d6b]">2018</div>
                </div>
                <div className="flex-grow pl-6 border-l-2 border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Scopus Indexing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Successfully indexed in Scopus, marking a significant milestone in 
                    journal quality and international visibility.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <div className="text-2xl font-bold text-[#0f2d6b]">2023</div>
                </div>
                <div className="flex-grow pl-6 border-l-2 border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Innovation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Launched enhanced digital platform with improved user experience 
                    and advanced manuscript management system.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Milestone className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Key Achievements</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-[#0f2d6b] mb-2">5,000+</div>
                <div className="text-sm text-gray-600">Articles Published</div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-[#0f2d6b] mb-2">85+</div>
                <div className="text-sm text-gray-600">Countries Served</div>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-[#0f2d6b] mb-2">10M+</div>
                <div className="text-sm text-gray-600">Article Downloads</div>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-[#0f2d6b] mb-2">15+</div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
            </div>
          </div>

          {/* Vision Forward */}
          <div className="bg-[#0f2d6b] text-white rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Looking Forward</h2>
            </div>
            
            <p className="text-white/90 leading-relaxed mb-6">
              As we continue our journey, Advanced Materials Letters remains committed to 
              advancing materials science through open access publishing, fostering global 
              collaboration, and supporting breakthrough research that shapes the future.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Globe className="w-8 h-8 text-white mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Global Expansion</h3>
                <p className="text-white/80 text-sm">Reaching more researchers worldwide</p>
              </div>
              
              <div className="text-center">
                <Milestone className="w-8 h-8 text-white mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Technology Innovation</h3>
                <p className="text-white/80 text-sm">Enhanced digital publishing tools</p>
              </div>
              
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Impact Growth</h3>
                <p className="text-white/80 text-sm">Increasing scientific influence</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}