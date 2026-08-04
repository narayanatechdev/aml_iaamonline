import { MainLayout } from '@/components/layout/main-layout';

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Privacy Policy
          </h1>
          <p className="text-[#5a6a8a] text-sm">
            Last updated: 27 July 2026
          </p>
        </div>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>1. Data Controller</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            The data controller for personal data processed through the Advanced Materials Letters website and
            manuscript management system is the <strong>International Association of Advanced Materials (IAAM)</strong>,
            a non-profit scientific organisation headquartered in Sweden. IAAM is subject to the General Data
            Protection Regulation (GDPR) and Swedish data-protection law.
          </p>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mt-2">
            For all data-protection enquiries, contact the IAAM editorial office at{' '}
            <a href="mailto:info@iaamonline.org" className="text-[#0f2d6b] underline">info@iaamonline.org</a>.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>2. Personal Data We Collect</h2>

          <h3 className="text-[#0f2d6b] text-sm font-semibold mb-1 mt-3">Account data</h3>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Name, institutional email address, affiliation, country, ORCID identifier, and password (stored as a
            salted hash). Collected when you create an account or update your profile.
          </p>

          <h3 className="text-[#0f2d6b] text-sm font-semibold mb-1 mt-3">Submission and peer-review data</h3>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Manuscript files, cover letters, author contribution statements, suggested reviewers, reviewer reports,
            editorial correspondence, and revision histories. This data is inherent to the scholarly publication
            process and is retained in the editorial record.
          </p>

          <h3 className="text-[#0f2d6b] text-sm font-semibold mb-1 mt-3">Usage data</h3>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            IP address, browser type, pages visited, referring URL, and timestamps. Collected automatically when you
            interact with the website. This data is used in aggregated, pseudonymous form for platform improvement.
          </p>

          <h3 className="text-[#0f2d6b] text-sm font-semibold mb-1 mt-3">Cookie data</h3>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            See our <a href="/cookie-policy" className="text-[#0f2d6b] underline">Cookie Policy</a> for a full list
            of cookies used and their purposes.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>3. Lawful Bases for Processing</h2>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>
              <strong>Performance of a contract</strong> — processing your account and manuscript submission data is
              necessary to provide the editorial and publication services you have requested (Art. 6(1)(b) GDPR).
            </li>
            <li>
              <strong>Legitimate interests</strong> — processing server logs and aggregated usage data to ensure
              platform security, detect abuse, and improve site functionality (Art. 6(1)(f) GDPR). We have assessed
              that these interests do not override your rights and freedoms.
            </li>
            <li>
              <strong>Consent</strong> — non-essential cookies (analytics, marketing) are only set after you have
              given explicit consent through the cookie-consent banner (Art. 6(1)(a) GDPR). You may withdraw consent
              at any time.
            </li>
          </ul>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>4. Retention</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Account data is retained for as long as your account remains active. If you request deletion, we will
            remove personally identifiable fields within 30 days, except where retention is required by law or by the
            integrity of the published scientific record (e.g., authorship of a published article). Editorial
            correspondence associated with a published article is retained indefinitely as part of the publication
            record. Unpublished submission data is deleted three years after a final rejection decision.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>5. Sharing and Disclosure</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            We do not sell personal data. We share data only as described below:
          </p>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li>
              <strong>CrossRef</strong> — upon publication, article metadata (title, author names, affiliations,
              abstract, and DOI) is deposited with CrossRef, a not-for-profit DOI registration agency, to enable
              citation indexing across the scholarly literature.
            </li>
            <li>
              <strong>Service providers</strong> — hosting, email delivery, and database services are provided by
              vetted third-party processors acting under data-processing agreements that bind them to GDPR standards.
            </li>
            <li>
              <strong>Legal obligation</strong> — we may disclose data when required by law, court order, or to
              protect rights, property, or safety.
            </li>
          </ul>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>6. International Transfers</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            IAAM is based in Sweden (European Economic Area). Where service providers process data outside the EEA,
            transfers are protected by the European Commission's Standard Contractual Clauses or an equivalent
            adequacy mechanism under Chapter V of the GDPR.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>7. Your GDPR Rights</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            Under the GDPR you have the following rights in relation to personal data we hold about you:
          </p>
          <ul className="text-[#3a4a6a] text-sm leading-relaxed space-y-2">
            <li><strong>Right of access</strong> — to receive a copy of the personal data we hold about you.</li>
            <li><strong>Right to rectification</strong> — to have inaccurate data corrected.</li>
            <li>
              <strong>Right to erasure</strong> — to request deletion of your data where there is no overriding
              legitimate reason for us to keep it.
            </li>
            <li>
              <strong>Right to restriction</strong> — to request that we limit processing of your data in certain
              circumstances.
            </li>
            <li>
              <strong>Right to data portability</strong> — to receive your data in a structured, machine-readable
              format where processing is based on consent or contract.
            </li>
            <li>
              <strong>Right to object</strong> — to object to processing based on legitimate interests.
            </li>
            <li>
              <strong>Right to withdraw consent</strong> — where processing is based on consent, to withdraw it at
              any time without affecting the lawfulness of prior processing.
            </li>
          </ul>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mt-3">
            To exercise any of these rights, contact the IAAM editorial office at{' '}
            <a href="mailto:info@iaamonline.org" className="text-[#0f2d6b] underline">info@iaamonline.org</a>.
            We will respond within 30 days.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>8. Right to Lodge a Complaint</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            If you believe we have processed your personal data unlawfully, you have the right to lodge a complaint
            with a supervisory authority. In Sweden the lead supervisory authority is the{' '}
            <strong>Integritetsskyddsmyndigheten (IMY)</strong>. You may also contact the supervisory authority in
            your country of residence.
          </p>
        </section>

        <section className="py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>9. Contact</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            For any privacy-related requests or questions, please contact the IAAM editorial office:
          </p>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mt-2">
            Email:{' '}
            <a href="mailto:info@iaamonline.org" className="text-[#0f2d6b] underline">info@iaamonline.org</a>
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
