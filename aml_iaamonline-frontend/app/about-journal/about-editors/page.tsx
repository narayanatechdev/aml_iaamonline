import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import AboutEditorsStatic from './about-editors-static';

export const metadata: Metadata = {
  title: 'About the Editors',
  description:
    'Meet the editorial leadership of Advanced Materials Letters — Editor-in-Chief, Managing Editor, and Academic Editorial Board members from institutions worldwide.',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "about-editors"):
 * - layout "about-editors": the designed layout below with CMS overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and editor profiles
 */
export default async function AboutEditorsPage() {
  const cmsPage = await fetchCmsPage('about-editors');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <AboutEditorsStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
