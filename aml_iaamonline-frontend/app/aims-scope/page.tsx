import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import AimsScopeStatic from '../about-journal/aims-scope/aims-scope-static';

export const metadata: Metadata = {
  title: 'Aims & Scope',
  description:
    'The aims and scope of Advanced Materials Letters — journal mission, core research areas, submission criteria, and material categories.',
};

export default async function AimsScopePage() {
  const cmsPage = await fetchCmsPage('aims-scope');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <AimsScopeStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
