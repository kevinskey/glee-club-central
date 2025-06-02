
import React from 'react';
import { ProductDesignStudio } from '@/components/store/ProductDesignStudio';
import { UniversalHero } from '@/components/hero/UniversalHero';

export default function DesignStudioPage() {
  return (
    <div className="min-h-screen">
      <UniversalHero 
        sectionId="design-studio-hero"
        height="banner"
        showNavigation={false}
        enableAutoplay={false}
      />
      <div className="container mx-auto px-4 py-8">
        <ProductDesignStudio />
      </div>
    </div>
  );
}
