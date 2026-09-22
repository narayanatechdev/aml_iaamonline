import type { HubArticle } from '@/lib/hub-data';

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function HubArticleCard({ article }: { article: HubArticle }) {
  const date = formatDate(article.publishDate);

  return (
    <a
      href={`/${article.journalPath}/article/${article.id}`}
      className="flex flex-col rounded-[10px] border border-[#DCE3F0] bg-white p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold tracking-wide text-[var(--brand)]">{article.journal}</span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E3F3E8] text-[#14532D] whitespace-nowrap">
          {article.accessLabel}
        </span>
      </div>
      <h3 className="font-hub-display font-bold text-[15px] text-[#14213D] leading-snug line-clamp-3 mb-1.5">
        {article.title}
      </h3>
      {article.authors && <p className="text-[12.5px] text-[#5a6a8a] line-clamp-1 mb-2">{article.authors}</p>}
      <div className="mt-auto flex items-center gap-3 text-[12px] text-[#8B98B8] pt-2">
        {date && <span>{date}</span>}
        <span>{article.views.toLocaleString()} views</span>
        <span>{article.citations} citations</span>
      </div>
    </a>
  );
}

/**
 * Grid of article cards with an explicit empty state — the hub never pads a
 * short list with placeholder entries.
 */
export function HubArticleList({ articles, empty }: { articles: HubArticle[]; empty: React.ReactNode }) {
  if (articles.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#C7D2E8] bg-[#F6F8FC] px-6 py-10 text-center">
        <div className="text-[14px] text-[#3D4A66] leading-relaxed max-w-[56ch] mx-auto">{empty}</div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {articles.map((a) => (
        <HubArticleCard key={`${a.journalPath}-${a.id}`} article={a} />
      ))}
    </div>
  );
}
