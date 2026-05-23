"use client";

import { FileText, CheckCircle, Shield, DollarSign, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const FAQ_ITEMS = [
  {
    q: "Does AML charge Article Processing Charges (APCs)?",
    a: "No. Advanced Materials Letters operates under a Diamond Open Access model. There are absolutely no APCs, submission fees, or any other charges for authors. Publishing in AML is completely free.",
  },
  {
    q: "How long does the peer review process take?",
    a: "The average review time is 4–6 weeks from submission. Rapid communications (Letters) may be expedited within 2–3 weeks. Authors are notified of the editorial decision within 8 weeks of submission.",
  },
  {
    q: "What file formats are accepted for submission?",
    a: "Manuscripts should be submitted as PDF files. Source files (Word, LaTeX) will be requested upon acceptance. Figures should be in TIFF, PNG, or EPS format at minimum 300 dpi resolution.",
  },
  {
    q: "What is the maximum manuscript length?",
    a: "Research Articles: up to 8,000 words; Review Articles: up to 15,000 words; Letters/Communications: up to 3,000 words. These limits exclude references, figure captions, and supplementary material.",
  },
  {
    q: "Can I submit a previously published preprint?",
    a: "Yes, AML accepts manuscripts previously posted on preprint servers such as arXiv, ChemRxiv, or bioRxiv. Please disclose the preprint DOI during submission.",
  },
  {
    q: "Under what license are articles published?",
    a: "All articles are published under the Creative Commons Attribution License (CC BY 4.0), which allows unrestricted use, distribution, and reproduction in any medium, provided proper attribution is given.",
  },
];

export default function AuthorResourcesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[{ label: 'Author Resources' }]} 
        className="mb-6"
      />
      
      {/* Section Navigation */}
      <nav className="flex gap-4 mb-8">
        <a href="#guidelines" className="text-[#0f2d6b] text-xs hover:underline">Guide for Authors</a>
        <a href="#ethics" className="text-[#0f2d6b] text-xs hover:underline">Peer Review & Ethics</a>
        <a href="#open-access" className="text-[#0f2d6b] text-xs hover:underline">Open Access</a>
        <a href="#faq" className="text-[#0f2d6b] text-xs hover:underline">FAQ</a>
      </nav>

      <div className="mb-10 border-b border-border pb-8">
        <h1 className="text-black mb-6" style={{ fontSize: "2.5rem", fontWeight: 700 }}>Author Resources</h1>
        <p className="text-[#5a6a8a] text-xl leading-relaxed">Everything you need to submit and publish in Advanced Materials Letters</p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 border-b border-gray-200 pb-8">
        {[
          { icon: <FileText className="w-6 h-6" />, label: "Submit Manuscript", desc: "Start your submission online", to: "/submit", color: "bg-[#0f2d6b]", textColor: "text-white" },
          { icon: <CheckCircle className="w-6 h-6" />, label: "Track Submission", desc: "Check your manuscript status", to: "/track", color: "bg-[#1a3f8f]", textColor: "text-white" },
          { icon: <Shield className="w-6 h-6" />, label: "Review Process", desc: "Learn about peer review", to: "#ethics", color: "bg-[#254b9d]", textColor: "text-white" },
          { icon: <DollarSign className="w-6 h-6" />, label: "Open Access Info", desc: "No APCs — Diamond OA", to: "#open-access", color: "bg-[#3260b5]", textColor: "text-white" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.to}
            className={`${action.color} ${action.textColor} p-5 hover:opacity-90 transition-opacity`}
          >
            <div className="mb-3 opacity-90">{action.icon}</div>
            <h3 className="text-sm mb-1" style={{ fontWeight: 700 }}>{action.label}</h3>
            <p className="text-xs opacity-80">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Guidelines */}
      <section id="guidelines" className="mb-14 scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6 text-2xl" style={{ fontWeight: 700 }}>Guide for Authors</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Manuscript Types",
              items: [
                "Research Articles: Original research with full experimental detail",
                "Review Articles: Comprehensive reviews of established topics",
                "Letters: Short communications of urgent scientific importance",
                "Perspectives: Forward-looking opinion pieces by invited experts",
              ],
            },
            {
              title: "Manuscript Preparation",
              items: [
                "Title, abstract (150–250 words), and 5–8 keywords required",
                "Structured sections: Introduction, Methods, Results, Discussion",
                "References in Vancouver style (numbered, sequential)",
                "All figures and tables must be cited in the text",
              ],
            },
            {
              title: "Figures & Tables",
              items: [
                "Minimum resolution: 300 dpi for raster images",
                "Accepted formats: TIFF, PNG, EPS, SVG for vector art",
                "Color figures are published at no extra cost",
                "Supplementary data must be uploaded separately",
              ],
            },
            {
              title: "Language & Ethics",
              items: [
                "Manuscripts must be written in clear English",
                "Language editing services available for non-native speakers",
                "iThenticate plagiarism check performed on all submissions",
                "AI-assisted writing must be disclosed in Methods section",
              ],
            },
          ].map((section) => (
            <div key={section.title} className="border-b border-gray-200 p-5">
              <h3 className="text-[#0f2d6b] text-sm mb-4" style={{ fontWeight: 700 }}>{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#3a4a6a]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0f2d6b] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Peer Review */}
      <section id="ethics" className="mb-14 scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Peer Review & Publication Ethics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-b border-gray-200 p-5">
            <div className="w-10 h-10 rounded-full bg-[#0f2d6b]/10 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-[#0f2d6b]" />
            </div>
            <h3 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 700 }}>Double-Blind Review</h3>
            <p className="text-[#3a4a6a] text-xs leading-relaxed">
              AML employs double-blind peer review for all research articles. Authors and reviewers remain anonymous to each other throughout the process. Typically 2–3 reviewers are assigned per manuscript.
            </p>
          </div>
          <div className="border-b border-gray-200 p-5">
            <div className="w-10 h-10 rounded-full bg-[#0f2d6b]/10 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-[#0f2d6b]" />
            </div>
            <h3 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 700 }}>COPE Compliance</h3>
            <p className="text-[#3a4a6a] text-xs leading-relaxed">
              AML is a member of the Committee on Publication Ethics (COPE) and follows COPE guidelines for handling ethical issues including authorship disputes, data fabrication, and duplicate publication.
            </p>
          </div>
          <div className="border-b border-gray-200 p-5">
            <div className="w-10 h-10 rounded-full bg-[#0f2d6b]/10 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-[#0f2d6b]" />
            </div>
            <h3 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 700 }}>Data Availability</h3>
            <p className="text-[#3a4a6a] text-xs leading-relaxed">
              Authors are encouraged to deposit research data in public repositories. Data availability statements are required for all research articles. Raw data should be available upon reasonable request.
            </p>
          </div>
        </div>

        {/* Review timeline */}
        <div className="mt-6 border-b border-gray-200 p-5">
          <h3 className="text-[#0f2d6b] text-sm mb-5" style={{ fontWeight: 700 }}>Typical Review Timeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { step: "01", label: "Submission", time: "Day 1", color: "bg-[#0f2d6b]" },
              { step: "02", label: "Editorial Check", time: "3–5 days", color: "bg-[#1a3f8f]" },
              { step: "03", label: "Peer Review", time: "3–5 weeks", color: "bg-[#254b9d]" },
              { step: "04", label: "Editorial Decision", time: "5–8 weeks", color: "bg-[#3260b5]" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className={`w-10 h-10 rounded-full ${s.color} text-white flex items-center justify-center mx-auto mb-2 text-sm`} style={{ fontWeight: 700 }}>
                  {s.step}
                </div>
                <div className="text-[#0f1a2e] text-xs mb-0.5" style={{ fontWeight: 600 }}>{s.label}</div>
                <div className="text-[#5a6a8a] text-[10px]">{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Access */}
      <section id="open-access" className="mb-14 scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Fees & Open Access Policy</h2>
        <div className="bg-gradient-to-br from-[#0f2d6b] to-[#1a3f8f] p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/30 text-white text-xs mb-4" style={{ fontWeight: 600 }}>
                Diamond Open Access
              </div>
              <h3 className="text-2xl mb-4" style={{ fontWeight: 700 }}>Zero Fees for Authors & Readers</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Advanced Materials Letters is committed to the Diamond Open Access model. We believe scientific knowledge should be accessible to everyone without financial barriers.
              </p>
              <ul className="space-y-2">
                {["No Article Processing Charges (APCs)", "No submission fees", "No reading or download fees", "Immediate open access upon publication", "CC BY 4.0 license — maximum reuse rights"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 p-6 text-center">
              <div className="text-white mb-2" style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1 }}>$0</div>
              <div className="text-white text-lg mb-2" style={{ fontWeight: 700 }}>Article Processing Charge</div>
              <div className="text-white/70 text-sm">Forever free to publish & read</div>
              <Link
                href="/submit"
                className="inline-block mt-5 px-6 py-2.5 bg-white text-[#0f2d6b] rounded-lg text-sm hover:bg-[#f0f4fb] transition-colors"
                style={{ fontWeight: 700 }}
              >
                Submit Your Manuscript
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-40">
        <h2 className="text-[#0f2d6b] mb-6 flex items-center gap-2" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
          <HelpCircle className="w-5 h-5" /> Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={faq.q} className="border-b border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f0f4fb] transition-colors"
                aria-expanded={openFaq === i}
              >
                <span className="text-[#0f1a2e] text-sm pr-4" style={{ fontWeight: 600 }}>{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-[#0f2d6b] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#5a6a8a] flex-shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 border-t border-border">
                  <p className="text-[#3a4a6a] text-sm leading-relaxed pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
