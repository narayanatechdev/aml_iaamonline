'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Diamond, DollarSign, Globe, CheckCircle, Users, BookOpen } from 'lucide-react';

export default function PublishingModelsPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', path: '/about-journal' },
              { label: 'Our Publishing Models' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Our Publishing Models</h1>
          <p className="text-lg text-gray-700">
            Committed to Diamond Open Access for universal knowledge sharing
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Diamond Open Access Hero */}
          <div className="bg-gray-200 text-black rounded-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-300 border border-gray-400 text-black text-sm mb-4 font-medium">
                  <Diamond className="w-4 h-4" />
                  Diamond Open Access
                </div>
                <h2 className="text-2xl font-bold mb-4">Zero Fees for Authors & Readers</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Advanced Materials Letters operates under the Diamond Open Access model, ensuring that 
                  scientific knowledge is freely accessible to everyone without any financial barriers.
                </p>
                <ul className="space-y-2">
                  {[
                    "No Article Processing Charges (APCs)",
                    "No submission fees for authors",
                    "No reading or download fees",
                    "Immediate open access upon publication"
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
                <div className="text-black text-lg mb-2 font-semibold">Publication Cost</div>
                <div className="text-gray-600 text-sm">Forever free to publish & read</div>
              </div>
            </div>
          </div>

          {/* Publishing Model Comparison */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Publishing Model Comparison</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 text-[#0f2d6b] font-semibold">Diamond OA<br/>(Our Model)</th>
                    <th className="text-center py-4 px-4 text-gray-600 font-semibold">Gold OA</th>
                    <th className="text-center py-4 px-4 text-gray-600 font-semibold">Traditional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-900">Author Fees (APCs)</td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-sm text-gray-600 mt-1">$0</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-red-600 font-semibold">$1,500-5,000+</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-gray-600">Varies</div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-900">Reader Access</td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Free</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Free</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-red-600">Subscription Required</div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-900">Copyright</td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-[#0f2d6b] font-medium">CC BY 4.0</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-gray-600">CC BY 4.0</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-gray-600">Publisher Retains</div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-900">Sustainability</td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-[#0f2d6b] font-medium">Community Funded</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-gray-600">Author/Funder Pays</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-gray-600">Subscriber Pays</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Benefits for Stakeholders */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Benefits for All Stakeholders</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">For Authors</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">No Financial Barriers</h4>
                      <p className="text-sm text-gray-600">Publish without worrying about APCs or submission fees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Maximum Visibility</h4>
                      <p className="text-sm text-gray-600">Research freely accessible to global audience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Retain Copyright</h4>
                      <p className="text-sm text-gray-600">Authors maintain rights under CC BY 4.0</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">For Researchers</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Free Access</h4>
                      <p className="text-sm text-gray-600">No subscription fees or institutional barriers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Immediate Access</h4>
                      <p className="text-sm text-gray-600">Latest research available immediately upon publication</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Global Equity</h4>
                      <p className="text-sm text-gray-600">Equal access regardless of institutional wealth</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">For Society</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Knowledge Sharing</h4>
                      <p className="text-sm text-gray-600">Scientific knowledge freely available to all</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Innovation Acceleration</h4>
                      <p className="text-sm text-gray-600">Faster research progress through open collaboration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Educational Impact</h4>
                      <p className="text-sm text-gray-600">Enhanced learning and teaching opportunities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability & Funding */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Sustainability & Funding</h2>
            </div>
            
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                Our Diamond Open Access model is sustained through the commitment of the International Association 
                of Advanced Materials (IAAM) and support from the global materials science community. This ensures 
                long-term sustainability without placing financial burden on authors or readers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Sources</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">IAAM Support</h4>
                      <p className="text-sm text-gray-600">Primary funding from IAAM resources</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Community Contributions</h4>
                      <p className="text-sm text-gray-600">Voluntary support from scientific community</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Institutional Partnerships</h4>
                      <p className="text-sm text-gray-600">Collaborations with research institutions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Commitment</h3>
                <div className="bg-gray-200 text-black p-6 rounded-lg">
                  <blockquote className="text-gray-700 italic mb-4">
                    "We believe that scientific knowledge should be a public good, freely available to advance 
                    human understanding and solve global challenges."
                  </blockquote>
                  <div className="text-black font-medium">— IAAM Editorial Team</div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Long-term Sustainability:</strong> Our model is designed for long-term sustainability, 
                    ensuring that Advanced Materials Letters remains freely accessible for years to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}