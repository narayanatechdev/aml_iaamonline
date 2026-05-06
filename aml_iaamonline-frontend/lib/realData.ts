import articlesData from './articles_data.json';

export interface FeaturedArticle {
  id: string;
  type: 'Research Article' | 'Review' | 'Letter' | 'Communication' | 'Editorial';
  title: string;
  authors: string[];
  affiliations: string[];
  abstract: string;
  subject: string;
  published: string;
  year: number;
  volume: string;
  issue: string;
  doi: string;
  pages: string;
  views: number;
  cited: number;
  keywords: string[];
  pdf_url?: string;
  graphical_abstract_url?: string;
  original_pdf_url?: string;
  language?: string;
}

export interface Subject {
  id: string;
  name: string;
  count: number;
}

export interface ArchiveVolume {
  year: number;
  volumes: Array<{
    vol: number;
    issues: number[];
  }>;
}

export const JOURNAL_INFO = {
  currentVolume: '17',
  currentIssue: '1',
  currentYear: '2026',
  issn: '0976-3961',
  eISSN: '1998-0140',
};

// Load and process real articles data
export const FEATURED_ARTICLES: FeaturedArticle[] = articlesData.map((article: any) => ({
  id: article.id,
  type: article.type as FeaturedArticle['type'],
  title: article.title,
  authors: article.authors || [],
  affiliations: article.affiliations || ['Research Institution'],
  abstract: article.abstract || '',
  subject: article.subject || 'Materials Science',
  published: article.published || '2013-01-01',
  year: article.year || 2013,
  volume: article.volume || '1',
  issue: article.issue || '1',
  doi: article.doi || '',
  pages: article.pages || '1-12',
  views: article.views || 100,
  cited: article.cited || 0,
  keywords: article.keywords || [],
  pdf_url: article.pdf_url,
  graphical_abstract_url: article.graphical_abstract_url,
  original_pdf_url: article.original_pdf_url,
  language: article.language || 'EN'
}));

// Generate subjects from real data
const subjectCounts: Record<string, number> = {};
FEATURED_ARTICLES.forEach(article => {
  subjectCounts[article.subject] = (subjectCounts[article.subject] || 0) + 1;
});

export const SUBJECTS: Subject[] = Object.entries(subjectCounts)
  .map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count
  }))
  .sort((a, b) => b.count - a.count);

// Generate archive volumes from real data
const yearVolumes: Record<number, Set<string>> = {};
FEATURED_ARTICLES.forEach(article => {
  if (!yearVolumes[article.year]) {
    yearVolumes[article.year] = new Set();
  }
  yearVolumes[article.year].add(article.volume);
});

export const ARCHIVE_VOLUMES: ArchiveVolume[] = Object.entries(yearVolumes)
  .map(([year, volumes]) => {
    const volumeList = Array.from(volumes).map(vol => {
      // For each volume, find all issues
      const issues = FEATURED_ARTICLES
        .filter(article => article.year === parseInt(year) && article.volume === vol)
        .map(article => parseInt(article.issue))
        .filter((issue, index, arr) => arr.indexOf(issue) === index)
        .sort((a, b) => a - b);
      
      return {
        vol: parseInt(vol),
        issues: issues.length > 0 ? issues : [1]
      };
    }).sort((a, b) => a.vol - b.vol);

    return {
      year: parseInt(year),
      volumes: volumeList
    };
  })
  .sort((a, b) => b.year - a.year);

// Helper functions for filtering and searching
export function getArticlesBySubject(subject: string): FeaturedArticle[] {
  return FEATURED_ARTICLES.filter(article => 
    article.subject.toLowerCase().includes(subject.toLowerCase())
  );
}

export function getArticlesByYear(year: number): FeaturedArticle[] {
  return FEATURED_ARTICLES.filter(article => article.year === year);
}

export function getArticlesByVolume(volume: string, issue?: string): FeaturedArticle[] {
  return FEATURED_ARTICLES.filter(article => {
    if (issue) {
      return article.volume === volume && article.issue === issue;
    }
    return article.volume === volume;
  });
}

export function searchArticles(query: string): FeaturedArticle[] {
  const searchTerm = query.toLowerCase();
  return FEATURED_ARTICLES.filter(article =>
    article.title.toLowerCase().includes(searchTerm) ||
    article.abstract.toLowerCase().includes(searchTerm) ||
    article.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
    article.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
    article.doi.toLowerCase().includes(searchTerm)
  );
}

export function getFeaturedArticles(limit: number = 10): FeaturedArticle[] {
  return FEATURED_ARTICLES
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getRecentArticles(limit: number = 10): FeaturedArticle[] {
  return FEATURED_ARTICLES
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, limit);
}

export function getMostCitedArticles(limit: number = 10): FeaturedArticle[] {
  return FEATURED_ARTICLES
    .sort((a, b) => b.cited - a.cited)
    .slice(0, limit);
}

// Export stats for dashboard
export const ARTICLE_STATS = {
  total: FEATURED_ARTICLES.length,
  byType: Object.fromEntries(
    Object.entries(
      FEATURED_ARTICLES.reduce((acc, article) => {
        acc[article.type] = (acc[article.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort(([,a], [,b]) => b - a)
  ),
  byYear: Object.fromEntries(
    Object.entries(yearVolumes).map(([year, volumes]) => [
      year, 
      FEATURED_ARTICLES.filter(a => a.year === parseInt(year)).length
    ]).sort(([a], [b]) => parseInt(String(b)) - parseInt(String(a)))
  ),
  bySubject: Object.fromEntries(
    Object.entries(subjectCounts).sort(([,a], [,b]) => b - a)
  ),
  totalViews: FEATURED_ARTICLES.reduce((sum, article) => sum + article.views, 0),
  totalCitations: FEATURED_ARTICLES.reduce((sum, article) => sum + article.cited, 0)
};