import { HUB_TOPICS } from '@/lib/hub-topics';

export function MaterialsAreas() {
  return (
    <section className="font-hub-body bg-[#F6F8FC]">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="flex items-end justify-between gap-4 mb-2">
          <div>
            <h2 className="font-hub-display font-bold text-[28px] text-[#0B1F4D]">Browse by Materials Area</h2>
            <div className="w-14 h-1 rounded-full bg-[#10B981] mt-2 mb-3" />
            <p className="text-[15px] text-[#5a6a8a]">Pick a field to see every article, paper, lecture and book on it in one place.</p>
          </div>
          <a href="/topics" className="hidden sm:inline text-[14px] font-semibold text-[#1546E0] hover:underline">
            View all topics
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-8">
          {HUB_TOPICS.map((t) => (
            <a
              key={t.slug}
              href={`/topics/${t.slug}`}
              title={t.text}
              className="group rounded-[10px] border border-[#DCE3F0] bg-white p-4 hover:shadow-md transition-shadow flex flex-col items-start gap-3"
            >
              <span className="w-9 h-9 rounded-lg bg-[#EAF1FD] text-[#1546E0] flex items-center justify-center group-hover:bg-[#1546E0] group-hover:text-white transition-colors">
                <t.icon className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="text-[13px] font-semibold text-[#14213D] leading-snug">{t.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
