'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Calendar, Tag, Newspaper, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const newsArticles = [
    {
      id: 1,
      title: 'IAAM Awards 2025: Call for Nominations Opens',
      excerpt: 'International Association of Advanced Materials announces the opening of nominations for prestigious research awards recognizing outstanding contributions in materials science.',
      content: 'The International Association of Advanced Materials (IAAM) is pleased to announce the opening of nominations for the prestigious IAAM Awards 2025. These awards recognize outstanding contributions to the field of materials science and engineering, celebrating researchers who have made significant impacts through their innovative work...',
      date: '2026-05-15',
      category: 'Awards',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278449_indx_.jpg',
      featured: true
    },
    {
      id: 2,
      title: 'New Special Issue: Green Materials for Energy Storage',
      excerpt: 'Advanced Materials Letters announces a special issue focusing on sustainable materials for next-generation energy storage applications. Submission deadline: August 2026.',
      content: 'We are excited to announce a special issue of Advanced Materials Letters dedicated to "Green Materials for Energy Storage". This special issue will focus on sustainable and environmentally friendly materials for next-generation energy storage applications...',
      date: '2026-05-12',
      category: 'Special Issue',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278473_indx_.jpg',
      featured: true
    },
    {
      id: 3,
      title: 'Editor-in-Chief Featured in Nature Materials',
      excerpt: 'Dr. Ashutosh Tiwari discusses the future of open-access publishing in materials science and the role of Advanced Materials Letters in promoting global research collaboration.',
      content: 'Dr. Ashutosh Tiwari, Editor-in-Chief of Advanced Materials Letters, was recently featured in Nature Materials discussing the future of open-access publishing in materials science and the critical role that journals like AML play in promoting global research collaboration...',
      date: '2026-05-10',
      category: 'Featured',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278482_indx_.jpg',
      featured: true
    },
    {
      id: 4,
      title: 'Advanced Materials Letters Joins DOAJ Database',
      excerpt: 'The journal has been officially indexed in the Directory of Open Access Journals, further enhancing its visibility and accessibility to the global research community.',
      content: 'We are proud to announce that Advanced Materials Letters has been officially indexed in the Directory of Open Access Journals (DOAJ). This milestone further enhances the journal\'s visibility and accessibility to the global research community...',
      date: '2026-05-08',
      category: 'Indexing',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278489_indx_.jpg',
      featured: false
    },
    {
      id: 5,
      title: 'Webinar Series: AI in Materials Discovery',
      excerpt: 'Join our monthly webinar series featuring leading researchers discussing the application of artificial intelligence and machine learning in materials discovery and design.',
      content: 'Advanced Materials Letters is launching a new monthly webinar series focusing on "AI in Materials Discovery". This series will feature leading researchers from around the world discussing the latest applications of artificial intelligence and machine learning...',
      date: '2026-05-05',
      category: 'Event',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278501_indx_.jpg',
      featured: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All News', count: newsArticles.length },
    { id: 'Awards', label: 'Awards', count: newsArticles.filter(n => n.category === 'Awards').length },
    { id: 'Special Issue', label: 'Special Issues', count: newsArticles.filter(n => n.category === 'Special Issue').length },
    { id: 'Featured', label: 'Featured', count: newsArticles.filter(n => n.category === 'Featured').length },
    { id: 'Event', label: 'Events', count: newsArticles.filter(n => n.category === 'Event').length },
    { id: 'Indexing', label: 'Indexing', count: newsArticles.filter(n => n.category === 'Indexing').length }
  ];

  const filteredNews = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeCategory);

  const featuredNews = newsArticles.filter(article => article.featured).slice(0, 3);

  return (
    <MainLayout>
      <div className="bg-[#0f2d6b] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-4">News & Events</h1>
          <p className="text-lg text-white/80">
            Stay updated with the latest news, announcements, and events from Advanced Materials Letters
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <h3 className="text-[#0f2d6b] font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-[#0f2d6b] text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-medium">{category.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Images */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-[#0f2d6b] font-semibold text-lg mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Featured Images
                </h3>
                <div className="space-y-3">
                  {newsArticles.slice(0, 5).map((news, index) => (
                    <div key={index} className="w-full h-16 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured News */}
              {activeCategory === 'all' && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">Featured News</h2>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {featuredNews.map((news) => (
                      <div key={news.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-semibold text-[#c9a227] bg-[#c9a227]/10 px-2 py-1 rounded-full">
                              {news.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(news.date).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{news.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-3">{news.excerpt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All News */}
              <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">
                {activeCategory === 'all' ? 'All News' : categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <div className="space-y-6">
                {filteredNews.map((news) => (
                  <div key={news.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-6">
                      <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-semibold text-[#c9a227] bg-[#c9a227]/10 px-2 py-1 rounded-full">
                            {news.category}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(news.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{news.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{news.excerpt}</p>
                        <button className="text-[#0f2d6b] font-semibold text-sm hover:underline flex items-center gap-1">
                          Read more <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}