'use client';

import { useState } from 'react';
import type { HubArticle } from '@/lib/hub-data';

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ArticleCard({ article }: { article: HubArticle }) {
  const date = formatDate(article.publishDate);
  return (
    <a
      href={`/${article.journalPath}/article/${article.id}`}
      className="flex flex-col rounded-[10px] border border-[#DCE3F0] bg-white p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold tracking-wide text-[#1546E0]">{article.journal}</span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E3F3E8] text-[#14532D]">{article.accessLabel}</span>
      </div>
      <h3 className="font-hub-display font-bold text-[15px] text-[#14213D] leading-snug line-clamp-2 mb-1.5">
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

export function LatestArticlesTabs({ recent, mostCited }: { recent: HubArticle[]; mostCited: HubArticle[] }) {
  const [tab, setTab] = useState<'recent' | 'cited'>('recent');
  const articles = tab === 'recent' ? recent : mostCited;

  return (
    <div>
      <div role="tablist" className="flex gap-2 mb-6">
        <button
          role="tab"
          aria-selected={tab === 'recent'}
          onClick={() => setTab('recent')}
          className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition-colors ${
            tab === 'recent' ? 'bg-[#1546E0] text-white' : 'bg-[#F6F8FC] text-[#2B3853] hover:bg-[#EAF1FD]'
          }`}
        >
          Most recent
        </button>
        <button
          role="tab"
          aria-selected={tab === 'cited'}
          onClick={() => setTab('cited')}
          className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition-colors ${
            tab === 'cited' ? 'bg-[#1546E0] text-white' : 'bg-[#F6F8FC] text-[#2B3853] hover:bg-[#EAF1FD]'
          }`}
        >
          Most cited
        </button>
      </div>

      {articles.length === 0 ? (
        <p className="text-[14px] text-[#5a6a8a] py-8 text-center">
          Nothing here yet. New articles appear as soon as they are published.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => (
            <ArticleCard key={`${a.journalPath}-${a.id}`} article={a} />
          ))}
        </div>
      )}

      <a href="/archive" className="inline-block mt-6 text-[14px] font-semibold text-[#1546E0] hover:underline">
        View all articles
      </a>
    </div>
  );
}
