import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import EditorialPoliciesStatic from './editorial-policies-static';

export const metadata: Metadata = {
  title: 'Editorial Policies',
  description:
    'Comprehensive policies governing the editorial process and publication standards of Advanced Materials Letters.',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "editorial-policies"):
 * - layout "editorial-policies": the designed layout below with CMS overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and default text
 */
export default async function EditorialPoliciesPage() {
  const cmsPage = await fetchCmsPage('editorial-policies');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <EditorialPoliciesStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
