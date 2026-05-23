'use client';

import { BookOpen, FileText, Users, Award, TrendingUp, Tag, Newspaper, Globe } from 'lucide-react';
import Link from 'next/link';
import { ARTICLE_STATS, SUBJECTS } from '@/lib/realData';

export function ReadersAuthorsSidebar() {

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
      {/* For Readers */}
      <div className="bg-white rounded-xl border border-gray-100 p-8 fade-in-up">
        <BookOpen className="w-8 h-8 text-[#0f2d6b] mb-4" />
        <h3 className="text-black text-2xl mb-4 font-bold">For Readers</h3>
        <p className="text-black text-base leading-relaxed mb-6">
          Access {ARTICLE_STATS.total.toLocaleString()}+ peer-reviewed articles across all areas of materials science — completely free, no subscription required. Stay current with the latest research from {ARTICLE_STATS.totalCountries}+ countries.
        </p>
        <div className="flex gap-3">
          <a
            href="/browse/current"
            className="px-5 py-3 bg-[#0f2d6b] text-white rounded-lg text-base hover:bg-[#0d2560] transition-colors font-semibold"
          >
            Current Issue
          </a>
          <a
            href="/browse/archive"
            className="px-5 py-3 bg-white border border-gray-300 text-black rounded-lg text-base hover:bg-gray-50 transition-colors"
          >
            Browse Archive
          </a>
        </div>
      </div>

      {/* For Authors */}
      <div className="bg-white rounded-xl border border-gray-100 p-8 fade-in-up">
        <FileText className="w-8 h-8 text-[#c9a227] mb-4" />
        <h3 className="text-black text-2xl mb-4 font-bold">For Authors</h3>
        <p className="text-black text-base leading-relaxed mb-6">
          Publish your research in a Diamond Open Access journal — free to read, free to publish. Fast peer review, high visibility, and global reach.
        </p>
        <div className="flex gap-3">
          <a
            href="/submit"
            className="px-5 py-3 bg-[#c9a227] text-white rounded-lg text-base hover:bg-[#b8911f] transition-colors font-semibold"
          >
            Submit Now
          </a>
          <a
            href="#guidelines"
            className="px-5 py-3 bg-white border border-gray-300 text-black rounded-lg text-base hover:bg-gray-50 transition-colors"
          >
            Author Guidelines
          </a>
        </div>
      </div>

      {/* Browse by Subject */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 fade-in-up">
        <h3 className="text-black font-semibold text-lg mb-4 flex items-center gap-2">
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
      <div className="bg-white rounded-xl border border-gray-100 p-6 fade-in-up">
        <h3 className="text-black font-semibold text-xl mb-4 flex items-center gap-2">
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
              <h4 className="text-base font-semibold text-black group-hover:text-[#0f2d6b] transition-colors line-clamp-2 mb-3">
                {news.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
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
        <h3 className="text-black font-semibold text-lg mb-4">Publishing Parameters</h3>
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