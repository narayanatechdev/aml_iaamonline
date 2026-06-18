'use client';

interface MetadataItem {
  title: string;
  content: string | string[] | null;
  icon?: React.ReactNode;
}

interface MetadataSectionProps {
  acknowledgements?: string | null;
  fundingInformation?: string | null;
  conflictOfInterest?: string | null;
  authorContributions?: Record<string, string>[] | null;
  dataAvailability?: string | null;
}

export function MetadataSection({
  acknowledgements,
  fundingInformation,
  conflictOfInterest,
  authorContributions,
  dataAvailability,
}: MetadataSectionProps) {
  const items: MetadataItem[] = [];

  if (acknowledgements) {
    items.push({
      title: 'Acknowledgements',
      content: acknowledgements,
    });
  }

  if (fundingInformation) {
    items.push({
      title: 'Funding Information',
      content: fundingInformation,
    });
  }

  if (conflictOfInterest) {
    items.push({
      title: 'Conflict of Interest',
      content: conflictOfInterest,
    });
  }

  if (authorContributions && Array.isArray(authorContributions) && authorContributions.length > 0) {
    const contributionsList = authorContributions
      .map((contrib) => (typeof contrib === 'object' ? Object.values(contrib).join(': ') : String(contrib)))
      .filter(Boolean);

    if (contributionsList.length > 0) {
      items.push({
        title: 'Author Contributions',
        content: contributionsList,
      });
    }
  }

  if (dataAvailability) {
    items.push({
      title: 'Data Availability',
      content: dataAvailability,
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-4xl">
        <h2
          className="text-2xl font-bold text-black mb-8"
          style={{
            fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif",
          }}
        >
          Article Metadata
        </h2>

        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-sm font-semibold text-black uppercase tracking-wide">
                {item.title}
              </h3>

              {Array.isArray(item.content) ? (
                <ul className="space-y-2">
                  {item.content.map((line, i) => (
                    <li key={i} className="text-sm text-gray-700 leading-relaxed flex gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
