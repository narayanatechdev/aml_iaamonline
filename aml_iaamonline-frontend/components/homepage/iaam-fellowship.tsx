'use client';

interface FellowshipItem {
  id: string;
  letter: string;
  category: string;
  title: string;
  description: string;
}

const FELLOWSHIP_ITEMS: FellowshipItem[] = [
  {
    id: '1',
    letter: 'W',
    category: 'WHITE PAPER',
    title: 'A global roadmap for regulatory science in nanomedicine',
    description: 'Fellow-led · 9 contributing institutions',
  },
  {
    id: '2',
    letter: 'T',
    category: 'THEMATIC ISSUE',
    title: 'Materials for pandemic preparedness – call for invited papers',
    description: 'Guest-curated by domain leaders',
  },
  {
    id: '3',
    letter: 'V',
    category: 'ANNUAL VISION PAPER',
    title: 'Where advanced materials meet climate adaptation in 2030',
    description: 'IAAM Editorial Council',
  },
];

export function IAAMFellowship() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-black" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
            From the IAAM Fellowship
          </h2>
          <a href="/fellowship" className="text-black font-semibold hover:text-gray-700 transition">
            All invited content →
          </a>
        </div>

        {/* Divider */}
        <div className="border-b border-black mb-8"></div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FELLOWSHIP_ITEMS.map((item) => (
            <div
              key={item.id}
              className="border border-black rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
            >
              {/* Circle with letter */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{item.letter}</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-black tracking-wider">
                    {item.category}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-black font-bold text-lg mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
