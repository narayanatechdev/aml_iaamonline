import { MainLayout } from '@/components/layout/main-layout';

export default function TermsOfUsePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Terms of Use
          </h1>
          <p className="text-[#5a6a8a] text-sm">Terms governing access to and use of this platform.</p>
        </div>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Acceptance of Terms</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            By using this platform, you agree to comply with these terms and all applicable laws and regulations.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>User Responsibilities</h2>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>Provide accurate submission and profile information.</li>
            <li>Respect intellectual property and publication ethics.</li>
            <li>Avoid misuse, unauthorized access, or harmful activities.</li>
          </ul>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Intellectual Property</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Content on this platform is protected by applicable intellectual property laws. Use of published content is
            subject to license terms stated for each article.
          </p>
        </section>

        <section className="py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Changes to Terms</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            We may update these terms periodically. Continued use of the platform after updates constitutes acceptance of
            the revised terms.
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
