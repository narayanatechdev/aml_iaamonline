'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardCheck, BookOpen, Menu, LogOut } from 'lucide-react';
import { getToken, getUser, clearAuth, authFetch, API_BASE, type AuthUser } from '@/lib/userAuth';
import { NotificationBell } from '@/components/shared/NotificationBell';

export function ReviewerShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    const u = getUser();
    if (!token || !u) { router.replace('/account/login'); return; }
    setUser(u);
    setChecked(true);
  }, [router]);

  const logout = () => { clearAuth(); router.replace('/account/login'); };

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#f0f4fb] flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-[#0f2d6b]/20 border-t-[#0f2d6b] rounded-full animate-spin" />
      </div>
    );
  }

  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : 'R';

  return (
    <div className="min-h-screen bg-[#f0f4fb]">
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-100 text-gray-700 border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200">
          <div className="w-8 h-8 rounded-lg bg-[#c9a227] flex items-center justify-center flex-shrink-0"><BookOpen className="w-4 h-4 text-white" /></div>
          <span className="text-sm font-bold text-gray-900">Reviewer Portal</span>
        </div>
        <nav className="py-4 px-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-white text-[#0f2d6b] font-semibold shadow-sm">
            <ClipboardCheck className="w-5 h-5" /> My Reviews
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-lg font-bold text-[#0f2d6b]">Peer Review</h1>
          <div className="flex-1" />
          <NotificationBell authFetch={authFetch} apiBase={API_BASE} />
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#0f2d6b] text-white flex items-center justify-center text-xs font-bold">{initials}</div>
            <div className="hidden sm:block"><div className="text-sm font-semibold text-gray-900 leading-tight">{user?.name ?? 'Reviewer'}</div><div className="text-xs text-gray-500">Reviewer</div></div>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
