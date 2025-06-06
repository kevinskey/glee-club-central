
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  compact?: boolean;
  className?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  icon, 
  compact = false, 
  className,
  children,
  actions
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1",
      compact ? "mb-3" : "mb-4 sm:mb-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn(
              "flex items-center justify-center rounded-lg",
              compact 
                ? "p-1.5 bg-glee-spelman/10" 
                : "p-2 bg-glee-spelman/10"
            )}>
              {icon}
            </div>
          )}
          <h1 className={cn(
            "font-bold text-gray-900 dark:text-white",
            compact 
              ? "text-lg sm:text-xl" 
              : "text-xl sm:text-2xl lg:text-3xl"
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
        <p className={cn(
          "text-gray-600 dark:text-gray-400",
          compact 
            ? "text-xs sm:text-sm" 
            : "text-sm sm:text-base"
        )}>
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}
