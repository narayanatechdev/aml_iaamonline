import type { Metadata } from 'next';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CheckCircle, FileText, Users, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Subscriptions & Fees',
  description:
    'Subscription plans and per-article fees for Advanced Materials Letters. Authors are never charged — reading access is funded through IAAM membership and subscriptions.',
};

interface Plan {
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

interface Tier {
  key: string;
  label: string;
  daily_limit: number;
  monthly_limit: number;
}

interface AccessModel {
  tiers: Tier[];
  plans: Plan[];
  article_price: number;
  currency: string;
  contact_email: string;
}

async function fetchAccessModel(): Promise<AccessModel | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/access-model`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()).data as AccessModel;
  } catch {
    return null;
  }
}

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export default async function SubscribePage() {
  const model = await fetchAccessModel();
  const plans = model?.plans ?? [];
  const contact = model?.contact_email || 'aml@iaamonline.org';

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Subscriptions & Fees' }]} className="mb-6" />
          <h1 className="text-3xl font-bold mb-4">Subscriptions &amp; Fees</h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Advanced Materials Letters is funded by readers, not authors. Choose the access route
            that fits you — IAAM membership, a subscription, or a single article.
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* No author fees banner */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-10 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-emerald-900">Authors are never charged</h2>
              <p className="text-sm text-emerald-800">
                No article processing charges, no submission fees, no publication fees — publishing
                in AML is free for authors.
              </p>
            </div>
          </div>

          {/* Subscription plans */}
          {plans.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`bg-white rounded-xl p-8 flex flex-col ${
                    plan.featured
                      ? 'border-2 border-[#0f2d6b] shadow-lg relative'
                      : 'border border-gray-200'
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
                  {plan.description && (
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  )}
                  <div className="mb-5">
                    <span className="text-4xl font-bold text-gray-900">
                      {money(plan.price, plan.currency)}
                    </span>
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
                  <a
                    href={`mailto:${contact}?subject=${encodeURIComponent(`AML subscription enquiry: ${plan.name}`)}`}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      plan.featured
                        ? 'bg-[#0f2d6b] text-white hover:bg-[#0d2560]'
                        : 'border border-[#0f2d6b] text-[#0f2d6b] hover:bg-[#0f2d6b]/5'
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Subscribe — contact us
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Per-article + membership routes */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-bold text-[#0f2d6b] mb-1">Single article</h3>
              <p className="text-sm text-gray-600 mb-4">
                Purchase permanent access to one article — no subscription needed.
              </p>
              <div className="mb-5">
                <span className="text-4xl font-bold text-gray-900">
                  {model ? money(model.article_price, model.currency) : '—'}
                </span>
                <span className="text-gray-500 text-sm"> / article</span>
              </div>
              <p className="text-sm text-gray-600">
                Available from any article page — browse the{' '}
                <Link href="/browse/current" className="text-[#0f2d6b] underline">
                  current issue
                </Link>{' '}
                to get started.
              </p>
            </div>

            <div className="bg-[#0f2d6b] rounded-xl p-8 text-white">
              <h3 className="text-lg font-bold mb-1">IAAM members read with their membership</h3>
              <p className="text-sm text-white/80 mb-4">
                Every IAAM membership includes an article access allowance — no separate
                subscription needed.
              </p>
              <ul className="space-y-1.5 mb-6 text-sm text-white/90">
                {(model?.tiers ?? []).slice(0, 5).map((tier) => (
                  <li key={tier.key} className="flex justify-between gap-4 border-b border-white/10 pb-1.5">
                    <span>{tier.label}</span>
                    <span className="text-white/70">{tier.monthly_limit} articles / month</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/access-model"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white text-[#0f2d6b] text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                How access works
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            Questions about subscriptions or institutional licensing? Write to{' '}
            <a href={`mailto:${contact}`} className="text-[#0f2d6b] underline">
              {contact}
            </a>
            .
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
