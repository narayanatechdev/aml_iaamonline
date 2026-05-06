'use client';

type ManuscriptStatus =
  | 'draft'
  | 'submitted'
  | 'under-check'
  | 'with-editor'
  | 'review-invited'
  | 'under-review'
  | 'revision-requested'
  | 'accepted'
  | 'rejected';

interface StatusBadgeProps {
  status: ManuscriptStatus;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG: Record<
  ManuscriptStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  draft: {
    label: 'Draft',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
  submitted: {
    label: 'Submitted',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  'under-check': {
    label: 'Under Check',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  'with-editor': {
    label: 'With Editor',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
  },
  'review-invited': {
    label: 'Review Invited',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
  'under-review': {
    label: 'Under Review',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
  'revision-requested': {
    label: 'Revision Requested',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  accepted: {
    label: 'Accepted',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  rejected: {
    label: 'Rejected',
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
  },
};

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.bgColor} ${config.textColor} ${SIZE_CLASSES[size]}`}
    >
      {config.label}
    </span>
  );
}

export type { ManuscriptStatus };
