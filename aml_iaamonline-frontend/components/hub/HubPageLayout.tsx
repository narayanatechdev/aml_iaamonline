import { HubHeader } from './HubHeader';
import { HubFooter } from './HubFooter';

/**
 * Chrome for every hub page that isn't the home page. Keeps the header and
 * footer identical to HubHome so the inner pages don't drift, and renders the
 * standard title block the hub uses above the fold.
 */
export function HubPageLayout({
  kicker,
  title,
  intro,
  breadcrumb,
  children,
}: {
  kicker?: string;
  title: string;
  intro?: React.ReactNode;
  breadcrumb?: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <HubHeader />
      <main className="font-hub-body bg-white min-h-[60vh]">
        <div className="bg-[#0B1F4D] text-white">
          <div className="max-w-[1400px] mx-auto px-6 py-10">
            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-3 text-[12.5px] text-[#A9B6D6]">
                {breadcrumb.map((crumb, i) => (
                  <span key={crumb.href}>
                    {i > 0 && <span className="mx-1.5 text-[#5A6A94]">/</span>}
                    <a href={crumb.href} className="hover:text-white transition-colors">
                      {crumb.label}
                    </a>
                  </span>
                ))}
              </nav>
            )}
            {kicker && (
              <p className="text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#A7F3D0] mb-2">{kicker}</p>
            )}
            <h1 className="font-hub-display font-bold text-[32px] leading-tight">{title}</h1>
            <div className="w-14 h-1 rounded-full bg-[#10B981] mt-3" />
            {intro && <div className="text-[15px] text-[#C5CEE3] leading-relaxed max-w-[70ch] mt-4">{intro}</div>}
          </div>
        </div>
        {children}
      </main>
      <HubFooter />
    </>
  );
}

/** Standard content band, matching the home page's 1400px container. */
export function HubSection({
  children,
  tone = 'white',
  className = '',
}: {
  children: React.ReactNode;
  tone?: 'white' | 'tint';
  className?: string;
}) {
  return (
    <section className={tone === 'tint' ? 'bg-[#F6F8FC]' : 'bg-white'}>
      <div className={`max-w-[1400px] mx-auto px-6 py-12 ${className}`}>{children}</div>
    </section>
  );
}
