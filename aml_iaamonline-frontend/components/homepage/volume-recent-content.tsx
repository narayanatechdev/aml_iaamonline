'use client';

import { ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getRecentArticles, JOURNAL_INFO, ARCHIVE_VOLUMES } from '@/lib/realData';

function getAuthorName(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  }
  return '';
}

export function VolumeRecentContent() {
  const recentArticles = getRecentArticles(8);

  return (
    <div className="space-y-6">
      {/* Recent Articles */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-black font-semibold text-2xl mb-6">Recent Articles</h3>
        <div className="space-y-6">
          {recentArticles.slice(0, 5).map((article) => (
            <div
              key={article.id}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                {/* Graphical Abstract Thumbnail - left side */}
                <div className="md:w-56 md:flex-shrink-0">
                  <div className="w-full min-h-40 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden">
                    {article.graphical_abstract_url ? (
                      <img
                        src={article.graphical_abstract_url}
                        alt={`Graphical abstract for ${article.title}`}
                        className="w-full h-full max-h-48 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallbackDiv = target.nextSibling as HTMLElement;
                          if (fallbackDiv) fallbackDiv.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full min-h-40 bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center text-center text-gray-500 text-xs px-3" style={{ display: article.graphical_abstract_url ? 'none' : 'flex' }}>
                      <span>Graphical Abstract Not Available</span>
                    </div>
                  </div>
                </div>

                {/* Article content - right side */}
                <div className="flex-1 min-w-0">
                  {/* Open Access Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="inline-flex w-fit items-center gap-1 px-2 py-1 bg-[#c9a227]/20 border border-[#c9a227]/40 text-[#c9a227] text-xs rounded-full font-semibold">
                      <span className="w-2 h-2 bg-[#c9a227] rounded-full"></span>
                      Open Access
                    </div>
                    <div className="text-xs text-[#5a6a8a] font-mono">
                      Vol. {article.volume}, Issue {article.issue} • {article.year}
                      {article.pages && ` • Pages: ${article.pages}`}
                    </div>
                  </div>

                  {/* Article Title */}
                  <Link
                    href={`/article/${article.id}`}
                    className="block hover:text-[#0f2d6b] transition-colors"
                  >
                    <h4 className="text-lg font-semibold text-[#0f1a2e] line-clamp-2 mb-3">
                      {article.title}
                    </h4>
                  </Link>

                  {/* Authors */}
                  <div className="text-base text-[#0f2d6b] mb-3 font-medium">
                    {(article.authors || []).slice(0, 3).map(getAuthorName).filter(Boolean).join(', ')}
                    {(article.authors || []).length > 3 ? ' et al.' : ''}
                  </div>

                  {/* DOI */}
                  <div className="text-sm text-[#5a6a8a] font-mono mb-3 break-words">
                    DOI:{' '}
                    <a
                      href={`https://doi.org/${article.doi || '10.5185/amlett.2025.011771'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0f2d6b] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {article.doi || '10.5185/amlett.2025.011771'}
                    </a>
                  </div>

                  {/* Abstract Snippet */}
                  <p className="text-base text-gray-700 line-clamp-3 leading-relaxed mb-5">
                    {article.abstract || 'Abstract not available.'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={article.pdf_url || `#`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-primary text-primary hover:bg-primary hover:text-white text-xs font-medium rounded transition-colors"
                      {...(article.pdf_url ? {} : { onClick: (e) => e.preventDefault() })}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      PDF
                    </Link>
                    <Link
                      href={`/article/${article.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#0f2d6b] hover:bg-[#0d2560] text-white text-xs font-medium rounded transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Full Text
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/browse/current"
          className="block text-center text-[#0f2d6b] text-sm font-semibold hover:underline mt-6"
        >
          View all recent articles
        </Link>
      </div>

      {/* Journal Covers Banner */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="w-full overflow-hidden rounded-lg">
          <img 
            src="https://aml.iaamonline.org/data/aml/coversheet/head_en.jpg"
            alt="Advanced Materials Letters Journal Covers"
            className="w-full h-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-black font-semibold text-xl mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Issues
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {ARCHIVE_VOLUMES.slice(0, 2).map((yearData) => 
            yearData.volumes.slice(0, 3).map((volume) => 
              volume.issues.slice(-2).map((issueNum) => {
                const issueKey = `${yearData.year}-${volume.vol}-${issueNum}`;
                return (
                  <Link
                    key={issueKey}
                    href={`/browse/archive?volume=${volume.vol}&issue=${issueNum}&year=${yearData.year}`}
                    className="group p-4 border border-gray-100 rounded-lg hover:border-[#0f2d6b]/30 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-28 bg-gradient-to-br from-[#2E8B57] to-[#1E5F3F] rounded border flex items-center justify-center relative overflow-hidden">
                        <img 
                          src="https://aml.iaamonline.org/data/aml/coversheet/cover_en.jpg" 
                          alt={`Volume ${volume.vol}, Issue ${issueNum} Cover`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallbackDiv = target.nextSibling as HTMLElement;
                            if (fallbackDiv) fallbackDiv.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-[#2E8B57] to-[#1E5F3F] rounded flex items-center justify-center relative overflow-hidden text-center" style={{ display: 'none' }}>
                          <div className="text-white text-xs font-semibold">
                            <div>V{volume.vol}</div>
                            <div>I{issueNum}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#0f1a2e] group-hover:text-[#0f2d6b] transition-colors">
                          Volume {volume.vol}, Issue {issueNum}
                        </div>
                        <div className="text-xs text-[#5a6a8a] mt-1">
                          {yearData.year}
                        </div>
                        <div className="text-xs text-[#c9a227] mt-1 font-medium">
                          Open Access
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )
          ).flat().flat().slice(0, 6)}
        </div>
        <Link
          href="/browse/archive"
          className="block text-center text-[#0f2d6b] text-sm font-semibold hover:underline mt-4"
        >
          View all issues
        </Link>
      </div>
    </div>
  );
}
