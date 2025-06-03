
import React from 'react';
import { UniversalHero } from '@/components/hero/UniversalHero';

export function HeroSection() {
  console.log('🎭 HeroSection: Rendering homepage hero');
  
  return (
    <section className="relative">
      <UniversalHero 
        sectionId="homepage-main"
        height="standard"
        showNavigation={true}
        enableAutoplay={true}
      />
    </section>
  );
}
