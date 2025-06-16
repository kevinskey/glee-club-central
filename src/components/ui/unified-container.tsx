
import React from 'react';
import { cn } from '@/lib/utils';

interface UnifiedContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: boolean;
  rounded?: boolean;
}

export function UnifiedContainer({ 
  children, 
  className,
  size = 'xl',
  padding = 'md',
  background = false,
  rounded = false
}: UnifiedContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-3 sm:px-4',
    md: 'px-4 sm:px-6',
    lg: 'px-6 sm:px-8'
  };

  return (
    <div className={cn(
      'w-full mx-auto',
      sizeClasses[size],
      paddingClasses[padding],
      background && 'bg-white dark:bg-gray-900',
      rounded && 'rounded-lg',
      className
    )}>
      {children}
    </div>
  );
}
