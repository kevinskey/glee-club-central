
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HorizontalSliderProps {
  children: ReactNode;
  className?: string;
  itemWidth?: string;
  gap?: string;
}

export function HorizontalSlider({ 
  children, 
  className = "",
  itemWidth = "w-80",
  gap = "gap-4"
}: HorizontalSliderProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto">
        <div 
          className={cn("flex pb-4", gap)}
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div 
              key={index}
              className={cn("flex-shrink-0", itemWidth)}
              style={{ scrollSnapAlign: 'start' }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
