
import React from 'react';
import { ModularHeroSection } from './ModularHeroSection';

// Compact hero for internal pages
export function CompactHero({ 
  category, 
  title, 
  subtitle 
}: { 
  category: string; 
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <ModularHeroSection
      category={category}
      height="40vh"
      displayMode="single"
      overlayTitle={title}
      overlaySubtitle={subtitle}
      autoPlay={false}
      className="rounded-b-lg"
    />
  );
}

// Banner hero for feature sections
export function BannerHero({ 
  category, 
  title, 
  subtitle 
}: { 
  category: string; 
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <ModularHeroSection
      category={category}
      height="25vh"
      displayMode="slideshow"
      overlayTitle={title}
      overlaySubtitle={subtitle}
      autoPlay={true}
      autoPlayInterval={8000}
      className="mb-8"
    />
  );
}

// Full-screen hero for landing pages
export function FullScreenHero({ 
  category, 
  title, 
  subtitle 
}: { 
  category: string; 
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <ModularHeroSection
      category={category}
      height="100vh"
      displayMode="slideshow"
      overlayTitle={title}
      overlaySubtitle={subtitle}
      autoPlay={true}
      autoPlayInterval={6000}
    />
  );
}

// Card hero for embedded sections
export function CardHero({ 
  category, 
  title, 
  subtitle 
}: { 
  category: string; 
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <div className="p-4">
      <ModularHeroSection
        category={category}
        height="300px"
        displayMode="slideshow"
        overlayTitle={title}
        overlaySubtitle={subtitle}
        autoPlay={true}
        autoPlayInterval={4000}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}
