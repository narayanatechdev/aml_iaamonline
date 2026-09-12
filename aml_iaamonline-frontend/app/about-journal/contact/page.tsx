import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { fetchCmsPage } from '@/lib/cms-pages';
import { CmsPageContent } from '@/components/shared/cms-page-content';
import { parsePageContent } from '@/lib/page-layouts';
import ContactStatic from './contact-static';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Advanced Materials Letters editorial team',
};

/**
 * Dashboard-editable (Admin → Content → Pages, slug "about-contact"):
 * - layout "about-contact": the designed layout below with CMS overrides
 * - layout "prose": free-form HTML replaces the page entirely
 * - no CMS page: the built-in design and default text
 */
export default async function ContactPage() {
  const cmsPage = await fetchCmsPage('about-contact');

  if (cmsPage && cmsPage.layout === 'prose') {
    return (
      <MainLayout>
        <CmsPageContent page={cmsPage} />
      </MainLayout>
    );
  }

  return <ContactStatic content={cmsPage ? parsePageContent(cmsPage.content) : {}} />;
}
