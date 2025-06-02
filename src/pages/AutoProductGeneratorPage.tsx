
import React from 'react';
import { AutoProductGenerator } from '@/components/store/AutoProductGenerator';
import { UniversalHero } from '@/components/hero/UniversalHero';

export default function AutoProductGeneratorPage() {
  return (
    <div className="min-h-screen">
      <UniversalHero 
        sectionId="auto-generator-hero"
        height="banner"
        showNavigation={false}
        enableAutoplay={false}
      />
      <div className="container mx-auto px-4 py-8">
        <AutoProductGenerator />
      </div>
    </div>
  );
}
