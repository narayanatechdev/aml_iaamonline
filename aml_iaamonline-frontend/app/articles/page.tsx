'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { BookOpen, Search, Filter } from 'lucide-react';

export default function ArticlesPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[{ label: 'Articles' }]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Articles</h1>
          <p className="text-lg text-gray-700">
            Browse and search all published articles in Advanced Materials Letters
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Browse Options */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#0f2d6b]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0f2d6b]">Current Issue</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Browse articles from the latest issue of Advanced Materials Letters
              </p>
              <Link 
                href="/browse/current"
                className="inline-flex items-center px-4 py-2 bg-[#0f2d6b] text-white rounded-lg hover:bg-[#0d2560] transition-colors"
              >
                Browse Current Issue
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-[#0f2d6b]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0f2d6b]">Search Articles</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Search through our entire archive by keywords, authors, or topics
              </p>
              <Link 
                href="/browse/current?search=true"
                className="inline-flex items-center px-4 py-2 bg-[#0f2d6b] text-white rounded-lg hover:bg-[#0d2560] transition-colors"
              >
                Search Articles
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-[#0f2d6b]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0f2d6b]">Browse by Subject</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Explore articles organized by research topics and subject areas
              </p>
              <Link 
                href="/browse/subject"
                className="inline-flex items-center px-4 py-2 bg-[#0f2d6b] text-white rounded-lg hover:bg-[#0d2560] transition-colors"
              >
                Browse Subjects
              </Link>
            </div>
          </div>

          {/* Quick Access */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">Quick Access</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/browse/archive"
                className="block p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-[#0f2d6b] mb-2">Archive</h4>
                <p className="text-sm text-gray-600">Browse past issues</p>
              </Link>
              
              <Link 
                href="/browse/author"
                className="block p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-[#0f2d6b] mb-2">Authors</h4>
                <p className="text-sm text-gray-600">Find articles by author</p>
              </Link>
              
              <Link 
                href="/author-resources"
                className="block p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-[#0f2d6b] mb-2">Submit Article</h4>
                <p className="text-sm text-gray-600">Author guidelines</p>
              </Link>
              
              <Link 
                href="/news"
                className="block p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-[#0f2d6b] mb-2">Latest News</h4>
                <p className="text-sm text-gray-600">Journal announcements</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}