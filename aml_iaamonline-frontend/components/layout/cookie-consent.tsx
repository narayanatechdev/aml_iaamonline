'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'aml_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (storedConsent !== 'accepted') {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    document.cookie = 'aml_cookie_consent=accepted; path=/; max-age=31536000; SameSite=Lax';
    setVisible(false);
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    document.cookie = 'aml_cookie_consent=rejected; path=/; max-age=31536000; SameSite=Lax';
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-gray-200 bg-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-[#0f1a2e] leading-relaxed">
          This platform uses cookies and is GDPR compliant. Please accept cookies to continue using all features.
          {' '}
          <Link href="/privacy-cookies" className="text-[#0f2d6b] underline underline-offset-2">
            What are GDPR & Cookies?
          </Link>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReject}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-[#0f2d6b] text-sm hover:bg-gray-50 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0f2d6b] text-white text-sm hover:bg-[#0d2560] transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
