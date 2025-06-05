
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedMobileContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  maxWidth?: 'full' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'tight' | 'normal' | 'relaxed';
}

export function EnhancedMobileContainer({ 
  children, 
  className,
  padding = 'md',
  maxWidth = 'full',
  spacing = 'normal'
}: EnhancedMobileContainerProps) {
  const paddingClasses = {
    none: '',
    xs: 'px-2 py-1',
    sm: 'px-3 py-2 sm:px-4 sm:py-3',
    md: 'px-3 py-4 sm:px-6 sm:py-6',
    lg: 'px-4 py-6 sm:px-8 sm:py-8'
  };

  const maxWidthClasses = {
    full: 'max-w-full',
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl'
  };

  const spacingClasses = {
    tight: 'space-y-2 sm:space-y-3',
    normal: 'space-y-3 sm:space-y-4 md:space-y-6',
    relaxed: 'space-y-4 sm:space-y-6 md:space-y-8'
  };

  return (
    <div className={cn(
      'w-full mx-auto overflow-x-hidden box-border',
      'max-w-[100vw]', // Ensure container never exceeds viewport width
      paddingClasses[padding],
      maxWidthClasses[maxWidth],
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
}
