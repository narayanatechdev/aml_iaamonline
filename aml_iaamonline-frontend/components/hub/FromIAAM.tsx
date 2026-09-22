const PORTAL_REGISTER_URL = process.env.NEXT_PUBLIC_PORTAL_REGISTER_URL || 'https://dev-portal.iaamonline.org/register';

export function FromIAAM() {
  return (
    <section className="font-hub-body bg-[#F6F8FC]">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#5a6a8a] mb-6">From IAAM</p>

        <div className="grid md:grid-cols-3 gap-5">
          <a href={PORTAL_REGISTER_URL} className="rounded-[10px] bg-[#EAF1FD] border border-[#DCE3F0] p-6 hover:shadow-md transition-shadow flex flex-col">
            <h3 className="font-hub-display font-bold text-[19px] text-[#0B1F4D] mb-2">Become an IAAM Member</h3>
            <p className="text-[13.5px] text-[#2B3853] leading-relaxed flex-1">
              Join a global network of 250,000+ members from over 150 countries, and read every IAAM title as part
              of your membership.
            </p>
            <p className="mt-4 text-[10.5px] font-bold tracking-[0.08em] text-[var(--brand)]">
              NETWORK · COLLABORATE · GROW · MAKE AN IMPACT
            </p>
          </a>

          <div className="rounded-[10px] bg-[#0B1F4D] text-white p-6 flex flex-col">
            <h3 className="font-hub-display font-bold text-[19px] mb-2">Advanced Materials Congress</h3>
            <p className="text-[13.5px] text-[#C5CEE3] leading-relaxed flex-1">
              9–14 August 2027 · Stockholm, Sweden.
              <br />
              Theme: Materials for a Sustainable World.
            </p>
            <a
              href="https://iaamonline.org/events"
              className="mt-4 inline-block self-start px-4 py-2 rounded-full bg-white text-[var(--brand-deep)] text-[13px] font-bold hover:bg-[var(--brand-tint)] transition-colors"
            >
              Learn more
            </a>
          </div>

          <a href="/about#not-for-profit" className="rounded-[10px] bg-[#DDF7E9] border border-[#DCE3F0] p-6 hover:shadow-md transition-shadow flex flex-col">
            <h3 className="font-hub-display font-bold text-[19px] text-[var(--brand-deep)] mb-2">Not-for-Profit Publication</h3>
            <p className="text-[15px] font-semibold text-[var(--brand-deep)] leading-snug flex-1">
              Science for Society.
              <br />
              Knowledge without Barriers.
            </p>
            <span className="mt-4 text-[13px] font-semibold text-[var(--brand)]">How we publish →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
