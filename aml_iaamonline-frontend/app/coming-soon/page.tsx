import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Advanced Materials Letters — Coming Soon',
  description:
    'The new home of Advanced Materials Letters is under construction. The full journal platform will be available here soon.',
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fd] text-[#0f1a2e] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-br from-[#0f2d6b] to-[#0d2560] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AML</span>
          </div>

          <p className="text-xs tracking-[0.3em] uppercase text-[#5a6a8a] mb-6">
            International Association of Advanced Materials
          </p>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-[#0f2d6b] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Advanced Materials Letters
          </h1>

          <div className="w-16 h-[3px] bg-[#c9a227] mx-auto mb-6" />

          <p className="text-lg sm:text-xl text-[#0f1a2e] mb-4">
            Our new journal platform is coming soon.
          </p>
          <p className="text-sm text-[#5a6a8a] max-w-md mx-auto leading-relaxed">
            We are preparing a new home for the journal, including the complete
            article archive from 2010 onwards. In the meantime, the current site
            remains available at{' '}
            <a
              href="https://aml.iaamonline.org"
              className="text-[#0f2d6b] underline underline-offset-4 hover:text-[#c9a227] transition-colors"
            >
              aml.iaamonline.org
            </a>
            .
          </p>

          <p className="text-sm text-[#5a6a8a] mt-8">
            Already have an account?{' '}
            <Link
              href="/account/login"
              className="text-[#0f2d6b] font-medium underline underline-offset-4 hover:text-[#c9a227] transition-colors"
            >
              Sign in
            </Link>{' '}
            to preview the new site.
          </p>
        </div>
      </div>

      <footer className="px-6 py-6 text-center text-xs text-[#5a6a8a]">
        <p>© {new Date().getFullYear()} International Association of Advanced Materials (IAAM)</p>
        <p className="mt-2">
          <Link
            href="/admin/login"
            className="opacity-50 hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
          >
            Administrator sign in
          </Link>
        </p>
      </footer>
    </main>
  );
}
