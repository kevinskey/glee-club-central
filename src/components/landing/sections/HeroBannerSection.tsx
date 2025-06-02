
import React from 'react';
import { UniversalHero } from '@/components/hero/UniversalHero';

export function HeroBannerSection() {
  return (
    <section className="relative">
      <UniversalHero 
        sectionId="homepage-banner"
        height="standard"
        showNavigation={false}
        enableAutoplay={true}
      />
    </section>
  );
}
