
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileResponsiveTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export function MobileResponsiveText({ 
  children, 
  as: Component = 'p',
  size = 'base',
  className,
  weight = 'normal'
}: MobileResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl md:text-4xl',
    '3xl': 'text-3xl sm:text-4xl md:text-5xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <Component className={cn(
      sizeClasses[size],
      weightClasses[weight],
      'leading-tight',
      className
    )}>
      {children}
    </Component>
  );
}
