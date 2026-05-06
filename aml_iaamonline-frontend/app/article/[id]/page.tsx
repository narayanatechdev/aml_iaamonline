'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FEATURED_ARTICLES } from "@/lib/realData";
import { Download, Quote, Share2, BookmarkPlus, ExternalLink, Eye, ChevronLeft, FileText, MapPin } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";

interface AuthorAffiliation {
  id: number;
  name: string;
  email: string | null;
  position: number;
  is_corresponding: boolean;
  affiliation: {
    id: number;
    name: string;
    country: string | null;
    city: string | null;
    department: string | null;
    full_address: string | null;
  } | null;
  affiliation_text: string | null;
}

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  
  const article = FEATURED_ARTICLES.find((a) => a.id === id) || FEATURED_ARTICLES[0];
  const related = FEATURED_ARTICLES.filter((a) => a.id !== article.id && a.subject === article.subject).slice(0, 3);
  
  const [authorsWithAffiliations, setAuthorsWithAffiliations] = useState<AuthorAffiliation[]>([]);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(true);

  // Fetch author affiliations from the API
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setIsLoadingAuthors(true);
        const response = await fetch(`http://localhost:8000/api/articles/${id}/authors`);
        if (response.ok) {
          const data = await response.json();
          setAuthorsWithAffiliations(data.authors || []);
        } else {
          setAuthorsWithAffiliations([]);
        }
      } catch (error) {
        setAuthorsWithAffiliations([]);
      } finally {
        setIsLoadingAuthors(false);
      }
    };

    // Fetch for any article ID
    if (id) {
      fetchAuthors();
    } else {
      setIsLoadingAuthors(false);
    }
  }, [id]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/browse/current" className="inline-flex items-center gap-1 text-[#0f2d6b] text-sm mb-6 hover:underline">
        <ChevronLeft className="w-4 h-4" /> Back to Current Issue
      </Link>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-2.5 py-0.5 bg-[#0f2d6b] text-white text-xs rounded" style={{ fontWeight: 600 }}>
                {article.type}
              </span>
              <span className="px-2.5 py-0.5 bg-[#f0f4fb] text-[#0f2d6b] text-xs rounded border border-[#0f2d6b]/10">
                {article.subject}
              </span>
            </div>

            <h1 className="text-[#0f1a2e] mb-4 leading-snug" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
              {article.title}
            </h1>

            {/* Authors with Affiliations */}
            <div className="mb-4">
              {isLoadingAuthors ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0f2d6b] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#5a6a8a] text-sm">Loading author information...</p>
                </div>
              ) : authorsWithAffiliations.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-[#0f2d6b] text-sm" style={{ fontWeight: 700 }}>Authors & Affiliations</h3>
                  
                  {/* Authors with superscript numbers */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {authorsWithAffiliations.map((author, index) => {
                        // Create a unique set of affiliations and get their indices
                        const allAffiliations = authorsWithAffiliations
                          .map(a => a.affiliation?.name || a.affiliation_text)
                          .filter(Boolean);
                        const uniqueAffiliations = [...new Set(allAffiliations)];
                        const authorAffiliationName = author.affiliation?.name || author.affiliation_text;
                        const affiliationNumber = uniqueAffiliations.indexOf(authorAffiliationName) + 1;
                        
                        return (
                          <span key={author.id} className="inline-flex items-baseline gap-1">
                            <span className="text-[#0f2d6b] text-sm font-semibold">
                              {author.name}
                            </span>
                            {affiliationNumber > 0 && (
                              <sup className="text-[#0f2d6b] text-xs font-medium">
                                {affiliationNumber}
                              </sup>
                            )}
                            {author.is_corresponding && (
                              <sup className="text-[#c9a227] text-xs font-bold">*</sup>
                            )}
                            {index < authorsWithAffiliations.length - 1 && (
                              <span className="text-[#5a6a8a] text-sm">,</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Numbered affiliations list */}
                  <div className="space-y-2">
                    {(() => {
                      const allAffiliations = authorsWithAffiliations
                        .map(a => ({
                          name: a.affiliation?.name || a.affiliation_text,
                          full: a.affiliation || { name: a.affiliation_text },
                          country: a.affiliation?.country,
                          city: a.affiliation?.city,
                          department: a.affiliation?.department
                        }))
                        .filter(aff => aff.name);
                      
                      const uniqueAffiliations = allAffiliations.filter((aff, index, self) =>
                        index === self.findIndex(a => a.name === aff.name)
                      );

                      return uniqueAffiliations.map((affiliation, index) => (
                        <div key={index} className="text-xs text-[#5a6a8a] leading-relaxed">
                          <sup className="text-[#0f2d6b] font-bold text-xs">
                            {index + 1}
                          </sup>
                          {affiliation.name}
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Corresponding author note */}
                  {authorsWithAffiliations.some(author => author.is_corresponding) && (
                    <p className="text-[10px] text-[#5a6a8a] mt-2">
                      <sup className="text-[#c9a227] font-bold">*</sup> Corresponding author
                    </p>
                  )}
                </div>
              ) : (
                // Fallback to original display
                <div>
                  <p className="text-[#0f2d6b] text-sm mb-1" style={{ fontWeight: 600 }}>
                    {article.authors.join(", ")}
                  </p>
                  <p className="text-[#5a6a8a] text-xs">{article.affiliations.join("; ")}</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#f0f4fb] rounded-xl p-4 mb-5">
              {[
                { label: "Volume", value: `Vol. ${article.volume}, No. ${article.issue}` },
                { label: "Pages", value: article.pages },
                { label: "Published", value: article.published },
                { label: "DOI", value: article.doi },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-[#5a6a8a] text-[10px] mb-0.5">{m.label}</p>
                  <p className="text-[#0f1a2e] text-xs font-mono" style={{ fontWeight: 600 }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors" style={{ fontWeight: 600 }}>
                <FileText className="w-4 h-4" /> View HTML
              </button>
              {(article.pdf_url || article.original_pdf_url) ? (
                <a 
                  href={article.pdf_url || article.original_pdf_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#c9a227] text-white rounded-lg text-sm hover:bg-[#b8911f] transition-colors" 
                  style={{ fontWeight: 600 }}
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              ) : (
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg text-sm cursor-not-allowed" 
                  style={{ fontWeight: 600 }}
                  disabled
                >
                  <Download className="w-4 h-4" /> PDF Unavailable
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors">
                <Quote className="w-4 h-4" /> Cite
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors">
                <BookmarkPlus className="w-4 h-4" /> Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-[#3a4a6a] hover:bg-[#f0f4fb] transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          {/* Graphical Abstract */}
          {article.graphical_abstract_url && (
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <h2 className="text-[#0f2d6b] mb-4" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Graphical Abstract</h2>
              <div className="flex justify-center">
                <img 
                  src={article.graphical_abstract_url} 
                  alt={`Graphical abstract for ${article.title}`}
                  className="max-w-full h-auto rounded-lg shadow-sm border border-border"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </div>
          )}

          {/* Abstract */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <h2 className="text-[#0f2d6b] mb-3" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Abstract</h2>
            <p className="text-[#3a4a6a] text-sm leading-relaxed mb-4">{article.abstract}</p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              The experimental results confirm the superior performance of the proposed approach compared to existing methods in the literature. Comprehensive characterization using XRD, SEM, TEM, and spectroscopic techniques validates the structural and compositional properties of the synthesized materials. These findings contribute to advancing the fundamental understanding and practical applications of polymers & composites in contemporary materials engineering.
            </p>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <h2 className="text-[#0f2d6b] mb-3" style={{ fontSize: "1rem", fontWeight: 700 }}>Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-[#f0f4fb] text-[#0f2d6b] text-xs rounded-full border border-[#0f2d6b]/15 hover:bg-[#0f2d6b] hover:text-white transition-colors cursor-pointer">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Citation */}
          <div className="bg-[#f0f4fb] rounded-xl border border-border p-6">
            <h2 className="text-[#0f2d6b] mb-3" style={{ fontSize: "1rem", fontWeight: 700 }}>How to Cite</h2>
            <div className="bg-white rounded-lg p-4 border border-border">
              <p className="text-[#3a4a6a] text-xs leading-relaxed font-mono">
                {article.authors.join(", ")} ({article.year}). {article.title}. <em>Advanced Materials Letters</em>, <strong>{article.volume}</strong>({article.issue}), {article.pages}. https://doi.org/{article.doi}
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              {["APA", "MLA", "BibTeX", "RIS", "EndNote"].map((fmt) => (
                <button key={fmt} className="px-3 py-1 border border-border rounded text-xs text-[#0f2d6b] bg-white hover:bg-[#0f2d6b] hover:text-white transition-colors">
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-5">
          {/* Metrics */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-[#0f2d6b] text-sm mb-4" style={{ fontWeight: 700 }}>Article Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#5a6a8a] text-xs flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Total Views</span>
                <span className="text-[#0f1a2e] text-sm" style={{ fontWeight: 700 }}>{article.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5a6a8a] text-xs flex items-center gap-1.5"><Quote className="w-3.5 h-3.5" />Citations</span>
                <span className="text-[#0f1a2e] text-sm" style={{ fontWeight: 700 }}>{article.cited}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5a6a8a] text-xs flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />Downloads</span>
                <span className="text-[#0f1a2e] text-sm" style={{ fontWeight: 700 }}>{Math.round(article.views * 0.4).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* DOI */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 700 }}>DOI & Links</h3>
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#0f2d6b] text-xs hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {article.doi}
            </a>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-[#0f2d6b] text-sm mb-4" style={{ fontWeight: 700 }}>Related Articles</h3>
              <div className="space-y-4">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/article/${rel.id}`} className="block hover:bg-[#f0f4fb] rounded-lg p-2 -mx-2 transition-colors">
                    <p className="text-[#0f1a2e] text-xs leading-snug mb-1 hover:text-[#0f2d6b]" style={{ fontWeight: 600 }}>
                      {rel.title}
                    </p>
                    <p className="text-[#5a6a8a] text-[10px]">{rel.authors[0]} et al.</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </MainLayout>
  );
}
