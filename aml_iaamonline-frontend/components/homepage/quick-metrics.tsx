'use client';

export function QuickMetrics() {
  const metrics = [
    { label: 'Annual Readership', value: '150K+' },
    { label: 'Published Articles', value: '1,250+' },
    { label: 'Journal Issues', value: '25' },
    { label: 'Countries', value: '50+' },
  ];

  return (
    <section className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="text-[#0f2d6b] font-bold" style={{ fontSize: "1.8rem", lineHeight: 1.2 }}>
                {metric.value}
              </div>
              <div className="text-[#5a6a8a] text-xs mt-1">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
