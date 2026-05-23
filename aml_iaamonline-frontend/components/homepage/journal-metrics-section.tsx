'use client';

import { Clock, Globe, Award, Users, TrendingUp, Shield, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ARTICLE_STATS, JOURNAL_INFO } from '@/lib/realData';

export function JournalMetricsSection() {
  const publishingParameters = [
    { label: 'Impact Factor', value: '3.82', icon: TrendingUp, description: '2023 Journal Citation Reports' },
    { label: 'Review Time', value: '4-6 weeks', icon: Clock, description: 'Average peer review duration' },
    { label: 'Publication Time', value: '2-3 weeks', icon: Zap, description: 'From acceptance to publication' },
    { label: 'Acceptance Rate', value: '35%', icon: CheckCircle, description: 'Rigorous peer review process' },
    { label: 'Global Reach', value: '135+ Countries', icon: Globe, description: 'Worldwide readership' },
    { label: 'Annual Readership', value: '500K+', icon: Users, description: 'Research community access' }
  ];

  const whyPublishBenefits = [
    {
      title: 'Diamond Open Access',
      description: 'No article processing charges (APC) for authors, completely free to publish and read',
      icon: Award,
      color: 'text-[#c9a227] bg-[#c9a227]/10'
    },
    {
      title: 'Global Visibility',
      description: 'Indexed in major databases including Scopus, Web of Science, and 25+ other databases',
      icon: Globe,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Fast Publication',
      description: 'Rapid peer review and publication process with online-first publication',
      icon: Zap,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Quality Assurance',
      description: 'Rigorous peer review by international experts in materials science and engineering',
      icon: Shield,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const detailedMetrics = [
    { metric: 'Total Articles Published', value: ARTICLE_STATS.total.toLocaleString() + '+', period: 'Since 2010' },
    { metric: 'Contributing Authors', value: '7,000+', period: 'Worldwide' },
    { metric: 'Participating Institutions', value: '5,500+', period: 'Global Universities' },
    { metric: 'Countries Represented', value: ARTICLE_STATS.totalCountries + '+', period: 'International Reach' },
    { metric: 'Total Citations', value: ARTICLE_STATS.totalCitations.toLocaleString() + '+', period: 'Research Impact' },
    { metric: 'Journal Volumes', value: ARTICLE_STATS.totalVolumes.toString(), period: '16 Years Publishing' }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Why Choose Advanced Materials Letters?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A leading international journal committed to advancing materials science research 
            through diamond open access publishing and rigorous peer review.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Publishing Parameters */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-black mb-6">Publishing Parameters</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {publishingParameters.map((param) => (
                <div key={param.label} className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#0f2d6b]/10 rounded-lg flex items-center justify-center">
                      <param.icon className="w-4 h-4 text-[#0f2d6b]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#0f2d6b]">{param.value}</div>
                      <div className="text-sm font-semibold text-gray-900">{param.label}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{param.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Issue Highlight */}
          <div className="bg-gradient-to-br from-[#0f2d6b] to-[#1e3a8a] p-6 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-4">Current Issue</h3>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-[#c9a227]">Volume {JOURNAL_INFO.currentVolume}</div>
                <div className="text-sm opacity-90">Issue {JOURNAL_INFO.currentIssue} • {JOURNAL_INFO.currentYear}</div>
              </div>
              <div className="text-sm opacity-90">
                ISSN: {JOURNAL_INFO.issn} | eISSN: {JOURNAL_INFO.eISSN}
              </div>
              <Link 
                href="/browse/current" 
                className="inline-block bg-[#c9a227] hover:bg-[#b8911f] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Browse Current Issue
              </Link>
            </div>
          </div>
        </div>

        {/* Why Publish With Us */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-black mb-6 text-center">Why Publish With Us</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPublishBenefits.map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow text-center">
                <div className={`w-12 h-12 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white rounded-xl border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-black mb-6 text-center">Journal Impact & Reach</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {detailedMetrics.map((metric) => (
              <div key={metric.metric}>
                <div className="text-2xl font-bold text-[#0f2d6b] mb-1">{metric.value}</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{metric.metric}</div>
                <div className="text-xs text-gray-600">{metric.period}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#0f2d6b] to-[#1e3a8a] rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Submit Your Research?</h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Join thousands of researchers worldwide who have chosen Advanced Materials Letters 
              for their groundbreaking research publications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/submit" 
                className="bg-[#c9a227] hover:bg-[#b8911f] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Submit Your Manuscript
              </Link>
              <Link 
                href="/author-resources" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Author Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}