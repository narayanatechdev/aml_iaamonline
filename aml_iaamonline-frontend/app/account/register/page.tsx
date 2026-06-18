'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { AuthSplit } from '@/components/account/AuthSplit';
import { saveAuth, API_BASE } from '@/lib/userAuth';

export default function AuthorRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();

      if (res.ok && result.success && result.token) {
        saveAuth(result.token, result.user);
        router.push('/dashboard');
      } else {
        // Surface the first Laravel validation error if present
        const firstError = result.errors ? Object.values(result.errors)[0] : null;
        setError((Array.isArray(firstError) ? firstError[0] : firstError) || result.message || 'Could not create your account.');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const input =
    'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] placeholder:text-gray-400';

  return (
    <AuthSplit>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-500 text-sm mt-1">Register to submit manuscripts and track their progress.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={set('name')} required placeholder="Given Family" className={input} />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">Email Address</label>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="you@institution.edu" className={input} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="Min. 8 characters" className={input} />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Confirm</label>
              <input type="password" value={form.password_confirmation} onChange={set('password_confirmation')} required placeholder="Repeat password" className={input} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3d7c] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/account/login" className="text-[#0f2d6b] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
      </form>
    </AuthSplit>
  );
}
