
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

export function MobileCard({ 
  children, 
  className,
  variant = 'default',
  padding = 'md',
  interactive = false,
  onClick
}: MobileCardProps) {
  const variantClasses = {
    default: 'bg-card border border-border',
    elevated: 'bg-card shadow-md border border-border/50',
    outlined: 'bg-transparent border-2 border-border'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div 
      className={cn(
        'rounded-lg transition-colors',
        variantClasses[variant],
        paddingClasses[padding],
        interactive && 'cursor-pointer hover:bg-accent/50 active:bg-accent/70',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
