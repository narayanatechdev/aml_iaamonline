import { MainLayout } from '@/components/layout/main-layout';
import { FeaturedArticle } from '@/components/layout/featured-hero';
import { FeaturedArticles } from '@/components/homepage/featured-articles';
import { OnTheCover } from '@/components/homepage/on-the-cover';
import { ChallengeDivisions } from '@/components/homepage/challenge-divisions';
import { Announcements } from '@/components/homepage/announcements';
import { IAAMFellowship } from '@/components/homepage/iaam-fellowship';
import { ArticleCategories } from '@/components/homepage/article-categories';
import { JournalInfoHeader } from '@/components/homepage/journal-info-header';
import { HeroSection } from '@/components/homepage/hero-section';
import { ContentLayout } from '@/components/homepage/content-layout';
import { CTASection } from '@/components/homepage/cta-section';

export default function Home() {
  return (
    <MainLayout>
      <FeaturedArticle />
      <FeaturedArticles />
      <OnTheCover />
      <ChallengeDivisions />
      <Announcements />
      <IAAMFellowship />
      <ArticleCategories />
      <JournalInfoHeader />
      <HeroSection />
      <ContentLayout />
      <CTASection />
    </MainLayout>
  );
}
