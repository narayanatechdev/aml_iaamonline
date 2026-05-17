import { MainLayout } from '@/components/layout/main-layout';

export default function PrivacyCookiesPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            GDPR & Cookies
          </h1>
          <p className="text-[#5a6a8a] text-sm">
            How we use cookies and how we handle personal data under GDPR principles.
          </p>
        </div>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>
            What is GDPR?
          </h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            GDPR (General Data Protection Regulation) is a European data protection law. It gives users rights over
            their personal data, including transparency, access, correction, and deletion where applicable.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>
            What are cookies?
          </h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Cookies are small text files stored in your browser. They help websites remember settings, keep sessions
            active, and improve overall user experience.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>
            How this platform uses cookies
          </h2>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>We store your cookie consent choice (`accepted` or `rejected`).</li>
            <li>Essential site functions may use technical cookies required for operation.</li>
            <li>We do not ask for non-essential cookies without consent.</li>
          </ul>
        </section>

        <section className="py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>
            Your choices
          </h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            You can accept or reject cookie consent from the consent banner. You can also clear cookies in your
            browser settings at any time.
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
