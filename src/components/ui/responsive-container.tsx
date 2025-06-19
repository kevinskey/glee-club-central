
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
    default: 'max-w-[1800px]',
    narrow: 'max-w-4xl',
    wide: 'max-w-[1800px]',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: isPad ? 'px-6 py-2' : 'px-4 py-1',
    md: isPad ? 'px-8 py-4' : 'px-6 py-2',
    lg: isPad ? 'px-12 py-6' : 'px-8 py-3',
    xl: isPad ? 'px-16 py-8' : 'px-10 py-4'
  };

  return (
    <div className={cn(
      'container mx-auto w-full',
      variantClasses[variant],
      paddingClasses[padding],
      isPad && 'ipad-optimized',
      className
    )}>
      {children}
    </div>
  );
}
