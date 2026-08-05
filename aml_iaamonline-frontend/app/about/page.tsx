import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import AboutStatic from './about-static';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Advanced Materials Letters — a peer-reviewed international journal of the International Association of Advanced Materials (IAAM), publishing since 2010.',
};

/**
 * Admin-overridable: if a published CMS page with slug "about" exists
 * (Admin → Content → Pages), it replaces the built-in content below.
 */
export default async function AboutPage() {
  const cmsPage = await fetchCmsPage('about');

  if (cmsPage) {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <AboutStatic />;
}
