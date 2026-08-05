import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await fetchCmsPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <MainLayout>
      <CmsPageContent page={page} />
    </MainLayout>
  );
}
