'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface SDG {
  id: number;
  sdg_number: number;
  name: string;
  description: string;
  color_code: string;
  icon_identifier?: string;
}

interface SDGSelectorProps {
  selectedSDGs?: number[];
  onSelectionChange?: (sdgIds: number[]) => void;
  errors?: string[];
  maxSelections?: number;
}

const DEFAULT_SDGS: SDG[] = [
  {
    id: 1,
    sdg_number: 1,
    name: 'No Poverty',
    description: 'End poverty in all its forms',
    color_code: '#E5243B',
    icon_identifier: 'sdg-01',
  },
  {
    id: 2,
    sdg_number: 2,
    name: 'Zero Hunger',
    description: 'End hunger and achieve food security',
    color_code: '#DDA250',
    icon_identifier: 'sdg-02',
  },
  {
    id: 3,
    sdg_number: 3,
    name: 'Good Health and Well-Being',
    description: 'Ensure healthy lives and well-being',
    color_code: '#4C9F38',
    icon_identifier: 'sdg-03',
  },
  {
    id: 4,
    sdg_number: 4,
    name: 'Quality Education',
    description: 'Ensure inclusive quality education',
    color_code: '#C6192B',
    icon_identifier: 'sdg-04',
  },
  {
    id: 5,
    sdg_number: 5,
    name: 'Gender Equality',
    description: 'Achieve gender equality',
    color_code: '#DD3E39',
    icon_identifier: 'sdg-05',
  },
  {
    id: 6,
    sdg_number: 6,
    name: 'Clean Water and Sanitation',
    description: 'Ensure water and sanitation access',
    color_code: '#26BDE2',
    icon_identifier: 'sdg-06',
  },
  {
    id: 7,
    sdg_number: 7,
    name: 'Affordable and Clean Energy',
    description: 'Ensure sustainable energy access',
    color_code: '#FCCC0A',
    icon_identifier: 'sdg-07',
  },
  {
    id: 8,
    sdg_number: 8,
    name: 'Decent Work and Economic Growth',
    description: 'Promote economic growth and employment',
    color_code: '#A21E48',
    icon_identifier: 'sdg-08',
  },
  {
    id: 9,
    sdg_number: 9,
    name: 'Industry, Innovation and Infrastructure',
    description: 'Build resilient infrastructure',
    color_code: '#DD1C3B',
    icon_identifier: 'sdg-09',
  },
  {
    id: 10,
    sdg_number: 10,
    name: 'Reduced Inequalities',
    description: 'Reduce inequality within countries',
    color_code: '#DD1C3B',
    icon_identifier: 'sdg-10',
  },
  {
    id: 11,
    sdg_number: 11,
    name: 'Sustainable Cities and Communities',
    description: 'Make cities sustainable',
    color_code: '#FD6925',
    icon_identifier: 'sdg-11',
  },
  {
    id: 12,
    sdg_number: 12,
    name: 'Responsible Consumption and Production',
    description: 'Ensure sustainable consumption',
    color_code: '#BF8B2E',
    icon_identifier: 'sdg-12',
  },
  {
    id: 13,
    sdg_number: 13,
    name: 'Climate Action',
    description: 'Combat climate change',
    color_code: '#3F7E44',
    icon_identifier: 'sdg-13',
  },
  {
    id: 14,
    sdg_number: 14,
    name: 'Life Below Water',
    description: 'Conserve oceans and marine life',
    color_code: '#0A97D9',
    icon_identifier: 'sdg-14',
  },
  {
    id: 15,
    sdg_number: 15,
    name: 'Life on Land',
    description: 'Protect terrestrial ecosystems',
    color_code: '#56C596',
    icon_identifier: 'sdg-15',
  },
  {
    id: 16,
    sdg_number: 16,
    name: 'Peace, Justice and Strong Institutions',
    description: 'Promote peaceful and inclusive societies',
    color_code: '#0066CC',
    icon_identifier: 'sdg-16',
  },
  {
    id: 17,
    sdg_number: 17,
    name: 'Partnerships for the Goals',
    description: 'Strengthen global partnerships',
    color_code: '#1B3562',
    icon_identifier: 'sdg-17',
  },
];

export function SDGSelector({
  selectedSDGs = [],
  onSelectionChange,
  errors = [],
  maxSelections = 5,
}: SDGSelectorProps) {
  const [selected, setSelected] = useState<number[]>(selectedSDGs);
  const [expandedSDG, setExpandedSDG] = useState<number | null>(null);

  useEffect(() => {
    setSelected(selectedSDGs);
  }, [selectedSDGs]);

  const handleSDGToggle = (sdgId: number) => {
    let newSelected: number[];

    if (selected.includes(sdgId)) {
      newSelected = selected.filter((id) => id !== sdgId);
    } else {
      if (selected.length >= maxSelections) {
        return; // Don't add if at max
      }
      newSelected = [...selected, sdgId];
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (sdgId: number) => selected.includes(sdgId);
  const isFull = selected.length >= maxSelections;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-black mb-2">
          Sustainable Development Goals (SDGs)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select up to {maxSelections} Sustainable Development Goals that your research relates to. This helps readers
          discover research aligned with global sustainability priorities.
        </p>

        {/* Selection Counter */}
        <div className="flex items-center justify-between mb-6 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-bold">
                {selected.length}
              </span>
              <span className="text-sm text-gray-700">
                of {maxSelections} selected
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            {selected.length === 0 && 'Select goals related to your research'}
            {selected.length > 0 && selected.length < 2 && 'Recommended: 2-4 goals'}
            {selected.length >= 2 && selected.length < maxSelections && 'Good selection'}
            {selected.length === maxSelections && 'Maximum reached'}
          </div>
        </div>
      </div>

      {/* SDG Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {DEFAULT_SDGS.map((sdg) => {
          const isSDGSelected = isSelected(sdg.id);
          const isDisabled = isFull && !isSDGSelected;

          return (
            <div key={sdg.id} className="space-y-2">
              <button
                onClick={() => handleSDGToggle(sdg.id)}
                disabled={isDisabled}
                className={`w-full p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                  isSDGSelected
                    ? 'border-black bg-black text-white'
                    : isDisabled
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                      : 'border-gray-200 bg-white text-black hover:border-gray-300'
                }`}
              >
                {/* SDG Number Badge */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    backgroundColor: isSDGSelected ? '#000000' : sdg.color_code,
                  }}
                >
                  {sdg.sdg_number}
                </div>

                {/* SDG Name */}
                <span className="text-xs font-semibold text-center leading-tight line-clamp-2">
                  {sdg.name}
                </span>

                {/* Checkmark */}
                {isSDGSelected && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>

              {/* Expandable Description */}
              <button
                onClick={() => setExpandedSDG(expandedSDG === sdg.id ? null : sdg.id)}
                className="w-full flex items-center justify-between px-2 py-1 text-xs text-gray-600 hover:text-black transition-colors"
              >
                <span className="text-left flex-1">View details</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    expandedSDG === sdg.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Description */}
              {expandedSDG === sdg.id && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <p className="text-xs text-gray-700 leading-relaxed">{sdg.description}</p>
                  <a
                    href={`https://sdgs.un.org/goals/goal${sdg.sdg_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Learn more →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ))}
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
        <h4 className="text-xs font-semibold text-blue-900">Guidelines</h4>
        <ul className="text-xs text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
            <span>Select goals that directly relate to your research topic</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
            <span>2-4 goals is the recommended range for best discoverability</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
            <span>You can select up to {maxSelections} goals total</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
            <span>Click "View details" to learn more about each goal</span>
          </li>
        </ul>
      </div>

      {/* Selected Summary */}
      {selected.length > 0 && (
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <h4 className="text-xs font-semibold text-black mb-3">Selected Goals</h4>
          <div className="flex flex-wrap gap-2">
            {selected.map((sdgId) => {
              const sdg = DEFAULT_SDGS.find((s) => s.id === sdgId);
              return (
                <div
                  key={sdgId}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-white"
                  style={{
                    backgroundColor: sdg?.color_code,
                  }}
                >
                  <span className="font-bold">{sdg?.sdg_number}</span>
                  <span>{sdg?.name}</span>
                  <button
                    onClick={() => handleSDGToggle(sdgId)}
                    className="ml-1 hover:opacity-80 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
