
import React from 'react';
import { ModernHeroSection } from '@/components/landing/hero/ModernHeroSection';

// Compact hero for internal pages
export function CompactHero({ 
  sectionId = "homepage-main",
  title, 
  subtitle 
}: { 
  sectionId?: string;
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <div style={{ height: '40vh' }} className="rounded-b-lg overflow-hidden">
      <ModernHeroSection />
    </div>
  );
}

// Banner hero for feature sections  
export function BannerHero({ 
  sectionId = "homepage-main",
  title, 
  subtitle 
}: { 
  sectionId?: string;
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <div style={{ height: '25vh' }} className="mb-8 overflow-hidden">
      <ModernHeroSection />
    </div>
  );
}

// Full-screen hero for landing pages
export function FullScreenHero({ 
  sectionId = "homepage-main",
  title, 
  subtitle 
}: { 
  sectionId?: string;
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <div style={{ height: '100vh' }} className="overflow-hidden">
      <ModernHeroSection />
    </div>
  );
}

// Card hero for embedded sections
export function CardHero({ 
  sectionId = "homepage-main",
  title, 
  subtitle 
}: { 
  sectionId?: string;
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <div className="p-4">
      <div style={{ height: '300px' }} className="rounded-lg shadow-lg overflow-hidden">
        <ModernHeroSection />
      </div>
    </div>
  );
}
