'use client';

import { Navbar } from './navbar';
import { Footer } from './footer';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 public-academic">
        {children}
      </main>
      <Footer />
    </div>
  );
}
