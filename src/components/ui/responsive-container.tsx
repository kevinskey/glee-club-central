
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsPad } from '@/hooks/useIsPad';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveContainer({ 
  children, 
  className,
  variant = 'default',
  padding = 'md'
}: ResponsiveContainerProps) {
  const isPad = useIsPad();

  const variantClasses = {
    default: 'glee-container',
    narrow: 'glee-container-narrow',
    wide: 'glee-container-wide',
    full: 'glee-container-full'
  };

  const paddingClasses = {
    none: '',
    sm: isPad ? 'py-2' : 'py-1',
    md: isPad ? 'py-4' : 'py-2',
    lg: isPad ? 'py-6' : 'py-3',
    xl: isPad ? 'py-8' : 'py-4'
  };

  return (
    <div className={cn(
      variantClasses[variant],
      paddingClasses[padding],
      isPad && 'ipad-optimized',
      className
    )}>
      {children}
    </div>
  );
}
