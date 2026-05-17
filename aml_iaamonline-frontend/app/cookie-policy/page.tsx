import { MainLayout } from '@/components/layout/main-layout';

export default function CookiePolicyPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Cookie Policy
          </h1>
          <p className="text-[#5a6a8a] text-sm">How cookies are used on this platform and your choices.</p>
        </div>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>What Are Cookies</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Cookies are small text files saved in your browser to remember preferences, session states, and consent
            choices.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Cookies We Use</h2>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>Essential cookies to keep core platform features working.</li>
            <li>Consent cookie to remember your Accept/Reject preference.</li>
          </ul>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Your Choices</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            You can accept or reject cookies from the consent banner and can clear cookies later from browser settings.
          </p>
        </section>

        <section className="py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-2" style={{ fontWeight: 700 }}>Contact</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">For cookie-related questions, contact: aml@iaamonline.org</p>
        </section>
      </div>
    </MainLayout>
  );
}
