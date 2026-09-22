import type { Metadata } from 'next';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { BookOpen, Users, CreditCard, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Access Model',
  description:
    'How to read Advanced Materials Letters: article access through IAAM membership categories or subscription. The journal never charges authors a fee.',
};

interface AccessTier {
  key: string;
  label: string;
  daily_limit: number;
  monthly_limit: number;
}

interface AccessModel {
  tiers: AccessTier[];
  free_until_volume: number;
  free_until_year: number;
  article_price: number;
  currency: string;
}

const FALLBACK_TIERS: AccessTier[] = [
  { key: 'regular', label: 'Regular Member', daily_limit: 5, monthly_limit: 100 },
  { key: 'fellow', label: 'Fellow Member', daily_limit: 10, monthly_limit: 200 },
  { key: 'distinguished', label: 'Distinguished Fellow', daily_limit: 15, monthly_limit: 300 },
  { key: 'industry', label: 'Industry Member', daily_limit: 15, monthly_limit: 300 },
  { key: 'institutional', label: 'Institutional Member', daily_limit: 25, monthly_limit: 500 },
];

async function fetchAccessModel(): Promise<AccessModel | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/access-model`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json())?.data as AccessModel;
  } catch {
    return null;
  }
}

export default async function AccessModelPage() {
  const model = await fetchAccessModel();
  const tiers = model?.tiers?.length ? model.tiers : FALLBACK_TIERS;
  const freeUntilVolume = model?.free_until_volume ?? 17;
  const freeUntilYear = model?.free_until_year ?? 2026;
  const articlePrice = model
    ? new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: model.currency || 'EUR',
        maximumFractionDigits: model.article_price % 1 === 0 ? 0 : 2,
      }).format(model.article_price)
    : null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1
            className="text-[#0f2d6b] mb-2"
            style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}
          >
            How Access Works
          </h1>
          <p className="text-[#5a6a8a] text-sm">
            Advanced Materials Letters is a curated, not-for-profit journal of the International
            Association of Advanced Materials (IAAM). See{' '}
            <Link href="/subscribe" className="text-[#0f2d6b] underline">
              Subscriptions &amp; Fees
            </Link>{' '}
            for plans and pricing.
          </p>
        </div>

        {/* The model in four points */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            {
              icon: <BookOpen className="w-5 h-5" />,
              title: `Volumes 1–${freeUntilVolume} stay free`,
              text: `Everything published from 2010 to ${freeUntilYear} was free open access and remains free to read — no sign-in, no subscription, no purchase.`,
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              title: 'Selective by invitation',
              text: 'Articles are invited from IAAM Fellows, awardees and collaborating institutions, and peer reviewed. Invited authors pay nothing.',
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: 'Read through membership',
              text: 'IAAM members receive daily article access allowances based on their membership category.',
            },
            {
              icon: <CreditCard className="w-5 h-5" />,
              title: 'Subscribe or buy one article',
              text: `Readers who are not IAAM members can subscribe, or buy permanent access to a single article${articlePrice ? ` for ${articlePrice}` : ''}.`,
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-2 text-[#c9a227] mb-2">
                {item.icon}
                <h2 className="text-[#0f2d6b] text-base" style={{ fontWeight: 700 }}>
                  {item.title}
                </h2>
              </div>
              <p className="text-[#3a4a6a] text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Tier allowances (live from the journal's access settings) */}
        <h2 className="text-[#0f2d6b] text-xl mb-4" style={{ fontWeight: 700 }}>
          Member article allowances
        </h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#f0f4fb] text-left">
                <th className="px-4 py-3 text-[#0f2d6b] font-semibold">Membership category</th>
                <th className="px-4 py-3 text-[#0f2d6b] font-semibold w-40">Articles per day</th>
                <th className="px-4 py-3 text-[#0f2d6b] font-semibold w-40">Articles per month</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.key} className="border-t border-gray-200 bg-white">
                  <td className="px-4 py-3 text-[#0f1a2e] font-medium">{tier.label}</td>
                  <td className="px-4 py-3 text-[#3a4a6a]">{tier.daily_limit}</td>
                  <td className="px-4 py-3 text-[#3a4a6a]">{tier.monthly_limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#5a6a8a] mb-10">
          Allowances count distinct articles from Volume {freeUntilVolume + 1} onwards; articles in
          Volumes 1&ndash;{freeUntilVolume} and any article published open access never use your
          allowance. Re-reading an article you opened the same day does not use it either. Abstracts,
          metadata and citation details are always free to view.
        </p>

        {/* CTAs */}
        <div className="bg-[#f0f4fb] border border-[#0f2d6b]/10 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#0f1a2e] text-sm">
            Already an IAAM member? Sign in with your member account to start reading.
          </p>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/account/login"
              className="px-4 py-2 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2560] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/account/register"
              className="px-4 py-2 border border-[#0f2d6b] text-[#0f2d6b] rounded-lg text-sm font-semibold hover:bg-white transition-colors"
            >
              Join IAAM
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
