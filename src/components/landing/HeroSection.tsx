
import React from 'react';
import { UniversalHero } from '@/components/hero/UniversalHero';

export function HeroSection() {
  console.log('🎭 HeroSection: Rendering homepage hero');
  
  return (
    <section className="relative w-full">
      <UniversalHero 
        sectionId="homepage-main"
        height="responsive"
        showNavigation={true}
        enableAutoplay={true}
        className="w-full"
      />
    </section>
  );
}
