
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export function MobileCardGrid({ 
  children, 
  className,
  columns = 1,
  gap = 'md'
}: MobileCardGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  return (
    <div className={cn(
      'grid',
      gridClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}
