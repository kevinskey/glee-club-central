
import React from "react";
import { UnifiedText } from "@/components/ui/unified-text";

interface ResponsiveTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  className?: string;
  align?: "left" | "center" | "right";
  balance?: boolean;
  pretty?: boolean;
}

export function ResponsiveText({
  children,
  as = "p",
  size = "base",
  className,
  align,
  balance = false,
  pretty = false,
  ...props
}: ResponsiveTextProps) {
  // Map legacy sizes to new variant system
  const sizeToVariant = {
    xs: 'small',
    sm: 'body-small',
    base: 'body',
    lg: 'body-large',
    xl: 'h5',
    '2xl': 'h4',
    '3xl': 'h3',
    '4xl': 'h2',
    '5xl': 'h1'
  } as const;

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const additionalClasses = [
    align && alignClasses[align],
    balance && "text-balance",
    pretty && "text-pretty",
    className
  ].filter(Boolean).join(' ');

  return (
    <UnifiedText
      as={as}
      variant={sizeToVariant[size]}
      className={additionalClasses}
      {...props}
    >
      {children}
    </UnifiedText>
  );
}

export default ResponsiveText;
