import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import AboutStatic from './about-static';
import { IS_HUB } from '@/lib/hub-guard';
import { HubAbout } from '@/components/hub/HubAbout';

export const metadata: Metadata = IS_HUB
  ? {
      title: 'About',
      description:
        'About IAAM Publications — the not-for-profit publishing arm of the International Association of Advanced Materials.',
    }
  : {
      title: 'About',
      description:
        'About Advanced Materials Letters — a peer-reviewed international journal of the International Association of Advanced Materials (IAAM), publishing since 2010.',
    };

/**
 * Dashboard-editable (Admin → Content → Pages, slug "about"):
 * - layout "about": the designed layout below with CMS text overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and text
 */
export default async function AboutPage() {
  // pubs.iaamonline.org builds from this same app/ directory. Without this
  // branch the hub served AML's journal About page — AML header, ISSN panel
  // and all — under the hub's own chrome.
  if (IS_HUB) {
    return <HubAbout />;
  }

  const cmsPage = await fetchCmsPage('about');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <AboutStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
