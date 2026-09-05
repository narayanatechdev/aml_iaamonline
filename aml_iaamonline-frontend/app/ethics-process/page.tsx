import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import EthicsProcessStatic from '../about-journal/ethics-process/ethics-process-static';

export const metadata: Metadata = {
  title: 'Ethics & Process',
  description:
    'Publication ethics and peer review process for Advanced Materials Letters — COPE guidelines, review workflow, and research misconduct handling.',
};

export default async function EthicsProcessPage() {
  const cmsPage = await fetchCmsPage('ethics-process');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <EthicsProcessStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
