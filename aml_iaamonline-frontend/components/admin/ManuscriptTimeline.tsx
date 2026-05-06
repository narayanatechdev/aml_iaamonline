'use client';

import { Check, Circle, Clock } from 'lucide-react';

interface TimelineItem {
  stage: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  details?: string;
}

interface ManuscriptTimelineProps {
  items: TimelineItem[];
  vertical?: boolean;
}

function TimelineIcon({ status }: { status: TimelineItem['status'] }) {
  if (status === 'completed') {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-white" />
      </div>
    );
  }

  if (status === 'current') {
    return (
      <div className="w-6 h-6 rounded-full bg-[#0f2d6b] flex items-center justify-center animate-pulse">
        <Clock className="w-3.5 h-3.5 text-white" />
      </div>
    );
  }

  return (
    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
      <Circle className="w-3 h-3 text-gray-400" />
    </div>
  );
}

export function ManuscriptTimeline({
  items,
  vertical = true,
}: ManuscriptTimelineProps) {
  if (vertical) {
    return (
      <div className="relative">
        {items.map((item, index) => (
          <div key={item.stage} className="flex gap-4 pb-6 last:pb-0">
            {/* Line + Icon */}
            <div className="relative flex flex-col items-center">
              <TimelineIcon status={item.status} />
              {index < items.length - 1 && (
                <div
                  className={`w-0.5 flex-1 mt-2 ${
                    item.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <p
                className={`text-sm font-medium ${
                  item.status === 'current'
                    ? 'text-[#0f2d6b]'
                    : item.status === 'completed'
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {item.stage}
              </p>
              {item.date && (
                <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
              )}
              {item.details && (
                <p className="text-xs text-gray-600 mt-1">{item.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Horizontal timeline
  return (
    <div className="relative">
      <div className="flex items-start justify-between">
        {items.map((item, index) => (
          <div
            key={item.stage}
            className="flex flex-col items-center text-center flex-1"
          >
            {/* Icon */}
            <div className="relative">
              <TimelineIcon status={item.status} />

              {/* Connecting line */}
              {index < items.length - 1 && (
                <div
                  className={`absolute top-3 left-6 h-0.5 ${
                    item.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                  style={{
                    width: 'calc(100% + 100%)',
                    transform: 'translateX(0)',
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="mt-3 px-2">
              <p
                className={`text-xs font-medium ${
                  item.status === 'current'
                    ? 'text-[#0f2d6b]'
                    : item.status === 'completed'
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {item.stage}
              </p>
              {item.date && (
                <p className="text-[10px] text-gray-500 mt-0.5">{item.date}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Horizontal connecting lines */}
      <div className="absolute top-3 left-0 right-0 flex">
        {items.slice(0, -1).map((item, index) => (
          <div
            key={`line-${index}`}
            className={`flex-1 h-0.5 mx-3 first:ml-6 last:mr-6 ${
              item.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export type { TimelineItem };
