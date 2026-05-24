'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { FileText, Shield, Users, CheckCircle } from 'lucide-react';

export default function EditorialPoliciesPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Editorial Policies' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Editorial Policies</h1>
          <p className="text-lg text-gray-700">
            Comprehensive policies governing our editorial process and publication standards
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Peer Review Policy */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Peer Review Policy</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Advanced Materials Letters employs a rigorous double-blind peer review process to ensure 
                the highest quality of published research. All manuscripts undergo thorough evaluation 
                by expert reviewers in the relevant field.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Process</h3>
                  <div className="space-y-3">
                    {[
                      "Double-blind peer review for all research articles",
                      "Minimum 2-3 expert reviewers per manuscript",
                      "Editorial board oversight and final decisions",
                      "Transparent and constructive feedback to authors",
                      "Appeals process for disputed decisions"
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Criteria</h3>
                  <div className="space-y-3">
                    {[
                      "Scientific rigor and methodology",
                      "Novelty and significance of findings", 
                      "Clarity of presentation and writing",
                      "Appropriate use of references and citations",
                      "Ethical compliance and data integrity"
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
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
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Publication Ethics</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Research Misconduct</h3>
                <p className="text-sm text-red-700 mb-3">Zero tolerance policy for:</p>
                <ul className="text-sm text-red-600 space-y-1">
                  <li>• Plagiarism and self-plagiarism</li>
                  <li>• Data fabrication or falsification</li>
                  <li>• Duplicate or redundant publication</li>
                  <li>• Undisclosed conflicts of interest</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Author Responsibilities</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Ensure originality and accuracy</li>
                  <li>• Disclose all funding sources</li>
                  <li>• Declare conflicts of interest</li>
                  <li>• Provide access to research data</li>
                  <li>• Obtain necessary permissions</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Editorial Standards</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Unbiased evaluation process</li>
                  <li>• Confidentiality of submissions</li>
                  <li>• Transparent decision making</li>
                  <li>• Timely communication</li>
                  <li>• Post-publication corrections</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright and Licensing */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Copyright & Licensing</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                All articles published in Advanced Materials Letters are made available under the Creative 
                Commons Attribution License (CC BY 4.0), ensuring maximum accessibility and reuse rights 
                while maintaining proper attribution.
              </p>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">CC BY 4.0 License Benefits</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">You are free to:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Share — copy and redistribute in any medium</li>
                      <li>• Adapt — remix, transform, and build upon</li>
                      <li>• Commercial use — for any purpose</li>
                      <li>• No additional restrictions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Under the terms:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Attribution — must give appropriate credit</li>
                      <li>• Indicate if changes were made</li>
                      <li>• Link to license</li>
                      <li>• No warranty or liability</li>
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