'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { UserForm, Role } from '@/components/forms/UserForm';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { Loader2 } from 'lucide-react';
import { authFetch, API_BASE } from '@/lib/adminAuth';

export default function NewUserPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message, isVisible: true });
  };

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authFetch(`${API_BASE}/admin/roles`);
      if (!response.ok) throw new Error('Failed to fetch roles');

      const data = await response.json();
      setRoles(data.data || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSubmit = async (data: {
    name: string;
    email: string;
    status: 'active' | 'inactive';
    roles: string[];
  }) => {
    setIsSubmitting(true);

    try {
      const response = await authFetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create user');
      }

      showToast('success', 'User created successfully!');

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/users');
      }, 1500);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0f2d6b] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: 'Users', href: '/admin/users' },
            { label: 'New User' },
          ]}
        />
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Form</h2>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRoles}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: 'Users', href: '/admin/users' },
          { label: 'New User' },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add a new user to the system
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <UserForm
          roles={roles}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Create User"
        />
      </div>

      {/* Toast */}
      <SimpleToast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
