'use client';

import { BookOpen, FileText, Link as LinkIcon, Calendar } from 'lucide-react';

interface PublicationMetadataProps {
  volume?: string | number | null;
  issue?: string | number | null;
  pagesFrom?: string | number | null;
  pagesTo?: string | number | null;
  doi?: string | null;
  publishYear?: string | number | null;
  publishMonth?: string | number | null;
  publishDate?: string | null;
}

export function PublicationMetadata({
  volume,
  issue,
  pagesFrom,
  pagesTo,
  doi,
  publishYear,
  publishMonth,
  publishDate,
}: PublicationMetadataProps) {
  // Format pages
  const pages =
    pagesFrom && pagesTo
      ? `${pagesFrom}–${pagesTo}`
      : pagesFrom
        ? pagesFrom.toString()
        : null;

  // Format date
  const formatPublishDate = (): string => {
    if (publishDate) {
      return new Date(publishDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    if (publishYear && publishMonth) {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthIndex = typeof publishMonth === 'string' ? parseInt(publishMonth) : publishMonth;
      return `${months[monthIndex - 1] || ''} ${publishYear}`;
    }

    if (publishYear) {
      return publishYear.toString();
    }

    return 'Publication date not available';
  };

  // Don't render if no metadata available
  if (!volume && !issue && !pages && !doi && !publishYear) {
    return null;
  }

  return (
    <section className="bg-gray-50 border-y border-gray-200 py-8 my-8">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-sm font-semibold text-black mb-6 uppercase tracking-wide">
          Publication Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Volume & Issue */}
          {(volume || issue) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-semibold">VOLUME & ISSUE</span>
              </div>
              <div className="text-lg font-semibold text-black">
                Volume <span className="text-blue-600">{volume || '—'}</span>
                {issue && <span className="text-gray-400 ml-2">Issue {issue}</span>}
              </div>
            </div>
          )}

          {/* Pages */}
          {pages && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-semibold">PAGES</span>
              </div>
              <div className="text-lg font-semibold text-black">pp. {pages}</div>
            </div>
          )}

          {/* Publication Date */}
          {publishYear && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-semibold">PUBLISHED</span>
              </div>
              <div className="text-lg font-semibold text-black">{formatPublishDate()}</div>
            </div>
          )}

          {/* DOI */}
          {doi && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <LinkIcon className="w-4 h-4" />
                <span className="text-xs font-semibold">DOI</span>
              </div>
              <a
                href={`https://doi.org/${doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:text-blue-700 break-all"
                title={doi}
              >
                {doi}
              </a>
            </div>
          )}
        </div>

        {/* DOI Info Box */}
        {doi && (
          <div className="mt-6 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Digital Object Identifier (DOI):</strong> This persistent identifier provides a permanent link to
              this article. It can be shared and will always resolve to the correct location.
            </p>
          </div>
        )}

        {/* Citation String */}
        <div className="mt-6 p-4 rounded-lg bg-white border border-gray-200">
          <h4 className="text-xs font-semibold text-black mb-3">Quick Citation Reference</h4>
          <div className="font-mono text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
            {volume && issue && pages ? (
              <>
                Advanced Materials Letters, {volume}({issue}), {pages}
                {publishYear && ` ({publishYear})`}
                {doi && <br />}
                {doi && `DOI: ${doi}`}
              </>
            ) : (
              'Publication metadata available for citation'
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
