
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
  horizontalPadding = "medium",
  fullWidth = false,
  maxWidth = "xl",
  centered = false,
  sectionSpacing = "normal",
  ...props 
}: ResponsiveSectionProps) {
  // Vertical padding styles
  const verticalPaddingClasses = {
    none: "",
    small: "py-4 sm:py-6",
    medium: "py-6 sm:py-8 md:py-12",
    large: "py-8 sm:py-12 md:py-16 lg:py-20",
  };

  // Horizontal padding styles
  const horizontalPaddingClasses = {
    none: "",
    small: "px-3 sm:px-4",
    medium: "px-4 sm:px-6 md:px-8",
    large: "px-6 sm:px-8 md:px-12",
  };

  // Max width styles
  const maxWidthClasses = {
    none: "",
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
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
        horizontalPadding !== "none" && horizontalPaddingClasses[horizontalPadding],
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
