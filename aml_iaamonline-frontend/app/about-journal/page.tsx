import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import AboutJournalStatic from './about-journal-static';

export const metadata: Metadata = {
  title: 'About the Journal',
  description:
    'About Advanced Materials Letters — aims and scope, editorial information, history, and indexing of the IAAM journal.',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "about-journal"):
 * - layout "about-journal": the designed layout below with CMS text overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and text
 */
export default async function AboutJournalPage() {
  const cmsPage = await fetchCmsPage('about-journal');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <AboutJournalStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
