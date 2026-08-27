import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import EditorialBoardStatic from '../../editorial-board/editorial-board-static';

export const metadata: Metadata = {
  title: 'Editorial Board',
  description:
    'The international editorial board of Advanced Materials Letters — Editor-in-Chief, Managing Editor, Academic Editors, and Advisory Board Members.',
};

/**
 * Same CMS page as /editorial-board (slug "editorial-board"), rendered with
 * the flat card styling used in the About Journal section.
 */
export default async function AboutJournalEditorialBoardPage() {
  const cmsPage = await fetchCmsPage('editorial-board');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return (
    <EditorialBoardStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} flat />
  );
}
