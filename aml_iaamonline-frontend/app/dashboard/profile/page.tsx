'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, User, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { authFetch, getUser, saveAuth, getToken, API_BASE } from '@/lib/userAuth';

interface Profile {
  name: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  affiliation?: string | null;
  orcid?: string | null;
  country?: string | null;
  city?: string | null;
  phone?: string | null;
}

const inputCls =
  'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] disabled:opacity-60';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' });

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/me`);
      if (res.ok) {
        const json = await res.json();
        setProfile(json.user);
        setRoles(json.roles ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);
    setMsg(null);
    try {
      const res = await authFetch(`${API_BASE}/me`, {
        method: 'PATCH',
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!res.ok) {
        const fe = json.errors ? Object.values(json.errors)[0] : null;
        throw new Error((Array.isArray(fe) ? fe[0] : fe) || json.message || 'Could not save.');
      }
      // keep the cached name/email (used in the header) in sync
      const u = getUser();
      const token = getToken();
      if (u && token) saveAuth(token, { ...u, name: profile.name, email: profile.email });
      setMsg({ type: 'ok', text: 'Profile saved.' });
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Could not save.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPw(true);
    setPwMsg(null);
    if (pw.password !== pw.password_confirmation) {
      setPwMsg({ type: 'err', text: 'New passwords do not match.' });
      setSavingPw(false);
      return;
    }
    try {
      const res = await authFetch(`${API_BASE}/me/password`, { method: 'PUT', body: JSON.stringify(pw) });
      const json = await res.json();
      if (!res.ok) {
        const fe = json.errors ? Object.values(json.errors)[0] : null;
        throw new Error((Array.isArray(fe) ? fe[0] : fe) || json.message || 'Could not update password.');
      }
      setPwMsg({ type: 'ok', text: 'Password updated.' });
      setPw({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      setPwMsg({ type: 'err', text: err instanceof Error ? err.message : 'Could not update password.' });
    } finally {
      setSavingPw(false);
    }
  };

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile((p) => (p ? { ...p, [k]: e.target.value } : p));

  const initials = profile?.name ? profile.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : 'A';

  return (
    <UserDashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your account details and password.</p>
        </div>

        {isLoading || !profile ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-[#0f2d6b] animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            {/* Identity header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0f2d6b] to-[#c9a227] text-white flex items-center justify-center text-lg font-bold">{initials}</div>
              <div>
                <p className="text-lg font-bold text-gray-900">{profile.name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <div className="flex gap-1.5 mt-1">
                  {roles.map((r) => (
                    <span key={r} className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#0f2d6b]/10 text-[#0f2d6b] capitalize">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile form */}
            <form onSubmit={saveProfile} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-4 h-4 text-[#0f2d6b]" />
                <h2 className="text-base font-bold text-gray-900">Account Details</h2>
              </div>

              {msg && (
                <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {msg.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {msg.text}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">Full Name</label><input value={profile.name ?? ''} onChange={set('name')} required className={inputCls} /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">Email</label><input value={profile.email ?? ''} disabled className={inputCls} title="Email cannot be changed here" /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">Affiliation</label><input value={profile.affiliation ?? ''} onChange={set('affiliation')} placeholder="Institution, Department" className={inputCls} /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">ORCID</label><input value={profile.orcid ?? ''} onChange={set('orcid')} placeholder="0000-0000-0000-0000" className={inputCls} /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">Country</label><input value={profile.country ?? ''} onChange={set('country')} className={inputCls} /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">City</label><input value={profile.city ?? ''} onChange={set('city')} className={inputCls} /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">Phone</label><input value={profile.phone ?? ''} onChange={set('phone')} className={inputCls} /></div>
              </div>

              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={savingProfile} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3d7c] transition-colors disabled:opacity-50">
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                </button>
              </div>
            </form>

            {/* Password form */}
            <form onSubmit={savePassword} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <KeyRound className="w-4 h-4 text-[#0f2d6b]" />
                <h2 className="text-base font-bold text-gray-900">Change Password</h2>
              </div>

              {pwMsg && (
                <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${pwMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {pwMsg.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {pwMsg.text}
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">Current</label><input type="password" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} required className={inputCls} /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">New</label><input type="password" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} required placeholder="Min. 8 chars" className={inputCls} /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1.5">Confirm</label><input type="password" value={pw.password_confirmation} onChange={(e) => setPw({ ...pw, password_confirmation: e.target.value })} required className={inputCls} /></div>
              </div>

              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={savingPw} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#0f2d6b] rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
                  {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />} Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}
