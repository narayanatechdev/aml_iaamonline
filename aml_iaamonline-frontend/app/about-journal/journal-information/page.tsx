'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Info, Calendar, Globe, BookOpen, Award, FileText } from 'lucide-react';

export default function JournalInformationPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', path: '/about-journal' },
              { label: 'Journal Information' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Journal Information</h1>
          <p className="text-lg text-gray-700">
            Essential information about Advanced Materials Letters
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Basic Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Journal Title</h3>
                  <p className="text-gray-700">Advanced Materials Letters</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Abbreviated Title</h3>
                  <p className="text-gray-700">Adv. Mater. Lett.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">ISSN Information</h3>
                  <div className="space-y-1">
                    <p className="text-gray-700">Print ISSN: 0976-3961</p>
                    <p className="text-gray-700">Electronic ISSN: 1998-0140</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Publisher</h3>
                  <p className="text-gray-700">International Association of Advanced Materials (IAAM)</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Publication Frequency</h3>
                  <p className="text-gray-700">Monthly (12 issues per year)</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">First Published</h3>
                  <p className="text-gray-700">2010</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Language</h3>
                  <p className="text-gray-700">English</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Model</h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-300 text-green-800 text-sm font-medium">
                    Diamond Open Access
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scope & Coverage */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Scope & Coverage</h2>
            </div>
            
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">
                Advanced Materials Letters publishes high-quality research articles, reviews, and communications 
                covering all aspects of advanced materials science and engineering. The journal focuses on 
                cutting-edge research that advances our understanding of materials properties, synthesis, 
                characterization, and applications.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">Materials Science</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Nanomaterials & Nanostructures</li>
                  <li>• Smart Materials & Systems</li>
                  <li>• Composite Materials</li>
                  <li>• Functional Materials</li>
                  <li>• Bio-inspired Materials</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">Applications</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Energy Storage & Conversion</li>
                  <li>• Environmental Applications</li>
                  <li>• Biomedical Applications</li>
                  <li>• Electronic & Photonic Devices</li>
                  <li>• Catalysis & Sensors</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-4">Characterization</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Structural Characterization</li>
                  <li>• Property Measurements</li>
                  <li>• Advanced Microscopy</li>
                  <li>• Spectroscopic Methods</li>
                  <li>• Computational Modeling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Publication Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Publication Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Types</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">Research Articles</h4>
                    <p className="text-sm text-gray-600">Original research with full experimental details (up to 8,000 words)</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">Review Articles</h4>
                    <p className="text-sm text-gray-600">Comprehensive reviews of established topics (up to 15,000 words)</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-medium text-gray-900">Letters</h4>
                    <p className="text-sm text-gray-600">Short communications of urgent importance (up to 3,000 words)</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900">Perspectives</h4>
                    <p className="text-sm text-gray-600">Forward-looking opinion pieces by invited experts</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Times</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Initial Editorial Decision:</span>
                    <span className="text-gray-900 font-medium">3-5 days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Peer Review:</span>
                    <span className="text-gray-900 font-medium">4-6 weeks</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Final Decision:</span>
                    <span className="text-gray-900 font-medium">6-8 weeks</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Time to Publication:</span>
                    <span className="text-gray-900 font-medium">2-4 weeks after acceptance</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Fast Track Option:</strong> Letters and urgent communications may be expedited 
                    with publication possible within 2-3 weeks of submission.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Indexing & Recognition */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Indexing & Recognition</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-[#0f2d6b] mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Scopus Indexed</h3>
                <p className="text-sm text-gray-600">Indexed in Scopus database</p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <FileText className="w-8 h-8 text-[#0f2d6b] mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Web of Science</h3>
                <p className="text-sm text-gray-600">Emerging Sources Citation Index</p>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <Globe className="w-8 h-8 text-[#0f2d6b] mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">DOI Registration</h3>
                <p className="text-sm text-gray-600">All articles receive DOI</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Indexing Services</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Chemical Abstracts Service (CAS)</li>
                  <li>• Google Scholar</li>
                  <li>• CrossRef</li>
                  <li>• DOAJ (Directory of Open Access Journals)</li>
                </ul>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• OCLC WorldCat</li>
                  <li>• Academic Search Complete</li>
                  <li>• Science Citation Index Expanded</li>
                  <li>• Materials Science Citation Index</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}