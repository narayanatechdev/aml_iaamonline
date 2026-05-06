'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  change?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
  bgColor?: string;
  onClick?: () => void;
}

export function StatsCard({
  icon,
  label,
  value,
  change,
  bgColor = 'bg-white',
  onClick,
}: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${bgColor} rounded-lg border border-gray-200 p-5 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>

          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                  change.direction === 'up'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {change.direction === 'up' ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-400">{change.period}</span>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#0f2d6b]/10 flex items-center justify-center text-[#0f2d6b]">
          {icon}
        </div>
      </div>
    </div>
  );
}
