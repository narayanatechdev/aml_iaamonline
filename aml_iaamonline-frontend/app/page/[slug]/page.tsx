import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { sanitizePageHtml } from '@/lib/rich-text';

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  placement: string;
  position: number;
  is_published: boolean;
  updated_at: string;
}

async function fetchPage(slug: string): Promise<PageData | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    return json.data as PageData;
  } catch {
    return null;
  }
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await fetchPage(slug);

  if (!page) {
    notFound();
  }

  const safeContent = sanitizePageHtml(page.content ?? '');

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1
          className="text-3xl font-bold mb-8 text-[#0f2d6b]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {page.title}
        </h1>

        <style>{`
          .page-content h2 { font-size: 1.5rem; font-weight: 700; color: #0f2d6b; margin: 1.5rem 0 0.75rem; }
          .page-content h3 { font-size: 1.25rem; font-weight: 600; color: #0f2d6b; margin: 1.25rem 0 0.5rem; }
          .page-content h4 { font-size: 1.1rem; font-weight: 600; color: #3a4a6a; margin: 1rem 0 0.5rem; }
          .page-content p  { color: #3a4a6a; line-height: 1.75; margin: 0.75rem 0; }
          .page-content ul, .page-content ol { color: #3a4a6a; padding-left: 1.5rem; margin: 0.75rem 0; }
          .page-content li { margin: 0.25rem 0; line-height: 1.7; }
          .page-content a  { color: #0f2d6b; text-decoration: underline; }
          .page-content a:hover { color: #c9a227; }
          .page-content blockquote { border-left: 4px solid #c9a227; padding-left: 1rem; margin: 1rem 0; color: #5a6a8a; font-style: italic; }
          .page-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
          .page-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
          .page-content th, .page-content td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; color: #3a4a6a; }
          .page-content th { background: #f9fafb; font-weight: 600; color: #0f2d6b; }
        `}</style>

        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </div>
    </MainLayout>
  );
}
