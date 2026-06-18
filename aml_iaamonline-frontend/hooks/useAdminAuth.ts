'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, getUser, clearAuth, AdminUser } from '@/lib/adminAuth';

export function useAdminAuth() {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]       = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    const u     = getUser();
    const isAdmin = !!u?.roles?.includes('admin');
    const isEditor = !!u?.roles?.some((r) => ['editor', 'managing-editor'].includes(r));

    if (token && u && !isAdmin && isEditor) {
      // An editor signed in — the admin panel isn't for them, send to /editor
      if (pathname !== '/admin/login') router.replace('/editor');
    } else if (!token || !u || !isAdmin) {
      // No token, or a non-staff account — deny admin access
      clearAuth();
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    } else {
      setUser(u);
    }
    setChecked(true);
  }, [pathname, router]);

  const logout = () => {
    clearAuth();
    router.replace('/admin/login');
  };

  return { user, checked, logout };
}
