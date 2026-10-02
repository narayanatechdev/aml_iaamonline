import type { Metadata } from 'next';
import { SavedArticlesClient } from './saved-articles-client';
import { MainLayout } from '@/components/layout/main-layout';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';

export const metadata: Metadata = {
  title: 'Saved Articles',
  description: 'Your saved articles from Advanced Materials Letters and Advanced Materials Proceedings.',
};

export default function SavedArticlesPage() {
  if (process.env.NEXT_PUBLIC_SITE_KIND === 'hub') {
    return (
      <HubPageLayout title="Saved Articles">
        <HubSection>
          <SavedArticlesClient />
        </HubSection>
      </HubPageLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SavedArticlesClient />
      </div>
    </MainLayout>
  );
}
