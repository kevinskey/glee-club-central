
import React from 'react';
import { cn } from '@/lib/utils';

interface UnifiedTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-large' | 'body-small' | 'small' | 'caption' | 'label';
  className?: string;
  color?: 'default' | 'muted' | 'primary' | 'brand';
}

const textVariants = {
  h1: 'text-h1 font-playfair',
  h2: 'text-h2 font-playfair', 
  h3: 'text-h3 font-playfair',
  h4: 'text-h4 font-inter',
  h5: 'text-h5 font-inter',
  h6: 'text-h6 font-inter',
  body: 'text-body font-inter',
  'body-large': 'text-body-large font-inter',
  'body-small': 'text-body-small font-inter',
  small: 'text-small font-inter',
  caption: 'text-caption font-inter',
  label: 'text-label font-inter'
};

const colorVariants = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  brand: 'text-[hsl(var(--glee-blue))]'
};

export function UnifiedText({
  children,
  as = 'p',
  variant = 'body',
  className,
  color = 'default',
  ...props
}: UnifiedTextProps) {
  const Component = as;
  
  return (
    <Component
      className={cn(
        textVariants[variant],
        colorVariants[color],
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
