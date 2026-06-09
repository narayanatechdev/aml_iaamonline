'use client';

interface Announcement {
  id: string;
  title: string;
  description: string;
  image: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: "New Editors' Highlights pages",
    description:
      'Our editors highlight articles they see as particularly interesting or important in these new pages spanning all research areas.',
    image: 'https://picsum.photos/300/200?random=10',
  },
  {
    id: '2',
    title: 'Journal Metrics',
    description:
      'Advanced Materials Letters has a 2-year impact factor of 15.7 (2024), article downloads of 177,272,701 (2024), and 8 days from submission to the first editorial decision.',
    image: 'https://picsum.photos/300/200?random=11',
  },
  {
    id: '3',
    title: 'Brain Energy Metabolism in Health and Disease',
    description:
      'This Nature Conference examines how energy metabolism in the brain impacts neurological function and disease. Over 20 leading experts investigating brain metabolism across multiple disciplines will convene to share findings and exchange ideas that are advancing this critical field. Join us at the KAUST campus in Saudi Arabia December 3–5, 2025. The call for abstracts ends October 3, 2025.',
    image: 'https://picsum.photos/300/200?random=12',
  },
];

export function Announcements() {
  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="border-t-2 border-black border-b-2 py-4 mb-8">
          <h2
            className="text-4xl font-bold text-black"
            style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}
          >
            Announcements
          </h2>
        </div>

        {/* Announcements List */}
        <div className="space-y-8">
          {ANNOUNCEMENTS.map((announcement, index) => (
            <div key={announcement.id}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Content */}
                <div className="lg:col-span-2">
                  <h3
                    className="text-xl font-bold text-black mb-3 underline"
                    style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}
                  >
                    {announcement.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{announcement.description}</p>
                </div>

                {/* Image */}
                <div className="lg:col-span-1">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://picsum.photos/300/200?random=99';
                    }}
                  />
                </div>
              </div>

              {/* Divider */}
              {index < ANNOUNCEMENTS.length - 1 && <hr className="mt-8 border-gray-300" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
