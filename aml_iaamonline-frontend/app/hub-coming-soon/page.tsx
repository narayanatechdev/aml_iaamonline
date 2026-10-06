import { HubHeader } from '@/components/hub/HubHeader';
import { HubFooter } from '@/components/hub/HubFooter';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon | IAAM Publications',
};

export default function HubComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col font-hub-body">
      <HubHeader />
      <main className="flex-1 flex flex-col justify-center items-center relative overflow-hidden bg-[#0A1330]">
        {/* Background from Home Section */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/hub/Home Banner.jpg"
            alt=""
            className="absolute inset-0 -z-10 w-full h-full object-cover object-center lg:object-right"
          />
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0A1A45_0%,rgba(10,26,69,0.88)_36%,rgba(10,26,69,0.70)_100%)]"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-24 mt-10">
          <div className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-xl">
            <span className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#A9B6D6]">Coming Soon</span>
          </div>
          
          <h1 className="font-hub-display font-bold text-[36px] md:text-[48px] leading-tight text-white mb-6">
            Something extraordinary is in the works.
          </h1>
          
          <p className="text-[16px] md:text-[18px] text-[#E4EEFC] leading-relaxed mb-12 max-w-2xl mx-auto">
            We are building a new platform for knowledge and discovery. Advanced Materials Lecture Series, Video Proceedings, WebTalks, and Books & Reports are being prepared for launch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0B1F4D] font-bold tracking-wide hover:bg-[#E4EEFC] transition-colors w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Home
            </Link>
            <a
              href="/#footer-newsletter"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2257d0] text-white font-bold tracking-wide hover:bg-[#1a44a6] transition-colors border border-[#2257d0] w-full sm:w-auto"
            >
              Get Notified
            </a>
          </div>
        </div>
      </main>
      <HubFooter />
    </div>
  );
}
