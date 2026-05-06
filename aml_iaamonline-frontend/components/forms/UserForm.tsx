'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UserFormData {
  id?: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  roles: string[];
}

interface Role {
  id: number;
  name: string;
  display_name: string;
}

interface UserFormProps {
  initialData?: UserFormData;
  roles: Role[];
  onSubmit: (data: Omit<UserFormData, 'id'>) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  roles?: string;
  general?: string;
}

export function UserForm({
  initialData,
  roles,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
}: UserFormProps) {
  const [formData, setFormData] = useState<Omit<UserFormData, 'id'>>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    status: initialData?.status || 'active',
    roles: initialData?.roles || [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        status: initialData.status,
        roles: initialData.roles,
      });
    }
  }, [initialData]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.roles.length === 0) {
      newErrors.roles = 'At least one role must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleToggle = (roleName: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName],
    }));
    if (errors.roles) {
      setErrors((prev) => ({ ...prev, roles: undefined }));
    }
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirm(true);
    }
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirm(false);
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

  return (
    <div className="relative">
      <form onSubmit={handleSubmitClick} className="space-y-6">
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
            <span className="text-sm">User saved successfully!</span>
          </div>
        )}

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
            placeholder="Enter user's full name"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] ${
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

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] bg-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Roles Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roles <span className="text-red-500">*</span>
          </label>
          <div
            className={`p-4 border rounded-lg ${
              errors.roles ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.name)}
                    onChange={() => handleRoleToggle(role.name)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0f2d6b] focus:ring-[#0f2d6b]"
                  />
                  <span className="text-sm text-gray-700">
                    {role.display_name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {errors.roles && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.roles}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitLabel}
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm {initialData ? 'Update' : 'Creation'}
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to {initialData ? 'update' : 'create'}{' '}
                this user?
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {formData.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {formData.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span> {formData.status}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Roles:</span>{' '}
                  {formData.roles.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedSubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { UserFormData, UserFormProps, Role };
