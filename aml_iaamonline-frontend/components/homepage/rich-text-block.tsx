'use client';

interface RichTextBlockProps {
  content?: {
    heading?: string;
    body?: string;
    align?: 'left' | 'center';
    background?: string;
  };
}

/**
 * Simple editable text block for the homepage builder. Renders a heading and a
 * paragraph body; both are optional so editors can use it flexibly.
 */
export function RichTextBlock({ content = {} }: RichTextBlockProps) {
  const { heading, body, align = 'left', background } = content;

  if (!heading && !body) return null;

  return (
    <section className="py-12 border-b border-gray-200" style={background ? { backgroundColor: background } : undefined}>
      <div className={`max-w-7xl mx-auto px-6 ${align === 'center' ? 'text-center' : ''}`}>
        {heading && (
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
        )}
        {body && (
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {body}
          </div>
        )}
      </div>
    </section>
  );
}
