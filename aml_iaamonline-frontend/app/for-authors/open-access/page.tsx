import type { Metadata } from 'next';
import { assertHub } from '@/lib/hub-guard';
import { HubPageLayout, HubSection } from '@/components/hub/HubPageLayout';
import { getAccessModel, formatMoney } from '@/lib/hub-data';

export const metadata: Metadata = {
  title: 'Access Policy & Charges',
  description:
    'How readers reach IAAM articles from 2027, what publishing costs, and how waivers work. Figures are live from the journals.',
};

export const revalidate = 600;

export default async function OpenAccessPage() {
  assertHub();

  const model = await getAccessModel();

  return (
    <HubPageLayout
      kicker="For Authors"
      title="Access Policy & Charges"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'For Authors', href: '/for-authors' },
        { label: 'Access & charges', href: '/for-authors/open-access' },
      ]}
      intro="How readers reach your article, and what publishing costs. Every figure on this page is read live from the journals, so it is always the price in force today."
    >
      <HubSection>
        {!model ? (
          <div className="rounded-[10px] border border-dashed border-[#C7D2E8] bg-[#F6F8FC] px-6 py-10 text-center">
            <p className="text-[14px] text-[#3D4A66] max-w-[56ch] mx-auto">
              Access settings are temporarily unavailable. Write to{' '}
              <a href="mailto:publishers@iaamonline.org" className="text-[var(--brand)] font-semibold hover:underline">
                publishers@iaamonline.org
              </a>{' '}
              and we will confirm the current charges.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-[#0B5D3B] text-white p-6 md:p-8 mb-6">
              <p className="text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#A7F3D0] mb-2">
                Free to read
              </p>
              <h2 className="font-hub-display font-bold text-[23px] mb-3">
                Everything up to Volume {model.freeUntilVolume} stays free, permanently
              </h2>
              <p className="text-[14.5px] text-[#D6F0E2] leading-relaxed max-w-[70ch]">
                Every article published through Volume {model.freeUntilVolume} ({model.freeUntilYear}) remains
                free to read for everyone, with no account and no paywall — and it stays that way. The access
                model below applies only to what we publish from Volume {model.freeUntilVolume + 1} onwards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-[#DCE3F0] bg-white p-6">
                <h2 className="font-hub-display font-bold text-[17px] text-[#0B1F4D] mb-3">
                  What authors pay
                </h2>
                {model.apc ? (
                  <>
                    <p className="text-[13.5px] text-[#3D4A66] leading-relaxed mb-4">
                      From Volume {model.freeUntilVolume + 1}, authors may choose the open-access route, which
                      carries an article processing charge. Publishing without it remains free — the article is
                      then read through membership or subscription.
                    </p>
                    <dl className="space-y-2.5 mb-4">
                      {[
                        ['Research article (open access)', model.apc.research],
                        ['Review article (open access)', model.apc.review],
                      ].map(([label, amount]) => (
                        <div
                          key={label as string}
                          className="flex items-baseline justify-between gap-3 rounded-lg bg-[#F6F8FC] px-4 py-3"
                        >
                          <dt className="text-[13px] text-[#3D4A66]">{label as string}</dt>
                          <dd className="font-hub-display font-bold text-[17px] text-[#0B1F4D]">
                            {formatMoney(amount as number, model.currency)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="text-[12.5px] text-[#5a6a8a] leading-relaxed">
                      Waivers are available. As a not-for-profit publisher we do not turn away work because its
                      authors lack funding — ask the editorial office when you submit.
                    </p>
                  </>
                ) : (
                  <p className="text-[13.5px] text-[#3D4A66] leading-relaxed">
                    There are no article processing charges and no submission fees. Publishing with us costs
                    authors nothing.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-[#DCE3F0] bg-white p-6">
                <h2 className="font-hub-display font-bold text-[17px] text-[#0B1F4D] mb-3">
                  How readers get access
                </h2>
                <p className="text-[13.5px] text-[#3D4A66] leading-relaxed mb-4">
                  Readers always see the {model.preview} of every article free. Beyond that, from Volume{' '}
                  {model.freeUntilVolume + 1} they read through IAAM membership, a subscription, or a single
                  article purchase at {formatMoney(model.articlePrice, model.currency)}.
                </p>
                <div className="space-y-3">
                  {model.plans.map((plan) => (
                    <div
                      key={plan.key}
                      className={`rounded-lg p-4 ${
                        plan.featured ? 'bg-[#EAF1FD] border border-[#B8CCF5]' : 'bg-[#F6F8FC]'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[13.5px] font-bold text-[#0B1F4D]">{plan.name}</p>
                        <p className="font-hub-display font-bold text-[15px] text-[#0B1F4D] whitespace-nowrap">
                          {formatMoney(plan.price, plan.currency || model.currency)}
                          <span className="text-[11.5px] font-semibold text-[#8B98B8]"> /{plan.period}</span>
                        </p>
                      </div>
                      <p className="text-[12.5px] text-[#3D4A66] leading-snug mt-1">{plan.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#F6F8FC] border border-[#DCE3F0] p-6 mt-6">
              <h2 className="font-hub-display font-bold text-[16px] text-[#0B1F4D] mb-2">Licence &amp; reuse</h2>
              <p className="text-[13.5px] text-[#3D4A66] leading-relaxed max-w-[74ch] mb-4">
                Open-access articles are published under CC BY 4.0, which lets anyone share and build on the work
                as long as they credit you. Authors retain copyright in their own work.
              </p>
              <a
                href={`mailto:${model.contactEmail}`}
                className="text-[13.5px] font-semibold text-[var(--brand)] hover:underline"
              >
                Questions about charges or waivers? {model.contactEmail} →
              </a>
            </div>
          </>
        )}
      </HubSection>
    </HubPageLayout>
  );
}
