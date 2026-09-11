'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Download, ExternalLink, Info, Loader2 } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { API_BASE } from '@/lib/adminAuth';

interface IssueRow {
  volume: string;
  issue: string;
  article_count: number;
  publish_date: string | null;
}

const ISSUE_FORMATS: { key: string; label: string; help: string }[] = [
  { key: 'ris', label: 'RIS', help: 'EndNote, Zotero, Mendeley' },
  { key: 'bibtex', label: 'BibTeX', help: 'LaTeX / BibTeX managers' },
  { key: 'doaj', label: 'DOAJ XML', help: "DOAJ's article schema" },
  { key: 'pubmed', label: 'PubMed XML', help: 'NLM-style structure' },
  { key: 'agris', label: 'AGRIS XML', help: 'FAO AGRIS Application Profile' },
];

export default function IndexingExportsPage() {
  const [issues, setIssues] = useState<IssueRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/export/issues`);
        if (!res.ok) throw new Error(`Failed to load issues (${res.status})`);
        setIssues((await res.json()).data ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load issues');
      }
    })();
  }, []);

  return (
    <div className="min-h-full max-w-5xl">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Content' },
          { label: 'Indexing Exports' },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Indexing Exports</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Metadata files for indexing databases, discovery services, and reference managers —
          one issue at a time. These links are public (no login required), the same way OAI-PMH
          works, since they exist to be fetched by an indexer or handed to a librarian.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-medium">Generating a file does not mean the journal is indexed there.</p>
          <p className="text-amber-800 mt-1">
            Each database below has its own application and review process. This page produces
            the file a given database would need; it does not submit it or guarantee acceptance.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 space-y-1.5">
          <p>
            <b>PubMed/MEDLINE:</b> NLM does not accept a self-submitted file from arbitrary
            journals — indexing follows an application NLM reviews. The export here is ready if a
            submission channel is later granted; it is not itself a path to indexing.
          </p>
          <p>
            <b>Agricola:</b> the US National Agricultural Library has no public self-submission
            schema — it indexes via its own cataloging process, so there is no file to generate here.
          </p>
          <p>
            <b>Summon / J-Gate / library discovery layers:</b> these ingest holdings via OAI-PMH
            harvesting (
            <a href={`${API_BASE}/oai`} target="_blank" rel="noopener noreferrer" className="underline">
              /api/oai
            </a>
            ) or a KBART holdings list — use the whole-journal KBART download below rather than a
            per-issue file.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Whole-journal holdings (KBART)</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            NISO RP-9 tab-separated format — the standard file library discovery layers ingest.
          </p>
        </div>
        <a
          href={`${API_BASE}/export/kbart`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f2d6b] text-white text-sm font-medium hover:bg-[#0d2560] transition-colors flex-shrink-0"
        >
          <Download className="w-4 h-4" /> Download KBART
        </a>
      </div>

      <h2 className="text-sm font-semibold text-gray-900 mb-3">Per-issue exports</h2>

      {error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">{error}</div>
      ) : issues === null ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm py-12 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading issues…
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-sm text-gray-500 text-center">
          No published issues with volume/issue metadata yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide bg-gray-50">
                  <th className="px-4 py-3 font-medium">Volume / Issue</th>
                  <th className="px-4 py-3 font-medium">Articles</th>
                  {ISSUE_FORMATS.map((f) => (
                    <th key={f.key} className="px-4 py-3 font-medium text-center" title={f.help}>
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.map((row) => (
                  <tr key={`${row.volume}-${row.issue}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      Vol. {row.volume}, Issue {row.issue}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{row.article_count}</td>
                    {ISSUE_FORMATS.map((f) => (
                      <td key={f.key} className="px-4 py-3 text-center">
                        <a
                          href={`${API_BASE}/export/${row.volume}/${row.issue}/${f.key}`}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-gray-400 hover:text-[#0f2d6b] hover:bg-[#0f2d6b]/5 transition-colors"
                          title={`Download ${f.label} for this issue — ${f.help}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
