'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { saveAuth, API_BASE } from '@/lib/userAuth';
import { AuthSplit } from '@/components/account/AuthSplit';

export default function AuthorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (res.ok && result.success && result.token) {
        saveAuth(result.token, result.user);
        const roles: string[] = result.user?.roles ?? [];
        // Reviewers go to the reviewer portal; everyone else to their dashboard
        router.push(roles.includes('reviewer') && !roles.includes('author') ? '/reviewer' : '/dashboard');
      } else {
        setError(result.message || 'Invalid email or password.');
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
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="text-gray-500 text-sm mt-1">Access your submissions and track their progress.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1.5">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@institution.edu" className={input} />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className={input} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3d7c] transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="text-center text-xs text-gray-500">
          New author?{' '}
          <Link href="/account/register" className="text-[#0f2d6b] font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthSplit>
  );
}
