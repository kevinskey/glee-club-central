
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile: 1 | 2;
    tablet: 1 | 2 | 3;
    desktop: 1 | 2 | 3 | 4 | 5 | 6;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function MobileResponsiveGrid({ 
  children, 
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  align = 'stretch'
}: MobileResponsiveGridProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div className={cn(
      'grid w-full',
      colClasses[cols.mobile],
      `sm:${colClasses[cols.tablet]}`,
      `lg:${colClasses[cols.desktop]}`,
      gapClasses[gap],
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  );
}
