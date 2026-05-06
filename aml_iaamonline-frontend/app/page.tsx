import { MainLayout } from '@/components/layout/main-layout';
import { HeroSection } from '@/components/homepage/hero-section';
import { QuickMetrics } from '@/components/homepage/quick-metrics';
import { AimsScope } from '@/components/homepage/aims-scope';
import { FeaturedContent } from '@/components/homepage/featured-content';
import { BrowseSubjects } from '@/components/homepage/browse-subjects';
import { CTASection } from '@/components/homepage/cta-section';
import { PerformanceMetrics } from '@/components/homepage/performance-metrics';

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <QuickMetrics />
      <AimsScope />
      <FeaturedContent />
      <BrowseSubjects />
      <CTASection />
      <PerformanceMetrics />
    </MainLayout>
  );
}
