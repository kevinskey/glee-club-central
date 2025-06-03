
import React from 'react';
import { SimpleHero } from '@/components/hero/SimpleHero';
import { useSimpleHero } from '@/hooks/useSimpleHero';

export function HeroSection() {
  console.log('🎭 HeroSection: Rendering new simple hero');
  
  const { slides, isLoading, error } = useSimpleHero('homepage-main');

  if (isLoading) {
    return (
      <section className="relative w-full h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading hero section...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <SimpleHero 
        slides={slides}
        autoPlay={true}
        interval={5000}
        showNavigation={true}
        height="70vh"
        className="w-full"
      />
    </section>
  );
}
