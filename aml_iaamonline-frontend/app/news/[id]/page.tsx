'use client';

import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewsArticlePage() {
  const params = useParams();
  const id = params.id as string;

  // This would normally come from a database or API
  const newsArticles = [
    {
      id: '1',
      title: 'IAAM Awards 2025: Call for Nominations Opens',
      excerpt: 'International Association of Advanced Materials announces the opening of nominations for prestigious research awards recognizing outstanding contributions in materials science.',
      content: `
        <p>The International Association of Advanced Materials (IAAM) is pleased to announce the opening of nominations for the prestigious IAAM Awards 2025. These awards recognize outstanding contributions to the field of materials science and engineering, celebrating researchers who have made significant impacts through their innovative work.</p>
        
        <p>The IAAM Awards program includes several categories:</p>
        <ul>
          <li><strong>IAAM Medal:</strong> Recognizing lifetime achievements in advanced materials research</li>
          <li><strong>IAAM Young Scientist Award:</strong> Honoring early-career researchers under 35 years</li>
          <li><strong>IAAM Innovation Award:</strong> Celebrating breakthrough technologies and applications</li>
          <li><strong>IAAM Excellence Award:</strong> Acknowledging outstanding research publications</li>
        </ul>
        
        <p>Nominations are open to researchers worldwide and can be submitted through the IAAM website. The deadline for submissions is July 31, 2026. Winners will be announced at the IAAM Annual Conference in September 2026.</p>
        
        <p>Previous winners of IAAM Awards have gone on to make significant contributions to the field, with many becoming leaders in academia and industry. The awards not only recognize achievement but also encourage continued excellence in materials science research.</p>
      `,
      date: '2026-05-15',
      category: 'Awards',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278449_indx_.jpg'
    },
    {
      id: '2',
      title: 'New Special Issue: Green Materials for Energy Storage',
      excerpt: 'Advanced Materials Letters announces a special issue focusing on sustainable materials for next-generation energy storage applications.',
      content: `
        <p>Advanced Materials Letters is excited to announce a special issue dedicated to "Green Materials for Energy Storage". This special issue will focus on sustainable and environmentally friendly materials for next-generation energy storage applications.</p>
        
        <p>Topics of interest include:</p>
        <ul>
          <li>Bio-derived materials for batteries and supercapacitors</li>
          <li>Recyclable and biodegradable energy storage components</li>
          <li>Sustainable synthesis methods for electrode materials</li>
          <li>Life cycle assessment of energy storage materials</li>
          <li>Green electrolytes and separators</li>
        </ul>
        
        <p>We invite original research articles, review papers, and short communications that address these topics. The special issue is guest edited by leading experts in the field of sustainable materials and energy storage.</p>
        
        <p><strong>Important Dates:</strong></p>
        <ul>
          <li>Submission deadline: August 31, 2026</li>
          <li>First review round: October 2026</li>
          <li>Publication: December 2026</li>
        </ul>
      `,
      date: '2026-05-12',
      category: 'Special Issue',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278473_indx_.jpg'
    },
    {
      id: '3',
      title: 'Editor-in-Chief Featured in Nature Materials',
      excerpt: 'Dr. Ashutosh Tiwari discusses the future of open-access publishing in materials science.',
      content: `
        <p>Dr. Ashutosh Tiwari, Editor-in-Chief of Advanced Materials Letters, was recently featured in Nature Materials in a comprehensive interview discussing the future of open-access publishing in materials science and the critical role that journals like AML play in promoting global research collaboration.</p>
        
        <p>In the interview, Dr. Tiwari emphasized the importance of diamond open access publishing, stating: "The future of scientific publishing lies in making research freely available to all, without financial barriers for either authors or readers. This democratization of knowledge is essential for global scientific progress."</p>
        
        <p>Key points from the interview include:</p>
        <ul>
          <li>The evolution of open-access publishing in materials science</li>
          <li>Challenges and opportunities in maintaining quality while ensuring accessibility</li>
          <li>The role of technology in improving peer review processes</li>
          <li>International collaboration in materials research</li>
        </ul>
        
        <p>Dr. Tiwari also discussed Advanced Materials Letters' commitment to supporting researchers from developing countries and the journal's initiatives to promote diversity and inclusion in scientific publishing.</p>
      `,
      date: '2026-05-10',
      category: 'Featured',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278482_indx_.jpg'
    },
    {
      id: '4',
      title: 'Advanced Materials Letters Joins DOAJ Database',
      excerpt: 'The journal has been officially indexed in the Directory of Open Access Journals.',
      content: `
        <p>We are proud to announce that Advanced Materials Letters has been officially indexed in the Directory of Open Access Journals (DOAJ). This milestone further enhances the journal's visibility and accessibility to the global research community.</p>
        
        <p>The DOAJ is a comprehensive directory that indexes high-quality, peer-reviewed open access journals. Inclusion in DOAJ indicates that Advanced Materials Letters meets the highest standards for open access publishing, including:</p>
        
        <ul>
          <li>Transparent peer review processes</li>
          <li>Clear open access policies</li>
          <li>High editorial standards</li>
          <li>Proper archiving and preservation practices</li>
        </ul>
        
        <p>This indexing will make our articles more discoverable through academic search engines and databases, increasing their impact and reach within the scientific community.</p>
      `,
      date: '2026-05-08',
      category: 'Indexing',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278489_indx_.jpg'
    },
    {
      id: '5',
      title: 'Webinar Series: AI in Materials Discovery',
      excerpt: 'Join our monthly webinar series featuring leading researchers discussing AI applications in materials science.',
      content: `
        <p>Advanced Materials Letters is launching a new monthly webinar series focusing on "AI in Materials Discovery". This series will feature leading researchers from around the world discussing the latest applications of artificial intelligence and machine learning in materials discovery and design.</p>
        
        <p>Upcoming webinar topics include:</p>
        <ul>
          <li><strong>June 2026:</strong> "Machine Learning for Predicting Material Properties"</li>
          <li><strong>July 2026:</strong> "High-Throughput Computational Screening"</li>
          <li><strong>August 2026:</strong> "AI-Driven Synthesis Route Optimization"</li>
          <li><strong>September 2026:</strong> "Deep Learning in Materials Characterization"</li>
        </ul>
        
        <p>Each webinar will feature a 45-minute presentation followed by a Q&A session. All webinars are free to attend and will be recorded for later viewing. Registration is required and can be completed through our website.</p>
        
        <p>This series is part of our commitment to promoting cutting-edge research and facilitating knowledge exchange within the materials science community.</p>
      `,
      date: '2026-05-05',
      category: 'Event',
      image: 'https://aml.iaamonline.org/data/aml/news/1649278501_indx_.jpg'
    }
  ];

  const article = newsArticles.find(article => article.id === id);

  if (!article) {
    return (
      <MainLayout>
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The news article you're looking for doesn't exist.</p>
            <Link href="/news" className="text-[#0f2d6b] font-semibold hover:underline">
              ← Back to News
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/news" className="inline-flex items-center gap-2 text-[#0f2d6b] font-semibold hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img 
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold text-[#c9a227] bg-[#c9a227]/10 px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>
              
              <div className="text-lg text-gray-600 mb-8 leading-relaxed">
                {article.excerpt}
              </div>

              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}