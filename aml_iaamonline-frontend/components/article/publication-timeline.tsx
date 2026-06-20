'use client';

import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface TimelineEvent {
  label: string;
  date: string | null | undefined;
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
}

interface PublicationTimelineProps {
  receiveDate?: string | null;
  reviseDate?: string | null;
  acceptDate?: string | null;
  publishDate?: string | null;
}

export function PublicationTimeline({
  receiveDate,
  reviseDate,
  acceptDate,
  publishDate,
}: PublicationTimelineProps) {
  // Determine timeline events
  const events: TimelineEvent[] = [
    {
      label: 'Received',
      date: receiveDate,
      status: receiveDate ? 'completed' : 'upcoming',
      description: 'Manuscript received for review',
    },
    {
      label: 'Under Review',
      date: reviseDate || acceptDate,
      status: reviseDate || acceptDate ? 'completed' : receiveDate ? 'current' : 'upcoming',
      description: 'Peer review process',
    },
    {
      label: 'Accepted',
      date: acceptDate,
      status: acceptDate ? 'completed' : publishDate ? 'completed' : 'upcoming',
      description: 'Article accepted for publication',
    },
    {
      label: 'Published',
      date: publishDate,
      status: publishDate ? 'completed' : 'upcoming',
      description: 'Article published online',
    },
  ];

  // If no dates available, don't render
  if (!receiveDate && !reviseDate && !acceptDate && !publishDate) {
    return null;
  }

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-4xl">
        <h2
          className="text-2xl font-bold text-black mb-2"
          style={{
            fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif",
          }}
        >
          Publication Timeline
        </h2>

        <p className="text-sm text-gray-600 mb-8">
          Track the journey of this article through the peer review and publication process.
        </p>

        {/* Timeline Visualization */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const isCompleted = event.status === 'completed';
            const isCurrent = event.status === 'current';
            const isUpcoming = event.status === 'upcoming';

            return (
              <div key={index} className="flex gap-6">
                {/* Timeline Marker */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-green-100 text-green-700'
                        : isCurrent
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isCurrent ? (
                      <Clock className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Calendar className="w-6 h-6" />
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < events.length - 1 && (
                    <div
                      className={`w-1 flex-grow mt-2 ${
                        isCompleted ? 'bg-green-200' : 'bg-gray-200'
                      }`}
                      style={{ minHeight: '60px' }}
                    />
                  )}
                </div>

                {/* Timeline Content */}
                <div className="flex-1 pt-2 pb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-black">{event.label}</h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : isCurrent
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Upcoming'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Box */}
        <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold text-black">Publication Process</h4>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5" />
              <span>
                <strong>Received:</strong> Your manuscript arrives in our editorial office
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5" />
              <span>
                <strong>Under Review:</strong> Peer reviewers evaluate your manuscript
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5" />
              <span>
                <strong>Accepted:</strong> Your manuscript has been approved for publication
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5" />
              <span>
                <strong>Published:</strong> Your article is now publicly available
              </span>
            </div>
          </div>
        </div>

        {/* Time to Publication Info */}
        {receiveDate && publishDate && (
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Time to Publication</h4>
            <p className="text-sm text-blue-800">
              This article took{' '}
              <strong>
                {Math.round(
                  (new Date(publishDate).getTime() - new Date(receiveDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{' '}
                days
              </strong>{' '}
              from submission to publication, reflecting our commitment to timely peer review.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
