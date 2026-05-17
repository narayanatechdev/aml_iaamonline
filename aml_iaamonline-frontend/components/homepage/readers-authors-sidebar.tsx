'use client';

import { BookOpen, FileText, Users, Award, TrendingUp, Tag, Newspaper, Globe } from 'lucide-react';
import Link from 'next/link';
import { ARTICLE_STATS, SUBJECTS } from '@/lib/realData';

export function ReadersAuthorsSidebar() {
  const quickStats = [
    { label: 'Published Articles', value: ARTICLE_STATS.total.toLocaleString() + '+', icon: FileText },
    { label: 'Total Citations', value: ARTICLE_STATS.totalCitations.toLocaleString() + '+', icon: TrendingUp },
    { label: 'Countries', value: ARTICLE_STATS.totalCountries + '+', icon: Users },
    { label: 'Journal Volumes', value: ARTICLE_STATS.totalVolumes.toString(), icon: BookOpen },
  ];

  const newsArticles = [
    {
      id: 1,
      title: 'IAAM Awards 2025: Call for Nominations Opens',
      excerpt: 'International Association of Advanced Materials announces the opening of nominations for prestigious research awards recognizing outstanding contributions in materials science.',
      date: '2026-05-15',
      category: 'Awards',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278449_indx_.jpg'
    },
    {
      id: 2,
      title: 'New Special Issue: Green Materials for Energy Storage',
      excerpt: 'Advanced Materials Letters announces a special issue focusing on sustainable materials for next-generation energy storage applications. Submission deadline: August 2026.',
      date: '2026-05-12',
      category: 'Special Issue',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278473_indx_.jpg'
    },
    {
      id: 3,
      title: 'Editor-in-Chief Featured in Nature Materials',
      excerpt: 'Dr. Ashutosh Tiwari discusses the future of open-access publishing in materials science and the role of Advanced Materials Letters in promoting global research collaboration.',
      date: '2026-05-10',
      category: 'Featured',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278482_indx_.jpg'
    },
    {
      id: 4,
      title: 'Advanced Materials Letters Joins DOAJ Database',
      excerpt: 'The journal has been officially indexed in the Directory of Open Access Journals, further enhancing its visibility and accessibility to the global research community.',
      date: '2026-05-08',
      category: 'Indexing',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278489_indx_.jpg'
    },
    {
      id: 5,
      title: 'Webinar Series: AI in Materials Discovery',
      excerpt: 'Join our monthly webinar series featuring leading researchers discussing the application of artificial intelligence and machine learning in materials discovery and design.',
      date: '2026-05-05',
      category: 'Event',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278501_indx_.jpg'
    }
  ];

  const newsImages = [
    'https://aml.iaamonline.org/data/aml/news/1649278449_indx_.jpg',
    'https://aml.iaamonline.org/data/aml/news/1649278473_indx_.jpg',
    'https://aml.iaamonline.org/data/aml/news/1649278482_indx_.jpg',
    'https://aml.iaamonline.org/data/aml/news/1649278489_indx_.jpg',
    'https://aml.iaamonline.org/data/aml/news/1649278501_indx_.jpg'
  ];


  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-[#0f2d6b] font-semibold text-lg mb-4">Journal Impact</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-10 h-10 bg-[#0f2d6b]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-5 h-5 text-[#0f2d6b]" />
              </div>
              <div className="text-lg font-bold text-[#0f2d6b]">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>


      {/* Browse by Subject */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-[#0f2d6b] font-semibold text-lg mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Browse by Subject
        </h3>
        <div className="space-y-2">
          {SUBJECTS.slice(0, 6).map((subject) => (
            <Link
              key={subject.id}
              href={`/browse/subject?subject=${encodeURIComponent(subject.name)}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0f2d6b] rounded-full"></div>
                <span className="text-sm text-[#0f1a2e] group-hover:text-[#0f2d6b] transition-colors font-medium">
                  {subject.name}
                </span>
              </div>
              <span className="text-xs text-[#5a6a8a] bg-gray-100 px-2 py-1 rounded-full">
                {subject.count}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/browse/subject"
          className="block text-center text-[#0f2d6b] text-sm font-semibold hover:underline mt-4"
        >
          View all subjects
        </Link>
      </div>

      {/* News Articles */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-[#0f2d6b] font-semibold text-lg mb-4 flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          News & Announcements
        </h3>
        <div className="space-y-4">
          {newsArticles.slice(0, 3).map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-[#c9a227] bg-[#c9a227]/10 px-2 py-1 rounded-full">
                  {news.category}
                </span>
                <span className="text-xs text-[#5a6a8a]">
                  {new Date(news.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#0f1a2e] group-hover:text-[#0f2d6b] transition-colors line-clamp-2 mb-2">
                {news.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {news.excerpt}
              </p>
            </Link>
          ))}
        </div>
        <Link
          href="/news"
          className="block text-center text-[#0f2d6b] text-sm font-semibold hover:underline mt-4"
        >
          View all news
        </Link>
      </div>

      {/* News Images Widget */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="space-y-3">
          {newsImages.slice(0, 5).map((imageUrl, index) => (
            <Link
              key={index}
              href={`/news/${index + 1}`}
              className="block group"
            >
              <div className="w-full bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                <div className="w-full h-20 bg-white rounded overflow-hidden">
                  <img 
                    src={imageUrl}
                    alt={`News Image ${index + 1}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallbackDiv = target.parentElement;
                      if (fallbackDiv) fallbackDiv.style.backgroundColor = '#f3f4f6';
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Publishing Parameters */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-[#0f2d6b] font-semibold text-lg mb-4">Publishing Parameters</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Impact Factor</span>
            <span className="text-sm font-semibold text-[#0f2d6b]">3.82</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Review Time</span>
            <span className="text-sm font-semibold text-[#0f2d6b]">4-6 weeks</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Publication Time</span>
            <span className="text-sm font-semibold text-[#0f2d6b]">2-3 weeks</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Acceptance Rate</span>
            <span className="text-sm font-semibold text-[#0f2d6b]">35%</span>
          </div>
        </div>
      </div>

      {/* Why Publish With Us */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-[#0f2d6b] font-semibold text-lg mb-4">Why Publish With Us</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#c9a227]/10 rounded flex items-center justify-center flex-shrink-0">
              <Award className="w-3 h-3 text-[#c9a227]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Diamond Open Access</div>
              <div className="text-xs text-gray-600 leading-relaxed">No publication fees, completely free for authors</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
              <Globe className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Global Visibility</div>
              <div className="text-xs text-gray-600 leading-relaxed">Indexed in Scopus, Web of Science, and 25+ databases</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-50 rounded flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Quality Assurance</div>
              <div className="text-xs text-gray-600 leading-relaxed">Rigorous peer review by international experts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Access Notice */}
      <div className="bg-gradient-to-br from-[#c9a227]/10 to-[#c9a227]/5 border border-[#c9a227]/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#c9a227] rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-[#c9a227] font-semibold text-sm mb-2">Diamond Open Access</h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              Free to publish, free to read. No article processing charges (APC) or subscription fees. 
              Supporting global scientific knowledge sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}