
import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  verticalPadding?: "small" | "medium" | "large" | "none";
  horizontalPadding?: "small" | "medium" | "large" | "none";
  fullWidth?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
  centered?: boolean;
  sectionSpacing?: "tight" | "normal" | "loose" | "none";
}

export function ResponsiveSection({ 
  children, 
  className, 
  as: Component = "section",
  verticalPadding = "medium",
  horizontalPadding = "none",
  fullWidth = false,
  maxWidth = "xl",
  centered = false,
  sectionSpacing = "normal",
  ...props 
}: ResponsiveSectionProps) {
  // Vertical padding styles using glee system
  const verticalPaddingClasses = {
    none: "",
    small: "glee-section-compact",
    medium: "glee-section",
    large: "glee-section-spacious",
  };

  // Max width styles using glee system
  const maxWidthClasses = {
    none: "",
    sm: "glee-container-narrow",
    md: "glee-container-narrow",
    lg: "glee-container",
    xl: "glee-container",
    "2xl": "glee-container-wide",
    full: "glee-container-full",
  };

  // Section spacing styles
  const sectionSpacingClasses = {
    none: "",
    tight: "mb-6 md:mb-8",
    normal: "mb-8 md:mb-12 lg:mb-16", 
    loose: "mb-12 md:mb-16 lg:mb-20",
  };
  
  return (
    <Component
      className={cn(
        verticalPadding !== "none" && verticalPaddingClasses[verticalPadding],
        fullWidth ? "w-full" : "",
        maxWidth !== "none" && maxWidthClasses[maxWidth],
        centered && "mx-auto",
        sectionSpacing !== "none" && sectionSpacingClasses[sectionSpacing],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default ResponsiveSection;
