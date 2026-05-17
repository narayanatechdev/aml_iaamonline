'use client';

import { VolumeRecentContent } from './volume-recent-content';
import { ReadersAuthorsSidebar } from './readers-authors-sidebar';

export function ContentLayout() {
  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Volume/Recent Content */}
          <div className="lg:col-span-2">
            <VolumeRecentContent />
          </div>
          
          {/* Right Column - Readers & Authors Sidebar */}
          <div className="lg:col-span-1">
            <ReadersAuthorsSidebar />
          </div>
        </div>
      </div>
    </section>
  );
}