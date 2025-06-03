
import React from 'react';
import { ModernHeroSection } from '@/components/landing/hero/ModernHeroSection';

interface UniversalHeroProps {
  sectionId?: string;
  height?: 'compact' | 'banner' | 'standard' | 'fullscreen' | 'auto';
  showNavigation?: boolean;
  enableAutoplay?: boolean;
  className?: string;
}

export function UniversalHero({ 
  sectionId = "homepage-main",
  height = 'auto',
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
      case 'auto':
      default:
        return 'auto';
    }
  };

  const getContainerClasses = () => {
    if (height === 'auto') {
      return `min-h-[50vh] w-full overflow-hidden ${className}`;
    }
    return `overflow-hidden w-full ${className}`;
  };

  console.log('🎭 UniversalHero: Rendering with sectionId:', sectionId);

  return (
    <div 
      style={height !== 'auto' ? { height: getHeightStyle() } : undefined}
      className={getContainerClasses()}
    >
      <ModernHeroSection 
        sectionId={sectionId}
        showNavigation={showNavigation}
        enableAutoplay={enableAutoplay}
      />
    </div>
  );
}
