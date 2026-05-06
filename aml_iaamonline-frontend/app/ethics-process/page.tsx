"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, FileText, Users, Clock, Eye, Scale } from 'lucide-react';

export default function EthicsProcess() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>Ethics & Process</h1>
          <p className="text-[#5a6a8a] text-lg leading-relaxed">
            Our commitment to ethical publishing practices and transparent peer review processes ensures the integrity and quality of all published research.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Publication Ethics */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Publication Ethics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#3a4a6a] leading-relaxed">
                  <strong>Advanced Materials Letters</strong> is committed to maintaining the highest standards of publication ethics. We follow the guidelines established by the Committee on Publication Ethics (COPE) and ensure that all stakeholders understand their ethical responsibilities.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Author Responsibilities",
                      points: [
                        "Submit only original, unpublished work",
                        "Provide accurate and complete citations",
                        "Disclose any conflicts of interest",
                        "Ensure proper authorship attribution",
                        "Report research methods and results honestly"
                      ]
                    },
                    {
                      title: "Editor Responsibilities", 
                      points: [
                        "Maintain confidentiality during review",
                        "Make fair and unbiased decisions",
                        "Handle misconduct allegations properly",
                        "Protect reviewer and author identities",
                        "Ensure timely review processes"
                      ]
                    }
                  ].map((section, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <h4 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>{section.title}</h4>
                      <div className="space-y-2">
                        {section.points.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-[#5a6a8a] text-xs">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Peer Review Process */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Peer Review Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-[#3a4a6a] leading-relaxed">
                    Our rigorous double-blind peer review process ensures the quality and integrity of published research. All manuscripts undergo comprehensive evaluation by international experts in the relevant field.
                  </p>
                  
                  <div className="grid gap-4">
                    {[
                      {
                        step: "1",
                        title: "Initial Editorial Assessment",
                        duration: "3-5 days",
                        description: "Manuscripts are checked for scope, quality, and technical merit by the editorial team."
                      },
                      {
                        step: "2", 
                        title: "Reviewer Assignment",
                        duration: "5-7 days",
                        description: "Qualified reviewers are identified and invited based on expertise and availability."
                      },
                      {
                        step: "3",
                        title: "Peer Review",
                        duration: "4-6 weeks",
                        description: "Expert reviewers conduct thorough evaluation and provide detailed feedback."
                      },
                      {
                        step: "4",
                        title: "Editorial Decision",
                        duration: "1-2 weeks",
                        description: "Editors review feedback and make final publication decisions."
                      },
                      {
                        step: "5",
                        title: "Author Revision",
                        duration: "2-4 weeks",
                        description: "Authors address reviewer comments and revise their manuscript as needed."
                      },
                      {
                        step: "6",
                        title: "Final Acceptance",
                        duration: "1-2 weeks", 
                        description: "Final review of revisions and preparation for publication."
                      }
                    ].map((step, index) => (
                      <div key={index} className="flex gap-4 p-4 border border-border rounded-lg hover:bg-[#f0f4fb] transition-colors">
                        <div className="w-10 h-10 bg-[#0f2d6b] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>{step.title}</h5>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-[#5a6a8a] text-xs leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research Misconduct */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Handling Research Misconduct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#3a4a6a] leading-relaxed">
                  We take allegations of research misconduct seriously and follow established procedures to investigate and address any concerns about published content.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      type: "Plagiarism",
                      description: "Unauthorized use of others' work without proper attribution",
                      action: "Immediate investigation and potential retraction"
                    },
                    {
                      type: "Data Fabrication", 
                      description: "Making up data or results that were never obtained",
                      action: "Full investigation with institutional collaboration"
                    },
                    {
                      type: "Duplicate Publication",
                      description: "Publishing the same research in multiple venues",
                      action: "Editorial notice and correction procedures"
                    }
                  ].map((misconduct, index) => (
                    <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h5 className="text-red-700 text-sm mb-2" style={{ fontWeight: 600 }}>{misconduct.type}</h5>
                      <p className="text-red-600 text-xs mb-3 leading-relaxed">{misconduct.description}</p>
                      <div className="text-red-700 text-xs" style={{ fontWeight: 500 }}>{misconduct.action}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ethics Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Ethics Standards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "COPE Member",
                      desc: "We are committed to COPE's best practices and guidelines for ethical publishing.",
                      badge: "Verified"
                    },
                    {
                      title: "DOAJ Compliance",
                      desc: "Full compliance with Directory of Open Access Journals quality standards.",
                      badge: "Certified"
                    },
                    {
                      title: "International Standards",
                      desc: "Adherence to international ethics guidelines and best practices.",
                      badge: "Compliant"
                    }
                  ].map((standard, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>{standard.title}</h5>
                        <Badge variant="secondary" className="text-xs">{standard.badge}</Badge>
                      </div>
                      <p className="text-[#5a6a8a] text-xs leading-relaxed">{standard.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Report Concerns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-[#3a4a6a] text-xs leading-relaxed">
                  If you have concerns about published content or the review process, please contact us:
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>Ethics Inquiries</p>
                    <p className="text-[#5a6a8a] text-xs">ethics@iaamonline.org</p>
                  </div>
                  <div>
                    <p className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>Editorial Office</p>
                    <p className="text-[#5a6a8a] text-xs">aml@iaamonline.org</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Typical Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-xs">Initial Review</span>
                    <span className="text-[#0f2d6b] text-xs font-bold">3-5 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-xs">Peer Review</span>
                    <span className="text-[#0f2d6b] text-xs font-bold">4-6 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-xs">First Decision</span>
                    <span className="text-[#0f2d6b] text-xs font-bold">6-8 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5a6a8a] text-xs">Final Decision</span>
                    <span className="text-[#0f2d6b] text-xs font-bold">8-12 weeks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviewer Recognition */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Reviewer Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-[#3a4a6a] text-xs leading-relaxed">
                    We recognize and appreciate our reviewers' contributions through:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-[#5a6a8a] text-xs">Annual recognition certificates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-[#5a6a8a] text-xs">Reviewer database profiles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-[#5a6a8a] text-xs">Outstanding reviewer awards</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}