import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import IndexingStatic from '../about-journal/indexing/indexing-static';

export const metadata: Metadata = {
  title: 'Indexing & Abstracting',
  description:
    'Indexing and abstracting information for Advanced Materials Letters — scientific databases, citation metrics, and impact data.',
};

export default async function IndexingPage() {
  const cmsPage = await fetchCmsPage('indexing');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <IndexingStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
