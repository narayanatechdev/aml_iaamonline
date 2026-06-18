'use client';

import { useState } from "react";
import { Upload, CheckCircle, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { MetadataForm } from "./metadata-form";
import { SDGSelector } from "./sdg-selector";

type Step = 1 | 2 | 3 | 4 | 5;

interface MetadataFormData {
  acknowledgements?: string;
  fundingInformation?: string;
  conflictOfInterest?: string;
  authorContributions?: Array<{ name: string; contribution: string }>;
  dataAvailability?: string;
}

const MANUSCRIPT_TYPES = [
  "Research Article",
  "Review Article",
  "Letter / Short Communication",
  "Perspective",
  "Case Study",
];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium",
  "Brazil", "Canada", "Chile", "China", "Colombia", "Czech Republic", "Denmark", "Egypt", "Finland",
  "France", "Germany", "Ghana", "Greece", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Japan", "Jordan", "Kenya", "South Korea", "Malaysia", "Mexico", "Morocco",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru", "Philippines", "Poland",
  "Portugal", "Romania", "Russia", "Saudi Arabia", "South Africa", "Spain", "Sri Lanka", "Sweden",
  "Switzerland", "Taiwan", "Thailand", "Turkey", "Ukraine", "United Kingdom", "United States",
  "Vietnam", "Other",
];

export function SubmissionWizard() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId] = useState("MS-2026-" + String(Math.floor(Math.random() * 9000) + 1000));
  const [fileName, setFileName] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    abstract: "",
    keywords: "",
    type: "",
    authorName: "",
    authorEmail: "",
    affiliation: "",
    country: "",
    coverLetter: "",
  });

  const [metadata, setMetadata] = useState<MetadataFormData>({
    acknowledgements: "",
    fundingInformation: "",
    conflictOfInterest: "",
    authorContributions: [],
    dataAvailability: "",
  });

  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-[#0f2d6b] mb-3" style={{ fontSize: "1.6rem", fontWeight: 700 }}>Manuscript Submitted!</h1>
        <p className="text-[#5a6a8a] text-sm mb-6 leading-relaxed">
          Your manuscript has been successfully received. A confirmation email has been sent to <strong>{form.authorEmail}</strong> with your submission details.
        </p>
        <div className="bg-[#f0f4fb] rounded-xl border border-border p-6 mb-8">
          <p className="text-[#5a6a8a] text-xs mb-1">Your Submission ID</p>
          <p className="text-[#0f2d6b] font-mono mb-4" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{submissionId}</p>
          <p className="text-[#5a6a8a] text-xs">
            Please save this ID. You can use it along with your email address to track your manuscript status.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/track" className="px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors" style={{ fontWeight: 600 }}>
            Track Submission
          </Link>
          <Link href="/" className="px-5 py-2.5 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {[
          { num: 1, label: "Manuscript Info" },
          { num: 2, label: "Author Details" },
          { num: 3, label: "Metadata" },
          { num: 4, label: "Sustainability Goals" },
          { num: 5, label: "Upload & Submit" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                  step > s.num
                    ? "bg-emerald-500 text-white"
                    : step === s.num
                    ? "bg-[#0f2d6b] text-white"
                    : "bg-[#f0f4fb] text-[#5a6a8a] border border-border"
                }`}
                style={{ fontWeight: 700 }}
              >
                {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs mt-1 ${step === s.num ? "text-[#0f2d6b]" : "text-[#5a6a8a]"}`} style={{ fontWeight: step === s.num ? 600 : 400 }}>
                {s.label}
              </span>
            </div>
            {i < 4 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${step > s.num ? "bg-emerald-500" : "bg-[#e0e8f5]"}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Manuscript Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Manuscript Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter the full title of your manuscript"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                required
              />
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Manuscript Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                required
              >
                <option value="">Select manuscript type...</option>
                {MANUSCRIPT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                name="abstract"
                value={form.abstract}
                onChange={handleChange}
                placeholder="Provide a structured abstract (150–250 words)..."
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] resize-none"
                required
              />
              <p className="text-[#5a6a8a] text-xs mt-1">{form.abstract.split(/\s+/).filter(Boolean).length} / 250 words</p>
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Keywords <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                placeholder="Separate keywords with semicolons (e.g., nanoparticles; photocatalysis; ZnO)"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                required
              />
              <p className="text-[#5a6a8a] text-xs mt-1">Enter 5–8 keywords separated by semicolons</p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.title || !form.type || !form.abstract || !form.keywords}
                className="px-6 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: 600 }}
              >
                Next: Author Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Author Details */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-[#f0f4fb] rounded-xl border border-border p-4 text-xs text-[#5a6a8a] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0f2d6b]" />
              Please provide the details for the <strong>corresponding author</strong>. Additional co-author information can be included in the manuscript file.
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                  Corresponding Author Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="authorName"
                  value={form.authorName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="authorEmail"
                  value={form.authorEmail}
                  onChange={handleChange}
                  placeholder="your@institution.edu"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Affiliation / Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="affiliation"
                value={form.affiliation}
                onChange={handleChange}
                placeholder="University / Institution name, Department"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                required
              />
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                required
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Cover Letter
              </label>
              <textarea
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Optional: Provide a cover letter to the Editor-in-Chief..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] resize-none"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!form.authorName || !form.authorEmail || !form.affiliation || !form.country}
                className="px-6 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: 600 }}
              >
                Next: Metadata →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Metadata */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-[#f0f4fb] rounded-xl border border-border p-4 text-xs text-[#5a6a8a] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0f2d6b]" />
              Provide optional metadata about your manuscript including acknowledgements, funding, and author contributions.
            </div>

            <MetadataForm
              acknowledgements={metadata.acknowledgements}
              fundingInformation={metadata.fundingInformation}
              conflictOfInterest={metadata.conflictOfInterest}
              authorContributions={metadata.authorContributions}
              dataAvailability={metadata.dataAvailability}
              onChange={(field, value) => {
                setMetadata({ ...metadata, [field]: value });
              }}
              errors={[]}
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors"
                style={{ fontWeight: 600 }}
              >
                Next: Sustainability Goals →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Sustainable Development Goals */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="bg-[#f0f4fb] rounded-xl border border-border p-4 text-xs text-[#5a6a8a] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0f2d6b]" />
              Select up to 5 UN Sustainable Development Goals that your research contributes to. This helps readers discover research aligned with global priorities.
            </div>

            <SDGSelector
              selectedSDGs={selectedSDGs}
              onSelectionChange={setSelectedSDGs}
              errors={[]}
              maxSelections={5}
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors"
                style={{ fontWeight: 600 }}
              >
                Next: Upload Files →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Upload & Submit */}
        {step === 5 && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-[#f0f4fb] rounded-xl border border-border p-5">
              <h3 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 700 }}>Submission Summary</h3>
              <dl className="space-y-2">
                <div className="flex gap-2 text-xs">
                  <dt className="text-[#5a6a8a] w-28 flex-shrink-0">Title:</dt>
                  <dd className="text-[#0f1a2e]">{form.title || "—"}</dd>
                </div>
                <div className="flex gap-2 text-xs">
                  <dt className="text-[#5a6a8a] w-28 flex-shrink-0">Type:</dt>
                  <dd className="text-[#0f1a2e]">{form.type || "—"}</dd>
                </div>
                <div className="flex gap-2 text-xs">
                  <dt className="text-[#5a6a8a] w-28 flex-shrink-0">Author:</dt>
                  <dd className="text-[#0f1a2e]">{form.authorName} ({form.affiliation})</dd>
                </div>
                <div className="flex gap-2 text-xs">
                  <dt className="text-[#5a6a8a] w-28 flex-shrink-0">Email:</dt>
                  <dd className="text-[#0f1a2e]">{form.authorEmail}</dd>
                </div>
                <div className="flex gap-2 text-xs">
                  <dt className="text-[#5a6a8a] w-28 flex-shrink-0">Country:</dt>
                  <dd className="text-[#0f1a2e]">{form.country}</dd>
                </div>
              </dl>
            </div>

            {/* Upload PDF */}
            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Upload Manuscript PDF <span className="text-red-500">*</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#0f2d6b]/30 rounded-xl bg-[#f4f7fc] cursor-pointer hover:border-[#0f2d6b]/60 hover:bg-[#e8eff9] transition-all">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                />
                {fileName ? (
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-[#0f2d6b] mx-auto mb-2" />
                    <p className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>{fileName}</p>
                    <p className="text-[#5a6a8a] text-xs mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-[#5a6a8a] mx-auto mb-2" />
                    <p className="text-[#5a6a8a] text-sm">Click to upload or drag & drop</p>
                    <p className="text-[#9aabcc] text-xs mt-1">PDF only · Max 50 MB</p>
                  </div>
                )}
              </label>
            </div>

            {/* Ethics declaration */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-[#0f2d6b]" required />
                <span className="text-xs text-[#3a4a6a] leading-relaxed">
                  I confirm that this manuscript has not been published previously and is not under consideration for publication elsewhere.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-[#0f2d6b]" required />
                <span className="text-xs text-[#3a4a6a] leading-relaxed">
                  All authors have approved the final version and agree to the submission. Authorship criteria are consistent with ICMJE guidelines.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-[#0f2d6b]" required />
                <span className="text-xs text-[#3a4a6a] leading-relaxed">
                  I have read and agree to the{" "}
                  <Link href="/author-resources#ethics" className="text-[#0f2d6b] hover:underline">publication ethics</Link>{" "}
                  and confirm compliance with all editorial policies of Advanced Materials Letters.
                </span>
              </label>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={!fileName}
                className="px-8 py-2.5 bg-[#c9a227] text-white rounded-lg text-sm hover:bg-[#b8911f] transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: 700 }}
              >
                Submit Manuscript
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}