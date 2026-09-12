import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import HistoryStatic from './history-static';

export const metadata: Metadata = {
  title: 'History & Milestones',
  description:
    'A journey through the evolution of Advanced Materials Letters — from its founding in 2010 to becoming a globally recognised materials science publication.',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "history"):
 * - layout "history": the designed layout below with CMS overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and timeline
 */
export default async function HistoryPage() {
  const cmsPage = await fetchCmsPage('history');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <HistoryStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
