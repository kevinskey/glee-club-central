
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md';
  maxWidth?: 'full' | 'sm' | 'md' | 'lg' | 'xl';
}

export function MobileOptimizedContainer({ 
  children, 
  className,
  padding = 'sm',
  maxWidth = 'full'
}: MobileOptimizedContainerProps) {
  const paddingClasses = {
    none: '',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3'
  };

  const maxWidthClasses = {
    full: 'max-w-full',
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl'
  };

  return (
    <div className={cn(
      'w-full mx-auto overflow-x-hidden box-border',
      'max-w-[100vw]',
      paddingClasses[padding],
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
