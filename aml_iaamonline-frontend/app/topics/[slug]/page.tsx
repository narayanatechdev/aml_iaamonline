import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { assertHub, IS_HUB } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { HubArticleList } from '@/components/hub/HubArticleList';
import { HUB_TOPICS, findTopic } from '@/lib/hub-topics';
import { getTopicArticles } from '@/lib/hub-data';

export const revalidate = 3600;

export function generateStaticParams() {
  if (!IS_HUB) return [];
  return HUB_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) return { title: 'Topic' };
  return { title: topic.label, description: topic.text };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  assertHub();

  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();

  const { articles, total, matchedSubjects } = await getTopicArticles(topic, 24);

  return (
    <HubPageLayout
      kicker="Topic"
      title={topic.label}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Topics', href: '/topics' },
        { label: topic.label, href: `/topics/${topic.slug}` },
      ]}
      intro={topic.text}
    >
      <HubSection>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
          <p className="text-[13.5px] text-[#5a6a8a]">
            {total > 0 ? (
              <>
                {total.toLocaleString()} {total === 1 ? 'article' : 'articles'} published
                {articles.length < total && <> · showing the {articles.length} most recent</>}
              </>
            ) : (
              'No articles published in this area yet'
            )}
          </p>
          <a
            href={`/search?q=${encodeURIComponent(topic.label)}`}
            className="text-[13.5px] font-semibold text-[#1546E0] hover:underline"
          >
            Search within this area →
          </a>
        </div>

        <HubArticleList
          articles={articles}
          empty={
            <>
              <p className="font-semibold text-[#14213D] mb-1.5">Nothing published here yet.</p>
              <p>
                {topic.label} is within our scope, but no article in Advanced Materials Letters or Advanced
                Materials Proceedings carries this subject so far. If you work in this area,{' '}
                <a href="/for-authors/submit-proposal" className="text-[#1546E0] font-semibold hover:underline">
                  propose an article
                </a>{' '}
                — or{' '}
                <a href="/topics" className="text-[#1546E0] font-semibold hover:underline">
                  browse the areas that are active
                </a>
                .
              </p>
            </>
          }
        />

        {matchedSubjects.length > 0 && (
          <p className="text-[12px] text-[#8B98B8] mt-6">
            Included subject {matchedSubjects.length === 1 ? 'area' : 'areas'}: {matchedSubjects.join(' · ')}
          </p>
        )}
      </HubSection>
    </HubPageLayout>
  );
}
