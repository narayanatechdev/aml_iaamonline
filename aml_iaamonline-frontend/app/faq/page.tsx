"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Search, FileText, Clock, DollarSign, Users, Globe } from 'lucide-react';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      category: "Submission & Peer Review",
      icon: <FileText className="w-4 h-4" />,
      faqs: [
        {
          question: "How do I submit my manuscript to Advanced Materials Letters?",
          answer: "Manuscripts can be submitted through our online submission system. Please ensure your manuscript follows our formatting guidelines and includes all required files (main document, figures, supplementary materials). You'll need to create an account on our submission portal and follow the step-by-step submission process."
        },
        {
          question: "What is the typical review time for manuscripts?",
          answer: "The typical review process takes 6-8 weeks from submission to first decision. Initial editorial assessment takes 3-5 days, followed by 4-6 weeks for peer review. Authors will receive regular updates on the status of their submission throughout the process."
        },
        {
          question: "How many reviewers evaluate each manuscript?",
          answer: "Each manuscript is typically reviewed by 2-3 independent experts in the relevant field. We use a double-blind peer review process to ensure fairness and objectivity. In some cases, additional reviewers may be consulted for specialized topics."
        },
        {
          question: "Can I suggest reviewers for my manuscript?",
          answer: "Yes, you can suggest up to 3 potential reviewers during submission. Please provide their full contact details and expertise areas. However, the final selection of reviewers remains at the discretion of the editorial team to maintain independence."
        },
        {
          question: "What happens if reviewers disagree on my manuscript?",
          answer: "When reviewers provide conflicting recommendations, the editor will carefully evaluate all feedback and may seek additional expert opinion. The final decision will be based on the scientific merit of the work and the quality of the reviewers' comments."
        }
      ]
    },
    {
      category: "Open Access & Publication Fees",
      icon: <DollarSign className="w-4 h-4" />,
      faqs: [
        {
          question: "Are there any publication fees or Article Processing Charges (APCs)?",
          answer: "No, Advanced Materials Letters operates under a Diamond Open Access model. There are no publication fees, article processing charges, or submission fees for authors. All costs are covered by our publisher, IAAM, making research freely accessible worldwide."
        },
        {
          question: "What does Diamond Open Access mean?",
          answer: "Diamond Open Access means that articles are freely available to readers worldwide AND there are no charges for authors to publish. This is different from Gold Open Access (which may charge APCs) and Green Open Access (which may have embargo periods)."
        },
        {
          question: "Can I publish in AML if my institution doesn't have funding for publication fees?",
          answer: "Absolutely! Since we don't charge any publication fees, funding availability is not a barrier to publishing in AML. We welcome submissions from researchers worldwide regardless of their financial circumstances or institutional support."
        },
        {
          question: "What license is used for published articles?",
          answer: "All articles are published under the Creative Commons Attribution 4.0 International (CC BY 4.0) license, allowing for maximum reuse, distribution, and reproduction in any medium, provided proper attribution is given."
        }
      ]
    },
    {
      category: "Scope & Content",
      icon: <Globe className="w-4 h-4" />,
      faqs: [
        {
          question: "What types of materials research does AML publish?",
          answer: "AML publishes research on all types of advanced materials including nanomaterials, biomaterials, energy materials, electronic materials, ceramics, polymers, composites, 2D materials, and smart materials. We welcome both fundamental research and applied studies."
        },
        {
          question: "Do you publish computational and theoretical studies?",
          answer: "Yes, we welcome high-quality computational and theoretical studies that provide significant insights into materials properties, behavior, or design. These studies should demonstrate clear relevance to experimental materials science or practical applications."
        },
        {
          question: "What are the different article types you accept?",
          answer: "We accept Research Articles (full-length original research), Review Articles (comprehensive reviews), Letters (short communications of urgent findings), and Perspectives (forward-looking opinion pieces by invited experts)."
        },
        {
          question: "Is there a minimum or maximum length for manuscripts?",
          answer: "Research articles typically range from 6-12 pages including figures and references. Letters should be 4 pages maximum. Review articles can be longer (15-25 pages) depending on the topic scope. Quality and significance matter more than length."
        }
      ]
    },
    {
      category: "Editorial Process",
      icon: <Users className="w-4 h-4" />,
      faqs: [
        {
          question: "Who makes the final decision on manuscript acceptance?",
          answer: "Final decisions are made by the Editor-in-Chief or Associate Editors based on reviewer feedback, scientific merit, and fit with journal scope. The editorial team has extensive expertise in materials science and engineering."
        },
        {
          question: "Can I appeal an editorial decision?",
          answer: "Yes, if you believe there has been a misunderstanding or error in the review process, you can submit an appeal with detailed justification within 30 days of the decision. Appeals should address specific technical or procedural concerns."
        },
        {
          question: "How do you handle conflicts of interest?",
          answer: "All editors and reviewers must declare any potential conflicts of interest. We have strict policies to ensure that individuals with competing interests do not participate in the review process. Authors must also disclose any conflicts in their submissions."
        },
        {
          question: "Do you offer pre-submission inquiries?",
          answer: "Yes, you can send a brief inquiry (1-2 pages) describing your research to assess whether it fits within our scope before preparing a full manuscript. Include the title, abstract, key findings, and significance of your work."
        }
      ]
    },
    {
      category: "Technical & Formatting",
      icon: <Clock className="w-4 h-4" />,
      faqs: [
        {
          question: "What file formats do you accept for submission?",
          answer: "We accept manuscripts in Microsoft Word (.doc/.docx) or LaTeX formats. Figures should be submitted as high-resolution files (TIFF, EPS, or PDF). Supplementary materials can be in various formats including video files."
        },
        {
          question: "Are there specific formatting requirements?",
          answer: "Yes, please follow our author guidelines for formatting. This includes font specifications, reference style, figure requirements, and structure. Template files are available for download on our website."
        },
        {
          question: "How should I prepare figures and images?",
          answer: "Figures should be high resolution (minimum 300 DPI for color images, 600 DPI for line art), clearly labeled, and accompanied by detailed captions. Ensure all text in figures is legible and use standard scientific notation."
        },
        {
          question: "Can I submit supplementary materials?",
          answer: "Yes, supplementary materials are encouraged and can include additional data, experimental details, videos, or large datasets. These materials undergo the same peer review process as the main manuscript."
        },
        {
          question: "How do I ensure my references are formatted correctly?",
          answer: "We use a numbered reference system. Please follow our citation format exactly as shown in the author guidelines. Reference management software like EndNote or Mendeley can help ensure consistency."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const index = categoryIndex * 1000 + faqIndex; // Create unique index
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>Frequently Asked Questions</h1>
          <p className="text-[#5a6a8a] text-lg leading-relaxed">
            Find answers to common questions about submission, review process, publication fees, and more.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6a8a]" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFAQs.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  {category.icon}
                  {category.category}
                  <Badge variant="secondary" className="ml-auto">
                    {category.faqs.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const uniqueIndex = categoryIndex * 1000 + faqIndex;
                    const isOpen = openFAQ === uniqueIndex;

                    return (
                      <div key={faqIndex} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                          className="w-full p-4 text-left hover:bg-[#f0f4fb] transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <HelpCircle className="w-4 h-4 text-[#c9a227] mt-0.5 flex-shrink-0" />
                            <span className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>
                              {faq.question}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#5a6a8a] flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#5a6a8a] flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 border-t border-border bg-[#fafbff]">
                            <div className="pl-7 pt-3">
                              <p className="text-[#3a4a6a] text-sm leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-[#0f2d6b] text-lg">Still Have Questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-[#f0f4fb] to-[#e8f1ff] p-6 rounded-lg">
              <p className="text-[#3a4a6a] text-sm mb-4 leading-relaxed">
                If you can't find the answer you're looking for, our editorial team is here to help. We typically respond to inquiries within 1-2 business days.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>Editorial Inquiries</h4>
                  <p className="text-[#5a6a8a] text-xs">aml@iaamonline.org</p>
                </div>
                <div>
                  <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>Technical Support</h4>
                  <p className="text-[#5a6a8a] text-xs">support@iaamonline.org</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results Notice */}
        {searchTerm && filteredFAQs.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-6 text-center">
              <HelpCircle className="w-12 h-12 text-[#5a6a8a] mx-auto mb-3" />
              <h3 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 600 }}>No matching questions found</h3>
              <p className="text-[#5a6a8a] text-sm mb-4">
                Try different keywords or browse all categories above. You can also contact our editorial team directly.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-[#0f2d6b] text-white text-sm rounded-lg hover:bg-[#0f2d6b]/90 transition-colors"
              >
                Clear Search
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}