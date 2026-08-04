/**
 * Rich-text utilities for Advanced Materials Letters.
 *
 * All functions run safely on the server — no DOMParser, no browser globals.
 * Allowed inline formatting: b, strong, i, em, sub, sup, br.
 * Everything else is stripped (tags removed, inner text preserved).
 * Script/style blocks are removed entirely (content too).
 */

const ALLOWED_TAGS = new Set(['b', 'strong', 'i', 'em', 'sub', 'sup', 'br']);

/**
 * Sanitize rich HTML to only allow safe inline formatting tags.
 * Strips all attributes, event handlers, and non-allowed elements.
 * Removes <script> and <style> blocks including their content.
 * Safe to run on the server (regex-only, no DOM).
 */
export function sanitizeRichText(html: string): string {
  if (!html) return '';

  // Remove script/style blocks entirely (tags + content)
  let out = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  // Process remaining tags: keep allowed tags (attributes stripped), drop others
  out = out.replace(/<\/?[a-zA-Z][^>]*>/g, (match) => {
    const tagMatch = /^<\/?([a-zA-Z][a-zA-Z0-9]*)/.exec(match);
    if (!tagMatch) return '';
    const tag = tagMatch[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return ''; // remove tag, inner text survives
    if (tag === 'br') return '<br>';
    return match.startsWith('</') ? `</${tag}>` : `<${tag}>`;
  });

  return out;
}

const PAGE_ALLOWED_TAGS = new Set([
  'h2','h3','h4','p','ul','ol','li','a','br','hr',
  'blockquote','b','strong','i','em','sub','sup',
  'table','thead','tbody','tr','th','td',
]);

/**
 * Sanitize full-page HTML content.
 * Allowed block/inline tags: h2–h4, p, ul, ol, li, a, br, hr, blockquote,
 * b, strong, i, em, sub, sup, table, thead, tbody, tr, th, td.
 * Strips all attributes EXCEPT href on <a>; only keeps href values that start
 * with http://, https://, mailto:, / or #. Adds rel="noopener" target="_blank"
 * to absolute http(s) links. Safe to run on the server (regex-only, no DOM).
 */
export function sanitizePageHtml(html: string): string {
  if (!html) return '';

  // Remove script/style blocks entirely (tags + content)
  let out = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  out = out.replace(/<\/?[a-zA-Z][^>]*>/g, (match) => {
    const tagMatch = /^<\/?([a-zA-Z][a-zA-Z0-9]*)/.exec(match);
    if (!tagMatch) return '';
    const tag = tagMatch[1].toLowerCase();
    if (!PAGE_ALLOWED_TAGS.has(tag)) return '';
    if (match.startsWith('</')) return `</${tag}>`;
    // Void/self-closing elements
    if (tag === 'br') return '<br>';
    if (tag === 'hr') return '<hr>';
    // Anchor: keep a validated href only
    if (tag === 'a') {
      const hrefMatch = /href\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/i.exec(match);
      const raw = hrefMatch ? (hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '') : '';
      const safe = /^(https?:\/\/|mailto:|\/|#)/.test(raw) ? raw : '';
      if (!safe) return '<a>';
      if (/^https?:\/\//.test(safe)) {
        return `<a href="${safe}" rel="noopener" target="_blank">`;
      }
      return `<a href="${safe}">`;
    }
    return `<${tag}>`;
  });

  return out;
}

/**
 * Strip all HTML tags and decode basic HTML entities.
 * Use for <title>, meta tags, aria labels, and alt attributes.
 */
export function richTextToPlain(html: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, code: string) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .trim();
}
