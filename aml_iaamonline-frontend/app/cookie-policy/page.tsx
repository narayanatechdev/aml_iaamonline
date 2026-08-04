import { MainLayout } from '@/components/layout/main-layout';

export default function CookiePolicyPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Cookie Policy
          </h1>
          <p className="text-[#5a6a8a] text-sm">
            Last updated: 27 July 2026
          </p>
        </div>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>What Are Cookies?</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Cookies are small text files that a website places in your browser or device storage when you visit. They
            serve functions such as keeping you logged in, remembering your preferences, and helping site operators
            understand how their site is used. Local storage items work similarly but are stored in your browser's
            local storage rather than as traditional cookies.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>Cookies and Storage Items We Use</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-4">
            We categorise the cookies and storage items used on this site as follows.
          </p>

          <h3 className="text-[#0f2d6b] text-sm font-semibold mb-3">Strictly Necessary</h3>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">
            These items are essential for the site to function and cannot be switched off. They are set in response
            to actions you take, such as logging in. No consent is required for these.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs text-[#3a4a6a] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-[#0f2d6b]">Name</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-[#0f2d6b]">Type</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-[#0f2d6b]">Purpose</th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-[#0f2d6b]">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 font-mono">user_token</td>
                  <td className="border border-gray-200 px-3 py-2">Local storage</td>
                  <td className="border border-gray-200 px-3 py-2">Stores the authenticated user session token to keep you logged in as a reader or author.</td>
                  <td className="border border-gray-200 px-3 py-2">Until sign-out or browser storage cleared</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 font-mono">admin_token</td>
                  <td className="border border-gray-200 px-3 py-2">Local storage</td>
                  <td className="border border-gray-200 px-3 py-2">Stores the administrative session token for editorial and admin staff.</td>
                  <td className="border border-gray-200 px-3 py-2">Until sign-out or browser storage cleared</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 font-mono">aml_user_preview</td>
                  <td className="border border-gray-200 px-3 py-2">Cookie</td>
                  <td className="border border-gray-200 px-3 py-2">Enables preview mode for authenticated users reviewing content before publication.</td>
                  <td className="border border-gray-200 px-3 py-2">Session (expires when browser is closed)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 font-mono">aml_admin_preview</td>
                  <td className="border border-gray-200 px-3 py-2">Cookie</td>
                  <td className="border border-gray-200 px-3 py-2">Enables editorial preview mode for admin staff to check layout and content before publishing.</td>
                  <td className="border border-gray-200 px-3 py-2">Session (expires when browser is closed)</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 font-mono">aml_cookie_consent</td>
                  <td className="border border-gray-200 px-3 py-2">Cookie</td>
                  <td className="border border-gray-200 px-3 py-2">Stores your cookie consent preference (accepted or rejected) so the banner is not shown on every page.</td>
                  <td className="border border-gray-200 px-3 py-2">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-[#0f2d6b] text-sm font-semibold mb-3 mt-5">Analytics Cookies (Optional — consent required)</h3>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">
            If you accept analytics cookies via the consent banner, we may use third-party analytics services to
            understand how visitors use the site (e.g., which articles are most read, which pages generate errors).
            These cookies collect data in a pseudonymous, aggregated form and do not identify you personally.
          </p>

          <h3 className="text-[#0f2d6b] text-sm font-semibold mb-3 mt-5">Marketing / Tracking Cookies (Optional — consent required)</h3>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            We do not currently deploy marketing or tracking cookies. Should we introduce them in the future, they
            will only be set with your prior explicit consent via the cookie-consent banner, and this policy will be
            updated accordingly.
          </p>
        </section>

        <section className="border-b border-gray-200 py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>How to Manage and Withdraw Consent</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            <strong>Consent banner</strong> — when you first visit the site, a banner allows you to accept or reject
            optional cookies. You can re-open your preferences at any time by clearing the{' '}
            <span className="font-mono text-xs bg-gray-100 px-1 rounded">aml_cookie_consent</span> cookie and
            refreshing the page.
          </p>
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-2">
            <strong>Browser settings</strong> — all major browsers let you view, block, and delete cookies and clear
            local storage. Consult your browser's help documentation for instructions. Note that blocking strictly
            necessary cookies will prevent you from logging in or using account features.
          </p>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Withdrawing consent for optional cookies does not affect the lawfulness of processing based on consent
            before its withdrawal.
          </p>
        </section>

        <section className="py-5">
          <h2 className="text-[#0f2d6b] text-lg mb-3" style={{ fontWeight: 700 }}>Contact</h2>
          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            For questions about cookies or data protection, contact the IAAM editorial office at{' '}
            <a href="mailto:info@iaamonline.org" className="text-[#0f2d6b] underline">info@iaamonline.org</a>.
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
