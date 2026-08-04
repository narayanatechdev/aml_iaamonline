'use client';

interface Announcement {
  id: string | number;
  title: string;
  description: string;
  image?: string;
}

/**
 * Default announcements shown when the CMS has none.
 * Only factual, journal-own content belongs here — no third-party
 * publisher material and no unverifiable metrics (audit F-04/F-05/F-09).
 */
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'relaunch',
    title: 'A new home for Advanced Materials Letters',
    description:
      'The journal is moving to a new platform with a redesigned reading experience, challenge-based divisions, and improved article discovery. The complete archive from 2010 onwards is being migrated and verified issue by issue.',
  },
];

interface AnnouncementsContent {
  heading?: string;
  items?: Announcement[];
}

export function Announcements({ content }: { content?: AnnouncementsContent } = {}) {
  const heading = content?.heading || 'Announcements';
  const items =
    content?.items && content.items.length > 0 ? content.items : DEFAULT_ANNOUNCEMENTS;

  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="border-t-2 border-black border-b-2 py-4 mb-8">
          <h2
            className="text-4xl font-bold text-black"
            style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}
          >
            {heading}
          </h2>
        </div>

        {/* Announcements List */}
        <div className="space-y-8">
          {items.map((announcement, index) => (
            <div key={announcement.id}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Content */}
                <div className={announcement.image ? 'lg:col-span-2' : 'lg:col-span-3'}>
                  <h3
                    className="text-xl font-bold text-black mb-3 underline"
                    style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}
                  >
                    {announcement.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{announcement.description}</p>
                </div>

                {/* Image (optional, CMS-hosted) */}
                {announcement.image && (
                  <div className="lg:col-span-1">
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Divider */}
              {index < items.length - 1 && <hr className="mt-8 border-gray-300" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
