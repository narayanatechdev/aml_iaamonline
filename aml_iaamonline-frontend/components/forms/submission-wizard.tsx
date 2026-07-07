'use client';

import { useState, useEffect } from "react";
import { Upload, CheckCircle, FileText, AlertCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { MetadataForm } from "./metadata-form";
import { SDGSelector } from "./sdg-selector";
import { getUser, API_BASE } from "@/lib/userAuth";
import { COVER_IMAGE_ACCEPT, COVER_IMAGE_HELP_TEXT, GRAPHICAL_ABSTRACT_ACCEPT, GRAPHICAL_ABSTRACT_HELP_TEXT, validateCoverImageFile, validateGraphicalAbstractFile } from "@/lib/cover-image-validation";

// Research areas accepted by the backend (category enum)
const RESEARCH_AREAS: { value: string; label: string }[] = [
  { value: "nanotechnology", label: "Nanotechnology" },
  { value: "materials-science", label: "Materials Science" },
  { value: "polymers", label: "Polymers" },
  { value: "composites", label: "Composites" },
  { value: "functional-materials", label: "Functional Materials" },
  { value: "sustainable", label: "Sustainable Materials" },
  { value: "other", label: "Other" },
];

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
  const [submissionId, setSubmissionId] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImageName, setCoverImageName] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [graphicalAbstractName, setGraphicalAbstractName] = useState<string | null>(null);
  const [graphicalAbstractFile, setGraphicalAbstractFile] = useState<File | null>(null);
  const [graphicalAbstractPreview, setGraphicalAbstractPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    abstract: "",
    keywords: "",
    type: "",
    category: "",
    authorName: "",
    authorEmail: "",
    affiliation: "",
    country: "",
    coverLetter: "",
  });

  // Prefill the corresponding-author email from the logged-in account so the
  // submission shows up on their dashboard (matched by author_email).
  useEffect(() => {
    const u = getUser();
    if (u?.email) {
      setForm((f) => ({ ...f, authorEmail: u.email, authorName: f.authorName || u.name }));
    }
  }, []);

  const [metadata, setMetadata] = useState<MetadataFormData>({
    acknowledgements: "",
    fundingInformation: "",
    conflictOfInterest: "",
    authorContributions: [],
    dataAvailability: "",
  });

  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear a field's error as the user corrects it
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Manuscript title is required.";
    if (!form.type) e.type = "Select a manuscript type.";
    if (!form.category) e.category = "Select a research area.";
    if (!form.abstract.trim()) e.abstract = "Abstract is required.";
    else if (form.abstract.trim().length < 50) e.abstract = "Abstract must be at least 50 characters.";
    if (!form.keywords.trim()) e.keywords = "Enter at least one keyword.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.authorName.trim()) e.authorName = "Corresponding author name is required.";
    if (!form.authorEmail.trim()) e.authorEmail = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.authorEmail)) e.authorEmail = "Enter a valid email address.";
    if (!form.affiliation.trim()) e.affiliation = "Affiliation is required.";
    if (!form.country) e.country = "Select a country.";
    if (!form.coverLetter.trim()) e.coverLetter = "Cover letter to the editor is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fieldError = (name: string) =>
    errors[name] ? <p className="text-red-600 text-xs mt-1">{errors[name]}</p> : null;

  const handleCoverImageChange = async (file: File | null) => {
    if (!file) {
      setCoverImageFile(null);
      setCoverImageName(null);
      setCoverImagePreview(null);
      setSubmitError("Please attach the required 16:9 cover image.");

      return;
    }

    const validationError = await validateCoverImageFile(file);

    if (validationError) {
      setCoverImageFile(null);
      setCoverImageName(null);
      setCoverImagePreview(null);
      setSubmitError(validationError);

      return;
    }

    setCoverImageFile(file);
    setCoverImageName(file.name);
    setCoverImagePreview(URL.createObjectURL(file));
    setSubmitError(null);
  };


  const handleGraphicalAbstractChange = async (file: File | null) => {
    if (!file) {
      setGraphicalAbstractFile(null);
      setGraphicalAbstractName(null);
      setGraphicalAbstractPreview(null);
      setSubmitError("Please attach the required Graphical Abstract.");

      return;
    }

    const validationError = await validateGraphicalAbstractFile(file);

    if (validationError) {
      setGraphicalAbstractFile(null);
      setGraphicalAbstractName(null);
      setGraphicalAbstractPreview(null);
      setSubmitError(validationError);

      return;
    }

    setGraphicalAbstractFile(file);
    setGraphicalAbstractName(file.name);
    setGraphicalAbstractPreview(URL.createObjectURL(file));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!pdfFile) {
      setSubmitError("Please attach your manuscript PDF before submitting.");
      return;
    }

    if (!coverImageFile) {
      setSubmitError("Please attach the required 16:9 cover image before submitting.");
      return;
    }

    if (!graphicalAbstractFile) {
      setSubmitError("Please attach the required Graphical Abstract before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("authors", form.authorName);
      fd.append("author_email", form.authorEmail);
      fd.append("author_affiliation", `${form.affiliation}${form.country ? ", " + form.country : ""}`);
      fd.append("abstract", form.abstract);
      fd.append("keywords", form.keywords);
      fd.append("category", form.category || "other");
      fd.append("cover_letter", form.coverLetter);
      fd.append("pdf", pdfFile);
      fd.append("image", coverImageFile);
      fd.append("graphical_abstract", graphicalAbstractFile);

      const res = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const result = await res.json();

      if (!res.ok) {
        const firstError = result.errors ? Object.values(result.errors)[0] : null;
        throw new Error(
          (Array.isArray(firstError) ? firstError[0] : firstError) || result.message || "Submission failed."
        );
      }

      setSubmissionId(result.submission_id || result.data?.submission_id || "Submitted");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
              />
              {fieldError("title")}
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
              {fieldError("type")}
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Research Area <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                required
              >
                <option value="">Select research area...</option>
                {RESEARCH_AREAS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              {fieldError("category")}
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
              />
              {fieldError("abstract")}
              <p className="text-[#5a6a8a] text-xs mt-1">{form.abstract.trim().length} characters · minimum 50</p>
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
              />
              {fieldError("keywords")}
              <p className="text-[#5a6a8a] text-xs mt-1">Enter 5–8 keywords separated by semicolons</p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { if (validateStep1()) setStep(2); }}
                className="px-6 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors"
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
                />
                {fieldError("authorName")}
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
                />
                {fieldError("authorEmail")}
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
              />
              {fieldError("affiliation")}
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
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {fieldError("country")}
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Provide a cover letter to the Editor-in-Chief..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] resize-none"
              />
              {fieldError("coverLetter")}
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
                onClick={() => { if (validateStep2()) setStep(3); }}
                className="px-6 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors"
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
              authors={metadata.authorContributions}
              dataAvailability={metadata.dataAvailability}
              onChange={(data) => setMetadata(data)}
              errors={{}}
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
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setPdfFile(f);
                    setFileName(f?.name || null);
                  }}
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

            {/* Upload required cover image */}
            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Upload Cover Image <span className="text-red-500">*</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#0f2d6b]/30 rounded-xl bg-[#f4f7fc] cursor-pointer hover:border-[#0f2d6b]/60 hover:bg-[#e8eff9] transition-all overflow-hidden">
                <input
                  type="file"
                  accept={COVER_IMAGE_ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    void handleCoverImageChange(e.target.files?.[0] || null);
                  }}
                />
                {coverImagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImagePreview} alt="cover image preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-[#5a6a8a] mx-auto mb-2" />
                    <p className="text-[#5a6a8a] text-sm">Click to upload cover image</p>
                    <p className="text-[#9aabcc] text-xs mt-1">{COVER_IMAGE_HELP_TEXT}</p>
                  </div>
                )}
              </label>
              {coverImageName && <p className="text-[#0f2d6b] text-xs mt-2 font-medium">{coverImageName}</p>}
            </div>

            {/* Upload required graphical abstract */}
            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Upload Graphical Abstract <span className="text-red-500">*</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#0f2d6b]/30 rounded-xl bg-[#f4f7fc] cursor-pointer hover:border-[#0f2d6b]/60 hover:bg-[#e8eff9] transition-all overflow-hidden">
                <input
                  type="file"
                  accept={GRAPHICAL_ABSTRACT_ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    void handleGraphicalAbstractChange(e.target.files?.[0] || null);
                  }}
                />
                {graphicalAbstractPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={graphicalAbstractPreview} alt="graphical abstract preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-[#5a6a8a] mx-auto mb-2" />
                    <p className="text-[#5a6a8a] text-sm">Click to upload Graphical Abstract</p>
                    <p className="text-[#9aabcc] text-xs mt-1">{GRAPHICAL_ABSTRACT_HELP_TEXT}</p>
                  </div>
                )}
              </label>
              {graphicalAbstractName && <p className="text-[#0f2d6b] text-xs mt-2 font-medium">{graphicalAbstractName}</p>}
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

            {submitError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

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
                disabled={!fileName || !coverImageName || !graphicalAbstractName || submitting}
                className="px-8 py-2.5 bg-[#c9a227] text-white rounded-lg text-sm hover:bg-[#b8911f] transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: 700 }}
              >
                {submitting ? "Submitting…" : "Submit Manuscript"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}