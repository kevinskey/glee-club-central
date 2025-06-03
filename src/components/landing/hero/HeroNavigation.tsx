
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroNavigationProps {
  slidesCount: number;
  showNavigation: boolean;
  isMobile: boolean;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export function HeroNavigation({ 
  slidesCount, 
  showNavigation, 
  isMobile, 
  onPrevSlide, 
  onNextSlide 
}: HeroNavigationProps) {
  if (slidesCount <= 1 || !showNavigation || isMobile) return null;

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
        onClick={onPrevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
        onClick={onNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </>
  );
}
