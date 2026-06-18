'use client';

import { useState, useEffect } from 'react';
import { Save, Info, Mail } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';

const STORAGE_KEY = 'admin_settings_email_templates';

interface Template {
  key: string;
  name: string;
  subject: string;
  body: string;
}

const DEFAULT_TEMPLATES: Template[] = [
  { key: 'submission_received', name: 'Submission Received', subject: 'Your manuscript {{title}} has been received', body: 'Dear {{author}},\n\nThank you for submitting your manuscript. Your submission ID is {{submission_id}}.\n\nRegards,\nEditorial Office' },
  { key: 'review_invitation', name: 'Reviewer Invitation', subject: 'Invitation to review {{title}}', body: 'Dear {{reviewer}},\n\nYou have been invited to review a manuscript for Advanced Materials Letters. Please respond by {{due_date}}.\n\nRegards,\nEditorial Office' },
  { key: 'decision_accept', name: 'Decision — Accept', subject: 'Decision on {{title}}: Accepted', body: 'Dear {{author}},\n\nWe are pleased to inform you that your manuscript has been accepted for publication.\n\nRegards,\nEditorial Office' },
  { key: 'decision_revisions', name: 'Decision — Revisions', subject: 'Decision on {{title}}: Revisions required', body: 'Dear {{author}},\n\nYour manuscript requires revisions before it can be accepted. Please see the reviewer comments.\n\nRegards,\nEditorial Office' },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [activeKey, setActiveKey] = useState(DEFAULT_TEMPLATES[0].key);
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({ type: 'success', message: '', isVisible: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: Template[] = JSON.parse(raw);
        setTemplates(DEFAULT_TEMPLATES.map((d) => saved.find((s) => s.key === d.key) ?? d));
      }
    } catch { /* ignore */ }
  }, []);

  const active = templates.find((t) => t.key === activeKey)!;

  const update = (patch: Partial<Template>) => {
    setTemplates((prev) => prev.map((t) => (t.key === activeKey ? { ...t, ...patch } : t)));
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    setToast({ type: 'success', message: `Template "${active.name}" saved.`, isVisible: true });
  };

  const input = 'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

  return (
    <div className="min-h-full">
      <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'Email Templates' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customise automated notification emails · use {`{{placeholders}}`}</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">Templates are saved in this browser. Connect to a mail/settings API to send these for real.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Template list */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 h-fit">
          {templates.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveKey(t.key)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-colors mb-1 ${activeKey === t.key ? 'bg-[#0f2d6b] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t.name}</span>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
            <input className={input} value={active.subject} onChange={(e) => update({ subject: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Body</label>
            <textarea rows={12} className={`${input} resize-y font-mono`} value={active.body} onChange={(e) => update({ body: e.target.value })} />
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors shadow-sm">
              <Save className="w-4 h-4" /> Save Template
            </button>
          </div>
        </div>
      </div>

      <SimpleToast {...toast} onClose={() => setToast((t) => ({ ...t, isVisible: false }))} />
    </div>
  );
}
