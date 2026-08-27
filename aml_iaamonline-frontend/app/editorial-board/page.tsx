import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import EditorialBoardStatic from './editorial-board-static';

export const metadata: Metadata = {
  title: 'Editorial Board',
  description:
    'The international editorial board of Advanced Materials Letters — Editor-in-Chief, Managing Editor, Academic Editors, and Advisory Board Members.',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "editorial-board"):
 * - layout "editorial-board": the designed layout below with CMS overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and board roster
 */
export default async function EditorialBoardPage() {
  const cmsPage = await fetchCmsPage('editorial-board');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <EditorialBoardStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
