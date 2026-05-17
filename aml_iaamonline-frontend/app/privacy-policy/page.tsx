import { MainLayout } from '@/components/layout/main-layout';

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Privacy Policy
          </h1>
          <p className="text-[#5a6a8a] text-sm">How we collect, use, and protect personal information.</p>
        </div>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Information We Collect</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            We may collect information you provide directly, such as contact details, account data, and manuscript
            submission details. We may also collect technical data required to operate and secure the platform.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>How We Use Information</h2>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>To provide submission, review, and publication services.</li>
            <li>To communicate editorial decisions and service updates.</li>
            <li>To maintain platform security, reliability, and compliance.</li>
          </ul>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Data Protection & GDPR</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            We follow GDPR principles including transparency, data minimization, and purpose limitation. Where
            applicable, users may request access, correction, or deletion of personal data.
          </p>
        </section>

        <section className="py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Contact</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">For privacy-related requests, contact: aml@iaamonline.org</p>
        </section>
      </div>
    </MainLayout>
  );
}
