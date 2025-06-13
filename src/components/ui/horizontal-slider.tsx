
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HorizontalSliderProps {
  children: React.ReactNode;
  itemWidth?: string;
  gap?: string;
  className?: string;
}

export function HorizontalSlider({ 
  children, 
  itemWidth = "w-80", 
  gap = "gap-4",
  className = ""
}: HorizontalSliderProps) {
  return (
    <ScrollArea className={`w-full ${className}`}>
      <div className={`flex ${gap} pb-4`}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className={`flex-shrink-0 ${itemWidth}`}>
            {child}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
