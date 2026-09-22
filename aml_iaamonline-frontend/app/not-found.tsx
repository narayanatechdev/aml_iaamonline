import { IS_HUB } from '@/lib/hub-guard';
import { HubHeader } from '@/components/hub/HubHeader';
import { HubFooter } from '@/components/hub/HubFooter';

export const metadata = { title: 'Page not found' };

/**
 * The hub gets a branded 404 with its own header and footer, so a mistyped or
 * retired URL still leaves readers somewhere they can navigate from.
 *
 * Journal deployments keep the plain centred 404 they have always shown —
 * this file exists in their build too, so it deliberately reproduces that
 * rather than introducing journal chrome on a 404.
 */
export default function NotFound() {
  if (!IS_HUB) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ display: 'inline-block', margin: '0 20px 0 0', paddingRight: 23, fontSize: 24, fontWeight: 500, verticalAlign: 'top', lineHeight: '49px' }}>
            404
          </h1>
          <div style={{ display: 'inline-block' }}>
            <h2 style={{ fontSize: 14, fontWeight: 400, lineHeight: '49px', margin: 0 }}>
              This page could not be found.
            </h2>
          </div>
        </div>
      </div>
    );
  }

  const LINKS = [
    { href: '/publications', label: 'Our publications', text: 'The six IAAM titles, and what each one covers.' },
    { href: '/topics', label: 'Browse by topic', text: 'Every article grouped by materials area.' },
    { href: '/archive', label: 'Archive', text: 'All volumes of both journals, by year and by volume.' },
    { href: '/for-authors', label: 'For authors', text: 'Guidelines, ethics, peer review and how to submit.' },
  ];

  return (
    <>
      <HubHeader />
      <main className="font-hub-body bg-white">
        <div className="bg-[#0B1F4D] text-white">
          <div className="max-w-[1400px] mx-auto px-6 py-14">
            <p className="text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#A7F3D0] mb-2">Error 404</p>
            <h1 className="font-hub-display font-bold text-[32px] leading-tight">This page could not be found</h1>
            <div className="w-14 h-1 rounded-full bg-[#10B981] mt-3" />
            <p className="text-[15px] text-[#C5CEE3] leading-relaxed max-w-[64ch] mt-4">
              The address may be mistyped, or the page may have moved. Everything we publish is reachable from the
              links below.
            </p>
          </div>
        </div>

        <section className="max-w-[1400px] mx-auto px-6 py-12">
          <form action="/search" className="max-w-xl mb-10">
            <label htmlFor="nf-search" className="block text-[12px] font-semibold tracking-wide uppercase text-[#5a6a8a] mb-2">
              Search all publications
            </label>
            <div className="flex gap-2">
              <input
                id="nf-search"
                name="q"
                type="search"
                placeholder="Title, author, keyword, topic or DOI"
                className="flex-1 rounded-md border border-[#DCE3F0] px-4 py-3 text-[14px] text-[#14213D] focus:outline-none focus:border-[#1546E0]"
              />
              <button
                type="submit"
                className="px-6 rounded-md bg-[#1546E0] text-white text-[14px] font-semibold hover:bg-[#1139b8] transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-[10px] border border-[#DCE3F0] bg-white p-5 hover:shadow-md transition-shadow"
              >
                <h2 className="font-hub-display font-bold text-[15px] text-[#0B1F4D] mb-1.5">{l.label}</h2>
                <p className="text-[12.5px] text-[#3D4A66] leading-relaxed">{l.text}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
      <HubFooter />
    </>
  );
}
