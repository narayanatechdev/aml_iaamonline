import { MainLayout } from '@/components/layout/main-layout';
import { JournalInfoHeader } from '@/components/homepage/journal-info-header';
import { HeroSection } from '@/components/homepage/hero-section';
import { ContentLayout } from '@/components/homepage/content-layout';
import { CTASection } from '@/components/homepage/cta-section';

export default function Home() {
  return (
    <MainLayout>
      <JournalInfoHeader />
      <HeroSection />
      <ContentLayout />
      <CTASection />
    </MainLayout>
  );
}
