import { sanitizeRichText } from '@/lib/rich-text';

type Tag = 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';

interface RichTextProps {
  html: string;
  className?: string;
  as?: Tag;
}

/**
 * Renders sanitized rich HTML inline.
 * Only b, strong, i, em, sub, sup, br are allowed through.
 * Safe to use with user-provided content.
 */
export function RichText({ html, className, as: Tag = 'span' }: RichTextProps) {
  const safe = sanitizeRichText(html ?? '');
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
}
