"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, CheckCircle, FileText, Send, Eye, Edit, Globe, AlertCircle, Award } from 'lucide-react';

export default function Process() {
  const submissionSteps = [
    {
      step: 1,
      title: "Preparation",
      duration: "1-2 weeks",
      icon: <FileText className="w-5 h-5" />,
      description: "Prepare your manuscript according to our guidelines",
      details: [
        "Format manuscript according to journal style",
        "Prepare high-quality figures and tables",
        "Write comprehensive abstract and keywords",
        "Compile complete reference list",
        "Prepare supplementary materials if applicable"
      ],
      tips: "Use our manuscript template to ensure proper formatting from the start."
    },
    {
      step: 2,
      title: "Online Submission",
      duration: "30 minutes",
      icon: <Send className="w-5 h-5" />,
      description: "Submit through our online manuscript system",
      details: [
        "Create account on submission portal",
        "Upload manuscript files",
        "Complete author and affiliation information",
        "Suggest potential reviewers (optional)",
        "Provide cover letter"
      ],
      tips: "Ensure all co-authors approve the submission before uploading."
    },
    {
      step: 3,
      title: "Initial Editorial Assessment",
      duration: "3-5 days",
      icon: <Eye className="w-5 h-5" />,
      description: "Editorial team evaluates scope and quality",
      details: [
        "Check manuscript scope and fit",
        "Assess technical quality and novelty",
        "Verify formatting and completeness",
        "Screen for ethical issues",
        "Decision to proceed to peer review"
      ],
      tips: "Manuscripts are occasionally returned at this stage for major revisions."
    },
    {
      step: 4,
      title: "Peer Review",
      duration: "4-6 weeks",
      icon: <Eye className="w-5 h-5" />,
      description: "Expert reviewers evaluate your work",
      details: [
        "2-3 independent reviewers assigned",
        "Double-blind review process",
        "Reviewers assess scientific merit",
        "Detailed feedback provided",
        "Recommendations made to editor"
      ],
      tips: "Review time may vary depending on reviewer availability and manuscript complexity."
    },
    {
      step: 5,
      title: "Editorial Decision",
      duration: "1-2 weeks",
      icon: <CheckCircle className="w-5 h-5" />,
      description: "Editor makes final decision based on reviews",
      details: [
        "Editor evaluates reviewer feedback",
        "Decision: Accept, Minor Revision, Major Revision, or Reject",
        "Detailed decision letter sent to authors",
        "Reviewer comments forwarded",
        "Specific revision instructions provided"
      ],
      tips: "Most manuscripts require at least minor revisions before acceptance."
    },
    {
      step: 6,
      title: "Revision & Resubmission",
      duration: "2-4 weeks",
      icon: <Edit className="w-5 h-5" />,
      description: "Authors address reviewer comments",
      details: [
        "Revise manuscript based on feedback",
        "Prepare detailed response letter",
        "Address each reviewer comment",
        "Highlight changes in revised manuscript",
        "Resubmit through online system"
      ],
      tips: "Be thorough in addressing all comments, even if you disagree with some suggestions."
    },
    {
      step: 7,
      title: "Final Review",
      duration: "1-2 weeks", 
      icon: <Award className="w-5 h-5" />,
      description: "Editor reviews revisions for final acceptance",
      details: [
        "Editor checks revision quality",
        "May send to reviewers for re-evaluation",
        "Final acceptance/rejection decision",
        "Manuscript sent for production",
        "Author informed of acceptance"
      ],
      tips: "Minor formatting adjustments may be requested at this stage."
    },
    {
      step: 8,
      title: "Publication",
      duration: "2-3 weeks",
      icon: <Globe className="w-5 h-5" />,
      description: "Article published and made available online",
      details: [
        "Copyediting and typesetting",
        "Author proof review",
        "DOI assignment",
        "Online publication",
        "Indexing in databases"
      ],
      tips: "Articles are published immediately upon completion under our Diamond Open Access model."
    }
  ];

  const decisionTypes = [
    {
      decision: "Accept",
      description: "Manuscript accepted without further revisions",
      percentage: "15%",
      color: "text-emerald-600",
      nextSteps: "Proceeds directly to production and publication"
    },
    {
      decision: "Minor Revision",
      description: "Small changes required, no additional review needed",
      percentage: "45%",
      color: "text-blue-600", 
      nextSteps: "Revise and resubmit; editor makes final decision"
    },
    {
      decision: "Major Revision",
      description: "Significant changes required, may need re-review",
      percentage: "25%",
      color: "text-amber-600",
      nextSteps: "Substantial revisions needed; may return to reviewers"
    },
    {
      decision: "Reject",
      description: "Manuscript not suitable for publication",
      percentage: "15%",
      color: "text-red-600",
      nextSteps: "Consider feedback for submission elsewhere"
    }
  ];

  const timelineHighlights = [
    {
      milestone: "Submission to First Decision",
      timeframe: "6-8 weeks",
      description: "Complete peer review process"
    },
    {
      milestone: "Revision Time Allowed", 
      timeframe: "2-4 weeks",
      description: "Time for authors to address comments"
    },
    {
      milestone: "Final Decision",
      timeframe: "1-2 weeks",
      description: "Editor reviews revised manuscript"
    },
    {
      milestone: "Publication",
      timeframe: "2-3 weeks",
      description: "From acceptance to online publication"
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>Editorial Process</h1>
          <p className="text-[#5a6a8a] text-lg leading-relaxed">
            Our comprehensive editorial process ensures rigorous peer review while maintaining efficiency and transparency for authors.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Process Steps */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl">Submission to Publication Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {submissionSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-[#0f2d6b] text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {step.step}
                          </div>
                          {index < submissionSteps.length - 1 && (
                            <div className="w-0.5 h-12 bg-[#0f2d6b]/20 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {step.icon}
                              <h3 className="text-[#0f2d6b] text-lg" style={{ fontWeight: 600 }}>{step.title}</h3>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-[#3a4a6a] text-sm mb-4">{step.description}</p>
                          
                          <div className="grid sm:grid-cols-1 gap-4">
                            <div>
                              <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>Key Activities:</h4>
                              <div className="space-y-1">
                                {step.details.map((detail, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-[#5a6a8a] text-xs">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-[#f0f4fb] rounded-lg border border-[#0f2d6b]/10">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-[#c9a227] mt-0.5 flex-shrink-0" />
                              <p className="text-[#3a4a6a] text-xs"><strong>Tip:</strong> {step.tips}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Decision Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl">Editorial Decision Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {decisionTypes.map((decision, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg hover:bg-[#f0f4fb] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-sm ${decision.color}`} style={{ fontWeight: 600 }}>
                          {decision.decision}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          ~{decision.percentage}
                        </Badge>
                      </div>
                      <p className="text-[#3a4a6a] text-xs mb-3 leading-relaxed">{decision.description}</p>
                      <p className="text-[#5a6a8a] text-xs"><strong>Next Steps:</strong> {decision.nextSteps}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timelineHighlights.map((item, index) => (
                    <div key={index} className="pb-3 border-b border-border last:border-b-0">
                      <div className="flex items-start justify-between mb-1">
                        <h5 className="text-[#0f2d6b] text-xs" style={{ fontWeight: 600 }}>{item.milestone}</h5>
                        <Badge variant="outline" className="text-xs">{item.timeframe}</Badge>
                      </div>
                      <p className="text-[#5a6a8a] text-xs">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Success Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Success Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h5 className="text-emerald-700 text-xs mb-1" style={{ fontWeight: 600 }}>Before Submission</h5>
                    <p className="text-emerald-600 text-xs">Follow formatting guidelines exactly and include all required sections.</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="text-blue-700 text-xs mb-1" style={{ fontWeight: 600 }}>During Review</h5>
                    <p className="text-blue-600 text-xs">Be patient and avoid multiple status inquiries during normal review periods.</p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h5 className="text-amber-700 text-xs mb-1" style={{ fontWeight: 600 }}>During Revision</h5>
                    <p className="text-amber-600 text-xs">Address every reviewer comment thoroughly and clearly mark all changes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">Editorial Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h5 className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>Submission Help</h5>
                  <p className="text-[#5a6a8a] text-xs">aml@iaamonline.org</p>
                </div>
                <div>
                  <h5 className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>Technical Issues</h5>
                  <p className="text-[#5a6a8a] text-xs">support@iaamonline.org</p>
                </div>
                <p className="text-[#3a4a6a] text-xs leading-relaxed">
                  Our editorial team is available to help with any questions about the submission and review process.
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">Process Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-[#0f2d6b]/5 rounded-lg">
                    <div className="text-[#0f2d6b] text-lg font-bold">85%</div>
                    <div className="text-[#5a6a8a] text-xs">Manuscripts requiring revision</div>
                  </div>
                  <div className="text-center p-3 bg-[#0f2d6b]/5 rounded-lg">
                    <div className="text-[#0f2d6b] text-lg font-bold">6-8 weeks</div>
                    <div className="text-[#5a6a8a] text-xs">Average time to first decision</div>
                  </div>
                  <div className="text-center p-3 bg-[#0f2d6b]/5 rounded-lg">
                    <div className="text-[#0f2d6b] text-lg font-bold">2-3 rounds</div>
                    <div className="text-[#5a6a8a] text-xs">Average revision cycles</div>
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