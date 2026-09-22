import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Eye,
  FileText,
  GraduationCap,
  Globe,
  Megaphone,
  Trophy,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

const COMPONENTS: { icon: LucideIcon; label: string; weight: string; text: string }[] = [
  { icon: FileText, label: 'Citation Impact', weight: '60%', text: 'How often the work is cited, adjusted for field and age.' },
  { icon: Users, label: 'Research Engagement', weight: '15%', text: 'Views, downloads and saves by researchers.' },
  { icon: Globe, label: 'Research Translation', weight: '15%', text: 'Use in patents, standards, policy documents and industry.' },
  { icon: Megaphone, label: 'Academic Attention', weight: '10%', text: 'Mentions in teaching, news, scholarly blogs and social media.' },
];

const SCORE_TRAITS: { icon: LucideIcon; label: string }[] = [
  { icon: BarChart3, label: 'High Impact' },
  { icon: Eye, label: 'High Visibility' },
  { icon: TrendingUp, label: 'Greater Change' },
];

const RECOGNITION: { icon: LucideIcon; label: string; text: string }[] = [
  { icon: Trophy, label: 'Distinguished Invited Article', text: 'Commissioned from leading experts in the field.' },
  { icon: GraduationCap, label: 'IAAM Fellow Contribution', text: 'Written by IAAM Fellows to shape the future of the discipline.' },
  { icon: Users, label: 'Not-for-Profit Publishing', text: 'Science for society, not for profit.' },
  { icon: BookOpen, label: 'Open Access', text: 'Free for anyone to read, share and build on.' },
];

/** The example score. Not a real article's — see the note under the dial. */
const EXAMPLE_SCORE = 82;

function Kicker({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-3 text-[12px] font-bold tracking-[0.18em] uppercase text-[#5a6a8a] mb-4">
      <span className="w-7 h-[3px] rounded-full bg-[var(--brand)]" />
      {children}
    </p>
  );
}

function ScoreDial({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative w-[136px] h-[136px] flex-shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#E4EBF7" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-hub-display font-bold text-[34px] leading-none text-[#0B1F4D]">{score}</span>
        <span className="text-[12px] text-[#8B98B8] mt-1">/ 100</span>
      </div>
    </div>
  );
}

export function ArticleImpact() {
  return (
    <section id="article-impact" className="font-hub-body relative isolate bg-[#F6F8FC] overflow-hidden">
      <img
        src="/hub/impact-background.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 w-full h-full object-cover"
      />

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
          <div>
            <Kicker>Impact</Kicker>
            <h2 className="font-hub-display font-bold text-[36px] leading-[1.05] text-[#0B1F4D] mb-3">
              About IAAM Article Impact (AII)
            </h2>
            <p className="text-[15.5px] text-[#5a6a8a] mb-5">
              Beyond citations. Measuring real-world impact in materials science.
            </p>

            <p className="inline-block font-mono text-[13.5px] font-semibold text-[var(--brand)] bg-[#EAF1FD] rounded-lg px-4 py-2 mb-5">
              AII = 0.60C + 0.15E + 0.15T + 0.10A
            </p>

            <p className="text-[15px] text-[#2B3853] leading-relaxed max-w-[62ch] mb-7">
              A citation count tells only part of the story. The IAAM Article Impact score, from 0 to 100, also
              reflects who reads a paper, who puts it to use and who talks about it, so authors and readers can
              see its full scholarly and societal reach. We measure articles, not journals: the credit goes to
              the people who wrote the work.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {COMPONENTS.map((c) => (
                <a
                  key={c.label}
                  href="/about/article-impact"
                  className="group flex items-start gap-3.5 rounded-xl border border-[#DCE3F0] bg-white/80 p-4 hover:bg-white hover:shadow-md transition-all"
                >
                  <span className="w-11 h-11 rounded-full bg-[#EAF1FD] text-[var(--brand)] flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13.5px] font-bold text-[#14213D]">
                      {c.label} <span className="text-[#8B98B8] font-semibold">· {c.weight}</span>
                    </span>
                    <span className="block text-[12.5px] text-[#5a6a8a] leading-snug mt-1">{c.text}</span>
                  </span>
                  <span className="w-7 h-7 rounded-full border border-[#DCE3F0] flex items-center justify-center flex-shrink-0 text-[var(--brand)] group-hover:border-[var(--brand)] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE3F0] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-5">
              <p className="font-hub-display font-bold text-[18px] text-[#0B1F4D]">IAAM Article Impact</p>
              <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--brand)] bg-[#EAF1FD] rounded-full px-2.5 py-1 whitespace-nowrap">
                Example score
              </span>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <ScoreDial score={EXAMPLE_SCORE} />
              <ul className="space-y-3.5">
                {SCORE_TRAITS.map((t) => (
                  <li key={t.label} className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#EAF1FD] text-[var(--brand)] flex items-center justify-center flex-shrink-0">
                      <t.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                    </span>
                    <span className="text-[14px] font-semibold text-[#2B3853]">{t.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[12.5px] text-[#8B98B8] leading-relaxed pt-5 border-t border-[#E4EBF7] mb-5">
              Illustrative only — individual article scores are not live yet. Once AII scoring launches, every
              article carries its own score here.
            </p>

            <a
              href="/about/article-impact"
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-[#0B1F4D] text-white text-[14px] font-semibold hover:bg-[var(--brand-deep)] transition-colors"
            >
              Learn more about AII <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <Kicker>Recognition</Kicker>
              <h2 className="font-hub-display font-bold text-[30px] leading-[1.1] text-[#0B1F4D] mb-2">
                Scholarly Recognition
              </h2>
              <p className="text-[14.5px] text-[#5a6a8a]">
                Celebrating exceptional contributions to the materials community.
              </p>
            </div>
            <a
              href="/about#not-for-profit"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--brand)] hover:underline whitespace-nowrap"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECOGNITION.map((r) => (
              <div key={r.label} className="flex items-start gap-3.5 rounded-xl border border-[#DCE3F0] bg-white/80 p-4">
                <span className="w-11 h-11 rounded-full bg-[#EAF1FD] text-[var(--brand)] flex items-center justify-center flex-shrink-0">
                  <r.icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-[13.5px] font-bold text-[#14213D] leading-snug">{r.label}</p>
                  <p className="text-[12.5px] text-[#5a6a8a] leading-snug mt-1">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
