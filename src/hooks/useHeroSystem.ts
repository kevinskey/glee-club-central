
import { useState, useEffect } from 'react';
import { useHeroSlides } from '@/hooks/useHeroSlides';

export interface HeroConfig {
  autoAdvance: boolean;
  interval: number;
  showIndicators: boolean;
  fallbackEnabled: boolean;
}

export const useHeroSystem = (sectionId: string = 'homepage-main') => {
  const { visibleSlides, loading, error, fetchHeroSlides } = useHeroSlides(sectionId);
  const [config, setConfig] = useState<HeroConfig>({
    autoAdvance: true,
    interval: 7000,
    showIndicators: true,
    fallbackEnabled: true
  });

  const hasSlides = visibleSlides.length > 0;
  const isUsingFallback = !hasSlides && config.fallbackEnabled;

  const updateConfig = (newConfig: Partial<HeroConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return {
    slides: visibleSlides,
    loading,
    error,
    config,
    updateConfig,
    hasSlides,
    isUsingFallback,
    refresh: fetchHeroSlides
  };
};
