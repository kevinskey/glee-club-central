
import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTextProps {
  children: React.ReactNode;
  as?: React.ElementType;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  className?: string;
  align?: "left" | "center" | "right";
  balance?: boolean;
  pretty?: boolean;
}

export function ResponsiveText({
  children,
  as: Component = "p",
  size = "base",
  className,
  align,
  balance = false,
  pretty = false,
  ...props
}: ResponsiveTextProps) {
  // Define text size classes that scale appropriately across screen sizes
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-xs sm:text-sm",
    base: "text-sm sm:text-base",
    lg: "text-base sm:text-lg",
    xl: "text-lg sm:text-xl",
    "2xl": "text-xl sm:text-2xl",
    "3xl": "text-2xl md:text-3xl",
    "4xl": "text-3xl sm:text-4xl md:text-5xl",
    "5xl": "text-4xl sm:text-5xl md:text-6xl",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <Component
      className={cn(
        sizeClasses[size],
        align && alignClasses[align],
        balance && "text-balance",
        pretty && "text-pretty",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default ResponsiveText;
