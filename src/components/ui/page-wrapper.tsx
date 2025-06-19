
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
  maxWidth = "xl",
  ...props
}: PageWrapperProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-[1800px]",
    "2xl": "max-w-[1800px]",
    full: "max-w-full",
  };

  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      <div className="mx-auto w-full max-w-[1800px] px-6 md:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className={cn("mx-auto space-y-4 sm:space-y-6 md:space-y-8", maxWidthClasses[maxWidth])}>
          {/* Page Header */}
          {(title || icon) && (
            <div className={cn("space-y-3 sm:space-y-4 md:space-y-6", headerClassName)}>
              {(title || icon) && (
                <div className="flex items-center gap-2 sm:gap-3">
                  {icon && (
                    <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary flex-shrink-0">
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
          <div className={cn("space-y-4 sm:space-y-6 md:space-y-8", contentClassName)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageWrapper;
