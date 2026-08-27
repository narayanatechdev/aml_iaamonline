'use client';

export function AnnouncementBar() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
            <div className="text-sm md:text-base font-semibold text-amber-900" style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}>
              Relaunched 2026
            </div>
            <div className="text-sm text-gray-700" style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}>
              <span className="font-semibold">A curated, not-for-profit publishing platform.</span> Advanced Materials Letters publishes by invitation — articles from IAAM Fellows, awardees and collaborating institutions — with reading access through <span className="italic">IAAM membership and subscription.</span> Authors are never charged a fee.
            </div>
          </div>
          <a
            href="/access-model"
            className="text-sm font-semibold text-amber-900 hover:text-amber-800 whitespace-nowrap"
            style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
          >
            See the access model →
          </a>
        </div>
      </div>
    </div>
  );
}
