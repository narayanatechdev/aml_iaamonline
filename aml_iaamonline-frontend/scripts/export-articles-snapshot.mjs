#!/usr/bin/env node
/**
 * Exports a journal's published articles from its own API into the JSON
 * shape lib/realData.ts reads (same fields as lib/articles_data.json).
 *
 *   node scripts/export-articles-snapshot.mjs https://ampjournal.iaamonline.org/api lib/journal-data/amp-articles.json
 *
 * Re-run and commit the output whenever the journal publishes new articles.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [apiUrl, outFile] = process.argv.slice(2);

if (!apiUrl || !outFile) {
  console.error('Usage: export-articles-snapshot.mjs <api-base-url> <out-file>');
  process.exit(1);
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

const keywordList = (raw) =>
  String(raw ?? '')
    .split(/[,،]+/)
    .map((k) => k.trim())
    .filter(Boolean);

const authorName = (a) => {
  const first = a.first_name ?? a.firstName ?? '';
  const last = a.last_name ?? a.lastName ?? '';
  if (first || last) return { firstName: first, lastName: last, affiliations: [] };
  const [firstName = '', ...rest] = String(a.name ?? '').trim().split(/\s+/);
  return { firstName, lastName: rest.join(' '), affiliations: [] };
};

const list = [];
for (let page = 1, last = 1; page <= last; page++) {
  const body = await getJson(`${apiUrl}/articles?per_page=100&page=${page}`);
  last = body.last_page ?? 1;
  list.push(...body.data);
}

async function authorsFor(article) {
  try {
    const body = await getJson(`${apiUrl}/articles/${article.legacy_id ?? article.id}/authors`);
    return (body.authors ?? []).map(authorName);
  } catch {
    return [];
  }
}

const withAuthors = [];
for (let i = 0; i < list.length; i += 8) {
  const batch = list.slice(i, i + 8);
  const authors = await Promise.all(batch.map(authorsFor));
  batch.forEach((article, j) => withAuthors.push({ article, authors: authors[j] }));
}

const day = (value) => (value ? String(value).slice(0, 10) : undefined);

const snapshot = withAuthors
  .map(({ article: a, authors }) => ({
    id: String(a.legacy_id ?? a.id),
    type: a.document_type ?? a.article_type ?? 'Research Article',
    title: a.title,
    authors,
    affiliations: [],
    abstract: a.abstract ?? '',
    subject: a.subject ?? 'Materials Science',
    published: day(a.publish_date) ?? `${a.publish_year ?? a.year}-01-01`,
    year: Number(a.year ?? a.publish_year),
    volume: String(a.volume ?? ''),
    issue: String(a.issue ?? ''),
    doi: a.doi ?? '',
    pages: a.pages ?? '',
    views: a.views_count ?? a.total_views ?? 0,
    cited: a.cited_count ?? a.total_citations ?? 0,
    keywords: keywordList(a.keywords),
    pdf_url: a.pdf_url ?? undefined,
    original_pdf_url: a.original_pdf_url ?? undefined,
    graphical_abstract_url: a.graphical_abstract_url ?? undefined,
    pdf_downloads: a.pdf_downloads ?? a.total_downloads ?? 0,
    language: /^en/i.test(a.language ?? '') ? 'EN' : (a.language ?? 'EN'),
    receive_date: day(a.receive_date),
    accept_date: day(a.accept_date),
    corresponding_author: a.corresponding_author ?? undefined,
  }))
  .sort((x, y) => y.published.localeCompare(x.published));

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(snapshot));

const latest = snapshot[0];
console.log(
  `Wrote ${snapshot.length} articles to ${outFile} ` +
    `(${snapshot.filter((s) => s.authors.length).length} with authors). ` +
    `Latest: vol ${latest?.volume} issue ${latest?.issue} (${latest?.year}).`,
);
