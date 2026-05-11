'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAdminLayout } from './AdminLayout';
import { AdminUser } from '@/lib/adminAuth';

interface AdminHeaderProps {
  user: AdminUser | null;
  onLogout: () => void;
}

function UserDropdown({
  isOpen,
  onClose,
  user,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onLogout: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{user?.name ?? 'Admin'}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email ?? ''}</p>
        <div className="flex gap-1 mt-2 flex-wrap">
          {user?.roles?.map((r) => (
            <span
              key={r}
              className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#0f2d6b]/10 text-[#0f2d6b] capitalize"
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      <Link
        href="/admin/profile"
        onClick={onClose}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <User className="w-4 h-4 text-gray-400" />
        My Profile
      </Link>
      <Link
        href="/admin/settings"
        onClick={onClose}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Settings className="w-4 h-4 text-gray-400" />
        Settings
      </Link>

      <div className="border-t border-gray-100 mt-1 pt-1">
        <button
          onClick={() => { onClose(); onLogout(); }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  const { setMobileMenuOpen } = useAdminLayout();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 lg:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-[#0f2d6b] hidden sm:block">
            AML Admin Panel
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notifications placeholder */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#0f2d6b] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {user?.name ?? 'Admin'}
                </p>
                <p className="text-[10px] text-gray-500 capitalize">
                  {user?.roles?.[0] ?? 'admin'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            <UserDropdown
              isOpen={userMenuOpen}
              onClose={() => setUserMenuOpen(false)}
              user={user}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
