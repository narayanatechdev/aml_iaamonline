'use client';

import { JOURNAL_INFO } from '@/lib/realData';

interface JournalInfoHeaderProps {
  className?: string;
}

export function JournalInfoHeader({ className = '' }: JournalInfoHeaderProps) {
  return (
    <div className={`bg-white border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          
          {/* Journal Title, Logo and Editorial Information */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0f2d6b] to-[#0d2560] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">AML</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0f2d6b] leading-tight">
                  Advanced Materials Letters
                </h1>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">
                  Functional Materials for Green Energy and Environment
                </p>
              </div>
            </div>
            
            {/* Editorial Information */}
            <div className="space-y-1">
              <div>
                <span className="text-sm font-semibold text-foreground">Editor-in-Chief: </span>
                <span className="text-sm text-muted-foreground">Dr. Ashutosh Tiwari</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Associate Editors: </span>
                <span className="text-sm text-muted-foreground">
                  Dr. Raghvendra Singh Yadav, Dr. Maria Gonzalez, Dr. James Smith, 
                  Dr. Sarah Johnson, Dr. Chen Wei, Dr. Priya Sharma and Dr. Michael Brown
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Online ISSN: </span>
                <span className="text-sm text-muted-foreground">{JOURNAL_INFO.eISSN}</span>
              </div>
            </div>
          </div>

          {/* Latest Issue */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-28 h-36 rounded shadow-lg overflow-hidden">
              <img 
                src="https://aml.iaamonline.org/data/aml/coversheet/cover_en.jpg" 
                alt={`Advanced Materials Letters Volume ${JOURNAL_INFO.currentVolume}, Issue ${JOURNAL_INFO.currentIssue} Cover`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to original design if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallbackDiv = target.nextSibling as HTMLElement;
                  if (fallbackDiv) fallbackDiv.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-[#0f2d6b] to-[#0d2560] rounded shadow-lg flex items-center justify-center relative overflow-hidden" style={{ display: 'none' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative text-center">
                  <div className="text-white text-xs font-semibold mb-1">AML</div>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-[#0f2d6b] mb-1">Latest Issue</div>
              <div className="text-sm text-foreground font-medium">Volume {JOURNAL_INFO.currentVolume}, Issue {JOURNAL_INFO.currentIssue}</div>
              <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
