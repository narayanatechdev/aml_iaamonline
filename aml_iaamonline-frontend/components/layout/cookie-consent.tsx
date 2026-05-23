'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const CONSENT_KEY = 'aml_cookie_consent';
const PREFS_KEY = 'aml_cookie_preferences';

type CookiePrefs = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const storedPrefs = localStorage.getItem(PREFS_KEY);

    if (storedPrefs) {
      try {
        const parsed = JSON.parse(storedPrefs) as CookiePrefs;
        setPrefs({
          necessary: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        });
      } catch {
        // ignore bad stored data
      }
    }

    if (storedConsent !== 'accepted') {
      setVisible(true);
    }
  }, []);

  function persistConsent(state: 'accepted' | 'rejected', nextPrefs: CookiePrefs) {
    localStorage.setItem(CONSENT_KEY, state);
    localStorage.setItem(PREFS_KEY, JSON.stringify(nextPrefs));
    document.cookie = `aml_cookie_consent=${state}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `aml_cookie_prefs=${encodeURIComponent(JSON.stringify(nextPrefs))}; path=/; max-age=31536000; SameSite=Lax`;
  }

  function handleAccept() {
    const nextPrefs: CookiePrefs = { necessary: true, analytics: true, marketing: true };
    setPrefs(nextPrefs);
    persistConsent('accepted', nextPrefs);
    setVisible(false);
  }

  function handleReject() {
    const nextPrefs: CookiePrefs = { necessary: true, analytics: false, marketing: false };
    setPrefs(nextPrefs);
    persistConsent('rejected', nextPrefs);
    setVisible(false);
  }

  function handleSavePreferences() {
    const state = prefs.analytics || prefs.marketing ? 'accepted' : 'rejected';
    persistConsent(state, prefs);
    setShowPreferences(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[#0f2d6b]/20 bg-[#003a57] p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-white text-2xl mb-4" style={{ fontWeight: 700 }}>Your privacy, your choice</h3>
          <p className="text-white/90 text-sm leading-relaxed mb-3">
            We use essential cookies to make sure the site can function. We also use optional cookies for analytics and communications.
          </p>
          <p className="text-white/90 text-sm leading-relaxed mb-4">
            By accepting optional cookies, you consent to processing of your data for these purposes.
          </p>
          <p className="text-white/95 text-sm mb-2">
            See our{' '}
            <Link href="/privacy-policy" className="underline underline-offset-2">privacy policy</Link>
            {' '}and{' '}
            <Link href="/cookie-policy" className="underline underline-offset-2">cookie policy</Link>.
          </p>
          <button
            onClick={() => setShowPreferences(true)}
            className="text-white text-sm underline underline-offset-2 mb-5"
          >
            Manage preferences
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAccept}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-[#005b8f] text-sm rounded-full hover:bg-[#f0f4fb] transition-colors"
              style={{ fontWeight: 700 }}
            >
              Accept all cookies
            </button>
            <button
              onClick={handleReject}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-[#005b8f] text-sm rounded-full hover:bg-[#f0f4fb] transition-colors"
              style={{ fontWeight: 700 }}
            >
              Reject optional cookies
            </button>
          </div>
        </div>
      </div>

      {showPreferences && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white border border-gray-200 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl text-[#0f1a2e]" style={{ fontWeight: 700 }}>Manage your cookie preferences</h3>
              <button onClick={() => setShowPreferences(false)} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              <div className="border-b border-gray-200 pb-5">
                <h4 className="text-xl text-[#0f1a2e] mb-2" style={{ fontWeight: 700 }}>Cookies that are strictly necessary</h4>
                <p className="text-[#1a1a1a] text-sm leading-relaxed mb-3">These cookies are required for basic platform functionality and cannot be switched off.</p>
                <p className="text-[#0f1a2e] text-sm" style={{ fontWeight: 700 }}>Always on</p>
              </div>

              <div className="border-b border-gray-200 pb-5">
                <h4 className="text-xl text-[#0f1a2e] mb-2" style={{ fontWeight: 700 }}>Cookies that measure website use</h4>
                <p className="text-[#1a1a1a] text-sm leading-relaxed mb-3">These cookies help us understand site usage and improve performance.</p>
                <label className="inline-flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  />
                  {prefs.analytics ? 'On' : 'Off'}
                </label>
              </div>

              <div className="border-b border-gray-200 pb-5">
                <h4 className="text-xl text-[#0f1a2e] mb-2" style={{ fontWeight: 700 }}>Cookies that help with communications and marketing</h4>
                <p className="text-[#1a1a1a] text-sm leading-relaxed mb-3">These cookies may be used for content personalization and communications effectiveness.</p>
                <label className="inline-flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={prefs.marketing}
                    onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                  />
                  {prefs.marketing ? 'On' : 'Off'}
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap gap-3">
              <button
                onClick={handleAccept}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#0b6791] text-white text-sm rounded-full"
                style={{ fontWeight: 700 }}
              >
                Accept all cookies
              </button>
              <button
                onClick={handleReject}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#0b6791] text-white text-sm rounded-full"
                style={{ fontWeight: 700 }}
              >
                Reject optional cookies
              </button>
              <button
                onClick={handleSavePreferences}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#0b6791] text-white text-sm rounded-full"
                style={{ fontWeight: 700 }}
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
