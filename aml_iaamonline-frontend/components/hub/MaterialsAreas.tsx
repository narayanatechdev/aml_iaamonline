const TOPICS = [
  { label: 'Advanced Materials', slug: 'advanced-materials', text: 'Functional, smart and hybrid materials, composites, coatings and thin films.', tint: '#E8F0FF', ink: '#1546E0' },
  { label: 'Energy Materials', slug: 'energy-materials', text: 'Batteries, solar cells, fuel cells, hydrogen storage, supercapacitors and thermoelectrics.', tint: '#FFF4DB', ink: '#B45309' },
  { label: 'Biomaterials', slug: 'biomaterials', text: 'Tissue scaffolds, implants, drug delivery, biosensors and bioinspired design.', tint: '#FFE8EF', ink: '#BE185D' },
  { label: 'Nanomaterials', slug: 'nanomaterials', text: 'Nanoparticles, nanotubes, two-dimensional layers, quantum dots and nanocomposites.', tint: '#F1E8FF', ink: '#6D28D9' },
  { label: 'Sustainable & Circular Materials', slug: 'sustainable-circular-materials', text: 'Bio-based and recyclable materials, life-cycle design, waste recovery and green chemistry.', tint: '#DDF7E9', ink: '#0E7A45' },
  { label: 'Electronic Materials', slug: 'electronic-materials', text: 'Semiconductors, dielectrics, flexible and printed electronics, photonics and sensors.', tint: '#DDF4FA', ink: '#0E7490' },
  { label: 'Metallurgy & Rare-Earth Materials', slug: 'metallurgy-rare-earth-materials', text: 'Alloys, magnets, critical minerals, extraction, corrosion and high-temperature behaviour.', tint: '#E9EDF3', ink: '#334155' },
  { label: 'Structural & Engineering Materials', slug: 'structural-engineering-materials', text: 'Ceramics, polymers, concrete, lightweight structures, fatigue and fracture.', tint: '#FFEBDD', ink: '#C2410C' },
  { label: 'AI & Materials Discovery', slug: 'ai-materials-discovery', text: 'Machine learning, materials informatics, high-throughput screening and autonomous laboratories.', tint: '#E6E9FF', ink: '#4338CA' },
  { label: 'Quantum Materials', slug: 'quantum-materials', text: 'Superconductors, topological phases, spintronics and materials for quantum devices.', tint: '#D9F5F0', ink: '#0F766E' },
];

export function MaterialsAreas() {
  return (
    <section className="font-hub-body bg-[#F6F8FC]">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
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
          {TOPICS.map((t) => (
            <a
              key={t.slug}
              href={`/topics/${t.slug}`}
              title={t.text}
              className="rounded-[10px] border border-[#DCE3F0] bg-white p-4 hover:shadow-md transition-shadow flex flex-col items-start gap-3"
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center font-hub-display font-bold text-[13px]"
                style={{ backgroundColor: t.tint, color: t.ink }}
              >
                {t.label.charAt(0)}
              </span>
              <span className="text-[13px] font-semibold text-[#14213D] leading-snug">{t.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
