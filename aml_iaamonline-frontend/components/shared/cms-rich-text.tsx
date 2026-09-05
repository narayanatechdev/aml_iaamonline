import { sanitizePageHtml } from '@/lib/rich-text';

/**
 * Renders a CMS field that may contain rich text (HTML from the dashboard's
 * rich text editor) or plain text (seeded/legacy values). Plain values render
 * as a normal paragraph; HTML is sanitized and rendered with the same wrapper
 * classes so typography stays consistent with the design.
 */
export function CmsRichText({ value, className }: { value: string; className?: string }) {
  const v = value ?? '';
  if (v.trim() === '') return null;
  if (!/<[a-z][\s\S]*>/i.test(v)) {
    return <p className={className}>{v}</p>;
  }
  return (
    <div
      className={`cms-rich ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: sanitizePageHtml(v) }}
    />
  );
}
