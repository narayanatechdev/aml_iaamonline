'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink, Calendar } from 'lucide-react';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recentArticles = getRecentArticles(8);
  
  // Create different cover content for each slide
  const coverContent = [
    {
      title: "Microwave-Assisted Synthesis of Platinum-Nickel Nanoalloys",
      description: "This cover visualizes the microwave-assisted synthesis of platinum-nickel nanoalloys on nitrogen-doped graphene and their practical applications such as water electrolysis and fuel cell. This research concentrates on the fast and facile synthetic procedure using microwave heating with reducing the amount of platinum and enhancing the catalytic performance by the control of lattice strain and nitrogen doping.",
      volume: "17",
      issue: "1"
    },
    {
      title: "Advanced Carbon Nanomaterials for Energy Storage",
      description: "Featured research on next-generation carbon nanomaterials including graphene oxide composites and carbon nanotubes for high-performance supercapacitors and battery applications. The work demonstrates significant improvements in energy density and cycling stability through innovative synthesis methods.",
      volume: "16", 
      issue: "12"
    },
    {
      title: "Smart Materials for Biomedical Applications",
      description: "Highlighting breakthrough developments in smart materials including shape-memory alloys and stimuli-responsive polymers for biomedical applications. The research covers novel drug delivery systems, tissue engineering scaffolds, and implantable devices with enhanced biocompatibility.",
      volume: "16",
      issue: "11"
    },
    {
      title: "Quantum Dots and Photovoltaic Applications", 
      description: "This issue features cutting-edge research on quantum dot solar cells and their applications in next-generation photovoltaic devices. The work includes innovative synthesis approaches for improved efficiency and stability in perovskite quantum dot solar cells.",
      volume: "16",
      issue: "10"
    }
  ];
  
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? coverContent.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentSlide((prev) => (prev === coverContent.length - 1 ? 0 : prev + 1));
  };

  const currentCover = coverContent[currentSlide];

  return (
    <div className="space-y-6">
      {/* On the Cover Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#0f2d6b] font-semibold text-2xl">On the Cover</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1 text-xs font-medium rounded ${isPlaying ? 'bg-gray-500 text-white' : 'bg-gray-400 text-white'}`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 inline mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 inline mr-1" />
                  Play
                </>
              )}
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {coverContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-[#0f2d6b]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-48 h-64 bg-gradient-to-br from-[#2E8B57] to-[#1E5F3F] rounded border flex items-center justify-center relative overflow-hidden">
              <img 
                src="https://aml.iaamonline.org/data/aml/coversheet/cover_en.jpg" 
                alt={`Advanced Materials Letters Volume ${currentCover.volume}, Issue ${currentCover.issue} Cover`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallbackDiv = target.nextSibling as HTMLElement;
                  if (fallbackDiv) fallbackDiv.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-[#2E8B57] to-[#1E5F3F] rounded flex items-center justify-center relative overflow-hidden" style={{ display: 'none' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative text-center">
                  <div className="text-white text-lg font-semibold mb-2">AML</div>
                  <div className="text-white text-xs">Volume {currentCover.volume}</div>
                  <div className="text-white text-xs">Issue {currentCover.issue}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-[#0f2d6b] mb-3">{currentCover.title}</h4>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {currentCover.description}
            </p>
            <Link 
              href={`/browse/archive?volume=${currentCover.volume}&issue=${currentCover.issue}`}
              className="text-[#0f2d6b] text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Browse issue {currentCover.issue} (vol. {currentCover.volume}, 2026)
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            className="w-10 h-10 border border-[#0f2d6b] rounded flex items-center justify-center hover:bg-[#0f2d6b] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 border border-[#0f2d6b] rounded flex items-center justify-center hover:bg-[#0f2d6b] hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-[#0f2d6b] font-semibold text-xl mb-4">Recent Articles</h3>
        <div className="space-y-6">
          {recentArticles.slice(0, 5).map((article, index) => (
            <div
              key={article.id}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {/* Open Access Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#c9a227]/20 border border-[#c9a227]/40 text-[#c9a227] text-xs rounded-full font-semibold">
                  <span className="w-2 h-2 bg-[#c9a227] rounded-full"></span>
                  Open Access
                </div>
                <div className="text-xs text-[#5a6a8a] font-mono">
                  Vol. {article.volume}, Issue {article.issue} • {article.year}
                </div>
              </div>

              {/* Article Title */}
              <Link
                href={`/article/${article.id}`}
                className="block hover:text-[#0f2d6b] transition-colors"
              >
                <h4 className="text-sm font-semibold text-[#0f1a2e] line-clamp-2 mb-2">
                  {article.title}
                </h4>
              </Link>

              {/* Authors */}
              <div className="text-xs text-[#0f2d6b] mb-2 font-medium">
                {(article.authors || []).slice(0, 3).map(getAuthorName).filter(Boolean).join(', ')}
                {(article.authors || []).length > 3 ? ' et al.' : ''}
              </div>

              {/* DOI */}
              <div className="text-xs text-[#5a6a8a] font-mono mb-3">
                DOI: {article.doi || '10.5185/amlett.2025.011771'}
              </div>

              {/* Graphical Abstract Thumbnail */}
              <div className="mb-3">
                <div className="w-full max-w-xs h-32 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                  {article.graphical_abstract_url ? (
                    <img 
                      src={article.graphical_abstract_url}
                      alt={`Graphical abstract for ${article.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallbackDiv = target.nextSibling as HTMLElement;
                        if (fallbackDiv) fallbackDiv.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-xs" style={{ display: article.graphical_abstract_url ? 'none' : 'flex' }}>
                    <span>Graphical Abstract Not Available</span>
                  </div>
                </div>
              </div>

              {/* Abstract Snippet */}
              <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed mb-3">
                {article.abstract || 'Abstract not available.'}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href={article.pdf_url || `#`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
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
        <h3 className="text-[#0f2d6b] font-semibold text-xl mb-4 flex items-center gap-2">
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
