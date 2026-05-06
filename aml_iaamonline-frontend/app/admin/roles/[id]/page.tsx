'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Users, AlertTriangle } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { RoleForm, RoleFormData, Permission } from '@/components/forms/RoleForm';
import { SimpleToast, ToastType } from '@/components/ui/Toast';

interface RoleDetails extends RoleFormData {
  users_count: number;
  is_protected: boolean;
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id as string;

  const [role, setRole] = useState<RoleDetails | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [roleResponse, permissionsResponse] = await Promise.all([
        fetch(`${API_URL}/admin/roles/${roleId}`),
        fetch(`${API_URL}/admin/permissions`),
      ]);

      if (!roleResponse.ok) throw new Error('Failed to fetch role');
      if (!permissionsResponse.ok) throw new Error('Failed to fetch permissions');

      const roleData = await roleResponse.json();
      const permissionsData = await permissionsResponse.json();

      setRole(roleData.data || roleData);
      setAllPermissions(permissionsData.data || permissionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (data: {
    name: string;
    display_name: string;
    description: string;
    type: string;
    permissions: string[];
  }) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/admin/roles/${roleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update role');
      }

      const updatedRole = await response.json();
      setRole(updatedRole.data || updatedRole);
      showToast('success', 'Role updated successfully!');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update role');
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

  if (error || !role) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb
          items={[
            { label: 'Roles', href: '/admin/roles' },
            { label: 'Edit Role' },
          ]}
        />
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Role</h2>
          <p className="text-sm text-red-600 mb-4">{error || 'Role not found'}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/admin/roles')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Roles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: 'Roles', href: '/admin/roles' },
          { label: role.display_name },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Role</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage role details and permissions
          </p>
        </div>
      </div>

      {/* Users Count Warning */}
      {role.users_count > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              This role is assigned to {role.users_count} user{role.users_count > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Changes to this role will affect all assigned users immediately.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-3">
          <RoleForm
            initialData={{
              id: role.id,
              name: role.name,
              display_name: role.display_name,
              description: role.description,
              type: role.type,
              permissions: role.permissions,
            }}
            allPermissions={allPermissions}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            isProtected={role.is_protected}
          />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          {/* Users Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Assigned Users</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0f2d6b]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0f2d6b]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{role.users_count}</p>
                <p className="text-xs text-gray-500">
                  {role.users_count === 1 ? 'User assigned' : 'Users assigned'}
                </p>
              </div>
            </div>
          </div>

          {/* Role Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Role Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Permissions</span>
                <span className="text-sm font-medium text-gray-900">
                  {role.permissions.length} / {allPermissions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#0f2d6b] h-2 rounded-full transition-all"
                  style={{
                    width: `${(role.permissions.length / Math.max(allPermissions.length, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Timestamps</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <p className="font-medium text-gray-900">
                  {new Date(role.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <p className="font-medium text-gray-900">
                  {new Date(role.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
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
