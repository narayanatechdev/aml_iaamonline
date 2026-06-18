'use client';

import { Mail, Globe, Award } from 'lucide-react';
import Image from 'next/image';

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  orcid?: string;
  authorImage?: string;
  affiliation?: {
    name: string;
    country?: string;
    city?: string;
    department?: string;
  };
  isCorresponding?: boolean;
  position?: number;
}

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  const fullName = `${author.firstName} ${author.lastName}`;
  const hasPhoto = !!author.authorImage;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Author Info Grid */}
        <div className="flex gap-4 p-6">
          {/* Author Photo */}
          {hasPhoto ? (
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={author.authorImage}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-gray-200">
                <span className="text-2xl font-bold text-gray-400">
                  {author.firstName.charAt(0)}
                  {author.lastName.charAt(0)}
                </span>
              </div>
            </div>
          )}

          {/* Author Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-semibold text-black">{fullName}</h3>

                {/* Corresponding Author Badge */}
                {author.isCorresponding && (
                  <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                    Corresponding Author
                  </span>
                )}
              </div>

              {/* Position Badge */}
              {author.position && (
                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                  {author.position}
                </span>
              )}
            </div>

            {/* Affiliation */}
            {author.affiliation && (
              <div className="mb-3 space-y-1">
                <p className="text-sm font-medium text-gray-900">{author.affiliation.name}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  {author.affiliation.department && (
                    <span>{author.affiliation.department}</span>
                  )}
                  {author.affiliation.city && <span>•</span>}
                  {author.affiliation.city && <span>{author.affiliation.city}</span>}
                  {author.affiliation.country && <span>•</span>}
                  {author.affiliation.country && <span>{author.affiliation.country}</span>}
                </div>
              </div>
            )}

            {/* Contact & Links */}
            <div className="flex flex-wrap gap-3">
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  title={`Email ${fullName}`}
                >
                  <Mail className="w-3 h-3" />
                  Email
                </a>
              )}

              {author.orcid && (
                <a
                  href={`https://orcid.org/${author.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  title="View ORCID profile"
                >
                  <Award className="w-3 h-3" />
                  ORCID
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AuthorGridProps {
  authors: Author[];
  columns?: number;
}

export function AuthorGrid({ authors, columns = 2 }: AuthorGridProps) {
  if (!authors || authors.length === 0) {
    return null;
  }

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[Math.min(columns, 4)] || 'md:grid-cols-2';

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="text-2xl font-bold text-black mb-8"
          style={{
            fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif",
          }}
        >
          Authors
        </h2>

        <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
          {authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </section>
  );
}
