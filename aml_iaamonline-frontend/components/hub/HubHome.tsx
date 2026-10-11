import { HubHeader } from './HubHeader';
import { HubHero } from './HubHero';
import { OurPublications } from './OurPublications';
import { MaterialsAreas } from './MaterialsAreas';
import { LatestArticles } from './LatestArticles';
import { FromIAAM } from './FromIAAM';
import { ArticleImpact } from './ArticleImpact';
import { PublishingWithIAAM } from './PublishingWithIAAM';
import { Collaboration } from './Collaboration';
import { NotForProfitAndStats } from './NotForProfitAndStats';
import { HubFooter } from './HubFooter';

export default function HubHome() {
  return (
    <>
      <HubHeader />
      <main>
        <HubHero />
        <OurPublications />
        <MaterialsAreas />
        <LatestArticles />
        <FromIAAM />
        <ArticleImpact />
        <PublishingWithIAAM />
        <Collaboration />
        <NotForProfitAndStats />
      </main>
      <HubFooter />
    </>
  );
}
