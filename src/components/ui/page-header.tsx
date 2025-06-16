
import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  icon, 
  className,
  children 
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="h-8 w-8 text-[#0072CE] flex-shrink-0">
            {icon}
          </div>
        )}
        <h1 className="text-3xl font-bold text-[#0072CE] font-playfair">
          {title}
        </h1>
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
