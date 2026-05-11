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

    if (!token || !u) {
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
