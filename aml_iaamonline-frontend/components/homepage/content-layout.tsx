'use client';

import { VolumeRecentContent } from './volume-recent-content';

export function ContentLayout() {
  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <VolumeRecentContent />
      </div>
    </section>
  );
}