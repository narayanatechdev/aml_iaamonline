import { getLatestArticles, getMostCitedArticles } from '@/lib/hub-data';
import { LatestArticlesTabs } from './LatestArticlesTabs';

export async function LatestArticles() {
  const [recent, mostCited] = await Promise.all([getLatestArticles(6), getMostCitedArticles(6)]);

  return (
    <section id="latest-articles" className="font-hub-body bg-white">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <h2 className="font-hub-display font-bold text-[28px] text-[#0B1F4D]">Latest Articles</h2>
        <div className="w-14 h-1 rounded-full bg-[var(--brand)] mt-2 mb-6" />
        <LatestArticlesTabs recent={recent} mostCited={mostCited} />
      </div>
    </section>
  );
}
