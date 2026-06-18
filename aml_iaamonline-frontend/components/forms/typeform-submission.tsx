'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, Check, Loader2, Upload, FileText, CheckCircle2, Search, Image as ImageIcon,
} from 'lucide-react';
import { getUser, API_BASE } from '@/lib/userAuth';

/* ----------------------------- config ----------------------------- */
const MANUSCRIPT_TYPES = ['Research Article', 'Review Article', 'Letter / Short Communication', 'Perspective', 'Case Study'];
const RESEARCH_AREAS = [
  { value: 'nanotechnology', label: 'Nanotechnology' },
  { value: 'materials-science', label: 'Materials Science' },
  { value: 'polymers', label: 'Polymers' },
  { value: 'composites', label: 'Composites' },
  { value: 'functional-materials', label: 'Functional Materials' },
  { value: 'sustainable', label: 'Sustainable Materials' },
  { value: 'other', label: 'Other' },
];
const DIVISIONS = [
  'Materials for Human Health', 'Intelligent Functional Materials', 'Sustainable Materials',
  'Translational Biomaterials', 'Digital & AI-Designed Materials',
];
const COUNTRIES = ['Australia', 'Bangladesh', 'Brazil', 'Canada', 'China', 'Egypt', 'France', 'Germany', 'Ghana', 'India', 'Indonesia', 'Iran', 'Italy', 'Japan', 'Kenya', 'Malaysia', 'Mexico', 'Netherlands', 'Nigeria', 'Pakistan', 'Poland', 'Russia', 'Saudi Arabia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam', 'Other'];

type QType = 'welcome' | 'text' | 'email' | 'longtext' | 'tags' | 'select' | 'file' | 'image' | 'consent' | 'review' | 'fields' | 'sdg' | 'coauthors';

interface Question {
  id: string;
  type: QType;
  question: string;
  description?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  searchable?: boolean;
  fields?: { key: keyof FormState; label: string; placeholder: string }[];
  validate?: (v: string) => string | null;
}

const QUESTIONS: Question[] = [
  { id: 'title', type: 'text', question: 'What is the title of your manuscript?', description: 'Enter the full title as it should appear in publication.', placeholder: 'Type your title here…', validate: (v) => (v.trim() ? null : 'Please enter a title.') },
  { id: 'type', type: 'select', question: 'What type of manuscript is this?', options: MANUSCRIPT_TYPES.map((t) => ({ value: t, label: t })) },
  { id: 'category', type: 'select', question: 'Which research area best fits your work?', options: RESEARCH_AREAS },
  { id: 'division', type: 'select', question: 'Which challenge division?', options: DIVISIONS.map((d) => ({ value: d, label: d })) },
  { id: 'trl', type: 'select', question: 'Technology Readiness Level?', description: 'TRL 1 (lab) → 9 (market).', options: Array.from({ length: 9 }, (_, i) => ({ value: String(i + 1), label: `TRL ${i + 1}` })) },
  { id: 'abstract', type: 'longtext', question: 'Share your abstract', description: 'A concise summary of your contribution (minimum 50 characters).', placeholder: 'Write your abstract…', validate: (v) => (v.trim().length < 50 ? 'Abstract must be at least 50 characters.' : null) },
  { id: 'keywords', type: 'tags', question: 'What are your keywords?', description: 'Type a keyword and press ; or Enter to add it. 5–8 recommended.', placeholder: 'e.g. nanoparticles', validate: (v) => (v.trim() ? null : 'Please add at least one keyword.') },
  { id: 'authorName', type: 'text', question: "What's the corresponding author's name?", placeholder: 'Given Family', validate: (v) => (v.trim() ? null : 'Please enter a name.') },
  { id: 'authorEmail', type: 'email', question: 'What email should we use?', description: 'All correspondence goes here.', placeholder: 'you@institution.edu', validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address.') },
  { id: 'affiliation', type: 'text', question: 'Your affiliation or institution?', placeholder: 'University / Institution, Department', validate: (v) => (v.trim() ? null : 'Please enter an affiliation.') },
  { id: 'country', type: 'select', question: 'Which country are you based in?', options: COUNTRIES.map((c) => ({ value: c, label: c })), searchable: true },
  { id: 'coauthors', type: 'coauthors', question: 'Add any co-authors', description: 'Optional — list contributing authors besides yourself.' },
  {
    id: 'funding', type: 'fields', question: 'Funding & acknowledgements', description: 'Optional.',
    fields: [
      { key: 'funding_information', label: 'Funding information', placeholder: 'Grant numbers, funding bodies…' },
      { key: 'acknowledgements', label: 'Acknowledgements', placeholder: 'People or institutions to thank…' },
    ],
  },
  {
    id: 'ethics', type: 'fields', question: 'Ethics & data', description: 'Optional.',
    fields: [
      { key: 'conflict_of_interest', label: 'Conflict of interest', placeholder: 'Declare any competing interests, or "None".' },
      { key: 'data_availability', label: 'Data availability statement', placeholder: 'Where the underlying data can be found…' },
    ],
  },
  { id: 'sdgs', type: 'sdg', question: 'Sustainable Development Goals', description: 'Optional — select up to 5 UN SDGs your research contributes to.' },
  { id: 'cover_letter', type: 'longtext', question: 'Cover letter to the editor', description: 'Optional — a short note to the Editor-in-Chief.', placeholder: 'Dear Editor…' },
  { id: 'pdf', type: 'file', question: 'Upload your manuscript', description: 'PDF only · max 50 MB.' },
  { id: 'image', type: 'image', question: 'Add a cover image', description: 'Optional — a graphical abstract or author photo (JPG/PNG, max 5 MB).' },
  { id: 'consent', type: 'consent', question: 'A few confirmations before you submit' },
  { id: 'review', type: 'review', question: 'Review your submission' },
];

const CONSENTS = [
  'This manuscript has not been published previously and is not under consideration elsewhere.',
  'All authors have approved the final version and agree to the submission (per ICMJE guidelines).',
  'I have read and agree to the publication ethics and editorial policies of Advanced Materials Letters.',
];

const STORAGE_KEY = 'aml_typeform_submission';

interface FormState {
  title: string; type: string; category: string; division: string; trl: string; abstract: string; keywords: string;
  authorName: string; authorEmail: string; affiliation: string; country: string;
  funding_information: string; acknowledgements: string; conflict_of_interest: string;
  data_availability: string; cover_letter: string;
}
const EMPTY: FormState = {
  title: '', type: '', category: '', division: '', trl: '', abstract: '', keywords: '',
  authorName: '', authorEmail: '', affiliation: '', country: '',
  funding_information: '', acknowledgements: '', conflict_of_interest: '',
  data_availability: '', cover_letter: '',
};

interface CoAuthor { name: string; affiliation: string; email: string }

const SDG_LIST: { n: number; name: string; color: string }[] = [
  { n: 1, name: 'No Poverty', color: '#E5243B' }, { n: 2, name: 'Zero Hunger', color: '#DDA63A' },
  { n: 3, name: 'Good Health & Well-Being', color: '#4C9F38' }, { n: 4, name: 'Quality Education', color: '#C5192D' },
  { n: 5, name: 'Gender Equality', color: '#FF3A21' }, { n: 6, name: 'Clean Water & Sanitation', color: '#26BDE2' },
  { n: 7, name: 'Affordable & Clean Energy', color: '#FCC30B' }, { n: 8, name: 'Decent Work & Growth', color: '#A21942' },
  { n: 9, name: 'Industry & Innovation', color: '#FD6925' }, { n: 10, name: 'Reduced Inequalities', color: '#DD1367' },
  { n: 11, name: 'Sustainable Cities', color: '#FD9D24' }, { n: 12, name: 'Responsible Consumption', color: '#BF8B2E' },
  { n: 13, name: 'Climate Action', color: '#3F7E44' }, { n: 14, name: 'Life Below Water', color: '#0A97D9' },
  { n: 15, name: 'Life on Land', color: '#56C02B' }, { n: 16, name: 'Peace & Justice', color: '#00689D' },
  { n: 17, name: 'Partnerships', color: '#19486A' },
];

/* ----------------------------- component ----------------------------- */
export function TypeformSubmission() {
  const total = QUESTIONS.length;
  const [[index, dir], setPage] = useState<[number, number]>([-1, 0]); // -1 = welcome
  const [form, setForm] = useState<FormState>(EMPTY);
  const [keywordTags, setKeywordTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [pdf, setPdf] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);
  const [consents, setConsents] = useState<boolean[]>([false, false, false]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [canResume, setCanResume] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  /* prefill + resume */
  useEffect(() => {
    const u = getUser();
    let restored = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.form) {
          setForm({ ...EMPTY, ...saved.form });
          if (saved.form.keywords) setKeywordTags(String(saved.form.keywords).split(';').map((s: string) => s.trim()).filter(Boolean));
          if (Array.isArray(saved.coAuthors)) setCoAuthors(saved.coAuthors);
          if (Array.isArray(saved.selectedSDGs)) setSelectedSDGs(saved.selectedSDGs);
          restored = true;
        }
      }
    } catch { /* ignore */ }
    if (u?.email) setForm((f) => ({ ...f, authorEmail: f.authorEmail || u.email, authorName: f.authorName || u.name }));
    if (restored) setCanResume(true);
  }, []);

  /* keep keywords string in sync with the tag chips */
  useEffect(() => {
    setForm((f) => (f.keywords === keywordTags.join('; ') ? f : { ...f, keywords: keywordTags.join('; ') }));
  }, [keywordTags]);

  const addTag = () => {
    const t = tagInput.trim().replace(/[;,]+$/, '').trim();
    if (t && !keywordTags.includes(t)) setKeywordTags((prev) => [...prev, t]);
    setTagInput('');
  };

  /* auto-save */
  useEffect(() => {
    if (index >= 0) localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, index, coAuthors, selectedSDGs }));
  }, [form, index, coAuthors, selectedSDGs]);

  /* focus input on text screens */
  useEffect(() => {
    setError(null);
    setSearch('');
    const q = QUESTIONS[index];
    if (q && (q.type === 'text' || q.type === 'email' || q.type === 'longtext')) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [index]);

  const current = index >= 0 ? QUESTIONS[index] : null;
  const progress = index < 0 ? 0 : Math.round(((index + 1) / total) * 100);

  const goNext = useCallback(() => {
    const q = QUESTIONS[index];
    if (q?.validate) {
      const msg = q.validate((form as never)[q.id] ?? '');
      if (msg) { setError(msg); return; }
    }
    if (q?.type === 'file' && !pdf) { setError('Please attach your manuscript PDF.'); return; }
    if (q?.type === 'consent' && !consents.every(Boolean)) { setError('Please confirm all three statements.'); return; }
    if (index < total - 1) setPage([index + 1, 1]);
  }, [index, form, pdf, consents, total]);

  const goBack = () => { if (index > -1) setPage([index - 1, -1]); };

  const selectOption = (qid: string, value: string) => {
    setForm((f) => ({ ...f, [qid]: value }));
    setError(null);
    setTimeout(() => setPage(([i]) => [Math.min(i + 1, total - 1), 1]), 180); // auto-advance
  };

  /* keyboard support */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      const q = QUESTIONS[index];
      if (e.key === 'Enter' && !(e.shiftKey && q?.type === 'longtext')) {
        if (index === -1) { setPage([0, 1]); return; }
        if (q && q.type !== 'review') { e.preventDefault(); goNext(); }
      }
      if (q?.type === 'select' && !q.searchable && /^[1-9]$/.test(e.key)) {
        const opt = q.options?.[Number(e.key) - 1];
        if (opt) selectOption(q.id, opt.value);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, goNext, done]);

  const submit = async () => {
    setError(null);
    if (!pdf) { setError('Please attach your manuscript PDF.'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('authors', form.authorName);
      fd.append('author_email', form.authorEmail);
      fd.append('author_affiliation', `${form.affiliation}${form.country ? ', ' + form.country : ''}`);
      fd.append('abstract', form.abstract);
      fd.append('keywords', form.keywords);
      fd.append('category', form.category || 'other');
      if (form.division) fd.append('division', form.division);
      if (form.trl) fd.append('trl', form.trl);
      fd.append('pdf', pdf);
      if (image) fd.append('image', image);
      // Optional metadata
      if (form.funding_information) fd.append('funding_information', form.funding_information);
      if (form.acknowledgements) fd.append('acknowledgements', form.acknowledgements);
      if (form.conflict_of_interest) fd.append('conflict_of_interest', form.conflict_of_interest);
      if (form.data_availability) fd.append('data_availability', form.data_availability);
      if (form.cover_letter) fd.append('cover_letter', form.cover_letter);
      const validCoAuthors = coAuthors.filter((c) => c.name.trim());
      if (validCoAuthors.length) fd.append('co_authors', JSON.stringify(validCoAuthors));
      if (selectedSDGs.length) fd.append('sdgs', JSON.stringify(selectedSDGs));
      const res = await fetch(`${API_BASE}/submit`, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      const result = await res.json();
      if (!res.ok) {
        const fe = result.errors ? Object.values(result.errors)[0] : null;
        throw new Error((Array.isArray(fe) ? fe[0] : fe) || result.message || 'Submission failed.');
      }
      setSubmissionId(result.submission_id || result.data?.submission_id || 'Submitted');
      localStorage.removeItem(STORAGE_KEY);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setSubmitting(false);
    }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  /* ----------------------------- render ----------------------------- */
  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-lg">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#0f1a2e] mb-3">Thank you!</h1>
          <p className="text-[#5a6a8a] mb-6">Your manuscript has been submitted. A confirmation was sent to <strong>{form.authorEmail}</strong>.</p>
          <div className="bg-[#f0f4fb] rounded-xl border border-border p-5 mb-8 inline-block">
            <p className="text-[#5a6a8a] text-xs mb-1">Submission ID</p>
            <p className="text-[#0f2d6b] font-mono text-xl font-bold">{submissionId}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2560] transition-colors">Go to Dashboard</Link>
            <Link href="/dashboard/track" className="px-5 py-2.5 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors">Track Status</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[75vh]">
      {/* progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-40">
        <motion.div className="h-full bg-[#c9a227]" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-16 pb-32">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={index} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }}>
            {/* WELCOME */}
            {index === -1 && (
              <div>
                <p className="text-[#c9a227] font-semibold mb-3">Advanced Materials Letters</p>
                <h1 className="text-4xl md:text-5xl font-bold text-[#0f1a2e] mb-4 leading-tight">Submit your manuscript</h1>
                <p className="text-lg text-[#5a6a8a] mb-8">A few quick questions — it takes about 3 minutes. Your progress saves automatically.</p>
                <button onClick={() => setPage([0, 1])} className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2d6b] text-white rounded-xl font-semibold hover:bg-[#0d2560] transition-all hover:scale-[1.02]">
                  Start <ArrowRight className="w-5 h-5" />
                </button>
                {canResume && <p className="text-xs text-[#5a6a8a] mt-4">↻ We restored your earlier answers.</p>}
                <p className="text-xs text-gray-400 mt-6">Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Enter ↵</kbd> to begin</p>
              </div>
            )}

            {/* QUESTION SCREENS */}
            {current && (
              <div>
                <p className="text-sm text-[#c9a227] font-semibold mb-2">{index + 1} → {total}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0f1a2e] mb-2 leading-tight">{current.question}</h2>
                {current.description && <p className="text-lg text-[#5a6a8a] mb-8">{current.description}</p>}
                {!current.description && <div className="mb-8" />}

                {/* TEXT / EMAIL */}
                {(current.type === 'text' || current.type === 'email') && (
                  <input
                    ref={(el) => { inputRef.current = el; }}
                    type={current.type === 'email' ? 'email' : 'text'}
                    value={(form as never)[current.id] ?? ''}
                    onChange={(e) => setForm({ ...form, [current.id]: e.target.value })}
                    placeholder={current.placeholder}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:border-[#0f2d6b] text-2xl text-[#0f1a2e] py-3 outline-none transition-colors placeholder:text-gray-300"
                  />
                )}

                {/* LONG TEXT */}
                {current.type === 'longtext' && (
                  <div>
                    <textarea
                      ref={(el) => { inputRef.current = el; }}
                      value={(form as never)[current.id] ?? ''}
                      onChange={(e) => setForm({ ...form, [current.id]: e.target.value })}
                      placeholder={current.placeholder}
                      rows={5}
                      className="w-full bg-[#f4f7fc] border border-border rounded-xl text-lg text-[#0f1a2e] p-4 outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] resize-none placeholder:text-gray-300"
                    />
                    {current.id === 'abstract' && (
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className={form.abstract.trim().length < 50 ? 'text-[#5a6a8a]' : 'text-emerald-600'}>
                          {form.abstract.trim().length} characters{form.abstract.trim().length < 50 ? ' · minimum 50' : ' ✓'}
                        </span>
                        <span className="text-[#9aabcc]">{form.abstract.trim().split(/\s+/).filter(Boolean).length} words</span>
                      </div>
                    )}
                  </div>
                )}

                {/* MULTI FIELDS (optional metadata) */}
                {current.type === 'fields' && (
                  <div className="space-y-5">
                    {current.fields!.map((f) => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                        <textarea
                          value={(form as never)[f.key] ?? ''}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          rows={3}
                          className="w-full bg-[#f4f7fc] border border-border rounded-xl text-base text-[#0f1a2e] p-3 outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] resize-none placeholder:text-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* SDG multi-select (up to 5) */}
                {current.type === 'sdg' && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SDG_LIST.map((s) => {
                        const on = selectedSDGs.includes(s.n);
                        const full = selectedSDGs.length >= 5 && !on;
                        return (
                          <button
                            key={s.n}
                            disabled={full}
                            onClick={() => setSelectedSDGs((prev) => on ? prev.filter((x) => x !== s.n) : [...prev, s.n])}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all ${on ? 'border-gray-900 bg-gray-900 text-white' : full ? 'border-gray-100 opacity-40 cursor-not-allowed' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400'}`}
                          >
                            <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${on ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{s.n}</span>
                            <span className="text-xs font-medium leading-tight">{s.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-[#5a6a8a] mt-3">{selectedSDGs.length} of 5 selected</p>
                  </div>
                )}

                {/* CO-AUTHORS (repeatable) */}
                {current.type === 'coauthors' && (
                  <div className="space-y-3">
                    {coAuthors.map((c, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                        <input value={c.name} onChange={(e) => setCoAuthors((p) => p.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Name" className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
                        <input value={c.affiliation} onChange={(e) => setCoAuthors((p) => p.map((x, idx) => idx === i ? { ...x, affiliation: e.target.value } : x))} placeholder="Affiliation" className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
                        <input value={c.email} onChange={(e) => setCoAuthors((p) => p.map((x, idx) => idx === i ? { ...x, email: e.target.value } : x))} placeholder="Email" className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
                        <button onClick={() => setCoAuthors((p) => p.filter((_, idx) => idx !== i))} className="text-red-600 text-sm px-2 hover:underline justify-self-start">Remove</button>
                      </div>
                    ))}
                    <button onClick={() => setCoAuthors((p) => [...p, { name: '', affiliation: '', email: '' }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0f2d6b] hover:underline">
                      + Add co-author
                    </button>
                  </div>
                )}

                {/* TAGS */}
                {current.type === 'tags' && (
                  <div>
                    <div className="flex flex-wrap items-center gap-2 border-b-2 border-gray-200 focus-within:border-[#0f2d6b] pb-2 transition-colors">
                      {keywordTags.map((t, i) => (
                        <motion.span
                          key={t}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f2d6b]/8 text-[#0f2d6b] text-sm font-medium"
                        >
                          {t}
                          <button onClick={() => setKeywordTags((prev) => prev.filter((_, idx) => idx !== i))} className="hover:text-red-600 transition-colors">×</button>
                        </motion.span>
                      ))}
                      <input
                        autoFocus
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ';' || e.key === ',' || (e.key === 'Enter' && tagInput.trim())) {
                            e.preventDefault();
                            e.stopPropagation();
                            addTag();
                          } else if (e.key === 'Backspace' && !tagInput && keywordTags.length) {
                            setKeywordTags((prev) => prev.slice(0, -1));
                          }
                        }}
                        onBlur={addTag}
                        placeholder={keywordTags.length ? 'Add another…' : current.placeholder}
                        className="flex-1 min-w-[140px] bg-transparent text-lg text-[#0f1a2e] py-1.5 outline-none placeholder:text-gray-300"
                      />
                    </div>
                    <p className="text-xs text-[#5a6a8a] mt-2">{keywordTags.length} keyword{keywordTags.length === 1 ? '' : 's'} added · press <kbd className="px-1 bg-gray-100 rounded">;</kbd> to add</p>
                  </div>
                )}

                {/* SELECT */}
                {current.type === 'select' && (
                  <div>
                    {current.searchable && (
                      <div className="flex items-center gap-2 border-b-2 border-gray-200 mb-4 pb-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to search…" className="w-full bg-transparent outline-none text-[#0f1a2e]" />
                      </div>
                    )}
                    <div className={current.searchable ? 'max-h-72 overflow-y-auto space-y-2 pr-1' : 'space-y-3'}>
                      {current.options!
                        .filter((o) => !current.searchable || o.label.toLowerCase().includes(search.toLowerCase()))
                        .map((o, i) => {
                          const selected = (form as never)[current.id] === o.value;
                          return (
                            <motion.button
                              key={o.value}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => selectOption(current.id, o.value)}
                              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all hover:-translate-y-0.5 ${selected ? 'border-[#0f2d6b] bg-[#0f2d6b]/5' : 'border-gray-200 hover:border-[#0f2d6b]/50 hover:shadow-md'}`}
                            >
                              {!current.searchable && <span className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">{i + 1}</span>}
                              <span className="text-lg text-[#0f1a2e] flex-1">{o.label}</span>
                              {selected && <Check className="w-5 h-5 text-[#0f2d6b]" />}
                            </motion.button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* FILE */}
                {current.type === 'file' && (
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-[#0f2d6b]/30 rounded-2xl bg-[#f4f7fc] cursor-pointer hover:border-[#0f2d6b]/60 hover:bg-[#e8eff9] transition-all">
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => { setPdf(e.target.files?.[0] || null); setError(null); }} />
                    {pdf ? (
                      <div className="text-center"><FileText className="w-10 h-10 text-[#0f2d6b] mx-auto mb-2" /><p className="text-[#0f2d6b] font-semibold">{pdf.name}</p><p className="text-[#5a6a8a] text-xs mt-1">Click to change</p></div>
                    ) : (
                      <div className="text-center"><Upload className="w-10 h-10 text-[#5a6a8a] mx-auto mb-2" /><p className="text-[#5a6a8a]">Click to upload or drag & drop</p><p className="text-[#9aabcc] text-xs mt-1">PDF only · Max 50 MB</p></div>
                    )}
                  </label>
                )}

                {/* IMAGE (optional) */}
                {current.type === 'image' && (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-[#0f2d6b]/30 rounded-2xl bg-[#f4f7fc] cursor-pointer hover:border-[#0f2d6b]/60 hover:bg-[#e8eff9] transition-all overflow-hidden">
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setImage(f);
                          setImagePreview(f ? URL.createObjectURL(f) : null);
                          setError(null);
                        }}
                      />
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="preview" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center"><ImageIcon className="w-10 h-10 text-[#5a6a8a] mx-auto mb-2" /><p className="text-[#5a6a8a]">Click to upload an image</p><p className="text-[#9aabcc] text-xs mt-1">JPG or PNG · Max 5 MB · optional</p></div>
                      )}
                    </label>
                    {image && (
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-[#0f2d6b] font-medium">{image.name}</span>
                        <button onClick={() => { setImage(null); setImagePreview(null); }} className="text-red-600 hover:underline">Remove</button>
                      </div>
                    )}
                  </div>
                )}

                {/* CONSENT */}
                {current.type === 'consent' && (
                  <div className="space-y-3">
                    {CONSENTS.map((c, i) => (
                      <button key={i} onClick={() => setConsents((prev) => prev.map((v, idx) => (idx === i ? !v : v)))} className={`w-full flex items-start gap-3 text-left p-4 rounded-xl border-2 transition-all ${consents[i] ? 'border-[#0f2d6b] bg-[#0f2d6b]/5' : 'border-gray-200 hover:border-[#0f2d6b]/40'}`}>
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${consents[i] ? 'bg-[#0f2d6b] text-white' : 'border-2 border-gray-300'}`}>{consents[i] && <Check className="w-4 h-4" />}</span>
                        <span className="text-sm text-[#3a4a6a] leading-relaxed">{c}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* REVIEW */}
                {current.type === 'review' && (
                  <div className="space-y-3">
                    {[
                      ['Title', form.title], ['Type', form.type], ['Research area', RESEARCH_AREAS.find((r) => r.value === form.category)?.label || form.category],
                      ['Author', form.authorName], ['Email', form.authorEmail], ['Affiliation', form.affiliation], ['Country', form.country], ['File', pdf?.name || '—'], ['Cover image', image?.name || 'None'],
                      ['Co-authors', coAuthors.filter((c) => c.name.trim()).length ? coAuthors.filter((c) => c.name.trim()).map((c) => c.name).join(', ') : 'None'],
                      ['SDGs', selectedSDGs.length ? selectedSDGs.map((n) => `#${n}`).join(', ') : 'None'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3 text-sm py-2 border-b border-border">
                        <span className="text-[#5a6a8a] w-32 flex-shrink-0">{k}</span>
                        <span className="text-[#0f1a2e] font-medium">{v || '—'}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* error */}
                {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                {/* actions — selects auto-advance, others show Continue */}
                {current.type !== 'select' && (
                  <div className="mt-8 flex items-center gap-3">
                    {current.type === 'review' ? (
                      <button onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a227] text-white rounded-xl font-bold hover:bg-[#b8911f] transition-all hover:scale-[1.02] disabled:opacity-60">
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        {submitting ? 'Submitting…' : 'Submit manuscript'}
                      </button>
                    ) : (
                      <button onClick={goNext} className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2d6b] text-white rounded-xl font-semibold hover:bg-[#0d2560] transition-all hover:scale-[1.02]">
                        Continue <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                    {current.type !== 'review' && <span className="text-xs text-gray-400">press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Enter ↵</kbd></span>}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer nav */}
      {index > -1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between z-30">
          <span className="text-xs text-[#5a6a8a]">{progress}% complete</span>
          <div className="flex gap-2">
            <button onClick={goBack} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#3a4a6a] hover:bg-gray-100 transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
            {current && current.type !== 'select' && current.type !== 'review' && (
              <button onClick={goNext} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white bg-[#0f2d6b] hover:bg-[#0d2560] transition-colors">Next <ArrowRight className="w-4 h-4" /></button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
