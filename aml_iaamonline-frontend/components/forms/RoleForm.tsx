'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string;
  resource: string;
  action: string;
}

interface RoleFormData {
  id?: number;
  name: string;
  display_name: string;
  description: string;
  type: string;
  permissions: string[];
}

interface RoleFormProps {
  initialData?: RoleFormData;
  allPermissions: Permission[];
  onSubmit: (data: Omit<RoleFormData, 'id'>) => Promise<void>;
  isLoading?: boolean;
  isProtected?: boolean;
}

interface FormErrors {
  name?: string;
  display_name?: string;
  permissions?: string;
  general?: string;
}

const ROLE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  author: { label: 'Author', color: 'bg-gray-100 text-gray-700' },
  reviewer: { label: 'Reviewer', color: 'bg-blue-100 text-blue-700' },
  editor: { label: 'Editor', color: 'bg-purple-100 text-purple-700' },
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700' },
};

export function RoleForm({
  initialData,
  allPermissions,
  onSubmit,
  isLoading = false,
  isProtected = false,
}: RoleFormProps) {
  const [formData, setFormData] = useState<Omit<RoleFormData, 'id'>>({
    name: initialData?.name || '',
    display_name: initialData?.display_name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'author',
    permissions: initialData?.permissions || [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        display_name: initialData.display_name,
        description: initialData.description,
        type: initialData.type,
        permissions: initialData.permissions,
      });
    }
  }, [initialData]);

  // Group permissions by resource
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    allPermissions.forEach((permission) => {
      if (!groups[permission.resource]) {
        groups[permission.resource] = [];
      }
      groups[permission.resource].push(permission);
    });
    return groups;
  }, [allPermissions]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-z0-9_-]+$/.test(formData.name)) {
      newErrors.name =
        'Name must contain only lowercase letters, numbers, hyphens, and underscores';
    }

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePermissionToggle = (permissionName: string) => {
    if (isProtected) return;

    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionName)
        ? prev.permissions.filter((p) => p !== permissionName)
        : [...prev.permissions, permissionName],
    }));
  };

  const handleResourceToggle = (resource: string) => {
    if (isProtected) return;

    const resourcePermissions = groupedPermissions[resource]?.map((p) => p.name) || [];
    const allSelected = resourcePermissions.every((p) =>
      formData.permissions.includes(p)
    );

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !resourcePermissions.includes(p))
        : [...new Set([...prev.permissions, ...resourcePermissions])],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProtected) return;

    if (!validate()) return;

    setSubmitSuccess(false);
    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setErrors({
        general:
          error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const isResourceFullySelected = (resource: string) => {
    const resourcePermissions = groupedPermissions[resource]?.map((p) => p.name) || [];
    return resourcePermissions.every((p) => formData.permissions.includes(p));
  };

  const isResourcePartiallySelected = (resource: string) => {
    const resourcePermissions = groupedPermissions[resource]?.map((p) => p.name) || [];
    const selectedCount = resourcePermissions.filter((p) =>
      formData.permissions.includes(p)
    ).length;
    return selectedCount > 0 && selectedCount < resourcePermissions.length;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Protected Role Warning */}
      {isProtected && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-700">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">
            This is a protected role and cannot be modified.
          </span>
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{errors.general}</span>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">Role saved successfully!</span>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Role Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isProtected}
              placeholder="e.g., senior_editor"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Display Name Field */}
          <div>
            <label
              htmlFor="display_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              disabled={isProtected}
              placeholder="e.g., Senior Editor"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.display_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.display_name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.display_name}
              </p>
            )}
          </div>

          {/* Type Field */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type
            </label>
            <div className="flex items-center gap-2">
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isProtected || !!initialData}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="author">Author</option>
                <option value="reviewer">Reviewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  ROLE_TYPE_CONFIG[formData.type]?.color || 'bg-gray-100 text-gray-700'
                }`}
              >
                {ROLE_TYPE_CONFIG[formData.type]?.label || formData.type}
              </span>
            </div>
          </div>

          {/* Description Field */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isProtected}
              placeholder="Describe the role's responsibilities..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Permissions</h3>
          <span className="text-xs text-gray-500">
            {formData.permissions.length} of {allPermissions.length} selected
          </span>
        </div>

        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([resource, permissions]) => (
            <div
              key={resource}
              className="border border-gray-100 rounded-lg overflow-hidden"
            >
              {/* Resource Header */}
              <div
                className={`flex items-center gap-3 px-4 py-3 bg-gray-50 ${
                  !isProtected ? 'cursor-pointer hover:bg-gray-100' : ''
                } transition-colors`}
                onClick={() => handleResourceToggle(resource)}
              >
                <input
                  type="checkbox"
                  checked={isResourceFullySelected(resource)}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = isResourcePartiallySelected(resource);
                    }
                  }}
                  onChange={() => handleResourceToggle(resource)}
                  disabled={isProtected}
                  className="w-4 h-4 rounded border-gray-300 text-[#0f2d6b] focus:ring-[#0f2d6b] disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {resource.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-500">
                  ({permissions.length} permissions)
                </span>
              </div>

              {/* Permissions List */}
              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {permissions.map((permission) => (
                  <label
                    key={permission.id}
                    className={`flex items-start gap-2 ${
                      !isProtected ? 'cursor-pointer' : 'cursor-not-allowed'
                    } group`}
                    title={permission.description}
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.name)}
                      onChange={() => handlePermissionToggle(permission.name)}
                      disabled={isProtected}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#0f2d6b] focus:ring-[#0f2d6b] disabled:cursor-not-allowed"
                    />
                    <div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {permission.display_name}
                      </span>
                      {permission.description && (
                        <p className="text-xs text-gray-500 mt-0.5 hidden group-hover:block">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {allPermissions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            No permissions available.
          </p>
        )}
      </div>

      {/* Submit Button */}
      {!isProtected && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      )}
    </form>
  );
}

export type { RoleFormData, RoleFormProps, Permission };
