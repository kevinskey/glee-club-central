
import React from "react";
import { cn } from "@/lib/utils";

interface UnifiedTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-large' | 'body-small' | 'label' | 'small' | 'caption' | 'button' | 'button-large' | 'button-small';
  className?: string;
  brand?: boolean;
  muted?: boolean;
}

export function UnifiedText({
  children,
  as: Component = 'p',
  variant = 'body',
  className,
  brand = false,
  muted = false,
  ...props
}: UnifiedTextProps) {
  const variantClasses = {
    h1: 'text-h1 font-playfair',
    h2: 'text-h2 font-playfair',
    h3: 'text-h3 font-playfair',
    h4: 'text-h4 font-inter',
    h5: 'text-h5 font-inter',
    h6: 'text-h6 font-inter',
    body: 'text-body font-inter',
    'body-large': 'text-body-large font-inter',
    'body-small': 'text-body-small font-inter',
    label: 'text-label font-inter',
    small: 'text-small font-inter',
    caption: 'text-caption font-inter',
    button: 'text-button font-inter',
    'button-large': 'text-button-large font-inter',
    'button-small': 'text-button-small font-inter',
  };

  return (
    <Component
      className={cn(
        variantClasses[variant],
        brand && 'text-brand',
        muted && 'text-muted',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default UnifiedText;
