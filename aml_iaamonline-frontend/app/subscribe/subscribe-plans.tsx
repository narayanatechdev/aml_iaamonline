'use client';

import { useState } from 'react';
import { CheckCircle, FileText, Users, Loader2, Mail } from 'lucide-react';
import { isAuthenticated as isUserAuthenticated, getToken as getUserToken } from '@/lib/userAuth';
import { isAuthenticated as isAdminAuthenticated, getToken as getAdminToken } from '@/lib/adminAuth';

export interface Plan {
  key: string;
  name: string;
  audience: 'individual' | 'institutional';
  price: number;
  currency: string;
  period: 'year' | 'month';
  description: string;
  benefits: string[];
  featured: boolean;
}

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function SubscribePlans({ plans, contact }: { plans: Plan[]; contact: string }) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (plan: Plan) => {
    setError(null);

    if (!isUserAuthenticated() && !isAdminAuthenticated()) {
      window.location.href = '/account/login?next=/subscribe';
      return;
    }

    setPending(plan.key);
    try {
      const token = getUserToken() || getAdminToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/subscription`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_key: plan.key }),
      });
      const json = await res.json();

      if (!res.ok || !json?.data?.checkout_url) {
        setError(
          json?.message ||
            `We could not start the checkout. Please write to ${contact} and we will set your subscription up.`
        );
        return;
      }

      window.location.href = json.data.checkout_url;
    } catch {
      setError(`We could not reach the payment service. Please write to ${contact}.`);
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 max-w-4xl mx-auto text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`bg-white rounded-xl p-8 flex flex-col ${
              plan.featured ? 'border-2 border-[#0f2d6b] shadow-lg relative' : 'border border-gray-200'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a227] text-white text-xs font-bold px-3 py-1 rounded-full">
                Recommended
              </span>
            )}
            <div className="flex items-center gap-2 mb-1">
              {plan.audience === 'institutional' ? (
                <Users className="w-5 h-5 text-[#0f2d6b]" />
              ) : (
                <FileText className="w-5 h-5 text-[#0f2d6b]" />
              )}
              <h3 className="text-lg font-bold text-[#0f2d6b]">{plan.name}</h3>
            </div>
            {plan.description && <p className="text-sm text-gray-600 mb-4">{plan.description}</p>}
            <div className="mb-5">
              <span className="text-4xl font-bold text-gray-900">{money(plan.price, plan.currency)}</span>
              <span className="text-gray-500 text-sm"> / {plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            {/* Institutional licences are quoted and invoiced, not bought online. */}
            {plan.audience === 'institutional' ? (
              <a
                href={`mailto:${contact}?subject=${encodeURIComponent(`AML subscription enquiry: ${plan.name}`)}`}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.featured
                    ? 'bg-[#0f2d6b] text-white hover:bg-[#0d2560]'
                    : 'border border-[#0f2d6b] text-[#0f2d6b] hover:bg-[#0f2d6b]/5'
                }`}
              >
                <Mail className="w-4 h-4" /> Request a quote
              </a>
            ) : (
              <button
                onClick={() => subscribe(plan)}
                disabled={pending !== null}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors ${
                  plan.featured
                    ? 'bg-[#0f2d6b] text-white hover:bg-[#0d2560]'
                    : 'border border-[#0f2d6b] text-[#0f2d6b] hover:bg-[#0f2d6b]/5'
                }`}
              >
                {pending === plan.key && <Loader2 className="w-4 h-4 animate-spin" />}
                Subscribe
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
