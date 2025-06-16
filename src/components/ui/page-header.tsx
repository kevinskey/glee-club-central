
import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  compact?: boolean;
}

export function PageHeader({ 
  title, 
  description, 
  icon, 
  className,
  children,
  actions,
  compact = false
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="h-8 w-8 text-[#0072CE] flex-shrink-0">
              {icon}
            </div>
          )}
          <h1 className={cn(
            "font-bold text-[#0072CE] font-playfair",
            compact ? "text-2xl" : "text-3xl"
          )}>
            {title}
          </h1>
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}
