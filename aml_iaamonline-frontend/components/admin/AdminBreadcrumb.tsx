'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function AdminBreadcrumb({ items, showHome = true }: AdminBreadcrumbProps) {
  // Avoid a duplicate "Dashboard" when the page already passes it as the first item
  const firstIsDashboard = items[0]?.href === '/admin' || items[0]?.label === 'Dashboard';
  const allItems = showHome && !firstIsDashboard
    ? [{ label: 'Dashboard', href: '/admin' }, ...items]
    : items;

  return (
    <nav className="flex items-center gap-1 text-sm mb-4">
      {showHome && (
        <Link
          href="/admin"
          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Home className="w-4 h-4" />
        </Link>
      )}
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isFirst = index === 0;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1">
            {(!showHome || !isFirst) && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            {isLast || !item.href ? (
              <span className="px-1 text-gray-900 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="px-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
