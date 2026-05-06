'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'checkbox';
  options?: { label: string; value: string | number | boolean }[];
  value?: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

interface FilterPanelProps {
  title?: string;
  filters: FilterOption[];
  onApply?: () => void;
  onReset?: () => void;
}

function FilterInput({ filter }: { filter: FilterOption }) {
  switch (filter.type) {
    case 'text':
      return (
        <input
          type="text"
          value={(filter.value as string) || ''}
          onChange={(e) => filter.onChange(e.target.value)}
          placeholder={`Enter ${filter.label.toLowerCase()}`}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
        />
      );

    case 'select':
      return (
        <select
          value={(filter.value as string) || ''}
          onChange={(e) => filter.onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] bg-white"
        >
          <option value="">All</option>
          {filter.options?.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'date':
      return (
        <input
          type="date"
          value={(filter.value as string) || ''}
          onChange={(e) => filter.onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
        />
      );

    case 'checkbox':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filter.value)}
            onChange={(e) => filter.onChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#0f2d6b] focus:ring-[#0f2d6b]"
          />
          <span className="text-sm text-gray-700">
            {filter.options?.[0]?.label || 'Yes'}
          </span>
        </label>
      );

    default:
      return null;
  }
}

export function FilterPanel({
  title = 'Filters',
  filters,
  onApply,
  onReset,
}: FilterPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const hasActiveFilters = filters.some(
    (f) => f.value !== undefined && f.value !== '' && f.value !== false
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-[#0f2d6b] text-white rounded-full">
              Active
            </span>
          )}
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {filter.label}
                </label>
                <FilterInput filter={filter} />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
            {onApply && (
              <button
                onClick={onApply}
                className="px-4 py-1.5 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors"
              >
                Apply Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export type { FilterOption };
