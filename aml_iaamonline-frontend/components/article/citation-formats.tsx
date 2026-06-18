'use client';

import { useState, useEffect } from 'react';
import { Copy, Download, AlertCircle, Loader2 } from 'lucide-react';

interface CitationFormat {
  format: string;
  label: string;
  fileExtension: string;
}

interface CitationFormatsProps {
  articleId: string;
  articleTitle: string;
}

const FORMATS: CitationFormat[] = [
  { format: 'apa', label: 'APA', fileExtension: 'txt' },
  { format: 'mla', label: 'MLA', fileExtension: 'txt' },
  { format: 'bibtex', label: 'BibTeX', fileExtension: 'bib' },
  { format: 'ris', label: 'RIS', fileExtension: 'ris' },
  { format: 'endonote', label: 'EndNote', fileExtension: 'enw' },
];

export function CitationFormats({ articleId, articleTitle }: CitationFormatsProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('apa');
  const [citation, setCitation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCitation(selectedFormat);
  }, [selectedFormat, articleId]);

  const fetchCitation = async (format: string) => {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch(`/api/articles/${articleId}/citation?format=${format}`);

      if (!response.ok) {
        throw new Error('Failed to fetch citation');
      }

      const data = await response.json();
      setCitation(data.citation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCitation('');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy citation');
    }
  };

  const handleDownload = () => {
    const format = FORMATS.find((f) => f.format === selectedFormat);
    const extension = format?.fileExtension || 'txt';
    const filename = `citation_${articleTitle.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(citation)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-4xl">
        <h2
          className="text-2xl font-bold text-black mb-8"
          style={{
            fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif",
          }}
        >
          Cite This Article
        </h2>

        {/* Format Selection Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.format}
              onClick={() => setSelectedFormat(fmt.format)}
              className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                selectedFormat === fmt.format
                  ? 'text-black border-black'
                  : 'text-gray-600 border-transparent hover:text-black'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* Citation Display Box */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Generating citation...</span>
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Error</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative p-4 rounded-lg bg-gray-50 border border-gray-200 min-h-24">
                <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words font-mono">
                  {citation}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 text-black hover:bg-gray-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </>
          )}
        </div>

        {/* Format Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="text-xs font-semibold text-black">Citation Formats</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>
                <strong>APA:</strong> American Psychological Association format, widely used in humanities and social sciences
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>
                <strong>MLA:</strong> Modern Language Association format, common in literature and languages
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>
                <strong>BibTeX:</strong> LaTeX bibliography format, preferred by academic researchers
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>
                <strong>RIS:</strong> Research Information Systems format, compatible with most reference managers
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>
                <strong>EndNote:</strong> Clarivate EndNote format (.enw), for EndNote reference management
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
