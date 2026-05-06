"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Search, Globe, CheckCircle, Star, TrendingUp, Link, Award } from 'lucide-react';

export default function Indexing() {
  const majorIndexes = [
    {
      name: "Scopus",
      provider: "Elsevier",
      description: "Largest abstract and citation database of peer-reviewed literature",
      coverage: "Global",
      status: "Active",
      since: "2015",
      icon: <Database className="w-5 h-5 text-blue-600" />,
      featured: true
    },
    {
      name: "Web of Science Core Collection",
      provider: "Clarivate Analytics", 
      description: "Premier global citation database spanning all disciplines",
      coverage: "International",
      status: "Active",
      since: "2016",
      icon: <Globe className="w-5 h-5 text-green-600" />,
      featured: true
    },
    {
      name: "Directory of Open Access Journals (DOAJ)",
      provider: "DOAJ Foundation",
      description: "Community-curated directory of quality open access journals",
      coverage: "Global",
      status: "Active", 
      since: "2014",
      icon: <Search className="w-5 h-5 text-orange-600" />,
      featured: true
    }
  ];

  const additionalIndexes = [
    "Chemical Abstracts Service (CAS)",
    "CrossRef",
    "Google Scholar",
    "Microsoft Academic",
    "Semantic Scholar",
    "Dimensions",
    "BASE (Bielefeld Academic Search Engine)",
    "ROAD (Directory of Open Access scholarly Resources)",
    "Ulrich's Periodicals Directory",
    "JournalGuide",
    "Academia.edu",
    "ResearchGate"
  ];

  const metrics = [
    {
      metric: "CiteScore",
      value: "3.2",
      provider: "Scopus",
      description: "Average citations per document published in the journal"
    },
    {
      metric: "SJR",
      value: "0.68", 
      provider: "Scimago",
      description: "Scientific Journal Rankings based on citation data"
    },
    {
      metric: "SNIP",
      value: "1.15",
      provider: "Scopus",
      description: "Source Normalized Impact per Paper"
    },
    {
      metric: "h-index",
      value: "42",
      provider: "Google Scholar",
      description: "Largest number h such that h articles have at least h citations"
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>Indexing & Abstracting</h1>
          <p className="text-[#5a6a8a] text-lg leading-relaxed">
            Advanced Materials Letters is indexed and abstracted by leading scientific databases worldwide, ensuring global visibility and accessibility of published research.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Major Indexes */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#c9a227]" />
                  Major Scientific Databases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {majorIndexes.map((index, idx) => (
                    <div key={idx} className={`p-6 border rounded-lg ${index.featured ? 'border-[#c9a227] bg-[#c9a227]/5' : 'border-border'} hover:shadow-md transition-shadow`}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg border border-border flex items-center justify-center shadow-sm">
                          {index.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-[#0f2d6b] text-sm mb-1" style={{ fontWeight: 600 }}>
                                {index.name}
                                {index.featured && <Badge variant="secondary" className="ml-2 text-xs">Premium</Badge>}
                              </h4>
                              <p className="text-[#5a6a8a] text-xs">{index.provider}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs mb-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {index.status}
                              </Badge>
                              <p className="text-[#5a6a8a] text-xs">Since {index.since}</p>
                            </div>
                          </div>
                          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">{index.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-[#5a6a8a]" />
                              <span className="text-[#5a6a8a] text-xs">{index.coverage}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Citation Metrics */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Citation Metrics & Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {metrics.map((metric, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg text-center hover:bg-[#f0f4fb] transition-colors">
                      <div className="text-[#0f2d6b] text-2xl font-bold mb-1">{metric.value}</div>
                      <div className="text-[#0f2d6b] text-sm mb-1" style={{ fontWeight: 600 }}>{metric.metric}</div>
                      <div className="text-[#5a6a8a] text-xs mb-2">{metric.provider}</div>
                      <div className="text-[#3a4a6a] text-xs leading-relaxed">{metric.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits of Indexing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Benefits for Authors & Readers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>For Authors</h4>
                    <div className="space-y-2">
                      {[
                        "Global research visibility",
                        "Enhanced citation potential",
                        "Academic career advancement",
                        "International collaboration opportunities",
                        "Research impact measurement"
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[#5a6a8a] text-xs">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>For Readers</h4>
                    <div className="space-y-2">
                      {[
                        "Easy access to quality research",
                        "Comprehensive search capabilities",
                        "Citation tracking and analysis",
                        "Related article discovery",
                        "Research trend identification"
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[#5a6a8a] text-xs">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">Indexing Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-[#0f2d6b]/5 rounded-lg">
                    <div className="text-[#0f2d6b] text-lg font-bold">15+</div>
                    <div className="text-[#5a6a8a] text-xs">Major Databases</div>
                  </div>
                  <div className="text-center p-3 bg-[#0f2d6b]/5 rounded-lg">
                    <div className="text-[#0f2d6b] text-lg font-bold">50+</div>
                    <div className="text-[#5a6a8a] text-xs">Countries Reached</div>
                  </div>
                  <div className="text-center p-3 bg-[#0f2d6b]/5 rounded-lg">
                    <div className="text-[#0f2d6b] text-lg font-bold">1M+</div>
                    <div className="text-[#5a6a8a] text-xs">Annual Downloads</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Indexes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Additional Databases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {additionalIndexes.map((index, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#5a6a8a] text-xs">{index}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submission Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">For Authors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-[#3a4a6a] text-xs leading-relaxed">
                  To maximize your article's visibility and impact:
                </p>
                <div className="space-y-2">
                  <div className="text-[#5a6a8a] text-xs">• Use relevant keywords in title and abstract</div>
                  <div className="text-[#5a6a8a] text-xs">• Include complete author affiliations</div>
                  <div className="text-[#5a6a8a] text-xs">• Provide comprehensive references</div>
                  <div className="text-[#5a6a8a] text-xs">• Follow journal formatting guidelines</div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">Indexing Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>Editorial Office</p>
                  <p className="text-[#5a6a8a] text-xs">aml@iaamonline.org</p>
                </div>
                <p className="text-[#3a4a6a] text-xs leading-relaxed">
                  For questions about indexing status or citation metrics, please contact our editorial office.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}