
import React from 'react';
import { Hero } from './Hero';
import { PerformanceSection } from './performance/PerformanceSection';
import { EventsSlider } from './events/EventsSlider';
import { YouTubeSection } from './youtube/YouTubeSection';
import { About } from './About';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Hero />
      <div className="bg-gradient-to-b from-glee-purple/10 to-transparent">
        <EventsSlider />
        <PerformanceSection />
      </div>
      <YouTubeSection />
      <About />
      <ContactSection />
      <Footer />
    </div>
  );
}
