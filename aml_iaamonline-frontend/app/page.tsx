import { MainLayout } from '@/components/layout/main-layout';
import { getBlockComponent } from '@/components/homepage/block-registry';
import { getHomeSections } from '@/lib/homeSections';
import HubHome from '@/components/hub/HubHome';

export default async function Home() {
  if (process.env.NEXT_PUBLIC_SITE_KIND === 'hub') {
    return <HubHome />;
  }

  const sections = await getHomeSections();

  return (
    <MainLayout>
      {sections.map((section) => {
        const Block = getBlockComponent(section.block_type);
        if (!Block) return null;
        return <Block key={section.id} content={section.content} />;
      })}
    </MainLayout>
  );
}
