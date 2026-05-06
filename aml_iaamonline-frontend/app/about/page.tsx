"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Globe, Users, Calendar, Target, BookOpen, Zap, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>About Advanced Materials Letters</h1>
          <p className="text-[#5a6a8a] text-lg leading-relaxed">
            A premier international, peer-reviewed, open access journal dedicated to advancing the field of materials science and engineering through high-quality research publications.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Journal Overview */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Journal Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#3a4a6a] leading-relaxed">
                  <strong>Advanced Materials Letters (AML)</strong> is an international scientific journal published by the International Association of Advanced Materials (IAAM). The journal serves as a platform for researchers, scientists, and engineers to share their latest discoveries and innovations in the rapidly evolving field of materials science.
                </p>
                <p className="text-[#3a4a6a] leading-relaxed">
                  Since its inception, AML has been committed to maintaining the highest standards of scientific excellence while ensuring rapid dissemination of research findings. The journal operates under a Diamond Open Access model, making all content freely available to readers worldwide without any financial barriers.
                </p>
                <p className="text-[#3a4a6a] leading-relaxed">
                  Our mission is to bridge the gap between fundamental research and practical applications, fostering collaboration across disciplines and geographical boundaries. We welcome submissions from researchers at all career stages, from emerging scientists to established leaders in the field.
                </p>
              </CardContent>
            </Card>

            {/* Publication Types */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Publication Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { type: "Research Articles", desc: "Original research with comprehensive experimental details and analysis" },
                    { type: "Review Articles", desc: "Comprehensive reviews of established topics and emerging trends" },
                    { type: "Letters", desc: "Short communications reporting urgent or significant findings" },
                    { type: "Perspectives", desc: "Forward-looking opinion pieces by invited experts in the field" }
                  ].map((item) => (
                    <div key={item.type} className="p-4 border border-border rounded-lg hover:bg-[#f0f4fb] transition-colors">
                      <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>{item.type}</h4>
                      <p className="text-[#5a6a8a] text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Open Access Commitment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Diamond Open Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#3a4a6a] leading-relaxed">
                  AML is proud to operate under a <strong>Diamond Open Access</strong> model, which means:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "No Article Processing Charges (APCs)",
                    "No submission or publication fees",
                    "Free access for all readers worldwide",
                    "Immediate availability upon publication",
                    "CC BY 4.0 licensing for maximum reuse",
                    "No financial barriers to knowledge"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#3a4a6a] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">ISSN (Print)</span>
                    <Badge variant="secondary">0976-3961</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">eISSN</span>
                    <Badge variant="secondary">1998-0140</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">Publisher</span>
                    <span className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>IAAM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">Frequency</span>
                    <span className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>Monthly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-sm">Language</span>
                    <span className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>English</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Focus Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Nanomaterials",
                    "Biomaterials", 
                    "Smart Materials",
                    "Energy Materials",
                    "2D Materials",
                    "Composites",
                    "Ceramics",
                    "Polymers",
                    "Metals & Alloys",
                    "Electronic Materials"
                  ].map((area) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Editorial Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-[#0f2d6b] text-sm mb-1" style={{ fontWeight: 600 }}>International Association of Advanced Materials</p>
                  <p className="text-[#5a6a8a] text-xs leading-relaxed">
                    Gammalkilsvägen 18A<br />
                    16974 Vaxholm, Sweden
                  </p>
                </div>
                <div>
                  <p className="text-[#0f2d6b] text-sm mb-1" style={{ fontWeight: 600 }}>Email</p>
                  <p className="text-[#5a6a8a] text-xs">aml@iaamonline.org</p>
                </div>
                <div>
                  <p className="text-[#0f2d6b] text-sm mb-1" style={{ fontWeight: 600 }}>Website</p>
                  <p className="text-[#5a6a8a] text-xs">www.iaamonline.org</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Awards & Recognition */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recognition & Indexing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Scopus Indexed", desc: "Listed in Scopus database for global visibility" },
                { title: "Web of Science", desc: "Tracked in Clarivate's Web of Science Core Collection" },
                { title: "DOAJ Listed", desc: "Directory of Open Access Journals certified" },
                { title: "CrossRef DOI", desc: "Digital Object Identifiers for all articles" }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-[#0f2d6b]" />
                  </div>
                  <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>{item.title}</h4>
                  <p className="text-[#5a6a8a] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
