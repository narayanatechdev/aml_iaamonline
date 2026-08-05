import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import AboutJournalStatic from './about-journal-static';

export const metadata: Metadata = {
  title: 'About the Journal',
  description:
    'About Advanced Materials Letters — aims and scope, editorial information, history, and indexing of the IAAM journal.',
};

/**
 * Admin-overridable: if a published CMS page with slug "about-journal" exists
 * (Admin → Content → Pages), it replaces the built-in content below.
 */
export default async function AboutJournalPage() {
  const cmsPage = await fetchCmsPage('about-journal');

  if (cmsPage) {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <AboutJournalStatic />;
}
