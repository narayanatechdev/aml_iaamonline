import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import EditorialTeamStatic from './editorial-team-static';

export const metadata: Metadata = {
  title: 'Research Cross-Journal Editorial Team',
  description:
    'Collaborative editorial excellence across the IAAM journal portfolio — Advanced Materials Letters.',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "editorial-team"):
 * - layout "editorial-team": the designed layout below with CMS overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and default text
 */
export default async function EditorialTeamPage() {
  const cmsPage = await fetchCmsPage('editorial-team');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <EditorialTeamStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
