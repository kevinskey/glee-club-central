
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'full' | 'sm' | 'md' | 'lg' | 'xl';
}

export function MobileOptimizedContainer({ 
  children, 
  className,
  padding = 'md',
  maxWidth = 'full'
}: MobileOptimizedContainerProps) {
  const paddingClasses = {
    none: '',
    sm: 'mobile-padding-sm',
    md: 'mobile-padding-md',
    lg: 'mobile-padding-lg'
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
      'w-full mx-auto overflow-x-hidden',
      paddingClasses[padding],
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
