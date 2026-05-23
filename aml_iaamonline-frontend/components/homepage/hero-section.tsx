'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, FileText, Users, TrendingUp, Award, Globe } from 'lucide-react';
import { searchArticles, ARTICLE_STATS } from '@/lib/realData';
import Link from 'next/link';
import { NewsletterSubscription } from './newsletter-subscription';

const HERO_IMAGE = "https://images.unsplash.com/photo-1770320742319-6aa889b3130b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRlcmlhbHMlMjBzY2llbmNlJTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3MjcxMDI3OHww&ixlib=rb-4.0.3&q=80&w=1080";

function getAuthorName(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  }
  return '';
}

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length >= 2) {
      const found = searchArticles(value).slice(0, 6);
      setResults(found);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/browse/current?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const quickStats = [
    { label: 'Published Articles', value: ARTICLE_STATS.total.toLocaleString() + '+', icon: FileText },
    { label: 'Total Citations', value: ARTICLE_STATS.totalCitations.toLocaleString() + '+', icon: TrendingUp },
    { label: 'Countries', value: ARTICLE_STATS.totalCountries + '+', icon: Users },
    { label: 'Journal Volumes', value: ARTICLE_STATS.totalVolumes.toString(), icon: BookOpen },
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 max-w-3xl">
          <h3 className="text-black font-semibold text-2xl mb-6 fade-in-up">Dear Readers, Authors, and Supporters,</h3>
          <div className="text-black/80 text-base leading-relaxed space-y-6 mb-8">
            <p className="fade-in-up">
              As the Editor-in-Chief of Advanced Materials Letters, I sincerely thank all researchers, reviewers, and readers who have contributed to the journal's success. Since its launch in June 2010, Advanced Materials Letters has remained dedicated to providing a high-quality, open-access platform for publishing cutting-edge research in materials science, engineering, and technology. Published by the International Association of Advanced Materials (IAAM), a non-profit organization, the journal upholds the principles of free and accessible scientific knowledge.
            </p>
            <p className="fade-in-up">
              The journal completed 15 impactful years in June 2024 and is publishing its 16th volume in 2025. Over the years, we have published 2,000 peer-reviewed articles contributed by more than 7,000 authors from 5,500+ universities and organizations across 75+ countries. With an annual readership exceeding half a million across 135+ countries, our open-access model ensures that scientific research remains freely available without article processing charges (APC) or subscription fees.
            </p>
            <p className="fade-in-up">
              Advanced Materials Letters is committed to rigorous peer review and maintains the highest research integrity and quality. As an interdisciplinary journal, it covers various fields, including materials science, chemistry, physics, biology, engineering, and technology. The journal publishes a variety of research formats, such as: Original Research Articles, Review Articles, Short Communications, Perspective Articles, Systematic Reviews & Meta-Analyses, Letters to the Editor, Commentaries & Editorials. Beyond research publications, the journal fosters discussions on emerging trends and future directions in advanced materials. Published quarterly since 2022, it ensures the timely dissemination of groundbreaking scientific contributions.
            </p>
            <p className="fade-in-up">
              Celebrating this milestone, we reaffirm our commitment to advancing materials science and supporting global innovation. Thank you for being an integral part of this journey. We invite you to explore our latest publications and celebrate this achievement.
            </p>
            <p className="mt-8 fade-in-up">
              <span className="block">Sincerely,</span>
              <span className="block font-semibold">Editor-in-Chief</span>
              <span className="block">Advanced Materials Letters</span>
            </p>
          </div>

          </div>

          {/* Newsletter Subscription and Journal Impact */}
          <div className="lg:col-span-1 space-y-6">
            <div className="fade-in-right">
              <NewsletterSubscription />
            </div>
            
            {/* Journal Impact Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 scale-in">
              <h3 className="text-black font-semibold text-xl mb-4">Journal Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="w-10 h-10 bg-[#0f2d6b]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-5 h-5 text-[#0f2d6b]" />
                    </div>
                    <div className="text-xl font-bold text-[#0f2d6b]">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Publish With Us */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 scale-in">
              <h3 className="text-black font-semibold text-xl mb-4">Why Publish With Us</h3>
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
          </div>

        </div>
      </div>
    </section>
  );
}
