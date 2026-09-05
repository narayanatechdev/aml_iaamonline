import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import AwardsStatic from './awards-static';

export const metadata: Metadata = {
  title: 'Awards & Recognition',
  description:
    'Celebrating excellence in materials science — journal recognition, annual best paper and young researcher awards from Advanced Materials Letters.',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "awards"):
 * - layout "awards": the designed layout below with CMS overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and award listings
 */
export default async function AwardsPage() {
  const cmsPage = await fetchCmsPage('awards');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <AwardsStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
