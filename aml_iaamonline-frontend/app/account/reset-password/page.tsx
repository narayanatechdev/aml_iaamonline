'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE } from '@/lib/userAuth';
import { AuthSplit } from '@/components/account/AuthSplit';

// Opened from the emailed link (password setup for a new journal account,
// or a reset requested by an admin): ?token=…&email=…
function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmation) {
      setError('The two passwords don’t match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ token, email, password, password_confirmation: confirmation }),
      });
      const result = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        const first = result.errors ? Object.values(result.errors)[0] : null;
        setError((Array.isArray(first) ? first[0] : first) || result.message || 'This link could not be used.');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const input =
    'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] placeholder:text-gray-400';

  if (!token || !email) {
    return (
      <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-700">This link is incomplete. Please open it straight from your email.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800">Your password is set. You can sign in now.</p>
        </div>
        <Link
          href="/editor/login"
          className="w-full flex items-center justify-center px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3d7c] transition-colors"
        >
          Go to editor sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1.5">Email Address</label>
        <input type="email" value={email} readOnly className={`${input} text-gray-500`} />
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1.5">New Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" className={input} />
      </div>
      <div>
        <label htmlFor="password_confirmation" className="block text-gray-700 text-sm font-medium mb-1.5">Confirm Password</label>
        <input id="password_confirmation" type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required minLength={8} autoComplete="new-password" className={input} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3d7c] transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
        {loading ? 'Saving…' : 'Set Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthSplit>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Set your password</h1>
        <p className="text-gray-500 text-sm mt-1">Choose a password for your journal account.</p>
      </div>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthSplit>
  );
}
