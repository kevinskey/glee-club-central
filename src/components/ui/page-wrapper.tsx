
import React from "react";
import { cn } from "@/lib/utils";
import { ResponsiveText } from "@/components/ui/responsive-text";

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function PageWrapper({
  children,
  title,
  description,
  icon,
  className,
  headerClassName,
  contentClassName,
  maxWidth = "6xl",
  ...props
}: PageWrapperProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className={cn("mx-auto space-y-8", maxWidthClasses[maxWidth])}>
          {/* Page Header */}
          {(title || icon) && (
            <div className={cn("space-y-6", headerClassName)}>
              {(title || icon) && (
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className="h-6 w-6 sm:h-8 sm:w-8 text-primary">
                      {icon}
                    </div>
                  )}
                  {title && (
                    <ResponsiveText 
                      as="h1" 
                      size="4xl" 
                      className="font-playfair font-bold text-foreground"
                    >
                      {title}
                    </ResponsiveText>
                  )}
                </div>
              )}
              
              {description && (
                <ResponsiveText 
                  size="lg" 
                  className="text-muted-foreground leading-relaxed max-w-3xl"
                >
                  {description}
                </ResponsiveText>
              )}
            </div>
          )}

          {/* Page Content */}
          <div className={cn("space-y-8", contentClassName)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageWrapper;
