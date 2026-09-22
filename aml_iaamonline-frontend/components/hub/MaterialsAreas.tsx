import { ArrowRight } from 'lucide-react';
import { HUB_TOPICS } from '@/lib/hub-topics';

export function MaterialsAreas() {
  return (
    <section className="font-hub-body relative isolate bg-[#F6F8FC] overflow-hidden">
      <img
        src="/hub/topics-background.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 w-full h-full object-cover"
      />

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-9">
          <div>
            <p className="flex items-center gap-3 text-[12px] font-bold tracking-[0.18em] uppercase text-[#5a6a8a] mb-4">
              <span className="w-7 h-[3px] rounded-full bg-[#10B981]" />
              Explore
            </p>
            <h2 className="font-hub-display font-bold text-[38px] leading-[1.05] text-[#0B1F4D] mb-3">
              Browse by Materials Area
            </h2>
            <p className="text-[15px] text-[#5a6a8a]">
              Pick a field to see every article, paper, lecture and book on it in one place.
            </p>
          </div>

          <a
            href="/topics"
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#DCE3F0] text-[14px] font-semibold text-[#1546E0] hover:border-[#1546E0] hover:shadow-md transition-all whitespace-nowrap"
          >
            View all topics <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {HUB_TOPICS.map((t) => (
            <a
              key={t.slug}
              href={`/topics/${t.slug}`}
              title={t.text}
              className="group rounded-xl bg-white border border-[#DCE3F0] overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              {/*
                The tile photograph, where one has been supplied. Until then the
                accent wash keeps the grid even rather than leaving a gap.
              */}
              <div className={`relative h-[104px] overflow-hidden ${t.photo ? '' : t.accent.split(' ')[0]}`}>
                {t.photo && (
                  <img
                    src={t.photo}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                )}
              </div>

              <div className="flex items-center gap-3 p-3.5">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${t.accent}`}>
                  <t.icon className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="text-[13px] font-semibold text-[#14213D] leading-snug flex-1">{t.label}</span>
                <ArrowRight className="w-4 h-4 text-[#8B98B8] flex-shrink-0 group-hover:text-[#1546E0] transition-colors" />
              </div>
            </a>
          ))}
        </div>

        <p
          aria-hidden="true"
          className="hidden lg:flex items-center justify-end gap-4 mt-10 text-[11.5px] font-medium tracking-[0.22em] uppercase text-[#A9B6D6]"
        >
          Materials shape a brighter tomorrow
          <span className="w-8 h-px bg-[#C5CEE3]" />
        </p>
      </div>
    </section>
  );
}
