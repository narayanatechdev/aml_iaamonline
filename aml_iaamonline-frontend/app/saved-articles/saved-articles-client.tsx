'use client';

import { useEffect, useState } from 'react';
import { FileText, BookmarkX, ExternalLink } from 'lucide-react';

interface SavedArticle {
  id: string;
  title: string;
  authors: string;
  published: string;
  views: number;
  doi: string;
}

function formatAuthors(authors: any): string {
  if (!authors) return '';
  if (typeof authors === 'string') return authors;
  if (Array.isArray(authors)) {
    return authors
      .map((a: any) => {
        if (typeof a === 'string') return a;
        if (a.name) return a.name;
        const parts = [a.first_name, a.last_name].filter(Boolean);
        return parts.length > 0 ? parts.join(' ') : '';
      })
      .filter(Boolean)
      .join(', ');
  }
  return '';
}

export function SavedArticlesClient() {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const keys = Object.keys(localStorage).filter(k => k.startsWith('saved_article_'));
    const savedIds = keys.map(k => k.replace('saved_article_', ''));

    if (savedIds.length === 0) {
      setLoading(false);
      return;
    }

    Promise.allSettled(
      savedIds.map(id =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      const articles: SavedArticle[] = [];
      results.forEach((result, i) => {
        if (result.status === 'fulfilled' && result.value) {
          const data = result.value;
          articles.push({
            id: savedIds[i],
            title: data.title || 'Untitled',
            authors: formatAuthors(data.authors),
            published: data.publish_date ? data.publish_date.slice(0, 10) : '',
            views: data.views_count ?? data.total_views ?? 0,
            doi: data.doi || '',
          });
        }
      });
      setSavedArticles(articles);
      setLoading(false);
    });
  }, []);

  const handleUnsave = (id: string) => {
    localStorage.removeItem(`saved_article_${id}`);
    setSavedArticles(prev => prev.filter(a => a.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[50vh]">
      <div className="flex items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="font-bold text-2xl text-black mb-1">Saved Articles</h1>
          <p className="text-sm text-gray-600">Articles you've bookmarked for later reading.</p>
        </div>
        {savedArticles.length > 0 && (
          <span className="text-sm text-gray-500">{savedArticles.length} saved</span>
        )}
      </div>

      <div className="border-b-2 border-black mb-8 mt-4" />

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 h-48 animate-pulse" />
          ))}
        </div>
      ) : savedArticles.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-gray-300">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-lg text-black mb-2">No saved articles yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Click the <strong>Save</strong> button on any article page to bookmark it here.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 rounded bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
          >
            Browse articles
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedArticles.map(article => (
            <div
              key={article.id}
              className="flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <a href={`/article/${article.id}`} className="flex flex-col flex-1 p-5 group">
                <h3 className="font-bold text-[15px] text-black leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-3"
                    style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', serif" }}>
                  {article.title}
                </h3>
                {article.authors && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{article.authors}</p>
                )}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  {article.published && <span>{article.published}</span>}
                  {article.views > 0 && <span>{article.views.toLocaleString()} views</span>}
                </div>
              </a>
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                {article.doi ? (
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-700 hover:underline"
                  >
                    DOI <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span />}
                <button
                  onClick={() => handleUnsave(article.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                  title="Remove from saved"
                >
                  <BookmarkX className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
