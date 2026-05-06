'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Key, Trash2, UserCog, RefreshCw } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { FilterPanel, FilterOption } from '@/components/admin/FilterPanel';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { SimpleToast, ToastType } from '@/components/ui/Toast';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  roles: string[];
  last_login: string | null;
  created_at: string;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
}

interface PaginatedResponse {
  data: User[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message, isVisible: true });
  };

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      if (searchQuery) params.set('search', searchQuery);
      if (filterRole) params.set('role', filterRole);
      if (filterStatus) params.set('status', filterStatus);

      const response = await fetch(`${API_URL}/admin/users?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch users');

      const data: PaginatedResponse = await response.json();
      setUsers(data.data);
      setPagination(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterRole, filterStatus]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admin/roles`);
      if (!response.ok) throw new Error('Failed to fetch roles');

      const data = await response.json();
      setRoles(data.data || data);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleApplyFilters = () => {
    fetchUsers(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterRole('');
    setFilterStatus('');
    fetchUsers(1);
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog.user) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/users/${deleteDialog.user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      showToast('success', `User "${deleteDialog.user.name}" has been deleted.`);
      setDeleteDialog({ isOpen: false, user: null });
      fetchUsers(pagination.current_page);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordDialog.user) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/admin/users/${resetPasswordDialog.user.id}/reset-password`,
        { method: 'POST' }
      );

      if (!response.ok) throw new Error('Failed to send reset password email');

      showToast('success', `Password reset email sent to ${resetPasswordDialog.user.email}.`);
      setResetPasswordDialog({ isOpen: false, user: null });
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to send reset password email');
    } finally {
      setIsActionLoading(false);
    }
  };

  const filters: FilterOption[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      value: searchQuery,
      onChange: (value) => setSearchQuery(value as string),
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      value: filterRole,
      onChange: (value) => setFilterRole(value as string),
      options: roles.map((role) => ({ label: role.display_name, value: role.name })),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: filterStatus,
      onChange: (value) => setFilterStatus(value as string),
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ];

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      sortable: true,
      render: (value: unknown, row: User) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
        </div>
      ),
    },
    {
      key: 'email' as const,
      label: 'Email',
      sortable: true,
    },
    {
      key: 'roles' as const,
      label: 'Role(s)',
      render: (value: unknown) => {
        const roleNames = value as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {roleNames.map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#0f2d6b]/10 text-[#0f2d6b]"
              >
                {role}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'status' as const,
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const status = value as string;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'last_login' as const,
      label: 'Last Login',
      sortable: true,
      render: (value: unknown) => {
        const date = value as string | null;
        if (!date) return <span className="text-gray-400">Never</span>;
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
  ];

  const actions = [
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: (row: User) => router.push(`/admin/users/${row.id}`),
    },
    {
      label: 'Reset Password',
      icon: <Key className="w-4 h-4" />,
      onClick: (row: User) => setResetPasswordDialog({ isOpen: true, user: row }),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: User) => setDeleteDialog({ isOpen: true, user: row }),
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb items={[{ label: 'Users' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/users/new')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Filters */}
      <FilterPanel
        title="Search & Filter"
        filters={filters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => fetchUsers(pagination.current_page)}
              className="flex items-center gap-1 text-sm text-red-700 hover:text-red-900"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => fetchUsers(page)}
        actions={actions}
        keyField="id"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteDialog.user?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={isActionLoading}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteDialog({ isOpen: false, user: null })}
      />

      {/* Reset Password Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetPasswordDialog.isOpen}
        title="Reset Password"
        message={`Send a password reset email to "${resetPasswordDialog.user?.email}"?`}
        confirmText="Send Email"
        cancelText="Cancel"
        isLoading={isActionLoading}
        onConfirm={handleResetPassword}
        onCancel={() => setResetPasswordDialog({ isOpen: false, user: null })}
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
