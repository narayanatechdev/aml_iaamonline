import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import EditorialValuesStatic from './editorial-values-static';

export const metadata: Metadata = {
  title: 'Editorial Values Statement',
  description:
    'Our commitment to integrity, excellence, and open science in Advanced Materials Letters.',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "editorial-values"):
 * - layout "editorial-values": the designed layout below with CMS overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and default text
 */
export default async function EditorialValuesPage() {
  const cmsPage = await fetchCmsPage('editorial-values');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <EditorialValuesStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
