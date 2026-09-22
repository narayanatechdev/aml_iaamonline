const COMPONENTS = [
  { key: 'C', label: 'Citation Impact', weight: '60%', text: 'How often the work is cited, adjusted for field and age', color: '#15803D' },
  { key: 'E', label: 'Research Engagement', weight: '15%', text: 'Views, downloads and saves by researchers', color: '#1546E0' },
  { key: 'T', label: 'Research Translation', weight: '15%', text: 'Use in patents, standards, policy documents and industry', color: '#C2570C' },
  { key: 'A', label: 'Academic Attention', weight: '10%', text: 'Mentions in teaching, news, scholarly blogs and social media', color: '#6D28D9' },
];

const RECOGNITION = [
  { label: 'Distinguished Invited Article', text: 'Commissioned from leading experts in the field', bg: '#FDF0DC', ink: '#7A3E00' },
  { label: 'IAAM Fellow Contribution', text: 'Written by IAAM Fellows to shape the future of the discipline', bg: '#F1E8FB', ink: '#4A1D7A' },
  { label: 'Not-for-Profit Publishing', text: 'Science for society, not for profit', bg: '#E3F3E8', ink: '#14532D' },
  { label: 'Open Access', text: 'Free for anyone to read, share and build on', bg: '#E3F3E8', ink: '#14532D' },
];

export function ArticleImpact() {
  return (
    <section id="article-impact" className="font-hub-body bg-[#F6F8FC]">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div>
            <h2 className="font-hub-display font-bold text-[25px] text-[#0B1F4D]">About IAAM Article Impact (AII)</h2>
            <div className="w-14 h-1 rounded-full bg-[#10B981] mt-2 mb-4" />
            <p className="inline-block font-mono text-[13px] font-semibold text-[#1546E0] bg-[#EAF1FD] rounded-md px-3 py-1.5 mb-4">
              AII = 0.60C + 0.15E + 0.15T + 0.10A
            </p>
            <p className="text-[15px] text-[#2B3853] leading-relaxed max-w-[62ch] mb-6">
              A citation count tells only part of the story. The IAAM Article Impact score, from 0 to 100, also
              reflects who reads a paper, who puts it to use and who talks about it, so authors and readers can
              see its full scholarly and societal reach. We measure articles, not journals: the credit goes to
              the people who wrote the work.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {COMPONENTS.map((c) => (
                <div key={c.key} className="flex items-start gap-3 rounded-[10px] border border-[#DCE3F0] bg-white p-4">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center font-hub-display font-bold text-[13px] text-white flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.key}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-[#14213D]">
                      {c.label} <span className="text-[#8B98B8] font-semibold">· {c.weight}</span>
                    </p>
                    <p className="text-[12px] text-[#5a6a8a] leading-snug mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="/about/article-impact" className="text-[14px] font-semibold text-[#1546E0] hover:underline">
              Learn more about AII
            </a>
          </div>

          <div className="rounded-xl border border-[#DCE3F0] bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-hub-display font-bold text-[16px] text-[#0B1F4D]">IAAM Article Impact</p>
              <span className="text-[10.5px] font-bold tracking-wide uppercase text-[#8B98B8] bg-[#F6F8FC] rounded-full px-2 py-1">
                Example score
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full border-[6px] border-[#1546E0] flex items-center justify-center flex-shrink-0">
                <span className="font-hub-display font-bold text-[20px] text-[#0B1F4D]">82</span>
              </div>
              <p className="text-[13px] font-semibold text-[#2B3853] leading-snug">
                High Impact
                <br />
                High Visibility
                <br />
                Greater Change
              </p>
            </div>
            <p className="text-[11px] text-[#8B98B8] leading-relaxed">
              Illustrative only — individual article scores are not live yet. Once AII scoring launches, every
              article carries its own score here.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="font-hub-display font-bold text-[25px] text-[#0B1F4D]">Scholarly Recognition</h2>
              <p className="text-[14px] text-[#5a6a8a] mt-1">Celebrating exceptional contributions to the materials community</p>
            </div>
            <a href="/about#not-for-profit" className="hidden sm:inline text-[14px] font-semibold text-[#1546E0] hover:underline">
              Learn more
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECOGNITION.map((r) => (
              <div key={r.label} className="rounded-[10px] p-4" style={{ backgroundColor: r.bg }}>
                <p className="text-[13px] font-bold" style={{ color: r.ink }}>{r.label}</p>
                <p className="text-[12px] mt-1 leading-snug" style={{ color: r.ink, opacity: 0.85 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
