
import React from 'react';
import { ModernHeroSection } from '@/components/landing/hero/ModernHeroSection';

interface UniversalHeroProps {
  sectionId?: string;
  height?: 'compact' | 'banner' | 'standard' | 'fullscreen' | 'auto' | 'responsive';
  showNavigation?: boolean;
  enableAutoplay?: boolean;
  className?: string;
}

export function UniversalHero({ 
  sectionId = "homepage-main",
  height = 'responsive',
  showNavigation = true,
  enableAutoplay = true,
  className = ""
}: UniversalHeroProps) {
  const getHeightStyle = () => {
    switch (height) {
      case 'compact':
        return '40vh';
      case 'banner':
        return '25vh';
      case 'standard':
        return '60vh';
      case 'fullscreen':
        return '100vh';
      case 'responsive':
        return 'auto';
      case 'auto':
      default:
        return 'auto';
    }
  };

  const getContainerClasses = () => {
    if (height === 'responsive') {
      return `w-full overflow-hidden relative 
        max-h-[400px] sm:max-h-[450px] md:max-h-[700px] 
        h-[50vh] sm:h-[450px] md:h-[700px]
        ${className}`;
    }
    if (height === 'auto') {
      return `w-full overflow-hidden ${className}`;
    }
    return `overflow-hidden w-full ${className}`;
  };

  console.log('🎭 UniversalHero: Rendering with sectionId:', sectionId);

  return (
    <div 
      style={height !== 'auto' && height !== 'responsive' ? { height: getHeightStyle() } : undefined}
      className={getContainerClasses()}
    >
      <ModernHeroSection 
        sectionId={sectionId}
        showNavigation={showNavigation}
        enableAutoplay={enableAutoplay}
        isResponsive={height === 'responsive'}
      />
    </div>
  );
}
