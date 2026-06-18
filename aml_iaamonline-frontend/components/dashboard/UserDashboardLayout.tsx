'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle, Search, BookOpen, Menu,
  ChevronDown, LogOut, User,
} from 'lucide-react';
import { getUser, clearAuth, isAuthenticated, authFetch, API_BASE, type AuthUser } from '@/lib/userAuth';
import { NotificationBell } from '@/components/shared/NotificationBell';

const NAV = [
  { label: 'My Submissions', icon: <LayoutDashboard className="w-5 h-5" />, href: '/dashboard' },
  { label: 'New Submission', icon: <PlusCircle className="w-5 h-5" />, href: '/dashboard/submit' },
  { label: 'Track Status', icon: <Search className="w-5 h-5" />, href: '/dashboard/track' },
  { label: 'My Proposals', icon: <BookOpen className="w-5 h-5" />, href: '/dashboard/proposals' },
  { label: 'My Profile', icon: <User className="w-5 h-5" />, href: '/dashboard/profile' },
];

function UserMenu({ user, onLogout }: { user: AuthUser | null; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'A';

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="w-9 h-9 rounded-full bg-[#0f2d6b] text-white flex items-center justify-center text-xs font-bold">{initials}</div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-semibold text-gray-900 leading-tight">{user?.name ?? 'Author'}</div>
          <div className="text-xs text-gray-500 capitalize">{user?.roles?.[0] ?? 'author'}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user?.name ?? 'Author'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email ?? ''}</p>
          </div>
          <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <User className="w-4 h-4" /> My profile
          </Link>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/account/login');
      return;
    }
    setUser(getUser());
    setChecked(true);
  }, [router]);

  const logout = () => {
    clearAuth();
    router.replace('/account/login');
  };

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#f0f4fb] flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-[#0f2d6b]/20 border-t-[#0f2d6b] rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (href: string) => (href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href));

  const SidebarNav = (
    <ul className="space-y-1 px-2">
      {NAV.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(item.href) ? 'bg-white text-[#0f2d6b] font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-[#f0f4fb]">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-100 text-gray-700 border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200">
          <div className="w-8 h-8 rounded-lg bg-[#0f2d6b] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">Author Portal</span>
        </div>
        <nav className="py-4">{SidebarNav}</nav>
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-[#0f2d6b]" style={{ fontFamily: "'Linux Libertine', Georgia, serif" }}>
            Advanced Materials Letters
          </h1>
          <div className="flex-1" />
          <NotificationBell authFetch={authFetch} apiBase={API_BASE} />
          <UserMenu user={user} onLogout={logout} />
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
