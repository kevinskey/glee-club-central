
import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { TestMode } from './types';

interface HeroTestControlsProps {
  isResponsive: boolean;
  testMode: TestMode;
  setTestMode: (mode: TestMode) => void;
}

export function HeroTestControls({ isResponsive, testMode, setTestMode }: HeroTestControlsProps) {
  if (!isResponsive) return null;

  return (
    <div className="absolute top-4 right-4 z-30 flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
      <Button
        variant={testMode === 'desktop' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTestMode(testMode === 'desktop' ? null : 'desktop')}
        className="text-white hover:text-black"
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={testMode === 'tablet' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTestMode(testMode === 'tablet' ? null : 'tablet')}
        className="text-white hover:text-black"
      >
        <Tablet className="h-4 w-4" />
      </Button>
      <Button
        variant={testMode === 'mobile' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTestMode(testMode === 'mobile' ? null : 'mobile')}
        className="text-white hover:text-black"
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </div>
  );
}
