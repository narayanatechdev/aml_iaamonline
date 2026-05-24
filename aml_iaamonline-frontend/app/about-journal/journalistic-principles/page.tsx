'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Scale, Eye, Heart, Shield } from 'lucide-react';

export default function JournalisticPrinciplesPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Journalistic Principles' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Journalistic Principles</h1>
          <p className="text-lg text-gray-700">
            The fundamental principles guiding our editorial practices and scientific publishing
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Core Principles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Scale className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fairness</h3>
              <p className="text-sm text-gray-600">Unbiased evaluation and equal treatment for all</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Eye className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-sm text-gray-600">Open processes and clear communication</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Shield className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-sm text-gray-600">Honest and ethical practices in all aspects</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Heart className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service</h3>
              <p className="text-sm text-gray-600">Dedicated to serving the scientific community</p>
            </div>
          </div>

          {/* Detailed Principles */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-8">Our Editorial Principles in Practice</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Scale className="w-6 h-6 text-[#0f2d6b]" />
                  Editorial Independence & Fairness
                </h3>
                <div className="pl-9">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We maintain strict editorial independence, ensuring that all manuscript evaluations 
                    are based solely on scientific merit, methodological rigor, and contribution to 
                    the field. No external pressures, commercial interests, or personal relationships 
                    influence our editorial decisions.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Equal treatment regardless of author background, institution, or geography</li>
                    <li>• Decisions based solely on scientific quality and significance</li>
                    <li>• Protection from commercial and political influences</li>
                    <li>• Fair appeals process for all editorial decisions</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-[#0f2d6b]" />
                  Transparency & Accountability
                </h3>
                <div className="pl-9">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Transparency is fundamental to trust in scientific publishing. We are committed 
                    to clear communication about our processes, decisions, and policies. All 
                    stakeholders deserve to understand how we operate and make decisions.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Clear publication of editorial policies and procedures</li>
                    <li>• Open communication about decision rationale</li>
                    <li>• Transparent conflict of interest disclosures</li>
                    <li>• Accessible information about our editorial board and reviewers</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-[#0f2d6b]" />
                  Scientific Integrity & Ethics
                </h3>
                <div className="pl-9">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We uphold the highest standards of scientific integrity, actively working to 
                    prevent research misconduct and promote ethical research practices. The trust 
                    placed in scientific publications demands unwavering commitment to honesty 
                    and accuracy.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Rigorous screening for plagiarism and research misconduct</li>
                    <li>• Promotion of reproducible research practices</li>
                    <li>• Clear guidelines for ethical research conduct</li>
                    <li>• Swift action against violations of research integrity</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-[#0f2d6b]" />
                  Service to the Scientific Community
                </h3>
                <div className="pl-9">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our mission extends beyond publishing articles; we serve as stewards of 
                    scientific knowledge, facilitating discovery, collaboration, and advancement 
                    of materials science for the benefit of society.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Commitment to diamond open access for universal knowledge sharing</li>
                    <li>• Support for researchers at all career stages</li>
                    <li>• Promotion of global collaboration and inclusion</li>
                    <li>• Dedication to advancing scientific understanding</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-[#0f2d6b] text-white rounded-lg">
              <blockquote className="text-white/90 italic text-lg leading-relaxed mb-4">
                "Our commitment to these principles ensures that Advanced Materials Letters 
                remains a trusted platform for scientific communication, fostering innovation 
                and collaboration in the global materials science community."
              </blockquote>
              <div className="text-white font-medium">— Editorial Board, Advanced Materials Letters</div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}