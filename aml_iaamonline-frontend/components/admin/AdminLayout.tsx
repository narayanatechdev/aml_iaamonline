'use client';

import { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminLayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) throw new Error('useAdminLayout must be used within AdminLayoutProvider');
  return context;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);
  const pathname = usePathname();
  const { user, checked, logout } = useAdminAuth();

  // Don't render shell on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // While checking auth, show a blank screen (avoids flash)
  if (!checked) {
    return (
      <div className="min-h-screen bg-[#f0f4fb] flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-[#0f2d6b]/20 border-t-[#0f2d6b] rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated useAdminAuth already redirected — render nothing
  if (!user) return null;

  return (
    <AdminLayoutContext.Provider
      value={{ sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen }}
    >
      <div className="min-h-screen bg-[#f0f4fb]">
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <AdminSidebar currentPage={currentPage} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <AdminHeader user={user} onLogout={logout} />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
