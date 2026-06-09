'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CoverContent {
  title: string;
  description: string;
  volume: string;
  issue: string;
}

const coverContent: CoverContent[] = [
  {
    title: "Microwave-Assisted Synthesis of Platinum-Nickel Nanoalloys",
    description: "This cover visualizes the microwave-assisted synthesis of platinum-nickel nanoalloys on nitrogen-doped graphene and their practical applications such as water electrolysis and fuel cell. This research concentrates on the fast and facile synthetic procedure using microwave heating with reducing the amount of platinum and enhancing the catalytic performance by the control of lattice strain and nitrogen doping.",
    volume: "17",
    issue: "1"
  },
  {
    title: "Advanced Carbon Nanomaterials for Energy Storage",
    description: "Featured research on next-generation carbon nanomaterials including graphene oxide composites and carbon nanotubes for high-performance supercapacitors and battery applications. The work demonstrates significant improvements in energy density and cycling stability through innovative synthesis methods.",
    volume: "16",
    issue: "12"
  },
  {
    title: "Smart Materials for Biomedical Applications",
    description: "Highlighting breakthrough developments in smart materials including shape-memory alloys and stimuli-responsive polymers for biomedical applications. The research covers novel drug delivery systems, tissue engineering scaffolds, and implantable devices with enhanced biocompatibility.",
    volume: "16",
    issue: "11"
  },
  {
    title: "Quantum Dots and Photovoltaic Applications",
    description: "This issue features cutting-edge research on quantum dot solar cells and their applications in next-generation photovoltaic devices. The work includes innovative synthesis approaches for improved efficiency and stability in perovskite quantum dot solar cells.",
    volume: "16",
    issue: "10"
  }
];

export function OnTheCover() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? coverContent.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === coverContent.length - 1 ? 0 : prev + 1));
  };

  const currentCover = coverContent[currentSlide];

  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-4xl font-bold text-black mb-8" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
            On the Cover
          </h2>

          <div className="flex gap-8">
            <div className="flex-shrink-0">
              <div className="w-48 h-64 bg-gradient-to-br from-[#2E8B57] to-[#1E5F3F] rounded border flex items-center justify-center relative overflow-hidden transition-all duration-500 ease-in-out">
                <img
                  src="https://aml.iaamonline.org/data/aml/coversheet/cover_en.jpg"
                  alt={`Advanced Materials Letters Volume ${currentCover.volume}, Issue ${currentCover.issue} Cover`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallbackDiv = target.nextSibling as HTMLElement;
                    if (fallbackDiv) fallbackDiv.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-[#2E8B57] to-[#1E5F3F] rounded flex items-center justify-center relative overflow-hidden" style={{ display: 'none' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative text-center">
                    <div className="text-white text-lg font-semibold mb-2">AML</div>
                    <div className="text-white text-xs">Volume {currentCover.volume}</div>
                    <div className="text-white text-xs">Issue {currentCover.issue}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
                {currentCover.title}
              </h4>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                {currentCover.description}
              </p>
              <Link
                href={`/browse/archive?volume=${currentCover.volume}&issue=${currentCover.issue}`}
                className="text-blue-900 text-sm font-semibold hover:underline flex items-center gap-1 transition-all"
              >
                Browse issue {currentCover.issue} (vol. {currentCover.volume}, 2026)
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2">
              {coverContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-black w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
