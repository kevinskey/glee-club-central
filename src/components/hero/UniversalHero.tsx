
import React from 'react';
import { ModernHeroSection } from '@/components/landing/hero/ModernHeroSection';

interface UniversalHeroProps {
  sectionId?: string;
  height?: 'compact' | 'banner' | 'standard' | 'fullscreen';
  showNavigation?: boolean;
  showPlayPause?: boolean;
  showCounter?: boolean;
  showDots?: boolean;
  enableAutoplay?: boolean;
  className?: string;
}

export function UniversalHero({ 
  sectionId = "homepage-main",
  height = 'standard',
  showNavigation = true,
  showPlayPause = true,
  showCounter = true,
  showDots = true,
  enableAutoplay = true,
  className = ""
}: UniversalHeroProps) {
  const getHeightStyle = () => {
    switch (height) {
      case 'compact':
        return '40vh';
      case 'banner':
        return '25vh';
      case 'fullscreen':
        return '100vh';
      default:
        return '60vh';
    }
  };

  return (
    <div 
      style={{ height: getHeightStyle() }} 
      className={`overflow-hidden ${className}`}
    >
      <ModernHeroSection />
    </div>
  );
}
