import { getHubStats } from '@/lib/hub-data';

export async function NotForProfitAndStats() {
  const stats = await getHubStats();

  return (
    <>
      <section className="font-hub-body bg-[#0B5D3B] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-14">
          <h2 className="font-hub-display font-bold text-[26px] mb-3">Our Not-for-Profit Commitment</h2>
          <p className="text-[15px] text-[#D6F0E2] leading-relaxed max-w-[64ch] mb-4">
            IAAM Publications has no shareholders. Every surplus krona goes back into science: fee waivers for
            authors who lack funding, travel grants for early-career researchers, free live talks, and
            initiatives that move materials science, engineering and technology towards net zero.
          </p>
          <a href="/about#not-for-profit" className="text-[14px] font-semibold text-[#A7F3D0] hover:underline">
            Read our commitment
          </a>
          <p className="mt-6 text-[11.5px] font-bold tracking-[0.16em] uppercase text-[#A7F3D0]">
            A cleaner · greener · brighter · tomorrow
          </p>
        </div>
      </section>

      <section className="font-hub-body bg-[#1546E0] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-hub-display font-bold text-[26px] [font-variant-numeric:tabular-nums]">
              {stats.articleCount.toLocaleString()}+
            </p>
            <p className="text-[12.5px] text-[#D9E3FB] mt-1">Articles &amp; proceedings papers</p>
          </div>
          <div>
            <p className="font-hub-display font-bold text-[26px]">{stats.journalCount}</p>
            <p className="text-[12.5px] text-[#D9E3FB] mt-1">Publications live today</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <a href="/about/article-impact" className="font-hub-display font-bold text-[18px] hover:underline">
              IAAM Article Impact (AII)
            </a>
            <p className="text-[12.5px] text-[#D9E3FB] mt-1">How we measure impact</p>
          </div>
        </div>
      </section>
    </>
  );
}
