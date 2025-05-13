
import React from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { About } from './About';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { UpcomingEvents } from './UpcomingEvents';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Hero />
      <UpcomingEvents />
      <Features />
      <About />
      <ContactSection />
      <Footer />
    </div>
  );
}
