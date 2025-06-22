
import React from 'react';
import { UnifiedText } from '@/components/ui/unified-text';

interface MobileResponsiveTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-large' | 'body-small' | 'small' | 'caption';
  className?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export function MobileResponsiveText({ 
  children, 
  as = 'p',
  size = 'body',
  className,
  weight = 'normal'
}: MobileResponsiveTextProps) {
  // Map old size system to new variant system
  const variantMap = {
    'xs': 'small',
    'sm': 'body-small', 
    'base': 'body',
    'lg': 'body-large',
    'xl': 'h5',
    '2xl': 'h4',
    '3xl': 'h3',
    '4xl': 'h2',
    '5xl': 'h1'
  } as const;

  const variant = variantMap[size as keyof typeof variantMap] || size;

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <UnifiedText
      as={as}
      variant={variant as any}
      className={`${weightClasses[weight]} ${className || ''}`}
    >
      {children}
    </UnifiedText>
  );
}
