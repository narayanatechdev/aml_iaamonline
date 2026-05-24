'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Heart, Shield, Globe, CheckCircle, Users, Target } from 'lucide-react';

export default function EditorialValuesPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', path: '/about-journal' },
              { label: 'Editorial Values Statement' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Editorial Values Statement</h1>
          <p className="text-lg text-gray-700">
            Our commitment to integrity, excellence, and open science
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Core Values */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Our Core Values</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Shield className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
                <p className="text-sm text-gray-600">
                  Unwavering commitment to ethical standards and honest reporting
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Target className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-sm text-gray-600">
                  Pursuing the highest quality in research and publication standards
                </p>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <Globe className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-sm text-gray-600">
                  Making scientific knowledge freely available to all researchers worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Values */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">Our Editorial Values in Detail</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-[#0f2d6b]" />
                  Scientific Integrity
                </h3>
                <div className="pl-9 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    We are committed to maintaining the highest standards of scientific integrity throughout 
                    the publication process. This includes rigorous peer review, transparent reporting of 
                    methodology and results, and strict adherence to ethical guidelines.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Zero tolerance for research misconduct including plagiarism and data fabrication",
                      "Transparent disclosure of conflicts of interest and funding sources",
                      "Adherence to international standards for research ethics",
                      "Support for reproducible research practices"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#0f2d6b]" />
                  Editorial Excellence
                </h3>
                <div className="pl-9 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    Our editorial team is dedicated to publishing only the highest quality research that 
                    advances the field of materials science. We maintain rigorous standards while providing 
                    constructive feedback to authors.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Expert peer review by leading researchers in relevant fields",
                      "Fair and unbiased evaluation of all submissions",
                      "Constructive feedback to help authors improve their work",
                      "Timely decision-making to serve the research community"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#0f2d6b]" />
                  Diversity & Inclusion
                </h3>
                <div className="pl-9 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    We actively promote diversity and inclusion in all aspects of our publication. This 
                    includes diverse representation on our editorial board, fair treatment of authors from 
                    all backgrounds, and commitment to global accessibility.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Global representation on editorial board and reviewer pool",
                      "Support for researchers from developing countries",
                      "Equal consideration regardless of institutional affiliation",
                      "Language assistance for non-native English speakers"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#0f2d6b]" />
                  Open Science Commitment
                </h3>
                <div className="pl-9 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    As a Diamond Open Access journal, we are committed to the principles of open science, 
                    ensuring that research is freely available to advance human knowledge and address 
                    global challenges.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Immediate open access to all published articles",
                      "Support for open data and reproducible research",
                      "Encouragement of preprint sharing and collaboration",
                      "Commitment to long-term preservation of scientific record"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Our Promise */}
          <div className="bg-[#0f2d6b] text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Our Promise to the Scientific Community</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">To Authors</h3>
                <ul className="space-y-2 text-white/90">
                  <li>• Fair, timely, and constructive peer review</li>
                  <li>• Transparent editorial processes</li>
                  <li>• Maximum visibility for your research</li>
                  <li>• No financial barriers to publication</li>
                  <li>• Support throughout the publication journey</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">To Readers</h3>
                <ul className="space-y-2 text-white/90">
                  <li>• High-quality, rigorously reviewed content</li>
                  <li>• Free and immediate access to all articles</li>
                  <li>• Reliable and trustworthy scientific information</li>
                  <li>• Commitment to editorial independence</li>
                  <li>• Continuous improvement and innovation</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white/10 rounded-lg">
              <blockquote className="text-white/90 italic text-lg leading-relaxed">
                "We believe that scientific publishing should serve the global research community, 
                advancing knowledge and fostering collaboration across all boundaries."
              </blockquote>
              <div className="text-white font-medium mt-4">— Advanced Materials Letters Editorial Team</div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}