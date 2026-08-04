import { MainLayout } from '@/components/layout/main-layout';

export default function TermsOfUsePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Terms of Use
          </h1>
          <p className="text-[#5a6a8a] text-sm">
            Last updated: 27 July 2026
          </p>
        </div>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>1. Acceptance of Terms</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            By accessing or using the Advanced Materials Letters website and any associated services (collectively,
            the "Platform"), you agree to be bound by these Terms of Use. The Platform is operated by the
            International Association of Advanced Materials (IAAM), Sweden. If you do not agree to these terms, you
            must not use the Platform.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>2. Accounts</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            To submit manuscripts or access subscriber-only content, you must create an account. You are responsible
            for:
          </p>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>Providing accurate and up-to-date registration information, including your real name and
              institutional affiliation.</li>
            <li>Keeping your login credentials confidential. You must not share your account with others or
              allow automated access to your account.</li>
            <li>Notifying us promptly at{' '}
              <a href="mailto:info@iaamonline.org" className="text-[#0f2d6b] underline">info@iaamonline.org</a>{' '}
              if you suspect unauthorised use of your account.</li>
          </ul>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mt-2">
            IAAM reserves the right to suspend or terminate accounts that breach these terms.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>3. Acceptable Use</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            You agree not to use the Platform to:
          </p>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>Upload or transmit content that is unlawful, defamatory, fraudulent, or that infringes third-party
              intellectual property rights.</li>
            <li>Engage in plagiarism, data fabrication, image manipulation, duplicate submission, or any other form
              of research misconduct.</li>
            <li>Attempt to gain unauthorised access to any part of the Platform, its servers, or related systems.</li>
            <li>Use automated scripts, bots, or crawlers to extract content or data without IAAM's prior written
              consent.</li>
            <li>Interfere with or disrupt the integrity or performance of the Platform.</li>
          </ul>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>4. Intellectual Property</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            <strong>Published articles</strong> — each article is published under the licence stated on its
            individual article page. Open-access articles published under Creative Commons licences (such as CC BY)
            may be shared and adapted subject to the terms of that licence and with appropriate attribution. Where no
            open-access licence is stated, all rights are reserved by the respective rights holders.
          </p>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            <strong>Platform content</strong> — the design, layout, branding, and editorial content of the Platform
            (excluding article text) are the intellectual property of IAAM and may not be reproduced without written
            permission.
          </p>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            <strong>Submitted manuscripts</strong> — authors retain copyright in submitted work until a licence or
            copyright transfer agreement is executed as part of the acceptance process.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>5. Subscription and Membership Access</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            Access to certain content and features requires an active IAAM membership or institutional subscription.
            The following conditions apply to all subscribers and members:
          </p>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>Access is granted to the individual subscriber or, for institutional accounts, to authorised users
              within the subscribing organisation.</li>
            <li>You may download and print articles for personal, research, or educational use consistent with fair
              dealing and your licence tier.</li>
            <li>Resale, redistribution, or systematic bulk downloading of content is strictly prohibited. Automated
              harvesting that exceeds normal reading behaviour will result in account suspension.</li>
            <li>Subscription fees are published on the IAAM membership pages. IAAM does not charge article
              processing charges (APC) to authors — there are no author fees.</li>
            <li>Access continues for the duration of your active subscription or membership period. IAAM reserves
              the right to withdraw access if terms are breached.</li>
          </ul>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>6. Disclaimers</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            The Platform and its content are provided on an "as is" and "as available" basis. IAAM makes no
            warranties, express or implied, including warranties of merchantability, fitness for a particular
            purpose, or non-infringement.
          </p>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Scientific articles published on the Platform represent the views of the named authors and do not
            necessarily reflect the views of IAAM or its editorial board. IAAM does not guarantee the accuracy,
            completeness, or currentness of any published content.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>7. Limitation of Liability</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            To the fullest extent permitted by applicable law, IAAM shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from your use of or inability to use the Platform,
            even if IAAM has been advised of the possibility of such damages. Nothing in these terms limits
            liability that cannot be excluded under Swedish or EU law.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>8. Governing Law</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            These Terms of Use are governed by and construed in accordance with the laws of Sweden, without regard
            to its conflict-of-law principles. Disputes shall be subject to the exclusive jurisdiction of the courts
            of Sweden, unless mandatory consumer-protection law in your country of residence requires otherwise.
          </p>
        </section>

        <section className="py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>9. Changes to These Terms</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            IAAM may update these Terms of Use from time to time. Material changes will be notified by posting a
            revised version on this page with an updated "Last updated" date. Continued use of the Platform after
            such changes constitutes your acceptance of the revised terms. For questions, contact the IAAM editorial
            office at{' '}
            <a href="mailto:info@iaamonline.org" className="text-[#0f2d6b] underline">info@iaamonline.org</a>.
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
