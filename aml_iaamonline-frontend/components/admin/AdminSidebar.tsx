'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser } from '@/lib/adminAuth';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useAdminLayout } from './AdminLayout';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  adminOnly?: boolean;
  children?: { label: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/admin',
  },
  {
    label: 'Articles',
    icon: <BookOpen className="w-5 h-5" />,
    path: '/admin/articles',
  },
  {
    label: 'Authors',
    icon: <UserCheck className="w-5 h-5" />,
    path: '/admin/authors',
  },
  {
    label: 'Users',
    icon: <Users className="w-5 h-5" />,
    path: '/admin/users',
    adminOnly: true,
  },
  {
    label: 'Roles',
    icon: <Shield className="w-5 h-5" />,
    path: '/admin/roles',
    adminOnly: true,
  },
  {
    label: 'Manuscripts',
    icon: <FileText className="w-5 h-5" />,
    path: '/admin/manuscripts',
  },
  {
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    adminOnly: true,
    children: [
      { label: 'General', path: '/admin/settings/general' },
      { label: 'Workflow', path: '/admin/settings/workflow' },
      { label: 'Email Templates', path: '/admin/settings/email-templates' },
      { label: 'Security', path: '/admin/settings/security' },
    ],
  },
  {
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    adminOnly: true,
    children: [
      { label: 'Dashboard', path: '/admin/analytics' },
      { label: 'Submission Trends', path: '/admin/analytics/submissions' },
      { label: 'Acceptance Rate', path: '/admin/analytics/acceptance' },
      { label: 'Review Turnaround', path: '/admin/analytics/review-turnaround' },
      { label: 'Editor Performance', path: '/admin/analytics/editor-performance' },
      { label: 'Audit Logs', path: '/admin/analytics/audit-logs' },
    ],
  },
];

interface AdminSidebarProps {
  currentPage?: string;
}

export function AdminSidebar({ currentPage }: AdminSidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useAdminLayout();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Derive admin status from the logged-in user (stored at login). Read after
  // mount to avoid SSR/hydration mismatch, since it comes from localStorage.
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(getUser()?.roles?.includes('admin') ?? false);
  }, []);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  const isChildActive = (children?: { path: string }[]) => {
    if (!children) return false;
    return children.some((child) => pathname.startsWith(child.path));
  };

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-100 text-gray-700 border-r border-gray-200 z-50 transition-all duration-300 hidden lg:block ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c9a227] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold truncate text-gray-900">AML Admin</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-[#c9a227] flex items-center justify-center mx-auto">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Navigation */}
        <nav className="py-4 overflow-y-auto h-[calc(100%-8rem)]">
          <ul className="space-y-1 px-2">
            {filteredNavItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => !sidebarCollapsed && toggleMenu(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isChildActive(item.children)
                          ? 'bg-white text-[#0f2d6b] font-semibold shadow-sm'
                          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedMenus.includes(item.label)
                                ? 'rotate-180'
                                : ''
                            }`}
                          />
                        </>
                      )}
                    </button>
                    {!sidebarCollapsed &&
                      expandedMenus.includes(item.label) && (
                        <ul className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.path}>
                              <Link
                                href={child.path}
                                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                  pathname === child.path
                                    ? 'bg-white text-[#0f2d6b] font-semibold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </>
                ) : (
                  <Link
                    href={item.path!}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive(item.path)
                        ? 'bg-white text-[#0f2d6b] font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            title={sidebarCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 text-gray-700 border-r border-gray-200 z-50 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c9a227] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">AML Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="py-4 overflow-y-auto h-[calc(100%-8rem)]">
          <ul className="space-y-1 px-2">
            {filteredNavItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isChildActive(item.children)
                          ? 'bg-white text-[#0f2d6b] font-semibold shadow-sm'
                          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedMenus.includes(item.label) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedMenus.includes(item.label) && (
                      <ul className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              href={child.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                pathname === child.path
                                  ? 'bg-white text-[#0f2d6b] font-semibold shadow-sm'
                                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.path!}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive(item.path)
                        ? 'bg-white text-[#0f2d6b] font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
