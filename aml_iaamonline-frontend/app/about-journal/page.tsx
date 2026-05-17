'use client';

import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';
import { BookOpen, Users, Award, Globe, FileText, CheckCircle } from 'lucide-react';

export default function AboutJournalPage() {
  return (
    <MainLayout>
      <div className="bg-[#0f2d6b] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-4">About Journal</h1>
          <p className="text-lg text-white/80">
            Learn more about Advanced Materials Letters and our commitment to materials science research
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Journal Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Journal Overview</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Advanced Materials Letters (AML) is an international, peer-reviewed, diamond open access journal 
                that covers all aspects of materials science and engineering. Established to promote cutting-edge 
                research in advanced materials, AML serves as a premier platform for researchers, scientists, and 
                engineers worldwide.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The journal is committed to publishing high-quality research articles, reviews, and communications 
                that advance our understanding of materials properties, synthesis, characterization, and applications. 
                Our diamond open access model ensures that all research is freely available to the global scientific community.
              </p>
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Link href="/about-journal/aims-scope" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group-hover:border-[#0f2d6b]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#0f2d6b]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f2d6b] group-hover:text-[#0d2560]">Aims & Scope</h3>
                </div>
                <p className="text-gray-600">
                  Learn about our journal's objectives, research areas, and publication standards.
                </p>
              </div>
            </Link>

            <Link href="/about-journal/editorial-board" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group-hover:border-[#0f2d6b]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#0f2d6b]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f2d6b] group-hover:text-[#0d2560]">Editorial Board</h3>
                </div>
                <p className="text-gray-600">
                  Meet our distinguished editorial board members and their expertise areas.
                </p>
              </div>
            </Link>

            <Link href="/about-journal/indexing" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group-hover:border-[#0f2d6b]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-[#0f2d6b]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f2d6b] group-hover:text-[#0d2560]">Indexing</h3>
                </div>
                <p className="text-gray-600">
                  View the databases and indexing services that include our journal.
                </p>
              </div>
            </Link>

            <Link href="/about-journal/ethics-process" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group-hover:border-[#0f2d6b]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#0f2d6b]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f2d6b] group-hover:text-[#0d2560]">Ethics & Process</h3>
                </div>
                <p className="text-gray-600">
                  Information about our publication ethics and editorial processes.
                </p>
              </div>
            </Link>

            <Link href="/about-journal/review-process" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group-hover:border-[#0f2d6b]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#0f2d6b]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f2d6b] group-hover:text-[#0d2560]">Review Process</h3>
                </div>
                <p className="text-gray-600">
                  Understand our rigorous peer review and quality assurance processes.
                </p>
              </div>
            </Link>

            <Link href="/contact" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group-hover:border-[#0f2d6b]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#0f2d6b]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f2d6b] group-hover:text-[#0d2560]">Contact Us</h3>
                </div>
                <p className="text-gray-600">
                  Get in touch with our editorial team for inquiries and support.
                </p>
              </div>
            </Link>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Diamond Open Access</h4>
                    <p className="text-sm text-gray-600">Free to publish, free to read for all researchers worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Rigorous Peer Review</h4>
                    <p className="text-sm text-gray-600">Expert review process ensuring high-quality publications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">International Scope</h4>
                    <p className="text-sm text-gray-600">Global reach with international editorial board</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Fast Publication</h4>
                    <p className="text-sm text-gray-600">Efficient review and publication process</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Wide Indexing</h4>
                    <p className="text-sm text-gray-600">Indexed in major scientific databases</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">High Impact</h4>
                    <p className="text-sm text-gray-600">Publishing influential research in materials science</p>
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