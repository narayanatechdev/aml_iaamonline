'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Award, Trophy, Star, Medal } from 'lucide-react';

export default function AwardsPage() {
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
          <h1 className="text-3xl font-bold mb-4">Awards & Recognition</h1>
          <p className="text-lg text-gray-700">
            Celebrating excellence in materials science research and publication
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Journal Awards */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Journal Recognition</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-yellow-50 rounded-lg p-6 text-center">
                <Medal className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scopus Indexed</h3>
                <p className="text-sm text-gray-600 mb-2">2018 - Present</p>
                <p className="text-xs text-gray-500">Recognized for high editorial standards</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact Factor Growth</h3>
                <p className="text-sm text-gray-600 mb-2">2019 - 2023</p>
                <p className="text-xs text-gray-500">Consistent increase in citation metrics</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Diamond OA Pioneer</h3>
                <p className="text-sm text-gray-600 mb-2">2010 - Present</p>
                <p className="text-xs text-gray-500">Leading diamond open access model</p>
              </div>
            </div>
          </div>

          {/* Annual Awards */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Annual Excellence Awards</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-8">
              Advanced Materials Letters recognizes outstanding contributions to materials science through 
              our annual awards program, celebrating exceptional research, innovative discoveries, and 
              significant contributions to the field.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Paper Awards</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-medium text-gray-900">Outstanding Research Article (2023)</h4>
                    <p className="text-sm text-gray-600">"Novel Graphene-Based Nanocomposites for Energy Storage"</p>
                    <p className="text-xs text-gray-500 mt-1">Recognized for groundbreaking methodology and impact</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">Innovation in Materials (2023)</h4>
                    <p className="text-sm text-gray-600">"Smart Materials for Biomedical Applications"</p>
                    <p className="text-xs text-gray-500 mt-1">Awarded for innovative approach and clinical potential</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">Sustainability Excellence (2023)</h4>
                    <p className="text-sm text-gray-600">"Eco-Friendly Material Processing Techniques"</p>
                    <p className="text-xs text-gray-500 mt-1">Recognized for environmental impact and sustainability</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Young Researcher Awards</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900">Early Career Excellence (2023)</h4>
                    <p className="text-sm text-gray-600">Dr. Research Scientist</p>
                    <p className="text-xs text-gray-500 mt-1">Outstanding contribution by researcher under 35</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-gray-900">Emerging Scientist Award (2023)</h4>
                    <p className="text-sm text-gray-600">Dr. Materials Innovator</p>
                    <p className="text-xs text-gray-500 mt-1">Recognizing promising early-career achievements</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-medium text-gray-900">Student Research Excellence (2023)</h4>
                    <p className="text-sm text-gray-600">Graduate Student Researcher</p>
                    <p className="text-xs text-gray-500 mt-1">Outstanding PhD research publication</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recognition Program */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">Recognition Criteria</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Star className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Scientific Excellence</h3>
                <p className="text-sm text-gray-600">
                  Outstanding quality, rigor, and innovation in research methodology and findings
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Trophy className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Impact & Significance</h3>
                <p className="text-sm text-gray-600">
                  Demonstrated potential for advancing materials science and real-world applications
                </p>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <Award className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Community Recognition</h3>
                <p className="text-sm text-gray-600">
                  High citation rates, media attention, and recognition by scientific community
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-[#0f2d6b] text-white rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nomination Process</h3>
              <p className="text-white/90 mb-4">
                Nominations for annual awards are accepted from editorial board members, reviewers, 
                and the broader scientific community. Self-nominations are also welcome.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Submission Deadline:</h4>
                  <p className="text-white/80 text-sm">December 31st annually</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Announcement:</h4>
                  <p className="text-white/80 text-sm">February of following year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}