'use client';

import { useEffect } from 'react';
import { AnnouncementBar } from './announcement-bar';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { CookieConsent } from './cookie-consent';
import { useScrollAnimationMultiple } from '@/hooks/useScrollAnimation';

export function MainLayout({ children }: { children: React.ReactNode }) {
  // Initialize scroll animations for common elements with faster, more responsive settings
  useScrollAnimationMultiple('.fade-in-up', { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
  useScrollAnimationMultiple('.fade-in-left', { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
  useScrollAnimationMultiple('.fade-in-right', { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
  useScrollAnimationMultiple('.fade-in', { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
  useScrollAnimationMultiple('.scale-in', { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });

  useEffect(() => {
    // Enhanced smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const href = target.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          const headerOffset = 144; // Account for sticky header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    // Add smooth scroll enhancement to all anchor links
    document.addEventListener('click', handleAnchorClick);

    // Optimize scroll performance
    let ticking = false;
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll optimization logic can be added here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizeScroll, { passive: true });

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', optimizeScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 public-academic scroll-momentum">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
