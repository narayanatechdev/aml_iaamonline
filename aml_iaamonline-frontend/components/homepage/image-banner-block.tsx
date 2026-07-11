'use client';

interface ImageBannerBlockProps {
  content?: {
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
}

/**
 * Full-width image banner with optional overlaid title/subtitle and a CTA.
 * Recommended image: 1600 x 600 (landscape), WebP/JPG.
 */
export function ImageBannerBlock({ content = {} }: ImageBannerBlockProps) {
  const { imageUrl, title, subtitle, ctaLabel, ctaHref } = content;

  if (!imageUrl && !title) return null;

  return (
    <section className="relative border-b border-gray-200">
      <div className="relative h-64 md:h-80 overflow-hidden bg-gray-900">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title || 'Banner'} className="w-full h-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {title && <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h2>}
          {subtitle && <p className="text-lg text-gray-100 mb-6 max-w-2xl">{subtitle}</p>}
          {ctaLabel && ctaHref && (
            <a
              href={ctaHref}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition-colors"
            >
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
