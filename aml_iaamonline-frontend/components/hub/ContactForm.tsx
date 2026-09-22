'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';

const HUB_API_URL = process.env.NEXT_PUBLIC_HUB_API_URL;

const SUBJECTS = [
  'Collaboration & joint publication',
  'Manuscript submission',
  'Subscriptions & access',
  'Membership',
  'Rights & permissions',
  'General enquiry',
];

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrors({});
    setErrorMessage('');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      organisation: form.get('organisation') || undefined,
      subject: form.get('subject'),
      message: form.get('message'),
    };

    try {
      const res = await fetch(`${HUB_API_URL}/hub/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (!res.ok) {
        if (body.errors) {
          setErrors(Object.fromEntries(Object.entries(body.errors).map(([k, v]) => [k, (v as string[])[0]])));
        }
        setErrorMessage(body.message || 'Something went wrong and your message was not sent. Please try again, or email publications@iaamonline.org.');
        setStatus('error');
        return;
      }

      setSuccessMessage(body.message);
      setStatus('success');
      e.currentTarget.reset();
    } catch {
      setErrorMessage('Something went wrong and your message was not sent. Please try again, or email publications@iaamonline.org.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[#DCE3F0] bg-white p-7">
        <p className="text-[14.5px] text-[#14532D] font-semibold">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#DCE3F0] bg-white p-7" noValidate>
      <h3 className="font-hub-display font-bold text-[21px] text-[#0B1F4D] mb-2">Send us a message</h3>
      <p className="text-[14px] text-[#5a6a8a] mb-6">
        Fill out the form below and we&rsquo;ll get back to you shortly.
      </p>

      {status === 'error' && (
        <p className="text-[13px] text-[#B42318] bg-[#FBE9EB] rounded-md px-3 py-2 mb-4">{errorMessage}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="hub-contact-name" className="block text-[12.5px] font-semibold text-[#14213D] mb-1.5">
            Full name <span className="text-[#B42318]">*</span>
          </label>
          <input
            id="hub-contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full h-11 px-3 rounded-md border border-[#DCE3F0] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          />
          {errors.name && <p className="text-[12px] text-[#B42318] mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="hub-contact-email" className="block text-[12.5px] font-semibold text-[#14213D] mb-1.5">
            Email address <span className="text-[#B42318]">*</span>
          </label>
          <input
            id="hub-contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full h-11 px-3 rounded-md border border-[#DCE3F0] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          />
          {errors.email && <p className="text-[12px] text-[#B42318] mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="hub-contact-org" className="block text-[12.5px] font-semibold text-[#14213D] mb-1.5">
          Organisation
        </label>
        <input
          id="hub-contact-org"
          name="organisation"
          type="text"
          placeholder="University, institute or company"
          className="w-full h-11 px-3 rounded-md border border-[#DCE3F0] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="hub-contact-subject" className="block text-[12.5px] font-semibold text-[#14213D] mb-1.5">
          Subject <span className="text-[#B42318]">*</span>
        </label>
        <select
          id="hub-contact-subject"
          name="subject"
          required
          defaultValue=""
          className="w-full h-11 px-3 rounded-md border border-[#DCE3F0] text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
        >
          <option value="" disabled>Select a subject</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.subject && <p className="text-[12px] text-[#B42318] mt-1">{errors.subject}</p>}
      </div>

      <div className="mb-2">
        <label htmlFor="hub-contact-message" className="block text-[12.5px] font-semibold text-[#14213D] mb-1.5">
          Message <span className="text-[#B42318]">*</span>
        </label>
        <textarea
          id="hub-contact-message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full px-3 py-2.5 rounded-md border border-[#DCE3F0] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
        />
        {errors.message && <p className="text-[12px] text-[#B42318] mt-1">{errors.message}</p>}
      </div>

      <p className="text-[11.5px] text-[#8B98B8] mb-4">Fields marked * are required.</p>
      <p className="text-[11.5px] text-[#8B98B8] mb-5">
        We use your details only to answer this message. See our{' '}
        <a href="/privacy-policy" className="underline">privacy policy</a>.
      </p>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex items-center justify-center gap-2 w-full h-13 py-3.5 rounded-lg bg-[var(--brand)] text-white text-[15px] font-bold hover:bg-[var(--brand-deep)] transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : (<>Send message <ArrowRight className="w-4 h-4" /></>)}
      </button>
    </form>
  );
}
