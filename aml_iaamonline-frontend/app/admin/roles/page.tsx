'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Shield, Loader2, RefreshCw, Lock } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  type: string;
  permissions_count: number;
  users_count: number;
  is_protected: boolean;
}

const API_URL = API_BASE;

const ROLE_TYPE_CONFIG: Record<string, { color: string; bgColor: string }> = {
  author: { color: 'text-gray-700', bgColor: 'bg-gray-100' },
  reviewer: { color: 'text-blue-700', bgColor: 'bg-blue-100' },
  editor: { color: 'text-purple-700', bgColor: 'bg-purple-100' },
  admin: { color: 'text-red-700', bgColor: 'bg-red-100' },
};

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; role: Role | null }>({
    isOpen: false,
    role: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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
      const response = await authFetch(`${API_URL}/admin/roles`);
      if (!response.ok) throw new Error('Failed to fetch roles');

      const data = await response.json();
      setRoles(data.data || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDeleteRole = async () => {
    if (!deleteDialog.role) return;

    setIsDeleting(true);
    try {
      const response = await authFetch(`${API_URL}/admin/roles/${deleteDialog.role.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete role');

      showToast('success', `Role "${deleteDialog.role.display_name}" has been deleted.`);
      setDeleteDialog({ isOpen: false, role: null });
      fetchRoles();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete role');
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleTypeConfig = (type: string) => {
    return ROLE_TYPE_CONFIG[type] || ROLE_TYPE_CONFIG.author;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0f2d6b] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb items={[{ label: 'Roles' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage roles and their permissions
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/roles/new')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchRoles}
              className="flex items-center gap-1 text-sm text-red-700 hover:text-red-900"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const typeConfig = getRoleTypeConfig(role.type);

          return (
            <div
              key={role.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig.bgColor}`}
                    >
                      <Shield className={`w-5 h-5 ${typeConfig.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {role.display_name}
                        </h3>
                        {role.is_protected && (
                          <span title="Protected role">
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${typeConfig.bgColor} ${typeConfig.color}`}
                      >
                        {role.type.charAt(0).toUpperCase() + role.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {role.description || 'No description provided.'}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Permissions:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {role.permissions_count || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Users:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {role.users_count || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => router.push(`/admin/roles/${role.id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                {!role.is_protected && (
                  <button
                    onClick={() => setDeleteDialog({ isOpen: true, role })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {roles.length === 0 && !isLoading && !error && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Roles Found</h3>
          <p className="text-sm text-gray-500 mb-4">
            Get started by creating your first role.
          </p>
          <button
            onClick={() => router.push('/admin/roles/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Role"
        message={
          deleteDialog.role?.users_count
            ? `This role is assigned to ${deleteDialog.role.users_count} user(s). Are you sure you want to delete "${deleteDialog.role?.display_name}"? Users with this role will lose their permissions.`
            : `Are you sure you want to delete "${deleteDialog.role?.display_name}"? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteRole}
        onCancel={() => setDeleteDialog({ isOpen: false, role: null })}
      />

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
