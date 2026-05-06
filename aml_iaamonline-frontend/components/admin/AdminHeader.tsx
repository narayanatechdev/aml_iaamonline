'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAdminLayout } from './AdminLayout';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">Admin User</p>
        <p className="text-xs text-gray-500">admin@iaamonline.org</p>
      </div>
      <a
        href="/admin/profile"
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <User className="w-4 h-4" />
        Profile
      </a>
      <a
        href="/admin/settings"
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Settings className="w-4 h-4" />
        Settings
      </a>
      <div className="border-t border-gray-100 mt-2 pt-2">
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminHeader() {
  const { setMobileMenuOpen } = useAdminLayout();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 lg:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Page title - could be dynamic */}
          <h1 className="text-lg font-semibold text-[#0f2d6b] hidden sm:block">
            Admin Panel
          </h1>
        </div>

        {/* Center - Search (optional placeholder) */}
        <div className="flex-1 max-w-md hidden md:block">
          {/* Search bar placeholder - can be enabled if needed */}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#0f2d6b] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                Admin
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>

            <UserDropdown
              isOpen={userMenuOpen}
              onClose={() => setUserMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
