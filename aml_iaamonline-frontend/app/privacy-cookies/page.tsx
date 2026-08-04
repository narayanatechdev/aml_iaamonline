import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function PrivacyCookiesPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Legal &amp; Privacy
          </h1>
          <p className="text-[#5a6a8a] text-sm">
            GDPR compliance, cookie usage, and terms governing access to this platform.
          </p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/privacy-policy"
            className="block border border-gray-200 rounded-lg p-5 hover:border-[#0f2d6b] transition-colors group"
          >
            <h2 className="text-[#0f2d6b] text-base font-bold mb-1 group-hover:underline">
              Privacy Policy
            </h2>
            <p className="text-[#5a6a8a] text-sm">
              How IAAM collects, uses, and protects your personal data — data controller details, lawful bases,
              retention, your GDPR rights, and how to contact us.
            </p>
          </Link>

          <Link
            href="/cookie-policy"
            className="block border border-gray-200 rounded-lg p-5 hover:border-[#0f2d6b] transition-colors group"
          >
            <h2 className="text-[#0f2d6b] text-base font-bold mb-1 group-hover:underline">
              Cookie Policy
            </h2>
            <p className="text-[#5a6a8a] text-sm">
              Which cookies and local-storage items this site uses, why, and how to manage or withdraw your consent.
            </p>
          </Link>

          <Link
            href="/terms-of-use"
            className="block border border-gray-200 rounded-lg p-5 hover:border-[#0f2d6b] transition-colors group"
          >
            <h2 className="text-[#0f2d6b] text-base font-bold mb-1 group-hover:underline">
              Terms of Use
            </h2>
            <p className="text-[#5a6a8a] text-sm">
              Site use conditions, accounts, acceptable use, intellectual property, subscription access terms,
              disclaimers, and governing law (Sweden).
            </p>
          </Link>
        </div>

        <p className="text-[#5a6a8a] text-xs mt-8">
          For any legal or data-protection enquiries, contact the IAAM editorial office at{' '}
          <a href="mailto:info@iaamonline.org" className="text-[#0f2d6b] underline">
            info@iaamonline.org
          </a>.
        </p>
      </div>
    </MainLayout>
  );
}
